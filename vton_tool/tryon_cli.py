import argparse
import os
import random
from PIL import Image
import torch

from cloth_masker import AutoMasker
from model.pipeline import CatVTONPipeline


def parse_args():
    parser = argparse.ArgumentParser(description="AI Virtual Try-On CLI (Apple Silicon M2 / CUDA / CPU)")
    parser.add_argument("--person", type=str, required=True, help="Path to person image")
    parser.add_argument("--cloth", type=str, required=True, help="Path to garment image")
    parser.add_argument("--mask", type=str, default=None, help="Optional path to custom mask image")
    parser.add_argument(
        "--category",
        type=str,
        default="upper_body",
        choices=["upper_body", "lower_body", "dress", "all"],
        help="Clothing category to replace if mask is not provided",
    )
    parser.add_argument("--output", type=str, default="output.jpg", help="Output image file path")
    parser.add_argument("--output_mask", type=str, default=None, help="Optional output mask file path")
    parser.add_argument("--steps", type=int, default=25, help="Number of inference steps (default: 25)")
    parser.add_argument("--guidance", type=float, default=2.5, help="Guidance scale (default: 2.5)")
    parser.add_argument("--dilation", type=int, default=15, help="Mask boundary dilation in pixels (default: 15)")
    parser.add_argument("--seed", type=int, default=-1, help="Random seed (-1 for random)")
    return parser.parse_args()


def main():
    args = parse_args()

    # Determine device
    if torch.backends.mps.is_available():
        device = "mps"
        dtype = torch.float32
    elif torch.cuda.is_available():
        device = "cuda"
        dtype = torch.float16
    else:
        device = "cpu"
        dtype = torch.float32

    print(f"[*] Running on device: {device} ({dtype})")

    # Load input images
    if not os.path.exists(args.person):
        raise FileNotFoundError(f"Person image not found: {args.person}")
    if not os.path.exists(args.cloth):
        raise FileNotFoundError(f"Cloth image not found: {args.cloth}")

    person_img = Image.open(args.person).convert("RGB")
    cloth_img = Image.open(args.cloth).convert("RGB")

    # Mask handling
    if args.mask and os.path.exists(args.mask):
        print(f"[*] Using provided mask: {args.mask}")
        mask_img = Image.open(args.mask).convert("L")
    else:
        print(f"[*] Generating automatic mask for category '{args.category}'...")
        masker = AutoMasker(device=device)
        mask_img = masker(person_img, category=args.category, dilation=args.dilation)

    if args.output_mask:
        mask_img.save(args.output_mask)
        print(f"[+] Saved generated mask to: {args.output_mask}")

    # Seed
    if args.seed == -1:
        seed = random.randint(0, 2147483647)
    else:
        seed = args.seed
    generator = torch.Generator(device=device).manual_seed(seed)

    # Initialize Pipeline
    pipeline = CatVTONPipeline(
        base_ckpt="booksforcharlie/stable-diffusion-inpainting",
        attn_ckpt="zhengchong/CatVTON",
        attn_ckpt_version="mix",
        weight_dtype=dtype,
        device=device,
    )

    print(f"[*] Starting Try-On diffusion with {args.steps} steps...")
    results = pipeline(
        image=person_img,
        condition_image=cloth_img,
        mask=mask_img,
        num_inference_steps=args.steps,
        guidance_scale=args.guidance,
        generator=generator,
    )

    out_image = results[0]
    out_dir = os.path.dirname(args.output)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    out_image.save(args.output)
    print(f"[✓] Success! Try-on result saved to: {args.output}")


if __name__ == "__main__":
    main()
