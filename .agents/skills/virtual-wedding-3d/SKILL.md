---
name: virtual-wedding-3d
description: >-
  Development guidelines, 3D WebGL mobile optimization standards, system architecture,
  and implementation runbooks for the "Đi Đám Cưới Online 3D" (Virtual Wedding 3D) project.
  Use this skill whenever writing, refactoring, optimizing, or testing code for this project.
---

# 💒 Virtual Wedding 3D - Development & Engineering Skill

Skill này đóng vai trò là "kim chỉ nam" kỹ thuật, quy định các tiêu chuẩn code, kiến trúc 3D WebGL trên thiết bị di động, quy trình quản lý tài nguyên và luồng triển khai cho dự án **Đi Đám Cưới Online 3D**.

---

## 📚 Tài liệu dự án liên kết (Project References)
Trước khi thực hiện các task, tham khảo tài liệu chi tiết tại thư mục `documents/`:
* [PRD & Đặc tả nghiệp vụ](file:///Users/datle/workspace/didamcuoionline/documents/01_product_requirements.md)
* [Kiến trúc hệ thống](file:///Users/datle/workspace/didamcuoionline/documents/02_system_architecture.md)
* [Kế hoạch triển khai tổng quan](file:///Users/datle/workspace/didamcuoionline/documents/03_implementation_plan.md)
* [Bảng phân rã 40 Micro-tasks](file:///Users/datle/workspace/didamcuoionline/documents/04_detailed_task_breakdown.md)

---

## ⚡ 1. NGUYÊN TẮC VÀNG TỐI ƯU 3D WEBGL TRÊN MOBILE (P0)

Thiết bị di động (đặc biệt là iOS Safari trong Zalo/Messenger/Facebook WebView) rất nhạy cảm với bộ nhớ RAM và GPU. Mọi đoạn code 3D phải tuân thủ nghiêm ngặt 5 quy tắc sau:

### 1.1 Khống chế Device Pixel Ratio (DPR)
Tuyệt đối **không để DPR mặc định > 2** trên màn hình Retina, vì sẽ làm GPU phải tính toán số điểm ảnh gấp 4-9 lần gây nóng máy và tụt FPS.
```jsx
// ✅ Đúng: Giới hạn tối đa là 1.5 hoặc 2
<Canvas dpr={[1, Math.min(window.devicePixelRatio, 1.75)]} gl={{ antialias: true, powerPreference: "high-performance" }}>
```

### 1.2 Tuyệt đối KHÔNG dùng Realtime Shadows
* Tắt toàn bộ `castShadow` và `receiveShadow` trên tất cả mesh và lights.
* Đổ bóng bằng cách: **Bake texture sẵn từ Blender** hoặc dùng một tấm plane dẹt tròn màu xám đen mờ (Fake Shadow / Contact Shadow) đặt dưới chân nhân vật và bàn tiệc.

### 1.3 Quản lý bộ nhớ & Giải phóng tài nguyên (Memory Cleanup)
Trình duyệt di động sẽ crash (văng trang) nếu dung lượng WebGL vượt quá giới hạn. Khi đổi Scene hoặc unmount component:
```javascript
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
    if (material.map) material.map.dispose();
  };
}, []);
```

### 1.4 Sử dụng Draco Compression cho Assets 3D
Mọi file mô hình `.glb` phải được nén bằng Google Draco Decoder:
* File nén đặt trong `public/models/`.
* Bộ giải nén `draco_decoder.wasm` đặt trong `public/draco/`.
* Dùng `useGLTF.preload('/models/...', '/draco/')` để tải ngầm trước khi hiển thị.

---

## 🔊 2. TIÊU CHUẨN XỬ LÝ ÂM THANH (AUDIO CONTEXT UNLOCK)

Trình duyệt iOS/Safari chặn mọi âm thanh tự động phát (Autoplay Policy).
* **Quy tắc:** Chỉ khởi tạo và kích hoạt `Howler.ctx` khi người dùng có **thao tác chạm đầu tiên** (ví dụ: bấm nút *"VÀO TIỆC"* ở Scene 1).
* Mọi file âm thanh SFX (`sfx_clink.mp3`, `sfx_eat.mp3`) phải có bitrate vừa phải, thời lượng < 2 giây và dung lượng < 60KB.

---

## 🎬 3. QUẢN LÝ CHUYỂN CẢNH & CAMERA (GSAP DIRECTOR)

Hệ thống gồm 3 phân cảnh (Scene Index 1, 2, 3):
* **Scene 1 (Cổng cưới & Thay đồ):** Camera cố định nhìn bục xoay, người dùng xoay nhân vật quanh trục Y.
* **Scene 2 (Sảnh tiệc 3D):** Camera góc nhìn toàn cảnh (Bird's-eye / Isomeric), người dùng chạm vào ghế trống.
* **Scene 3 (Bàn tiệc cận cảnh):** Khi ghế được chọn, dùng GSAP lerp camera:
```javascript
import gsap from 'gsap';

export const flyToSeat = (camera, targetPosition, onComplete) => {
  gsap.to(camera.position, {
    x: targetPosition.x,
    y: targetPosition.y + 1.2,
    z: targetPosition.z + 1.8,
    duration: 1.6,
    ease: "power2.inOut",
    onComplete
  });
};
```

---

## 🌐 4. TIÊU CHUẨN ĐỒNG BỘ REALTIME (SOCKET.IO)

* **Namespace / Room:** Luôn phân vùng theo cú pháp:
  * Room cưới: `room:wedding:<wedding_id>`
  * Room bàn tiệc: `room:table:<wedding_id>:<table_id>`
* **Payload Event:** Payload gửi qua socket phải siêu gọn nhẹ (chỉ gửi ID và Index, không gửi object cồng kềnh):
  * `guest:cheers`: `{ tableId, guestId }`
  * `guest:join_seat`: `{ tableId, seatIndex, guestName, outfitId }`
  * `table:serve_dish`: `{ tableId, dishId }`

---

## 🛠️ 5. QUY TRÌNH PHÁT TRIỂN & NGHIỆM THU TỪNG TASK (RUNBOOK)

Khi bắt đầu một task từ `documents/04_detailed_task_breakdown.md`:
1. **Kiểm tra tiêu chí DoD (Definition of Done):** Đọc kỹ DoD của task trước khi viết code.
2. **Thực thi code:** Tuân thủ phân chia rõ ràng giữa `components/3d/` (Canvas R3F) và `components/ui/` (HTML/Tailwind Overlay).
3. **Kiểm thử trên thiết bị di động:** Bật chế độ Responsive Mode (iPhone SE / iPhone 14 Pro / Android) trong DevTools để đảm bảo UI không bị tràn và 3D không bị che khuất.
4. **Cập nhật tiến độ:** Đánh dấu `[x]` vào task tương ứng trong file `documents/04_detailed_task_breakdown.md`.
