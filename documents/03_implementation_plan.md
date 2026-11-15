# 📅 KẾ HOẠCH TRIỂN KHAI CHI TIẾT (IMPLEMENTATION PLAN)
## DỰ ÁN: ĐI ĐÁM CƯỚI ONLINE 3D

* **Quy mô:** MVP (Minimum Viable Product)  
* **Thời gian dự kiến:** 14 - 16 ngày làm việc  
* **Chiến lược:** Chia nhỏ theo từng Sprint/Giai đoạn độc lập. Sau mỗi giai đoạn đều có sản phẩm chạy được (testable output) để kiểm tra trực tiếp.

---

```
[GIAI ĐOẠN 1] ──► [GIAI ĐOẠN 2] ──► [GIAI ĐOẠN 3] ──► [GIAI ĐOẠN 4] ──► [GIAI ĐOẠN 5] ──► [GIAI ĐOẠN 6]
 Khung 3D &        Scene 1:          Scene 2:          Scene 3:          Realtime          Tối ưu Mobile
 Khởi tạo dự án    Lên đồ 3D        Sảnh tiệc 3D      Cụng ly & Mâm cỗ   Đồng bộ bạn bè     & Triển khai
 (2 - 3 ngày)      (2 ngày)         (2 - 3 ngày)      (3 ngày)          (3 ngày)          (2 ngày)
```

---

## 🎯 GIAI ĐOẠN 1: KHỞI TẠO DỰ ÁN & KHUNG 3D CƠ BẢN (DAY 1 - 3)
*Mục tiêu: Dựng xong nền tảng code React + Three.js, load được mô hình 3D thử nghiệm đầu tiên.*

* [ ] **Task 1.1: Khởi tạo Project & Cấu hình môi trường**
  * Khởi tạo React (Vite) + Tailwind CSS.
  * Cài đặt thư viện: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `howler`, `lucide-react`.
  * Cấu hình thư mục chứa tài nguyên tĩnh: `/public/models/`, `/public/textures/`, `/public/sounds/`.
* [ ] **Task 1.2: Tích hợp bộ giải nén 3D (Draco Decoder)**
  * Copy thư viện `draco_decoder` vào thư mục public để giải nén file `.glb` siêu nhẹ.
  * Viết hook chuẩn hóa tải 3D: `useGLTF` kết hợp bộ nhớ đệm (caching).
* [ ] **Task 1.3: Dựng Canvas 3D & Ánh sáng mẫu**
  * Dựng Canvas toàn màn hình (responsive trên cả điện thoại và máy tính).
  * Thiết lập ánh sáng ấm áp đám cưới: AmbientLight (vàng nhạt) + DirectionalLight.

---

## 🎯 GIAI ĐOẠN 2: SCENE 1 - CỔNG CƯỚI & PHÒNG THAY ĐỒ 3D (DAY 4 - 5)
*Mục tiêu: Người chơi nhập được tên, xoay nhân vật 360 độ và bấm đổi đồ xem trực tiếp.*

* [ ] **Task 2.1: Dựng nhân vật Chibi 3D & Bục xoay**
  * Đưa nhân vật Chibi 3D cơ bản (nam/nữ) đứng trên bục tròn.
  * Thêm animation nhún nhảy / đung đưa nhẹ (Idle animation).
  * Cho phép vuốt/kéo chuột để xoay nhân vật 360 độ.
* [ ] **Task 2.2: Hệ thống đổi trang phục & phụ kiện (Skin Switcher)**
  * Thiết lập cơ chế đổi texture/material: Vest bảnh bao, Áo dài, Quần đùi áo ba lỗ.
  * Bật/tắt phụ kiện (Phụ kiện node): Kính đen ngầu, Hoa cầm tay, Ly bia.
* [ ] **Task 2.3: UI Check-in & Unlock Web Audio**
  * Khung nhập: Tên khách mời + Danh xưng.
  * Nút to: **"VÀO TIỆC"** -> Khi bấm sẽ mở khóa Web Audio (tránh lỗi Safari chặn tiếng) và phát nhạc nền đám cưới.

---

## 🎯 GIAI ĐOẠN 3: SCENE 2 - SẢNH TIỆC 3D & CHỌN BÀN NGỒI (DAY 6 - 8)
*Mục tiêu: Nhìn thấy toàn cảnh hội trường cưới, bấm vào ghế trống thì camera lướt vào bàn.*

* [ ] **Task 3.1: Dựng không gian hội trường cưới 3D**
  * Mô hình rạp cưới / sảnh tiệc: Sân khấu có bánh kem, tháp champagne, cổng hoa.
  * Dùng `InstancedMesh` để render 6 - 10 bàn tiệc tròn (tiết kiệm GPU).
* [ ] **Task 3.2: Tương tác chọn bàn & ghế ngồi**
  * Mỗi bàn có biển tên nổi 3D: *Bàn Bạn Cấp 3, Bàn FA, Bàn Đồng Nghiệp...*
  * Ghế trống có hiệu ứng phát sáng nhẹ (Highlight).
  * Dùng Raycaster để bắt sự kiện click/tap vào ghế trống.
* [ ] **Task 3.3: Hiệu ứng Camera Cinematic (GSAP Fly-through)**
  * Khi chọn ghế: Camera chuyển động mượt mà lướt từ cổng sảnh, bay qua các bàn và hạ cánh cận cảnh đúng vào vị trí ghế đã chọn.

---

## 🎯 GIAI ĐOẠN 4: SCENE 3 - BÀN TIỆC CẬN CẢNH, CỤNG LY & LÊN MÓN (DAY 9 - 11)
*Mục tiêu: Đạt được cảm giác "ăn cỗ ảo" - Bưng đồ ăn ra mâm, cụng ly leng keng tóe bọt, mở mã VietQR.*

* [ ] **Task 4.1: Render mâm cỗ 3D & Các khách mời cùng bàn**
  * Hiển thị avatar 3D của những người đang ngồi cùng bàn quanh mâm tròn.
  * Đặt sẵn bộ chén đũa, ly thủy tinh và 1 bao lì xì đỏ 3D.
* [ ] **Task 4.2: Tương tác "Lên món cỗ cưới"**
  * Nút bấm **"LÊN MÓN"**: Mô hình 3D rơi xuống mâm (Đĩa 1: Gà luộc lá chanh -> Đĩa 2: Tôm hấp -> Đĩa 3: Xôi gấc).
  * Hiệu ứng hạt (Particle): Khói nóng bốc lên nhẹ nhàng từ đĩa đồ ăn.
  * Chạm vào đĩa: Phát tiếng nhai gắp cỗ `nhóp nhép`.
* [ ] **Task 4.3: Tương tác "Cụng ly (Dô!)"**
  * Nút bấm lớn: **"CỤNG LY 🍻"**.
  * Animation: Tất cả ly trên bàn cùng bay lên va vào nhau ở giữa bàn.
  * Sound: Phát tiếng va ly thủy tinh **"KENG!"** trong trẻo + tiếng reo "Dô!".
  * Particle: Bọt bia sủi tung tóe + tia sáng lấp lánh màu vàng kim.
  * Nhảy số bộ đếm: *"Bàn này đã cạn XX ly"*.
* [ ] **Task 4.4: Bao lì xì 3D trồi mã VietQR**
  * Chạm vào bao lì xì đỏ: Bao lì xì mở nắp trồi lên thẻ VietQR động.
  * Cho phép khách chọn nhanh mức mừng (68k, 168k, 500k, 999k) -> Sinh lại mã QR có đúng số tiền để quét thanh toán thẳng vào STK dâu rể.

---

## 🎯 GIAI ĐOẠN 5: REALTIME ĐỒNG BỘ BẠN BÈ (DAY 12 - 14)
*Mục tiêu: 2 - 3 người bạn mở 2 điện thoại khác nhau, cùng ngồi một bàn và thấy nhau cụng ly cùng lúc.*

* [ ] **Task 5.1: Dựng Backend Socket.io siêu nhẹ**
  * Node.js/Bun server quản lý Room theo cấu trúc: `weddingId` và `tableId`.
  * Bộ nhớ RAM lưu trạng thái các ghế trống/đã ngồi của từng bàn.
* [ ] **Task 5.2: Đồng bộ sự kiện thời gian thực**
  * Sự kiện `guest:join_seat`: Máy A vào ghế -> Máy B lập tức thấy nhân vật máy A xuất hiện ở ghế đó.
  * Sự kiện `guest:cheers`: Máy A bấm cụng ly -> Máy B cũng tự động nâng ly, rung chuông phát tiếng keng đồng thời.
  * Sự kiện `table:serve_dish`: Đồng bộ đĩa đồ ăn dọn ra cho cả bàn.

---

## 🎯 GIAI ĐOẠN 6: TỐI ƯU MOBILE, POLISH & DEPLOY (DAY 15 - 16)
*Mục tiêu: Đảm bảo chạy mượt trên mọi điện thoại 4G và có link share Facebook/Zalo.*

* [ ] **Task 6.1: Tối ưu hiệu năng di động**
  * Kiểm tra toàn bộ dung lượng tải trang (Assets < 6MB).
  * Kiểm tra FPS trên iPhone và Android tầm trung (đảm bảo đạt 50 - 60 FPS).
  * Xử lý xoay ngang / xoay dọc màn hình (Responsive orientation).
* [ ] **Task 6.2: Tạo ảnh "Thẻ chứng nhận ăn cỗ online"**
  * Dùng `html2canvas` render nhanh 1 bức ảnh kỷ niệm: Tên khách, Mẫu đồ đã mặc, Bàn đã ngồi, Số ly đã uống.
  * 1 chạm tải ảnh hoặc share Story Facebook/Instagram.
* [ ] **Task 6.3: Đóng gói & Triển khai (Deployment)**
  * Deploy Frontend lên Vercel / Netlify.
  * Deploy Backend Socket.io lên Render / Railway.
  * Cấu hình Custom Domain (ví dụ: `didamcuoi.online`).
