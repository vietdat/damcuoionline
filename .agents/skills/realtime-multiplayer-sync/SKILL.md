---
name: realtime-multiplayer-sync
description: >-
  Real-time synchronization patterns, Socket.io architecture, atomic seat reservation,
  clink throttling, and network resilience for multiplayer web apps and virtual banquet tables.
---

# ⚡ Realtime Multiplayer Synchronization Skill

Skill này quy định kiến trúc đồng bộ trạng thái nhiều người chơi (Multiplayer State Sync) cho nền tảng tiệc cưới ảo, đảm bảo kết nối ổn định, chống nghẽn mạng và xử lý mượt mà trên hạ tầng mạng di động 4G/5G.

---

## 🔒 1. NGUYÊN TẮC KHÓA GHẾ NGUYÊN TỬ (ATOMIC SEAT RESERVATION)

### Vấn đề:
Khi 2 khách mời cùng lúc nhấp vào một chiếc ghế trống tại một bàn tiệc, nếu không kiểm soát sẽ xảy ra tình trạng "tranh ghế" (Race condition).

### Giải pháp kỹ thuật:
1. **Kiểm tra và Khóa trên Server (Mutex Pattern):**
   * Client gửi yêu cầu: `socket.emit('seat:claim', { tableId, seatIndex, guestInfo })`.
   * Server kiểm tra mảng bộ nhớ `tables[tableId].seats[seatIndex]`.
   * **Nếu còn trống:** Đánh dấu ghế ngay lập tức là `RESERVED`, gán `socketId` và phản hồi `seat:claim_success`.
   * **Nếu đã bị người khác chọn trước:** Phản hồi `seat:claim_failed { reason: 'SEAT_TAKEN' }` -> Client hiển thị thông báo nhẹ: *"Ghế này vừa có người ngồi, bạn chọn ghế bên cạnh nhé!"*.

---

## 🍻 2. GOM SỰ KIỆN CỤNG LY (CLINK AGGREGATION & THROTTLING)

### Vấn đề:
Khi 6 người tại cùng một bàn phấn khích bấm nút "CỤNG LY 🍻" liên tục 10 lần/giây, nếu broadcast từng sự kiện đơn lẻ sẽ gây bão gói tin (packet storm) làm lag giật máy người dùng.

### Giải pháp kỹ thuật:
* **Client-side Throttle (Chặn spam ở máy khách):**
  * Nút "Cụng ly" bị khóa trong 600ms sau mỗi lần bấm (Cooldown 0.6s).
* **Server-side Window Aggregation:**
  * Server gom các lượt bấm cụng ly tại một bàn trong khung cửa sổ **250ms**.
  * Sau 250ms, phát duy nhất 1 sự kiện `table:cheers_wave` kèm tổng số ly được cụng:
    ```javascript
    // Payload broadcast gọn nhẹ:
    {
      tableId: 1,
      totalClinks: 88,
      cheerTriggeredBy: "Tuấn Híp"
    }
    ```

---

## 🔄 3. TỰ ĐỘNG PHỤC HỒI KẾT NỐI (SESSION RECOVERY & RECONNECT)

Mạng di động (4G/Wifi chuyển vùng) thường xuyên bị ngắt quãng ngắn:
1. **Lưu Token phiên (Session Storage):**
   * Khi khách vào ghế, lưu `{ weddingId, tableId, seatIndex, guestToken }` vào `sessionStorage`.
2. **Cơ chế Reconnect Handshake:**
   * Khi socket ngắt kết nối (`disconnect`), server giữ chỗ cho ghế đó trong vòng **30 giây** trước khi xóa.
   * Khi mạng có lại (`connect`), client tự động gửi sự kiện `session:reconnect` để nhận lại đúng chỗ ngồi mà không cần chọn lại từ đầu.

---

## 📡 4. DANH MỤC SOCKET EVENTS CHUẨN

| Tên Event | Chiều gửi | Dữ liệu truyền (Payload) | Mục đích |
| :--- | :---: | :--- | :--- |
| `guest:join_table` | Client ➔ Server | `{ tableId, seatIndex, guestName, outfitId }` | Yêu cầu ngồi vào ghế |
| `table:state_sync` | Server ➔ Client | `{ tableId, seats: [...], currentDishes: [...] }` | Cập nhật toàn bộ bàn |
| `guest:cheers` | Client ➔ Server | `{ tableId }` | Báo sự kiện bấm cụng ly |
| `table:cheers_wave` | Server ➔ Broadcast | `{ tableId, cheersCount }` | Kích hoạt nâng ly đồng thời |
| `table:serve_dish` | Client ➔ Server | `{ tableId, dishId }` | Yêu cầu dọn thêm món |
| `guest:leave_table` | Client ➔ Server | `{ tableId, seatIndex }` | Đứng dậy rời bàn |
