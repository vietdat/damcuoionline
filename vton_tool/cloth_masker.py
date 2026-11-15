import cv2
import numpy as np
from PIL import Image
import torch
from transformers import AutoModelForSemanticSegmentation, AutoProcessor


class AutoMasker:
    """
    Automatic clothing segmentation using SegFormer fine-tuned for clothes parsing.
    Labels:
      4: Upper-clothes (Áo)
      5: Skirt (Chân váy)
      6: Pants (Quần)
      7: Dress (Đầm / Váy liền)
      8: Belt (Thắt lưng)
      17: Scarf (Khăn choàng)
    """

    LABEL_GROUPS = {
        "upper_body": [4, 17],
        "lower_body": [5, 6],
        "dress": [4, 5, 7],
        "all": [4, 5, 6, 7, 8, 17],
    }

    def __init__(self, model_id: str = "mattmdjaga/segformer_b2_clothes", device: str = "mps"):
        self.device = device
        print(f"[AutoMasker] Loading segmentation model '{model_id}' on {device}...")
        self.processor = AutoProcessor.from_pretrained(model_id)
        self.model = AutoModelForSemanticSegmentation.from_pretrained(model_id).to(device)
        self.model.eval()
        print("[AutoMasker] Segmentation model loaded.")

    @torch.no_grad()
    def __call__(
        self,
        image: Image.Image,
        category: str = "upper_body",
        dilation: int = 15,
    ) -> Image.Image:
        """
        Generate binary mask for the specified clothing category.
        Returns a PIL Image (mode 'L') where white (255) is the clothing to replace.
        """
        w, h = image.size
        inputs = self.processor(images=image, return_tensors="pt").to(self.device)
        outputs = self.model(**inputs)
        logits = outputs.logits

        # Resize logits to original image dimension
        upsampled = torch.nn.functional.interpolate(
            logits,
            size=(h, w),
            mode="bilinear",
            align_corners=False,
        )
        pred_seg = upsampled.argmax(dim=1)[0].cpu().numpy()

        target_labels = self.LABEL_GROUPS.get(category, self.LABEL_GROUPS["upper_body"])
        mask_np = np.isin(pred_seg, target_labels).astype(np.uint8) * 255

        # Dilation to expand boundary slightly so seams and borders don't leak
        if dilation > 0:
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (dilation, dilation))
            mask_np = cv2.dilate(mask_np, kernel, iterations=1)

        return Image.fromarray(mask_np, mode="L")
