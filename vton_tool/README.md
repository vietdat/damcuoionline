# 👔 AI Virtual Try-On (CatVTON Local for Apple Silicon M2)

Công cụ thay đổi trang phục (Virtual Try-On) chạy **100% Offline / Local** trên máy Mac chip Apple Silicon M2, tận dụng tối đa GPU MPS (Metal Performance Shaders) và kiến trúc khuếch tán (Diffusion Inpainting).

---

## 🚀 Cách chạy nhanh (1-Click)

Mở Terminal và chạy lệnh:

```bash
cd vton_tool
./run.sh
```

Trình duyệt sẽ tự động mở giao diện tại địa chỉ: **http://127.0.0.1:7860**

---

## 🖥️ Giao diện Web (Gradio)

1. **Cột 1 - Dữ liệu:**
   - **Ảnh người mẫu (Person Image):** Ảnh chụp người cần thay đồ (nên chọn ảnh chụp rõ người, đứng thẳng hoặc nửa người).
   - **Ảnh trang phục (Garment Image):** Ảnh chiếc áo / quần / váy mới (ảnh trải phẳng hoặc ảnh chụp đồ riêng rẽ).

2. **Cột 2 - Vùng thay đồ (Masking):**
   - **Tự động (Auto Segmentation):** Sử dụng SegFormer AI tự động phân tích và tạo mặt nạ theo loại đồ:
     - *Áo / Thân trên (Upper Body)*
     - *Quần / Chân váy (Lower Body)*
     - *Đầm / Váy liền (Dress)*
     - *Toàn bộ đồ (All Clothes)*
   - **Độ mở rộng viền (Dilation):** Tự động mở rộng thêm 15px quanh viền áo cũ để xoá sạch các đường may/cổ áo cũ, tránh lộ viền.
   - **Nút "🔍 Xem thử vùng Mask":** Cho phép kiểm tra ngay vùng đồ AI đã tách trước khi chạy.

3. **Cột 3 - Kết quả:**
   - Ảnh sau khi đã thay trang phục mới ăn khớp với nếp nhăn cơ thể, ánh sáng và tư thế.

---

## ⌨️ Chạy bằng dòng lệnh (CLI Script)

Nếu muốn tích hợp vào script tự động hoặc xử lý hàng loạt:

```bash
cd vton_tool
source venv/bin/activate

# Thay áo (Upper body)
python tryon_cli.py \
  --person examples/person.jpg \
  --cloth examples/shirt.jpg \
  --category upper_body \
  --steps 25 \
  --output result.jpg
```

Các tham số hỗ trợ:
- `--person`: Đường dẫn ảnh người mẫu.
- `--cloth`: Đường dẫn ảnh quần áo.
- `--category`: `upper_body`, `lower_body`, `dress`, `all`.
- `--steps`: Số bước suy diễn (20 - 30 là tối ưu tốc độ trên Mac M2).
- `--dilation`: Độ phủ mở rộng viền mask (mặc định 15px).
- `--output`: Đường dẫn lưu file kết quả.

---

## 🧠 Kiến trúc kỹ thuật bên dưới

```text
[Ảnh người] ──> [SegFormer Clothes AI] ──> [Binary Mask (Vùng áo cũ)]
                                                      │
[Ảnh trang phục mới] ─────────────────────────────────┼──> [CatVTON Attention Adapter]
                                                      │           │
[Latent Noise] ───────────────────────────────────────┘           ▼
                                                       [SD Inpainting UNet (MPS GPU)]
                                                                  │
                                                                  ▼
                                                      [Ảnh đã thay trang phục hoàn chỉnh]
```

1. **SegFormer (`mattmdjaga/segformer_b2_clothes`):** Mô hình Semantic Segmentation chuyên biệt cho trang phục, nhận diện chính xác 18 bộ phận quần áo trong 0.2 giây.
2. **CatVTON (`zhengchong/CatVTON`):** Mô hình VTON SOTA nối tiếp đặc trưng (Concatenation Attention) giúp giữ nguyên chất liệu vải, họa tiết và màu sắc của trang phục mới.
3. **Hardware Acceleration:** Natively hỗ trợ PyTorch MPS (Metal) trên Apple Silicon M2.
