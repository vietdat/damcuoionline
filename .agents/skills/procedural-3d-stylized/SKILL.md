---
name: procedural-3d-stylized
description: >-
  Techniques, code patterns, and compound geometry formulas to create stylized,
  low-poly 3D models (Chibi characters, Vietnamese wedding banquet dishes, beer glasses,
  decor) directly with Three.js / React Three Fiber code without external 3D model dependencies.
---

# 🎨 Procedural Stylized 3D - Dựng Asset Bằng Code

Skill này cung cấp các công thức toán học và kỹ thuật ghép khối (Compound Geometries) để dựng toàn bộ không gian, nhân vật và mâm cỗ cưới Việt Nam **hoàn toàn bằng code Three.js / R3F**.

> **Lợi ích cốt lõi:** Không cần chờ đợi artist vẽ file 3D, không lo file `.glb` bị nặng mạng, toàn bộ cảnh tải trong **chưa đầy 100ms** và dung lượng web dưới 1MB!

---

## 🍗 1. CÔNG THỨC DỰNG MÂM CỖ CƯỚI VIỆT NAM (PROCEDURAL DISHES)

### 1.1 Đĩa Gà Luộc Lá Chanh Vàng Óng
* **Thân gà:** Ghép từ 1 khối hình bầu dục (`SphereGeometry` với scale `[1.3, 1, 0.9]`), xoay góc nghiêng 15 độ.
* **Đùi gà (2 bên):** Dùng `CylinderGeometry` vát nhọn nhẹ hoặc ghép từ 2 hình cầu nhỏ nối với ống xương trắng (`Cylinder`).
* **Màu sắc & Chất liệu:** `MeshStandardMaterial` màu vàng nghệ bóng nhẹ:
  * `color: '#F59E0B'` (hoặc `#D97706`), `roughness: 0.35` (tạo độ bóng bẩy như quét mỡ gà), `metalness: 0.05`.
* **Lá chanh thái chỉ:** 8 - 12 tấm dẹt mỏng màu xanh đậm (`BoxGeometry` kích thước `[0.15, 0.01, 0.02]`, `color: '#15803D'`) rải ngẫu nhiên trên lưng gà.
* **Đĩa sứ:** `CylinderGeometry` dẹt đáy tròn màu trắng tinh khôi (`color: '#FFFFFF'`, `roughness: 0.1`).

### 1.2 Đĩa Tôm Sú Hấp Nước Dừa
* **Thân tôm:** Dùng `TorusGeometry` uốn cong nửa vòng (`arc: Math.PI * 0.8`), đường kính thân nhỏ dần về phía đuôi.
* **Vảy đuôi tôm:** 2 tấm tam giác nhỏ màu đỏ cam xòe ra.
* **Màu sắc:** `MeshStandardMaterial` màu đỏ gạch chín tới (`color: '#EA580C'`, `roughness: 0.4`).
* **Trình bày:** Xếp 5 - 6 con tôm uốn tròn đồng tâm trên đĩa tròn có viền vàng kim.

### 1.3 Đĩa Xôi Gấc Hạt Sen Hình Trái Tim Chữ Hỷ
* **Khuôn xôi trái tim:** Dùng `THREE.Shape` vẽ đường cong Bezier hình trái tim, sau đó dùng `ExtrudeGeometry` đẩy khối dày `0.3` đơn vị với góc bo tròn (`bevelEnabled: true`).
* **Màu xôi gấc:** Màu đỏ cam son rực rỡ (`color: '#DC2626'`), bề mặt tạo độ nhám sần sùi nhẹ (`roughness: 0.8`).
* **Hạt sen:** 6 - 8 hình cầu nhỏ tròn dẹt màu trắng ngà (`color: '#FEF08A'`, `scale: [1, 0.6, 1]`) ấn chìm nhẹ trên mặt xôi.

---

## 🍻 2. CÔNG THỨC DỰNG LY BIA SỦI BỌT & BAO LÌ XÌ 3D

### 2.1 Cốc Bia Quai Thủy Tinh (Cụng Ly)
* **Thân cốc:** `CylinderGeometry` rỗng hoặc bán trong suốt (`transmission: 0.8`, `roughness: 0.1`, `transparent: true`, `opacity: 0.85`).
* **Quai cốc:** `TorusGeometry` nửa vòng gắn bên hông cốc.
* **Bia vàng:** `CylinderGeometry` nhỏ hơn nằm bên trong, màu vàng hổ phách (`color: '#FBBF24'`).
* **Bọt bia:** Một lớp hình cầu dẹt màu trắng ngà nở tràn trên miệng cốc (`color: '#FFFBEB'`).
* **Bọt khí bay (Particles):** 5 - 10 quả cầu li ti nổi dần từ đáy lên miệng bia.

### 2.2 Bao Lì Xì Đỏ May Mắn Chữ Hỷ
* **Thân bao:** `BoxGeometry` mỏng dẹt `[0.7, 1.2, 0.04]` bo góc nhẹ.
* **Màu sắc:** Màu đỏ nhung thắm (`color: '#B91C1C'`).
* **Họa tiết Chữ Hỷ / Trâm vàng:** 1 tấm plane dập nổi màu vàng kim sáng chói (`color: '#FACC15'`, `metalness: 0.8`, `roughness: 0.2`).

---

## 👶 3. CÔNG THỨC DỰNG NHÂN VẬT CHIBI 3D CHUẨN

* **Tỉ lệ Chibi:** Tỉ lệ 1:2 hoặc 1:2.5 (Đầu to bằng 1/2 chiều cao cả người).
  * **Đầu:** `SphereGeometry` hơi dẹt ở cằm (`scale: [1, 0.95, 0.95]`), màu da hồng hào (`color: '#FFEDD5'`).
  * **Mắt:** 2 hình cầu dẹt màu đen bóng + 2 điểm sáng trắng (Catchlight) tạo sự long lanh.
  * **Miệng:** Đường cong mỉm cười tươi tắn.
  * **Thân:** Khối trụ hình thang cụt ngược (`CylinderGeometry` đỉnh nhỏ hơn đáy).
  * **Tay & Chân:** Các khối capsule/cylinder tròn ngộ nghĩnh.
* **Đổi trang phục qua Material:**
  * Chỉ cần đổi màu/texture của khối Thân:
    * *Vest:* Màu đen `#1E293B` + cà vạt đỏ `#EF4444`.
    * *Áo dài:* Màu đỏ thắm `#DC2626` viền vàng.
    * *Áo ba lỗ:* Màu trắng `#FFFFFF` + quần đùi hoa `#3B82F6`.

---

## 💡 4. VẬT LIỆU TOON SHADER DỄ THƯƠNG (MESHTOONMATERIAL)
Để tạo phong cách hoạt hình anime/game ấm cúng, ưu tiên sử dụng `MeshToonMaterial` kết hợp `gradientMap` (3 tone màu phân cấp sáng/tối) thay cho vật liệu chân thực tả thực quá đà.
