# 📋 KẾ HOẠCH FIX TRIỆT ĐỂ LỖI UI/3D - SCENE 3 (BÀN TIỆC CẬN CẢNH)
## DỰ ÁN: ĐI ĐÁM CƯỚI ONLINE 3D

---

### 🎯 MỤC TIÊU CỐT LÕI
Khắc phục dứt điểm 5 lỗi hiển thị và công thái học 3D trong Scene 3 (Bàn Tiệc Cận Cảnh) được phát hiện qua ảnh chụp thực tế:
1. Đưa toàn bộ mâm cỗ (Gà luộc lá chanh, Tôm sú hấp, Xôi gấc trái tim), 6 ly bia và phong bì đỏ nổi lên đúng mặt bàn.
2. Xoay toàn bộ ghế và nhân vật Chibi hướng thẳng vào tâm bàn ăn.
3. Hạ độ cao bàn ăn về chuẩn công thái học tự nhiên với tư thế ngồi của nhân vật.
4. Thay thế phông đen vô tận bằng không gian sảnh tiệc ấm cúng với đèn chùm bàn tiệc.
5. Điều chỉnh góc Camera đạo diễn để mâm cỗ và các nhân vật không bị che khuất bởi cụm nút bấm dưới đáy.

---

## 📝 DANH SÁCH CHI TIẾT 5 TASKS CẦN THỰC HIỆN

### 🔹 TASK 1: CHUẨN HÓA CAO ĐỘ HÌNH HỌC BÀN & ĐƯA ĐỒ ĂN LÊN MẶT BÀN
* **File mục tiêu:** `src/components/3d/TableFocusScene.jsx` & `src/components/3d/BeerMugMesh.jsx`
* **Vấn đề kỹ thuật:** 
  - Khối trụ khăn trải bàn có tâm $Y = 0.72$, cao $0.70\text{m} \implies$ mặt bàn cao tới $Y = 1.07\text{m}$.
  - Toàn bộ đĩa gà luộc, đĩa tôm, đĩa xôi, ly bia, phong bì đỏ đặt ở $Y = 0.75 - 0.77\text{m}$, chìm sâu $30\text{cm}$ bên trong khối trụ đỏ.
* **Các bước thực hiện:**
  1. Hạ khối trụ khăn bàn đỏ: `position={[0, 0.38, 0]}`, `cylinderGeometry args={[1.1, 1.2, 0.70, 48]}` $\implies$ mặt bàn chuẩn xác ở $Y = 0.38 + 0.35 = 0.73\text{m}$.
  2. Viền vàng khăn trải bàn: `position={[0, 0.732, 0]}`, `rotation={[-Math.PI / 2, 0, 0]}`.
  3. Mâm xoay kính Lazy Susan: `position={[0, 0.74, 0]}`, `cylinderGeometry args={[0.72, 0.72, 0.02, 32]}` (mặt mâm ở $Y = 0.75\text{m}$).
  4. Đĩa gà luộc: đặt tại `position={[0, 0.76, 0]}`.
  5. Đĩa tôm sú hấp: đặt tại `position={[0.36, 0.76, -0.08]}`.
  6. Đĩa xôi gấc trái tim: đặt tại `position={[-0.36, 0.76, -0.08]}`.
  7. Hơi nước bốc nghi ngút (`DishSteamParticles`): đặt tại $Y = 0.86\text{m}$.
  8. Phong bì mừng cưới 3D (`RedEnvelope3D`): đặt tại `position={[0.42, 0.76, 0.48]}`.
  9. Trong `BeerMugMesh.jsx`: chỉnh cao độ ly bia nghỉ ở $Y = 0.76\text{m}$, khi cụng ly nâng lên $Y = 0.98\text{m}$.

---

### 🔹 TASK 2: SỬA HƯỚNG XOAY GHẾ & KHÁCH MỜI HƯỚNG VÀO TÂM MÂM CỖ
* **File mục tiêu:** `src/components/3d/TableFocusScene.jsx`
* **Vấn đề kỹ thuật:**
  - Dòng 92 dùng công thức `rotation={[0, -angle + Math.PI / 2, 0]}` (dấu `+` khiến ghế xoay ngược $180^\circ$ ra ngoài phòng).
* **Các bước thực hiện:**
  1. Sửa công thức góc xoay thành chuẩn: `rotation={[0, -angle - Math.PI / 2, 0]}`.
  2. Đặt khoảng cách ghế cách tâm bàn $R = 1.45\text{m}$ (ôm sát mép bàn $R = 1.15\text{m}$, vừa vặn tầm tay nhân vật).
  3. Đệm ghế ngồi ở $Y = 0.35\text{m}$, lưng tựa ghế ở $Z = -0.20\text{m}$.
  4. Nhân vật Chibi ngồi ở $Y = 0.40\text{m}$, tỷ lệ scale $[0.62, 0.62, 0.62]$: mặt bàn cao $0.73\text{m}$ ngang tầm khuỷu tay chuẩn công thái học.

---

### 🔹 TASK 3: TẠO BẦU KHÔNG KHÍ SẢNH TIỆC ẤM CÚNG & ĐÈN CHÙM
* **File mục tiêu:** `src/components/3d/TableFocusScene.jsx`
* **Vấn đề kỹ thuật:**
  - Scene 3 hiện chỉ có tấm sàn tròn $5\text{m}$ trên nền đen vô tận `#0B0F19`, tạo cảm giác lạnh lẽo, cô độc.
* **Các bước thực hiện:**
  1. Mở rộng sàn đá hoa cương sảnh tiệc: `circleGeometry args={[14, 48]}` với hoa văn viền vàng sang trọng.
  2. Thêm nguồn sáng đèn chùm ấm cúng rọi thẳng vào trung tâm mâm cỗ:
     `<pointLight position={[0, 3.2, 0]} color="#FEF3C7" intensity={1.8} distance={7} decay={2} />`
  3. Thêm vách rèm nhung đỏ phía xa ở hậu cảnh tạo chiều sâu không gian sảnh tiệc.

---

### 🔹 TASK 4: ĐIỀU CHỈNH GÓC CAMERA ĐẠO DIỄN & TRÁNH CHE KHUẤT NÚT BẤM
* **File mục tiêu:** `src/components/3d/WeddingCanvas.jsx` & `src/components/3d/TableFocusScene.jsx`
* **Vấn đề kỹ thuật:**
  - Góc máy quay cũ ($Y = 1.9, Z = 2.2$) nhìn quá thấp, khiến cụm 3 nút bấm dưới đáy đè lên các ghế phía trước.
* **Các bước thực hiện:**
  1. Trong `WeddingCanvas.jsx`: Căn chỉnh góc nhìn Scene 3 thành `camera.position.set(0, 2.3, 2.6)` và `camera.lookAt(0, 0.70, 0)`.
  2. Góc máy cao $2.3\text{m}$ nhìn chúc xuống $40^\circ$ mang lại góc nhìn ẩm thực (culinary angle) hoàn hảo: thấy trọn vẹn cả 3 món ăn, mâm xoay, ly bia và bạn bè cùng bàn.
  3. Cập nhật `OrbitControls`: `target={[0, 0.70, 0]}`, `minDistance={1.8}`, `maxDistance={4.2}`, giới hạn góc quay để không bị nhìn xuyên qua gầm sàn.

---

### 🔹 TASK 5: KIỂM THỬ TƯƠNG TÁC & BUILD VERIFICATION
* **Các bài test thực hiện:**
  1. **Test đĩa thức ăn:** Bấm nút *"Lên Món Tiếp"* $\implies$ từng đĩa gà, đĩa tôm, xôi gấc xuất hiện trên mâm xoay kèm hơi nước bốc lên.
  2. **Test Cụng Ly:** Bấm *"CỤNG LY 🍻"* $\implies$ 6 ly bia đồng loạt nâng lên, nghiêng vào giữa mâm, chạm tiếng Keng vang dội và bung pháo hoa vàng lấp lánh.
  3. **Test Mừng Cưới:** Bấm *"Mừng Cưới 🧧"* $\implies$ mở modal VietQR với các mệnh giá 68k, 168k, 500k, 999k.
  4. **Test Đổi tên bàn:** Bấm vào tên bàn ở header $\implies$ đổi tên thành công và lưu vào store.
  5. **Test Build:** Chạy `npm run build` đảm bảo không có bất kỳ lỗi biên dịch nào.

---

### 🎯 TIÊU CHÍ HOÀN THÀNH (DEFINITION OF DONE)
- [ ] Mâm cỗ đầy ắp thức ăn, ly bia, phong bì đỏ nổi rõ ràng trên mặt bàn (không còn chìm ngập).
- [ ] Tất cả 6 nhân vật đều ngồi ngay ngắn, quay mặt vào trung tâm mâm tiệc.
- [ ] Bàn ăn cao vừa tầm tay, công thái học tự nhiên.
- [ ] Không gian sảnh tiệc lung linh, ấm cúng với ánh đèn chùm.
- [ ] Thanh nút bấm không còn che khuất các chi tiết trên bàn.
- [ ] `npm run build` thành công 100%.
