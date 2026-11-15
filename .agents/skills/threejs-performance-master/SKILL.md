---
name: threejs-performance-master
description: >-
  Three.js, React Three Fiber (R3F), and WebGL performance optimization guidelines
  drawn from '100 Three.js Tips' and mobile WebGL standards. Use when creating,
  optimizing, profiling, or debugging 3D scenes, shaders, materials, and asset pipelines.
---

# 🚀 Three.js & WebGL Mobile Performance Master Skill

Skill này đúc kết từ cẩm nang kinh điển **"100 Three.js Tips That Actually Improve Performance"** (Utsubo), mã nguồn chuẩn của Three.js core và các dự án WebGL thực chiến trên thiết bị di động.

---

## 🏎️ 1. QUẢN LÝ DRAW CALL & HÌNH KHỐI (GEOMETRY OPTIMIZATION)

1. **Giới hạn số Draw Calls:**
   * Mục tiêu trên mobile: **< 50 - 100 Draw Calls**. Mỗi cặp Material + Mesh riêng biệt sẽ tạo ra 1 draw call.
2. **Kỹ thuật InstancedMesh:**
   * Khi cần vẽ nhiều vật thể giống nhau (bàn ghế, bát đĩa, hoa rơi, đèn lồng), **bắt buộc** dùng `InstancedMesh` thay vì tạo nhiều `Mesh` riêng lẻ.
   * Gom 100 chiếc ghế thành 1 InstancedMesh giảm từ 100 draw calls xuống còn **1 draw call duy nhất**.
3. **Gộp Geometry (Merge Geometries):**
   * Với các vật thể tĩnh trong sảnh tiệc (khung rạp, tường, bục sân khấu), dùng `BufferGeometryUtils.mergeGeometries()` để gộp chúng lại nếu dùng chung 1 Material.
4. **Xóa bỏ các mặt khuất (Culled Backfaces):**
   * Luôn bật `material.side = THREE.FrontSide` (mặc định). Tránh lạm dụng `THREE.DoubleSide` trừ khi thực sự cần thiết (như lá cờ, dải ruy băng).

---

## 💡 2. ÁNH SÁNG & ĐỔ BÓNG: ĐIỂM NGHẼN CHÍ MẠNG (LIGHTING & SHADOWS)

1. **Tuyệt đối tránh PointLight Shadows:**
   * Một `DirectionalLight` đổ bóng chỉ tốn 1 lần render pass.
   * Một `PointLight` đổ bóng yêu cầu **6 lần render pass (Cube Map)** -> Làm sụt giảm 500% hiệu năng GPU di động ngay lập tức!
2. **Nguyên tắc Bake Lighting:**
   * Không tính toán ánh sáng và bóng đổ động thời gian thực (no realtime shadow maps).
   * Toàn bộ ánh sáng đèn chùm, ánh nến, bóng dưới chân bàn ghế được **Bake sẵn vào texture** trong Blender.
3. **Giới hạn nguồn sáng hoạt động:**
   * Tối đa 1 - 2 nguồn sáng: `1 AmbientLight` (làm sáng nền dịu) + `1 DirectionalLight` không bật shadow.

---

## 🧠 3. BỘ NHỚ & CHỐNG TRÀN VRAM (MEMORY & DISPOSAL)

Khác với DOM HTML thông thường, việc xóa component hay gọi `scene.remove(mesh)` **KHÔNG hề giải phóng bộ nhớ VRAM của GPU**. Không dọn dẹp sẽ gây vỡ bộ nhớ (`WebGL: CONTEXT_LOST_WEBGL`).

* **Quy tắc dọn dẹp triệt để (The Disposal Pattern):**
```javascript
export const disposeMesh = (mesh) => {
  if (!mesh) return;
  if (mesh.geometry) mesh.geometry.dispose();
  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((mat) => disposeMaterial(mat));
    } else {
      disposeMaterial(mesh.material);
    }
  }
};

const disposeMaterial = (material) => {
  if (!material) return;
  Object.keys(material).forEach((prop) => {
    if (material[prop] && typeof material[prop].dispose === 'function') {
      material[prop].dispose();
    }
  });
  material.dispose();
};
```

---

## 🎨 4. QUẢN LÝ TEXTURE & NÉN ASSET (TEXTURES & DRACO)

1. **Kích thước Lũy thừa của 2 (Power of Two - PoT):**
   * Mọi texture phải có kích thước: `256x256`, `512x512`, tối đa `1024x1024`. Tuyệt đối không dùng ảnh 2K/4K trên web di động.
2. **Định dạng tối ưu:**
   * Dùng **WebP** cho ảnh màu/texture thông thường.
   * Dùng chuẩn nén **Google Draco** cho toàn bộ file `.glb` (giảm 70-80% kích thước tải qua 4G/5G).
3. **Tắt Mipmaps nếu không cần thiết:**
   * Với các texture phẳng như UI hoặc poster không đổi kích thước theo khoảng cách: `texture.generateMipmaps = false; texture.minFilter = THREE.LinearFilter;` (tiết kiệm 33% dung lượng VRAM cho texture đó).

---

## 📱 5. THIẾT LẬP RENDERER CHO MOBILE

```javascript
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75)); // Khống chế DPR
renderer.powerPreference = 'high-performance';
// Tắt antialias trên máy siêu yếu nếu cần
// Chỉ render theo nhu cầu (Render on-demand) nếu cảnh tĩnh: invalidate()
```
