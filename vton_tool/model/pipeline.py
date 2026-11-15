import inspect
import os
from typing import Union, Optional, Callable

import PIL
from PIL import Image
import numpy as np
import torch
import tqdm
from accelerate import load_checkpoint_in_model
from diffusers import AutoencoderKL, DDIMScheduler, UNet2DConditionModel
from diffusers.utils.torch_utils import randn_tensor
from huggingface_hub import snapshot_download

from .attn_processor import SkipAttnProcessor
from .utils import get_trainable_module, init_adapter
from utils import (
    compute_vae_encodings,
    numpy_to_pil,
    prepare_image,
    prepare_mask_image,
    resize_and_crop,
    resize_and_padding,
)


class CatVTONPipeline:
    def __init__(
        self,
        base_ckpt: str = "booksforcharlie/stable-diffusion-inpainting",
        attn_ckpt: str = "zhengchong/CatVTON",
        attn_ckpt_version: str = "mix",
        weight_dtype: torch.dtype = torch.float32,
        device: str = "mps",
    ):
        self.device = device
        self.weight_dtype = weight_dtype

        print(f"[CatVTON] Loading scheduler and VAE on device: {device} ({weight_dtype})...")
        self.noise_scheduler = DDIMScheduler.from_pretrained(base_ckpt, subfolder="scheduler")
        self.vae = AutoencoderKL.from_pretrained("stabilityai/sd-vae-ft-mse").to(device, dtype=weight_dtype)

        print("[CatVTON] Loading UNet inpainting base...")
        self.unet = UNet2DConditionModel.from_pretrained(base_ckpt, subfolder="unet").to(device, dtype=weight_dtype)
        
        # Initialize custom attention adapter for VTON
        init_adapter(self.unet, cross_attn_cls=SkipAttnProcessor)
        self.attn_modules = get_trainable_module(self.unet, "attention")

        # Load CatVTON trained weights
        print(f"[CatVTON] Loading CatVTON attention weights ({attn_ckpt_version})...")
        self.auto_attn_ckpt_load(attn_ckpt, attn_ckpt_version)
        print("[CatVTON] Pipeline initialized successfully!")

    def auto_attn_ckpt_load(self, attn_ckpt: str, version: str):
        sub_folder = {
            "mix": "mix-48k-1024",
            "vitonhd": "vitonhd-16k-512",
            "dresscode": "dresscode-16k-512",
        }[version]
        
        if os.path.exists(attn_ckpt):
            attn_dir = os.path.join(attn_ckpt, sub_folder, "attention")
        else:
            repo_path = snapshot_download(repo_id=attn_ckpt)
            attn_dir = os.path.join(repo_path, sub_folder, "attention")

        load_checkpoint_in_model(self.attn_modules, attn_dir)

    def check_inputs(self, image, condition_image, mask, width, height):
        if (
            isinstance(image, torch.Tensor)
            and isinstance(condition_image, torch.Tensor)
            and isinstance(mask, torch.Tensor)
        ):
            return image, condition_image, mask

        image = resize_and_crop(image, (width, height))
        mask = resize_and_crop(mask, (width, height))
        condition_image = resize_and_padding(condition_image, (width, height))
        return image, condition_image, mask

    def prepare_extra_step_kwargs(self, generator, eta):
        accepts_eta = "eta" in set(inspect.signature(self.noise_scheduler.step).parameters.keys())
        extra_step_kwargs = {}
        if accepts_eta:
            extra_step_kwargs["eta"] = eta
        accepts_generator = "generator" in set(
            inspect.signature(self.noise_scheduler.step).parameters.keys()
        )
        if accepts_generator:
            extra_step_kwargs["generator"] = generator
        return extra_step_kwargs

    @torch.no_grad()
    def __call__(
        self,
        image: Union[PIL.Image.Image, torch.Tensor],
        condition_image: Union[PIL.Image.Image, torch.Tensor],
        mask: Union[PIL.Image.Image, torch.Tensor],
        num_inference_steps: int = 30,
        guidance_scale: float = 2.5,
        height: int = 1024,
        width: int = 768,
        generator: Optional[torch.Generator] = None,
        eta: float = 1.0,
        progress_callback: Optional[Callable[[int, int], None]] = None,
    ):
        concat_dim = -2  # Height concatenation

        # 1. Resize & format inputs
        image, condition_image, mask = self.check_inputs(image, condition_image, mask, width, height)
        image_tensor = prepare_image(image).to(self.device, dtype=self.weight_dtype)
        condition_tensor = prepare_image(condition_image).to(self.device, dtype=self.weight_dtype)
        mask_tensor = prepare_mask_image(mask).to(self.device, dtype=self.weight_dtype)

        # 2. Mask the person image
        masked_image = image_tensor * (mask_tensor < 0.5)

        # 3. VAE Latents
        masked_latent = compute_vae_encodings(masked_image, self.vae)
        condition_latent = compute_vae_encodings(condition_tensor, self.vae)
        mask_latent = torch.nn.functional.interpolate(
            mask_tensor, size=masked_latent.shape[-2:], mode="nearest"
        )
        del image_tensor, mask_tensor, condition_tensor

        # 4. Concatenate condition
        masked_latent_concat = torch.cat([masked_latent, condition_latent], dim=concat_dim)
        mask_latent_concat = torch.cat([mask_latent, torch.zeros_like(mask_latent)], dim=concat_dim)

        # 5. Noise initialization
        latents = randn_tensor(
            masked_latent_concat.shape,
            generator=generator,
            device=masked_latent_concat.device,
            dtype=self.weight_dtype,
        )

        self.noise_scheduler.set_timesteps(num_inference_steps, device=self.device)
        timesteps = self.noise_scheduler.timesteps
        latents = latents * self.noise_scheduler.init_noise_sigma

        # 6. Classifier-Free Guidance
        do_cfg = guidance_scale > 1.0
        if do_cfg:
            masked_latent_concat = torch.cat(
                [
                    torch.cat([masked_latent, torch.zeros_like(condition_latent)], dim=concat_dim),
                    masked_latent_concat,
                ]
            )
            mask_latent_concat = torch.cat([mask_latent_concat] * 2)

        # 7. Denoising Loop
        extra_step_kwargs = self.prepare_extra_step_kwargs(generator, eta)
        num_warmup_steps = len(timesteps) - num_inference_steps * self.noise_scheduler.order

        with tqdm.tqdm(total=num_inference_steps, desc="CatVTON Try-On") as pbar:
            for i, t in enumerate(timesteps):
                latent_model_input = torch.cat([latents] * 2) if do_cfg else latents
                latent_model_input = self.noise_scheduler.scale_model_input(latent_model_input, t)

                inpainting_input = torch.cat(
                    [latent_model_input, mask_latent_concat, masked_latent_concat], dim=1
                )

                noise_pred = self.unet(
                    inpainting_input,
                    t.to(self.device),
                    encoder_hidden_states=None,
                    return_dict=False,
                )[0]

                if do_cfg:
                    noise_pred_uncond, noise_pred_text = noise_pred.chunk(2)
                    noise_pred = noise_pred_uncond + guidance_scale * (
                        noise_pred_text - noise_pred_uncond
                    )

                latents = self.noise_scheduler.step(
                    noise_pred, t, latents, **extra_step_kwargs
                ).prev_sample

                if (
                    i == len(timesteps) - 1
                    or ((i + 1) > num_warmup_steps and (i + 1) % self.noise_scheduler.order == 0)
                ):
                    pbar.update()

                if progress_callback is not None:
                    progress_callback(i + 1, num_inference_steps)

        # 8. Decode Latents
        latents = latents.split(latents.shape[concat_dim] // 2, dim=concat_dim)[0]
        latents = 1 / self.vae.config.scaling_factor * latents
        decoded = self.vae.decode(latents.to(self.device, dtype=self.weight_dtype)).sample
        decoded = (decoded / 2 + 0.5).clamp(0, 1)
        decoded = decoded.cpu().permute(0, 2, 3, 1).float().numpy()

        output_images = numpy_to_pil(decoded)
        return output_images
