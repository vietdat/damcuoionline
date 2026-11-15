# 📱 Checklist Tối Ưu Mobile 3D WebGL (Đi Đám Cưới Online)

Tài liệu tham chiếu nhanh khi dev hoặc review code cho các component 3D:

## 1. Giới hạn tài nguyên (Budget Constraints)
* **Tổng dung lượng tải ban đầu (Initial Bundle):** < 5MB (kể cả code JS + CSS + 3D assets cơ bản).
* **Polycount nhân vật Chibi:** < 2.500 triangles/nhân vật.
* **Polycount bàn tiệc + chén đĩa:** < 4.000 triangles/cụm bàn.
* **Texture resolution:** Tối đa `1024x1024` cho sảnh tiệc, `512x512` cho nhân vật và món ăn (dùng định dạng `.webp`).
* **Frame rate mục tiêu:** 55 - 60 FPS trên chip Apple A13 Bionic (iPhone 11) hoặc Snapdragon 720G trở lên.

## 2. Best Practices cho React Three Fiber (R3F)
1. **Tránh re-render không cần thiết trong R3F Canvas:**
   * Không đặt state thay đổi liên tục (như slider, input text) bên trong thẻ `<Canvas>`.
   * Truyền state qua ref hoặc zustand transient updates (`useFrame((state) => { ref.current.rotation.y += 0.01 })`).
2. **Quản lý Instancing:**
   * Với 6-10 bàn tiệc giống nhau, luôn dùng `InstancedMesh` hoặc thư viện `@react-three/drei` (`<Instances>` & `<Instance>`).
3. **Ánh sáng (Lighting):**
   * Tối đa 2 nguồn sáng: 1 `ambientLight` (cường độ 0.7) + 1 `directionalLight` (cường độ 0.8) không bóng đổ.
