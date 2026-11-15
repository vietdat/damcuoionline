# 🏛️ TÀI LIỆU THIẾT KẾ KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)
## DỰ ÁN: ĐI ĐÁM CƯỚI ONLINE 3D

* **Phiên bản:** 1.0  
* **Tham chiếu kỹ thuật:** Kế thừa kiến trúc từ các dự án mã nguồn mở *"Đi chùa online 3D"* (WebGL / Three.js + WebSocket Realtime).  
* **Mục tiêu kỹ thuật:** Chạy mượt mà 60 FPS trên trình duyệt di động (iOS Safari & Android Chrome), dung lượng tải ban đầu < 6MB, độ trễ tương tác thời gian thực < 50ms.

---

## 1. SƠ ĐỒ KIẾN TRÚC TỔNG THỂ (HIGH-LEVEL ARCHITECTURE)

```
                     [ KHÁCH TRÊN TRÌNH DUYỆT (MOBILE/WEB) ]
                                        │
           ┌────────────────────────────┴───────────────────────────┐
           ▼                                                        ▼
┌──────────────────────────────────────┐       ┌──────────────────────────────────────┐
│        2D UI OVERLAY LAYER           │       │          3D GRAPHICS CANVAS          │
│  (React.js / Vite + Tailwind CSS)    │       │     (Three.js / React Three Fiber)   │
│  - Form nhập tên, chọn avatar        │       │  - Scene Manager (3 Cảnh chuyển tiếp)│
│  - Bảng chọn set đồ & phụ kiện       │       │  - GLTF/GLB Loader + Draco Decoder   │
│  - Nút bấm to: "CỤNG LY", "LÊN MÓN"  │       │  - GSAP Camera Director (Lướt ghế)   │
│  - Modal hiển thị mã VietQR          │       │  - Particle Engine (Khói đồ ăn, Bọt) │
└──────────────────┬───────────────────┘       └──────────────────┬───────────────────┘
                   │                                              │
                   └──────────────────────┬───────────────────────┘
                                          │
                                          ▼
                       ┌──────────────────────────────────────┐
                       │      AUDIO & SOUND ENGINE LAYER      │
                       │             (Howler.js)              │
                       │  - Quản lý Web Audio Context di động │
                       │  - Tiếng Keng! ly, 1-2-3 Dô, Nhai cỗ │
                       └──────────────────┬───────────────────┘
                                          │
                     ┌────────────────────┴────────────────────┐
                     │ (WebSocket - Hai chiều thời gian thực)  │
                     ▼                                         ▼
┌──────────────────────────────────────────┐ ┌────────────────────────────────────────┐
│     REALTIME GATEWAY (SOCKET.IO)         │ │            STATIC ASSET CDN            │
│  - Quản lý Room cưới (/wedding/:id)      │ │  - Mô hình 3D (.glb nén Draco)         │
│  - Đồng bộ trạng thái Bàn tiệc (Table)   │ │  - Texture đã Bake ánh sáng (.webp)    │
│  - Broadcast sự kiện Cụng ly & Lên món   │ │  - Âm thanh SFX (.mp3 nén cao)         │
└──────────────────────────────────────────┘ └────────────────────────────────────────┘
```

---

## 2. CHI TIẾT CÁC TẦNG HỆ THỐNG (SYSTEM LAYERS)

### 2.1 Tầng Đồ họa 3D (3D WebGL Layer)
* **Thư viện cốt lõi:** `Three.js` kết hợp `@react-three/fiber` (R3F) và `@react-three/drei`.
* **Quản lý phân cảnh (Scene Director):**
  * **Scene 1 (Phòng thay đồ):** Render 1 bục xoay nhẹ nhàng + 1 Avatar Chibi trung tâm. Thay đổi trang phục trực tiếp bằng cách hoán đổi vật liệu (Material/Texture swapping) hoặc bật/tắt các Node Mesh trên bộ khung xương chung (Single Skeleton).
  * **Scene 2 (Sảnh tiệc cưới):** Sử dụng kỹ thuật **`InstancedMesh`** cho các bàn tròn và ghế ngồi. Cho phép render 10 - 20 bàn tiệc cùng hàng trăm chiếc ghế chỉ bằng **1 Draw Call duy nhất**, tiết kiệm tối đa GPU di động.
  * **Scene 3 (Cận cảnh Bàn tiệc):** Sử dụng **`GSAP (GreenSock)`** để điều khiển Camera lướt mượt mà (Lerp transition) từ tọa độ không gian sảnh tiệc rơi thẳng xuống ghế ngồi được chọn.

### 2.2 Tầng Hiệu ứng hạt & Âm thanh (Particles & Web Audio)
Kế thừa trực tiếp từ cách "Chùa online" tạo khói nhang và ánh hào quang:

* **Particle Systems (Hiệu ứng hạt):**
  * **Khói món ăn:** Dùng `THREE.Points` với hạt texture khói mờ bốc lên xoay tròn từ các đĩa đồ ăn nóng.
  * **Cụng ly:** Khi 2 ly va chạm, hệ thống kích hoạt bắn ra 30 - 50 hạt tia sáng (Sparkles) màu vàng kim và bọt bia sủi bay tung tóe.
* **Audio Engine (`Howler.js`):**
  * Khắc phục cơ chế chặn âm thanh tự động (Autoplay Policy) của Safari iOS: Kích hoạt Audio Context ngay tại thao tác bấm nút *"Vào tiệc"* ở Màn 1.
  * Danh mục âm thanh SFX được nén nhỏ dưới dạng `.mp3`/`.ogg` (<50KB/file):
    * `sfx_glass_clink.mp3`: Tiếng va ly trong trẻo.
    * `sfx_cheer.mp3`: Tiếng hô vang "Dô!".
    * `sfx_eat.mp3`: Tiếng gắp cỗ nhồm nhoàm.
    * `bgm_wedding.mp3`: Nhạc nền đám cưới vui nhộn lặp vòng (loop).

### 2.3 Tầng Đồng bộ Thời gian thực (Realtime Synchronization)
Đảm bảo khi nhiều bạn bè ngồi cùng một bàn tiệc ảo, mọi hành động diễn ra đồng thời:

* **Công nghệ:** **Node.js (hoặc Bun) + Socket.io** (hoặc tích hợp qua Supabase Realtime).
* **Cấu trúc phân vùng phòng (Room Partitioning):**
  * `wedding_room = wedding_<id>` (Kênh toàn bộ đám cưới).
  * `table_room = wedding_<id>_table_<index>` (Kênh riêng biệt của từng bàn tiệc).
* **Các sự kiện Socket chính (Socket Events):**
  1. `guest:join`: Khách chọn ghế -> Gửi thông tin `{ guestId, name, avatarConfig, seatIndex }` -> Render avatar vào đúng ghế cho cả bàn thấy.
  2. `guest:cheers`: Khách bấm cụng ly -> Server broadcast ngay lập tức -> Tất cả thiết bị ở bàn cùng kích hoạt hoạt ảnh nâng ly và phát tiếng keng.
  3. `table:serve_dish`: Lên món mới -> Đồng bộ đĩa đồ ăn 3D rơi xuống bàn của mọi người.

---

## 3. QUY TRÌNH TỐI ƯU HÓA ASSET 3D (3D PIPELINE)
Để ứng dụng đạt tốc độ tải trang dưới 3 giây trên kết nối 4G:

```
[Mô hình gốc (Blender)] 
        │
        ▼ 
[Giảm đa giác (Low-poly < 5.000 polys/model)]
        │
        ▼ 
[Bake ánh sáng & đổ bóng sẵn vào Texture (Baked Lighting)]
        │
        ▼ 
[Xuất định dạng .GLB] 
        │
        ▼ 
[Nén bằng Google Draco Compression (gltf-pipeline)] 
        │
        ▼ 
[File thành phẩm siêu nhẹ: Toàn bộ Scene < 5MB - 6MB]
```

* **Quy tắc vàng:** Không sử dụng Realtime Dynamic Shadow (bóng đổ động thời gian thực) vì sẽ làm nóng máy và tụt khung hình trên điện thoại. Toàn bộ ánh sáng đã được "nướng" (bake) vào map màu.

---

## 4. THIẾT KẾ MÔ HÌNH DỮ LIỆU (DATA SCHEMA)

### 4.1 Schema Bàn tiệc (Table State)
```json
{
  "weddingId": "cuoi-nam-2026",
  "tableId": 1,
  "tableName": "Mâm Bạn Thân Quẩy Tới Sáng",
  "capacity": 6,
  "cheersCount": 68,
  "currentDishes": [
    { "dishId": "ga_luoc", "servedAt": 1700000000 },
    { "dishId": "tom_hap", "servedAt": 1700000500 }
  ],
  "seats": [
    {
      "seatIndex": 0,
      "guest": {
        "guestId": "usr_9981",
        "name": "Hoàng Nam",
        "avatar": {
          "gender": "male",
          "outfit": "vest_den",
          "accessory": "kinh_ram"
        }
      }
    },
    {
      "seatIndex": 1,
      "guest": null
    }
  ]
}
```

### 4.2 Cấu hình VietQR Mừng Cưới (Payment Config)
```json
{
  "bankCode": "MB",
  "accountNumber": "99999999999",
  "accountName": "NGUYEN VAN A",
  "defaultAmounts": [68000, 168000, 500000, 999999],
  "transferSyntaxTemplate": "Mung cuoi {GUEST_NAME}"
}
```

---

## 5. BẢNG TỔNG HỢP CÔNG NGHỆ KHUYẾN NGHỊ (TECH STACK)

| Phân hệ | Công nghệ được chọn | Mục đích sử dụng |
| :--- | :--- | :--- |
| **Frontend Framework** | **React.js + Vite** | Khởi chạy cực nhanh, quản lý state và UI overlay mượt mà. |
| **3D Rendering** | **Three.js + React Three Fiber** | Engine 3D chuẩn web, hỗ trợ declarative component. |
| **Camera Animation** | **GSAP (GreenSock)** | Di chuyển camera mượt nhất để tạo trải nghiệm "lướt ghế". |
| **3D Compression** | **Draco Decoder** | Nén mô hình GLB nhỏ lại đến 70-80%. |
| **Âm thanh** | **Howler.js** | Giải quyết triệt để lỗi chặn Web Audio trên Safari iOS. |
| **Realtime Engine** | **Socket.io (Node.js/Bun)** | Giao tiếp hai chiều với độ trễ thấp (<50ms). |
| **Styling UI** | **Tailwind CSS** | Xây dựng giao diện nút bấm và modal chọn đồ nhanh chóng. |

---

## 6. LỘ TRÌNH TRIỂN KHAI KỸ THUẬT (ENGINEERING ROADMAP)

* **Giai đoạn 1: Prototype 3D Canvas (3 - 5 ngày)**
  * Dựng Scene Three.js: Bục thay đồ và Bàn tiệc tròn.
  * Tải thử nghiệm mô hình Chibi và đĩa thức ăn nén Draco.
  * Kiểm thử cụng ly 3D và tiếng keng trên điện thoại thực tế.
* **Giai đoạn 2: Ghép nối UI & Camera Fly-through (3 ngày)**
  * Xây dựng UI Overlay chọn đồ, nhập tên bằng React + Tailwind.
  * Tích hợp GSAP điều khiển luồng Camera từ Sảnh vào Bàn tiệc.
* **Giai đoạn 3: Realtime & VietQR (3 ngày)**
  * Dựng server Socket.io quản lý bàn tiệc và đồng bộ cụng ly.
  * Tích hợp sinh mã VietQR động theo tài khoản CD-CR.
* **Giai đoạn 4: Tối ưu & Đóng gói (2 ngày)**
  * Kiểm thử hiệu năng trên các dòng máy iPhone và Android tầm trung.
  * Tinh chỉnh âm thanh và hiệu ứng hạt bọt bia.

---

## 7. QUẢN TRỊ KIẾN TRÚC & QUY CHUẨN MÃ NGUỒN (GOVERNANCE SKILLS)

Để hỗ trợ codebase mở rộng quy mô lớn lâu dài, dự án tích hợp 2 bộ kỹ năng chuẩn hóa chuyên sâu trong `.agents/skills/`:

1. **`software-architect`** ([`.agents/skills/software-architect/SKILL.md`](../.agents/skills/software-architect/SKILL.md)):
   * Định hình kiến trúc phân tầng (4 Layers), ranh giới trách nhiệm giữa WebGL và React DOM.
   * Quản lý ngân sách hiệu năng (Draw Calls $\le 60$, VRAM $\le 80\text{MB}$, Latency $\le 100\text{ms}$).
   * Mẫu ghi nhận quyết định kiến trúc (ADR Template) và chiến lược Server Thẩm quyền (Authoritative Server).

2. **`codebase-manager`** ([`.agents/skills/codebase-manager/SKILL.md`](../.agents/skills/codebase-manager/SKILL.md)):
   * Quy chuẩn cấu trúc thư mục (Directory Taxonomy), phân tách các thư mục `3d/`, `components/`, `store/`, `hooks/`, `services/`, `constants/`.
   * Kiểm soát giới hạn độ dài file (< 300 dòng/component), quy tắc đặt tên và quản lý barrel exports.
   * Quy trình dọn dẹp nợ kỹ thuật (Boy Scout Rule, Strangler Fig Pattern) và kiểm soát dependencies.

