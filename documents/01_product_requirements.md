# 💒 TÀI LIỆU ĐẶC TẢ YÊU CẦU SẢN PHẨM (PRD)
## DỰ ÁN: ĐI ĐÁM CƯỚI ONLINE 3D (VIRTUAL WEDDING 3D)

* **Phiên bản:** 1.0 (MVP)  
* **Vai trò:** Product Owner (PO)  
* **Ý tưởng cốt lõi:** Mô phỏng nghi thức đi ăn cỗ cưới dưới định dạng 3D tương tác vui nhộn (lấy cảm hứng từ phong cách "Đi chùa online"), tối ưu chạy mượt mà ngay trên trình duyệt web điện thoại.

---

## 1. TỔNG QUAN SẢN PHẨM (PRODUCT OVERVIEW)

### 1.1 Mục tiêu sản phẩm
* **Dành cho Khách mời (Guests):** Người ở xa, bận việc hoặc bạn bè trên mạng xã hội có thể trải nghiệm cảm giác "lên đồ", "chọn bàn", "ăn cỗ ảo", "cụng ly dô vang trời" và mừng phong bì một cách thú vị, không gượng gạo.
* **Dành cho Cô dâu - Chú rể (Hosts):** Tạo một không gian cưới ảo độc lạ để chia sẻ link lên mạng xã hội/thiệp mời, nhận lời chúc và nhận mừng cưới trực tiếp qua VietQR.

### 1.2 Phong cách thiết kế (Art Style & Vibe)
* **Phong cách:** 3D Stylized / Low-poly Chibi dễ thương, ngộ nghĩnh, màu sắc rực rỡ, ấm cúng.
* **Cơ chế tương tác:** Tinh giản, nhanh gọn, không bắt đăng ký tài khoản phức tạp. Người dùng chỉ cần nhập tên và bắt đầu tham gia tiệc ngay lập tức.

---

## 2. LUỒNG TRẢI NGHIỆM NGƯỜI DÙNG (USER JOURNEY)

```
[Link / Mã QR Tiệc Cưới]
          │
          ▼
┌──────────────────────────────────────────────┐
│  MÀN 1: CỔNG RẠP CƯỚI & PHÒNG THAY ĐỒ 3D     │
│  - Nhập tên / biệt danh                      │
│  - Xoay 360° chọn đồ (Vest, Váy, Áo ba lỗ...)│
│  - Bấm "VÀO TIỆC"                            │
└──────────────────────┬───────────────────────┘
                       │ (Camera Fly-through)
                       ▼
┌──────────────────────────────────────────────┐
│  MÀN 2: TOÀN CẢNH SẢNH TIỆC 3D (CHỌN BÀN)    │
│  - Xoay camera ngắm không gian tiệc          │
│  - Thấy các bàn tiệc và người đang ngồi      │
│  - Chạm vào ghế trống để ngồi vào            │
└──────────────────────┬───────────────────────┘
                       │ (Camera Zoom-in)
                       ▼
┌──────────────────────────────────────────────┐
│  MÀN 3: BÀN TIỆC 3D (CẬN CẢNH ĂN & CỤNG LY)  │
│  - Bưng món ăn ra mâm (Gà luộc, Tôm, Xôi...) │
│  - Bấm nút "CỤNG LY!" (1-2-3 DÔ! + Keng!)    │
│  - Bấm Bao lì xì 3D -> Mở VietQR mừng cưới   │
│  - Nhận thẻ "Chứng nhận đã đi ăn cưới"       │
└──────────────────────────────────────────────┘
```

---

## 3. ĐẶC TẢ CHI TIẾT 3 CẢNH TRẢI NGHIỆM (3 SCENES)

### 🎬 Scene 1: Cổng rạp cưới & Lên đồ 3D (Dress-up)
* **Giao diện & Không gian 3D:**
  * Cổng cưới hoa tươi 3D, bảng tên Cô Dâu & Chú Rể kèm ngày cưới.
  * Nhân vật 3D Chibi đứng ở giữa bục xoay 360 độ.
* **Hành vi người dùng:**
  1. Nhập **Tên hiển thị** (Ví dụ: *Anh Tuấn Cấp 3*, *Lan FA*).
  2. Vuốt màn hình để xoay nhân vật 360°.
  3. Chọn bộ trang phục (Outfit):
     * *Lịch sự:* Vest đen bảnh bao, Đầm dạ hội lộng lẫy.
     * *Truyền thống:* Áo dài cưới cách tân.
     * *Meme hài hước:* Áo thun ba lỗ + quần đùi hoa lá hẹ, Đồ ngủ pijama.
  4. Chọn phụ kiện (tùy chọn): Kính đen siêu ngầu, Bó hoa cưới, Ly bia trên tay.
  5. Bấm nút: **"BƯỚC VÀO TIỆC"** (Kích hoạt âm thanh nền đám cưới và camera lướt vào sảnh).

---

### 🎬 Scene 2: Toàn cảnh Sảnh tiệc 3D (Chọn bàn ngồi)
* **Giao diện & Không gian 3D:**
  * Hội trường tiệc cưới với đèn chùm vàng ấm áp, tháp bánh kem, tháp champagne phía xa.
  * Hệ thống các bàn tiệc tròn 3D (6 - 8 ghế mỗi bàn).
  * Mỗi bàn tiệc có gắn bảng tên: *Bàn Bạn Cấp 3, Bàn Đồng Nghiệp, Bàn FA Săn Vía, Bàn Nhậu Xuyên Đêm...*
  * Ghế đã có khách ngồi sẽ hiển thị nhân vật 3D của khách đó. Ghế trống hiển thị hiệu ứng phát sáng nhẹ.
* **Hành vi người dùng:**
  1. Người dùng vuốt màn hình để xoay góc nhìn camera toàn cảnh hội trường.
  2. Nhấp chạm (Tap) trực tiếp vào một chiếc ghế trống tại bàn tiệc muốn tham gia.
  3. Camera tự động chuyển động mượt mà (Cinematic Zoom) hạ cánh ngay vào vị trí ghế đã chọn.

---

### 🎬 Scene 3: Bàn tiệc 3D (Ăn cỗ & Cụng ly) - *Trọng tâm tương tác*
*Góc nhìn cận cảnh trực diện mâm cỗ tròn.*

#### 1. Mâm cỗ 3D dọn món (Lên đồ ăn)
* Mâm xoay ở giữa bàn ban đầu có chén đũa, ly thủy tinh.
* Nút bấm **"LÊN MÓN"**:
  * Các đĩa thức ăn 3D lần lượt xuất hiện kèm khói bốc nghi ngút (Hiệu ứng hạt):
    * *Đĩa 1:* Gà luộc vàng ươm cắm lá chanh 3D.
    * *Đĩa 2:* Tôm sú hấp nước dừa.
    * *Đĩa 3:* Xôi gấc hạt sen đắp hình trái tim chữ Hỷ.
  * Khách chạm vào đĩa thức ăn: Đũa gắp món -> Miếng thức ăn bay về phía màn hình + Âm thanh gắp cỗ vui nhộn (`nhóp nhép`).

#### 2. Cụng ly 3D tương tác (1-2-3 DÔ!)
* Nút bấm trung tâm: **"CỤNG LY 🍻"**.
* Khi bấm:
  * Tất cả các ly bia/rượu trên bàn cùng nâng lên và chạm nhau ở giữa bàn.
  * Hiệu ứng va chạm: Bọt bia bắn ra, tia sáng tóe lên kèm âm thanh **"KENG!"** vang dội.
  * Dòng chữ 3D nảy lên: *"1... 2... 3... DÔ!"*.
  * Bộ đếm chúc phúc nhảy số thời gian thực: *"Bàn này đã cạn 88 ly"*.

#### 3. Bàn phong bì 3D (Mừng cưới thông minh)
* Trên bàn có sẵn một **Bao lì xì đỏ 3D**.
* Khách bấm vào bao lì xì:
  * Bao lì xì tự động mở nắp và trồi lên mã **VietQR** động (được cấu hình sẵn thông tin tài khoản của CD-CR).
  * Khách chỉ cần mở app ngân hàng quét mã để chuyển khoản mừng cưới trực tiếp, không qua trung gian.

#### 4. Thẻ chứng nhận "Đã đi ăn cưới" (Viral Share Loop)
* Nút bấm **"NHẬN THẺ ĂN CƯỚI"**:
  * Tự động sinh ảnh (Canvas/PNG) chứa: Tên khách, Mẫu avatar 3D đã chọn, Bàn đã ngồi, Số ly đã cụng.
  * 1 nút chạm để tải về máy hoặc chia sẻ thẳng lên Story Facebook / Instagram / TikTok.

---

## 4. BẢNG PHÂN RÃ TÍNH NĂNG THEO MỨC ĐỘ ƯU TIÊN

| STT | Tính năng | Mô tả chi tiết | Mức độ ưu tiên |
| :---: | :--- | :--- | :---: |
| 1 | **Phòng thay đồ 3D** | Chọn tên, chọn 3 set đồ chibi cơ bản, xoay nhân vật 360° | **P0 (Must-have)** |
| 2 | **Sảnh tiệc 3D & Chọn bàn** | Xem bàn tiệc, chạm ghế trống để camera zoom vào bàn | **P0 (Must-have)** |
| 3 | **Cụng ly 3D + Sound FX** | Nút bấm cụng ly, animation va ly, tiếng "Keng" và bộ đếm | **P0 (Must-have)** |
| 4 | **Bao lì xì VietQR 3D** | Bao lì xì mở nắp trồi mã VietQR chuyển khoản dâu rể | **P0 (Must-have)** |
| 5 | **Bưng mâm cỗ 3D** | Nút lên món ăn (gà luộc, tôm hấp, xôi gấc) có khói bốc | **P1 (Should-have)** |
| 6 | **Đồng bộ thời gian thực** | Thấy bạn bè cùng ngồi và cùng cụng ly cùng lúc qua Socket | **P1 (Should-have)** |
| 7 | **Tạo thẻ chia sẻ MXH** | Xuất ảnh "Chứng nhận đã đi ăn cưới" để share Story | **P1 (Should-have)** |
