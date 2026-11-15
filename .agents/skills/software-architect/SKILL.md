---
name: software-architect
description: >-
  High-level system architecture, software design patterns, domain boundaries, state management architecture,
  real-time event systems, 3D WebGL vs DOM decoupling, performance budgets, and Architectural Decision Records (ADRs).
  Activate when designing systems, planning new features, establishing component contracts, or making foundational technical choices.
---

# 🏛️ Software Architect - System Design & Engineering Architecture

Skill này hướng dẫn và chuẩn hóa tư duy của một **Software Architect (Kiến trúc sư phần mềm)** cho các hệ thống ứng dụng web hiện đại kết hợp WebGL 3D và đa người chơi thời gian thực (Real-time Multiplayer). Mục tiêu là thiết kế hệ thống có tính module hóa cao, mở rộng mượt mà, phân định rõ ràng biên giới trách nhiệm giữa các thành phần và kiểm soát chặt chẽ các yêu cầu phi chức năng (NFRs).

---

## 🎯 1. VAI TRÒ & NGUYÊN TẮC THIẾT KẾ KIẾN TRÚC

Kiến trúc phần mềm không phải là viết code nhiều nhất, mà là đưa ra **những quyết định cốt lõi khó thay đổi sau này**:

1. **Phân rã Ranh giới Trách nhiệm (Loose Coupling, High Cohesion):**
   * Các module hoạt động độc lập, giao tiếp với nhau qua giao diện (Interfaces / Contracts) hoặc luồng sự kiện (Events), không phụ thuộc vào chi tiết cài đặt của nhau.
2. **Tách biệt Triệt để giữa 3D WebGL và 2D DOM (WebGL / DOM Decoupling):**
   * **Nguyên tắc vàng:** *Không bao giờ để 2D DOM can thiệp trực tiếp vào 3D Object3D Scene Graph, và ngược lại.*
   * Mọi giao tiếp giữa giao diện người dùng 2D (Buttons, Modals, Forms) và thế giới 3D (Meshes, Lights, Camera) bắt buộc phải đi qua **Reactive State Store (Zustand)** hoặc **Event Bus**.
3. **Mô hình Server Thẩm quyền (Authoritative Server Pattern):**
   * Trong tính năng multiplayer (giữ chỗ ngồi, gửi tiền mừng, cụng ly): Client chỉ hiển thị dự đoán (Optimistic UI). Server luôn là nơi giữ chân lý tối hậu (Single Source of Truth) để giải quyết tranh chấp (Race conditions) khi 2 khách cùng bấm vào một ghế.

---

## 📐 2. MÔ HÌNH KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

Hệ thống được tổ chức thành 4 phân tầng độc lập:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TẦNG TRÌNH DIỄN (PRESENTATION)                  │
│   ┌─────────────────────────────┐   ┌──────────────────────────────┐   │
│   │   2D UI Overlays (React)    │   │   3D Canvas Scene Graph      │   │
│   │   - Tailwind CSS HUD        │   │   - R3F / Three.js Meshes    │   │
│   │   - Modals (VietQR, Form)   │   │   - Procedural Geometries    │   │
│   │   - Audio Synthesizer       │   │   - Lights, Camera, FX       │   │
│   └──────────────┬──────────────┘   └──────────────▲───────────────┘   │
└──────────────────┼─────────────────────────────────┼───────────────────┘
                   │                                 │
                   ▼                                 │
┌────────────────────────────────────────────────────┴───────────────────┐
│               TẦNG TRẠNG THÁI TRUNG TÂM (REACTIVE STATE)               │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │   Zustand Store (Single Source of Truth)                       │   │
│   │   - sceneSlice: { currentScene: 1 | 2 | 3 }                    │   │
│   │   - guestSlice: { name, gender, outfit, accessory }            │   │
│   │   - tableSlice: { tables, activeTableId, mySeatIndex }         │   │
│   │   - soundSlice: { isMuted, masterVolume }                      │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   TẦNG MẠNG & DỊCH VỤ (SERVICES & NETWORK)             │
│   ┌─────────────────────────────┐   ┌──────────────────────────────┐   │
│   │   Socket.io Client          │   │   External API Adapters      │   │
│   │   - table:join, table:leave │   │   - VietQR Image API         │   │
│   │   - table:clink_broadcast   │   │   - html2canvas Card Exporter│   │
│   └──────────────┬──────────────┘   └──────────────────────────────┘   │
└──────────────────┼─────────────────────────────────────────────────────┘
                   │ (WebSocket ws://)
                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   BACKEND REALTIME SERVER (NODE.JS / SOCKET.IO)        │
│   - Room / Table Manager (Atomic Mutex In-Memory)                      │
│   - Realtime Clink Event Throttler (Leaky Bucket / Token Bucket)       │
│   - Healthcheck & Reconnection Resilience Gateway                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 3. CÁC MẪU THIẾT KẾ CỐT LÕI (DESIGN PATTERNS)

### 3.1 Mẫu Factory cho Thực thể 3D Thủ tục (Procedural Entity Factory)
Thay vì tạo các file mesh rời rạc lặp code, sử dụng Factory để sinh ra thực thể dựa trên cấu hình:
```javascript
// ✅ Architectural Pattern: Parameterized 3D Character Factory
export function ChibiCharacterFactory({ outfitId, gender, accessoryId }) {
  const outfitSpec = OUTFIT_CATALOG[outfitId];
  const hairSpec = HAIR_STYLES[gender];
  const accessorySpec = ACCESSORY_CATALOG[accessoryId];

  return (
    <group>
      <ChibiHead hair={hairSpec} />
      <ChibiBody outfit={outfitSpec} />
      {accessorySpec && <ChibiAccessory item={accessorySpec} />}
    </group>
  );
}
```

### 3.2 Cập nhật Tạm thời (Transient Updates) trong Three.js Render Loop
Trong các hoạt ảnh liên tục 60 FPS (hơi nước bốc lên từ đĩa gà, hiệu ứng lấp lánh khi cụng ly):
* **Không lưu toạ độ vào React State** (sẽ gây re-render toàn bộ cây component 60 lần/giây, nghẽn CPU).
* **Dùng React Ref + Three.js `useFrame` trực tiếp trên Object3D matrix**:
  ```javascript
  useFrame((state, delta) => {
    // Biến đổi trực tiếp trên GPU matrix, hoàn toàn không qua React reconciliation
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * delta;
  });
  ```

### 3.3 Mẫu Kiến trúc Trạng thái (Slice Pattern trong Zustand)
Khi ứng dụng mở rộng thêm 20+ tính năng, không dồn tất cả vào 1 file store 1000 dòng. Chia store thành các **Slices**:
```javascript
// store/useWeddingStore.js
import { create } from 'zustand';
import { createGuestSlice } from './slices/guestSlice.js';
import { createTableSlice } from './slices/tableSlice.js';
import { createAudioSlice } from './slices/audioSlice.js';

export const useWeddingStore = create((...a) => ({
  ...createGuestSlice(...a),
  ...createTableSlice(...a),
  ...createAudioSlice(...a),
}));
```

---

## ⚡ 4. NGÂN SÁCH HIỆU NĂNG KIẾN TRÚC (NON-FUNCTIONAL BUDGETS)

Kiến trúc sư có trách nhiệm đặt ra và giám sát các chỉ số giới hạn:

| Tiêu chí | Ngân sách trên Mobile | Ngân sách trên Desktop | Chiến lược Kiểm soát |
| :--- | :--- | :--- | :--- |
| **Tốc độ khung hình (FPS)** | $\ge 50 - 60\text{ FPS}$ | Cố định $60\text{ FPS}$ | Tắt shadow realtime, dùng hình học thủ tục low-poly |
| **Draw Calls** | $\le 60\text{ calls/frame}$ | $\le 120\text{ calls/frame}$ | Dùng chung vật liệu (`InstancedMesh`, `clone`), gộp geometry |
| **Dung lượng VRAM** | $\le 80\text{ MB}$ | $\le 200\text{ MB}$ | Hạn chế texture độ phân giải lớn, giải phóng bằng `dispose()` |
| **Thời gian Tải ban đầu (FCP)** | $\le 1.8\text{ giây}$ | $\le 1.2\text{ giây}$ | Code-splitting dynamic `import()`, không load thừa 3D assets |
| **Độ trễ Đồng bộ (Latency)** | $\le 100\text{ ms}$ | $\le 60\text{ ms}$ | Throttle clink events $200\text{ms}$, payload Socket $\le 512\text{ bytes}$ |

---

## 📋 5. QUY CHUẨN GHI NHẬN QUYẾT ĐỊNH KIẾN TRÚC (ADR TEMPLATE)

Mỗi khi thay đổi nền tảng công nghệ (ví dụ: đổi từ Canvas 2D sang WebGL, đổi cơ chế truyền video từ `VideoTexture` sang DOM mini-player): Phải ghi lại bằng một tài liệu ADR ngắn theo mẫu:

```markdown
# ADR-[SỐ]: [TIÊU ĐỀ QUYẾT ĐỊNH]
* **Ngày:** YYYY-MM-DD
* **Trạng thái:** [Proposed | Accepted | Deprecated | Superseded]

## 1. Bối cảnh (Context)
Vấn đề kỹ thuật đang gặp phải là gì? Tại sao giải pháp hiện tại không đáp ứng được?

## 2. Quyết định (Decision)
Chúng ta sẽ chọn giải pháp nào? Tại sao chọn giải pháp này thay vì các phương án thay thế?

## 3. Hệ quả & Đánh đổi (Consequences)
- Ưu điểm: Lợi ích mang lại về hiệu năng, bảo trì, trải nghiệm người dùng.
- Nhược điểm / Đánh đổi: Độ phức tạp tăng lên ở đâu? Cần kiểm thử thêm những gì?
```

---

## 🛡️ 6. CHECKLIST KIỂM ĐỊNH CỦA SOFTWARE ARCHITECT

Trước khi phê duyệt bất kỳ thiết kế hệ thống mới nào:
- [ ] Tính năng mới có phá vỡ tính phân tầng (Layering) không?
- [ ] Đã lường trước trường hợp mất kết nối mạng và phục hồi (Reconnection strategy) chưa?
- [ ] Có phát sinh re-render không cần thiết trong vòng lặp 60 FPS không?
- [ ] Dữ liệu truyền qua WebSocket có được kiểm tra hợp lệ (Payload Validation) không?
- [ ] Giao diện có hoạt động mượt mà cả trên màn hình di động 375px lẫn màn hình 4K không?
