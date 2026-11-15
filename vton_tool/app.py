import os
import random
import gradio as gr
import numpy as np
from PIL import Image
import torch

from cloth_masker import AutoMasker
from model.pipeline import CatVTONPipeline
from utils import resize_and_crop, resize_and_padding

# Detect best device for Apple Silicon M2 or fallback
if torch.backends.mps.is_available():
    DEVICE = "mps"
    DTYPE = torch.float32
elif torch.cuda.is_available():
    DEVICE = "cuda"
    DTYPE = torch.float16
else:
    DEVICE = "cpu"
    DTYPE = torch.float32

print(f"[App] Selected compute device: {DEVICE} ({DTYPE})")

# Lazy-loaded singletons
pipeline_instance = None
masker_instance = None


def get_masker():
    global masker_instance
    if masker_instance is None:
        masker_instance = AutoMasker(device=DEVICE)
    return masker_instance


def get_pipeline():
    global pipeline_instance
    if pipeline_instance is None:
        pipeline_instance = CatVTONPipeline(
            base_ckpt="booksforcharlie/stable-diffusion-inpainting",
            attn_ckpt="zhengchong/CatVTON",
            attn_ckpt_version="mix",
            weight_dtype=DTYPE,
            device=DEVICE,
        )
    return pipeline_instance


def generate_mask_preview(person_img, category, dilation):
    if person_img is None:
        raise gr.Error("Vui lòng tải lên ảnh người mẫu trước!")
    masker = get_masker()
    mask = masker(person_img, category=category, dilation=int(dilation))
    return mask


def run_tryon(
    person_img,
    garment_img,
    mask_mode,
    category,
    dilation,
    custom_mask_img,
    steps,
    guidance_scale,
    seed,
    progress=gr.Progress(track_tqdm=True),
):
    if person_img is None:
        raise gr.Error("Vui lòng chọn ảnh người mẫu (Person Image)!")
    if garment_img is None:
        raise gr.Error("Vui lòng chọn ảnh trang phục (Garment Image)!")

    # 1. Determine Mask
    if mask_mode == "Tự động (Auto Segmentation)" or custom_mask_img is None:
        progress(0.1, desc="Đang phân tích và tự động tách vùng trang phục...")
        masker = get_masker()
        mask = masker(person_img, category=category, dilation=int(dilation))
    else:
        progress(0.1, desc="Sử dụng mask thủ công...")
        mask = custom_mask_img.convert("L")

    # 2. Generator / Seed
    if seed == -1:
        seed = random.randint(0, 2147483647)
    generator = torch.Generator(device=DEVICE).manual_seed(int(seed))

    # 3. Load & Run Pipeline
    progress(0.3, desc="Đang nạp mô hình CatVTON...")
    pipe = get_pipeline()

    progress(0.4, desc="Đang xử lý thay trang phục...")
    output_images = pipe(
        image=person_img,
        condition_image=garment_img,
        mask=mask,
        num_inference_steps=int(steps),
        guidance_scale=float(guidance_scale),
        height=1024,
        width=768,
        generator=generator,
    )

    result = output_images[0]
    return result, mask


# Custom CSS for modern clean UI
custom_css = """
.gradio-container { max-width: 1200px !important; margin: auto; }
.header-box { text-align: center; margin-bottom: 20px; }
.header-box h1 { font-size: 2.2rem; font-weight: 700; margin-bottom: 5px; }
.header-box p { color: #666; font-size: 1rem; }
.run-btn { background: #2563eb !important; color: white !important; font-size: 1.1rem !important; }
"""

with gr.Blocks(title="AI Virtual Try-On (CatVTON Local)", css=custom_css) as demo:
    gr.HTML(
        """
        <div class="header-box">
            <h1>👔 AI Virtual Try-On (Chạy Local trên Mac M2)</h1>
            <p>Thay đổi trang phục cho ảnh người mẫu bằng CatVTON & Diffusion Inpainting • 100% Cục bộ & Riêng tư</p>
        </div>
        """
    )

    with gr.Row():
        # Left Column: Inputs
        with gr.Column(scale=1):
            gr.Markdown("### 1. Dữ liệu đầu vào")
            person_input = gr.Image(type="pil", label="Ảnh người mẫu (Person Image)")
            garment_input = gr.Image(type="pil", label="Ảnh trang phục mới (Garment Image)")

            gr.Markdown("### 2. Thiết lập vùng thay đồ (Masking)")
            mask_mode = gr.Radio(
                choices=["Tự động (Auto Segmentation)", "Mask thủ công (Upload Mask)"],
                value="Tự động (Auto Segmentation)",
                label="Chế độ chọn vùng đồ",
            )

            with gr.Group(visible=True) as auto_group:
                category = gr.Dropdown(
                    choices=[
                        ("Áo / Thân trên (Upper Body)", "upper_body"),
                        ("Quần / Chân váy (Lower Body)", "lower_body"),
                        ("Đầm / Váy liền (Dress)", "dress"),
                        ("Toàn bộ đồ (All Clothes)", "all"),
                    ],
                    value="upper_body",
                    label="Loại trang phục cần thay",
                )
                dilation = gr.Slider(
                    minimum=0,
                    maximum=40,
                    value=15,
                    step=1,
                    label="Độ mở rộng viền Mask (Dilation px)",
                    info="Mở rộng viền giúp che triệt để đường may của áo cũ.",
                )
                btn_preview_mask = gr.Button("🔍 Xem thử vùng Mask tự động", size="sm")

            with gr.Group(visible=False) as manual_group:
                custom_mask_input = gr.Image(
                    type="pil",
                    label="Ảnh Mask tự vẽ (Vùng trắng = Thay đồ, Đen = Giữ nguyên)",
                )

            def toggle_mask_mode(mode):
                if mode == "Tự động (Auto Segmentation)":
                    return gr.update(visible=True), gr.update(visible=False)
                else:
                    return gr.update(visible=False), gr.update(visible=True)

            mask_mode.change(toggle_mask_mode, inputs=[mask_mode], outputs=[auto_group, manual_group])

            with gr.Accordion("⚙️ Cài đặt nâng cao (Advanced)", open=False):
                steps = gr.Slider(
                    minimum=15,
                    maximum=50,
                    value=25,
                    step=1,
                    label="Inference Steps (20-30 tối ưu cho Mac M2)",
                )
                guidance_scale = gr.Slider(
                    minimum=1.0,
                    maximum=5.0,
                    value=2.5,
                    step=0.1,
                    label="Guidance Scale (Độ bám sát trang phục)",
                )
                seed = gr.Number(value=-1, label="Seed (-1 để ngẫu nhiên)")

            btn_submit = gr.Button("✨ Bắt đầu thay trang phục", elem_classes=["run-btn"], size="lg")

        # Right Column: Outputs
        with gr.Column(scale=1):
            gr.Markdown("### 3. Kết quả")
            output_image = gr.Image(type="pil", label="Ảnh kết quả (Try-On Result)")
            output_mask = gr.Image(type="pil", label="Mask vùng thay đồ (Mask Preview)")

    # Events
    btn_preview_mask.click(
        fn=generate_mask_preview,
        inputs=[person_input, category, dilation],
        outputs=[output_mask],
    )

    btn_submit.click(
        fn=run_tryon,
        inputs=[
            person_input,
            garment_input,
            mask_mode,
            category,
            dilation,
            custom_mask_input,
            steps,
            guidance_scale,
            seed,
        ],
        outputs=[output_image, output_mask],
    )

if __name__ == "__main__":
    demo.queue().launch(server_name="127.0.0.1", server_port=7860, inbrowser=True)
