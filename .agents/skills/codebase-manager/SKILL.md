---
name: codebase-manager
description: >-
  Standards, workflows, and best practices for large-scale codebase management, modular directory taxonomy,
  code scalability, refactoring protocols, technical debt management, dependency hygiene, and file organization.
  Activate when structuring projects, refactoring, organizing large codebases, managing dependencies, or scaling features.
---

# 📦 Codebase Manager - Scalable Codebase Standards & Governance

Skill này thiết lập toàn bộ quy chuẩn, phương pháp tổ chức và quản trị mã nguồn cho các dự án quy mô vừa và lớn (đặc biệt là các ứng dụng web kết hợp 3D/WebGL tương tác thời gian thực). Mục tiêu cốt lõi: **Đảm bảo codebase luôn sạch sẽ, có cấu trúc chặt chẽ, dễ mở rộng khi thêm hàng chục tính năng mới mà không bị thoái hóa kỹ thuật (technical degradation).**

---

## 🧭 1. TRIẾT LÝ QUẢN TRỊ CODEBASE (CORE PRINCIPLES)

1. **Nguyên tắc Đồng vị trí (Co-location Principle):**
   * Những thứ thay đổi cùng nhau phải được đặt gần nhau. Ví dụ: Shader, CSS cục bộ, hằng số cấu hình riêng của một entity 3D nên nằm cạnh file component của entity đó thay vì vứt vào một thư mục chung chung.
2. **Nguyên tắc Phụ thuộc Một chiều (Acyclic Dependencies Principle):**
   * Tuyệt đối không để xảy ra Circular Dependency (A import B, B import A). Luôn tổ chức theo các tầng (Layers) từ dưới lên:
     $$\text{Constants / Types} \longrightarrow \text{Utils / Pure Helpers} \longrightarrow \text{Stores / State} \longrightarrow \text{Hooks / Services} \longrightarrow \text{UI / 3D Components}$$
3. **Giới hạn Độ dài File (File Size Budget):**
   * Mỗi file component UI hoặc 3D **không nên vượt quá 250 - 300 dòng code**.
   * Nếu vượt quá ngưỡng này: Bắt buộc tách nhỏ thành sub-components, custom hooks hoặc file helper logic.
4. **Boy Scout Rule & Hygiene:**
   * Mỗi khi mở một file để sửa lỗi hoặc thêm tính năng: Hãy định dạng lại, loại bỏ biến không dùng (unused imports/vars), bổ sung JSDoc tóm tắt trước khi commit.

---

## 🗂️ 2. QUY CHUẨN CẤU TRÚC THƯ MỤC CHUẨN MỰC (DIRECTORY TAXONOMY)

Dự án quy mô lớn cần tuân theo cấu trúc phân tầng rõ ràng:

```
src/
├── 3d/                     # Toàn bộ thế giới Three.js / WebGL
│   ├── components/         # Mesh, Procedural Geometry, Shaders
│   │   ├── characters/     # Chibi character parts, outfits, accessories
│   │   ├── environment/    # Hall, stage, lighting, floor, curtains
│   │   ├── dishes/         # Banquet dishes, food meshes
│   │   └── effects/        # Steam particles, cheers sparks, golden halos
│   ├── scenes/             # 3 Cảnh chính: LobbyScene, HallScene, TableFocusScene
│   └── CanvasContainer.jsx # Canvas WebGL chính, DPR, CameraController
│
├── components/             # Giao diện người dùng 2D (HTML/Tailwind)
│   ├── common/             # Atomic components dùng chung (Button, Modal, Toast)
│   ├── overlays/           # 2D HUD overlays cho từng Scene (Lobby, Hall, Table)
│   └── modals/             # VietQRModal, GuestCardModal, SettingsModal
│
├── state/ hoặc store/      # Quản lý trạng thái tập trung (Zustand slices)
│   ├── useWeddingStore.js  # Store tổng hợp hoặc chia slice:
│   ├── slices/             # userSlice, tableSlice, audioSlice, networkSlice
│
├── hooks/                  # Custom React Hooks tách biệt logic khỏi UI
│   ├── useSocketSync.js    # Logic lắng nghe và emit Socket.io
│   ├── useOrbitLimiter.js  # Kiểm soát góc xoay camera
│   └── useThrottledAction.js # Chống spam click
│
├── services/ hoặc api/     # Tầng giao tiếp bên ngoài (Socket, REST, WebRTC)
│   ├── socketClient.js     # Socket.io singleton kết nối backend
│   └── qrService.js        # VietQR generator service
│
├── audio/                  # Âm thanh & Web Audio Synthesizer
│   ├── soundManager.js     # Sound effects, clink synthesizer, audio buses
│   └── audioManifest.js    # Danh mục âm thanh & volume levels
│
├── constants/              # Hằng số toàn cục (KHÔNG ĐƯỢC HARDCODE TRONG CODE)
│   ├── sceneConfigs.js     # Camera positions, FOVs, light values
│   ├── tableLayout.js      # Danh sách bàn tiệc, toạ độ X-Z, số ghế
│   └── outfitCatalog.js    # Danh mục trang phục, phụ kiện
│
└── utils/                  # Hàm thuần túy (Pure Functions, không chứa React State)
    ├── math3d.js           # Tính toán toạ độ hình tròn, góc xoay radian
    ├── formatters.js       # Format tiền tệ VND, định dạng chuỗi
    └── performance.js      # FPS monitor, device tier detection
```

---

## 🏷️ 3. QUY ƯỚC ĐẶT TÊN & XUẤT MODULE (NAMING & EXPORT RULES)

### 3.1 Quy ước File & Thư mục
* **React Component & 3D Mesh:** Luôn dùng `PascalCase.jsx` (ví dụ: `ChibiCharacter.jsx`, `WeddingTableMesh.jsx`, `VietQRModal.jsx`).
* **Hooks:** Luôn bắt đầu bằng `use` dạng `camelCase.js` (ví dụ: `useTableSync.js`).
* **Stores / Services / Utils:** Luôn dùng `camelCase.js` (ví dụ: `soundManager.js`, `socketService.js`, `mathUtils.js`).
* **Constants:** Dùng `camelCase.js` cho tên file; bên trong hằng số viết `UPPER_SNAKE_CASE` (ví dụ: `MAX_SEATS_PER_TABLE = 6`).

### 3.2 Quy tắc Export
* Ưu tiên **Named Export** kèm Default Export:
  ```javascript
  // ✅ Chuẩn mực: Cho phép import linh hoạt, tự động hoàn thành code (Auto-import IDE) chính xác
  export function WeddingTableMesh({ table, onSelectSeat }) { ... }
  export default WeddingTableMesh;
  ```
* **Hạn chế Barrel Exports (`index.js` bừa bãi):**
  * Chỉ dùng `index.js` ở các module cấp cao (ví dụ: `src/components/common/index.js`).
  * Tránh tạo `index.js` gom hàng trăm file 3D mesh lại với nhau vì sẽ làm hỏng tính năng **Tree-Shaking** của Vite/Rollup và làm tăng thời gian build.

---

## 🧹 4. QUY TRÌNH QUẢN LÝ NỢ KỸ THUẬT (TECHNICAL DEBT MANAGEMENT)

1. **Quy tắc Gắn Nhãn TODO có Trách nhiệm:**
   * Tuyệt đối không viết `// TODO: fix this later` chung chung.
   * Cú pháp chuẩn:
     ```javascript
     // TODO(phase-5): Chuyển logic clink simulation sang broadcast Socket.io event 'table:cheers'
     // FIXME(mobile-safari): Xử lý pinch-to-zoom gây conflict với OrbitControls trên iOS
     ```
2. **Chu kỳ Dọn Dẹp Mã Nguồn (Refactoring Cadence):**
   * Sau mỗi Phase hoàn thành: Dành 1 micro-task chuyên biệt để chạy lint, xóa biến thừa, gộp các component tương đồng (DRY), và kiểm tra rò rỉ bộ nhớ Three.js (`geometry.dispose()`, `material.dispose()`).
3. **Chiến lược Thay Thế (Strangler Fig Pattern):**
   * Khi muốn thay thế một component cũ phức tạp: Không đập đi làm lại nguyên khối. Hãy tạo component mới, cho chạy song song qua cờ tính năng (`feature flag` hoặc toggle state), kiểm thử ổn định rồi mới gỡ bỏ component cũ.

---

## 📦 5. QUẢN TRỊ DEPENDENCIES (DEPENDENCY HYGIENE)

* **Quy tắc Thêm Thư viện Mới:**
  1. Tự hỏi: *Trình duyệt hiện tại hoặc Three.js có hỗ trợ sẵn Native Web API không?* (Ví dụ: Web Audio API thay vì cài thêm thư viện sound 500KB; native `Math` thay vì cài lodash).
  2. Kiểm tra bundle size qua `bundlephobia.com` trước khi `npm install`.
  3. Tuyệt đối không cài thư viện không hỗ trợ Tree-Shaking.
* **Kiểm tra Định kỳ:**
  * Chạy `npm run build` để kiểm tra kích thước các chunk JS/CSS sau minification.
  * Tách biệt các thư viện nặng (Three.js, Lucide icons, Socket.io) bằng `manualChunks` trong `vite.config.js` nếu kích thước bundle vượt quá 500KB.

---

## ✅ 6. CHECKLIST TỰ REVIEW CỦA CODEBASE MANAGER

Mỗi khi hoàn thành một tính năng hoặc trước khi merge:
- [ ] File mới có nằm đúng thư mục theo phân tầng không?
- [ ] Component có vượt quá 300 dòng không? Có cần tách hook logic không?
- [ ] Các giá trị màu sắc, toạ độ, hằng số có bị hardcode không?
- [ ] Có tồn tại Circular Dependency nào không?
- [ ] Đã dọn dẹp các `console.log` debug tạm thời chưa?
- [ ] `npm run build` có thành công tuyệt đối và không báo cảnh báo nghiêm trọng không?
