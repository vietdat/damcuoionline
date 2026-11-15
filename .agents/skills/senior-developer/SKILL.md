---
name: senior-developer
description: >-
  Senior software engineer guidelines, clean code principles, defensive programming,
  architectural rigor, performance profiling, and engineering excellence standards.
  Activate when writing, reviewing, architecting, refactoring, or debugging code.
---

# 🧠 Senior Software Engineer - Core Engineering Skill

Skill này định hình tư duy, tiêu chuẩn chất lượng code và phương pháp làm việc của một **Senior Software Engineer (L5/L6)**. Khi kích hoạt skill này, mọi dòng code, cấu trúc thư mục, xử lý lỗi và quyết định kỹ thuật đều phải đạt chuẩn production-ready cao cấp nhất.

---

## 🎯 1. TƯ DUY KỸ THUẬT CỐT LÕI (SENIOR MINDSET)

1. **Pragmatic & Simple (Thực tế & Tối giản):** Không over-engineering (không phức tạp hóa vấn đề khi chưa cần thiết). Ưu tiên code dễ đọc, dễ hiểu hơn code "thông minh" mà người khác khó bảo trì.
2. **Defensive Programming (Lập trình phòng thủ):** Luôn lường trước các trường hợp biên (edge cases): mạng chập chờn, API trả về null/undefined, thiết bị cấu hình yếu, người dùng bấm nút liên tục (spam click/double click).
3. **Verify, Don't Guess (Kiểm chứng, Không đoán mò):** Luôn tự kiểm tra (dry-run, build, check log, test runtime) trước khi kết luận hoàn thành một tính năng.
4. **Boy Scout Rule:** Bất kỳ file nào bạn chạm vào để sửa chữa, hãy để lại nó sạch đẹp, ngăn nắp hơn lúc bạn mở ra.

---

## 💎 2. TIÊU CHUẨN CLEAN CODE & KIẾN TRÚC MÃ NGUỒN

### 2.1 Cấu trúc & Tách bạch trách nhiệm (Separation of Concerns)
* **Single Responsibility Principle (SRP):** Mỗi function/component chỉ làm đúng MỘT nhiệm vụ duy nhất.
  * *Tách biệt rõ ràng:* UI Presentation (Component) ⟷ Business Logic (Custom Hooks) ⟷ State Management (Stores) ⟷ Side Effects/APIs (Services/Gateways).
* **Không Hardcode:** Mọi hằng số, thông số cấu hình (màu sắc, kích thước, URL, key sự kiện) phải đưa vào file hằng số `constants/` hoặc biến môi trường `.env`.

### 2.2 Đặt tên mang tính tự giải thích (Self-documenting Code)
* Biến boolean: Bắt đầu bằng `is`, `has`, `should`, `can` (ví dụ: `isCheersActive`, `hasJoinedTable`).
* Hàm thực thi hành động: Bắt đầu bằng động từ rõ nghĩa (ví dụ: `calculateNextSeatIndex`, `broadcastClinkEvent` thay vì `handleData`).
* Tránh viết tắt vô nghĩa: Viết `characterPosition` thay vì `cp`, `guestIndex` thay vì `gi`.

---

## 🛡️ 3. XỬ LÝ LỖI & PHÒNG NGỪA SỰ CỐ (ERROR HANDLING)

* **Graceful Degradation (Suy giảm tính năng mượt mà):**
  * Nếu máy người dùng không hỗ trợ WebGL hoặc GPU quá yếu: Không được để màn hình trắng (White Screen of Death), phải hiển thị fallback UI thông báo thân thiện.
* **Safe State Access:**
  * Luôn sử dụng Optional Chaining (`?.`) và Nullish Coalescing (`??`):
    ```javascript
    // ✅ Chuẩn Senior:
    const guestName = currentTable?.seats?.[seatIndex]?.guest?.name ?? 'Khách ẩn danh';
    ```
* **Debounce & Throttle:**
  * Mọi nút bấm tương tác mạng hoặc trigger animation nặng (như nút "CỤNG LY", "GẮP CỖ") bắt buộc phải có Throttle/Debounce để chống spam click gây crash hoặc nghẽn socket.

---

## ⚡ 4. TỐI ƯU HIỆU NĂNG & QUẢN TRỊ BỘ NHỚ (PERFORMANCE & MEMORY)

* **React Optimization:**
  * Không tạo function hoặc object mới vô tội vạ bên trong render loop. Dùng `useCallback`, `useMemo` khi truyền props xuống component con hoặc canvas 3D.
* **Zero Memory Leaks (Không rò rỉ bộ nhớ):**
  * Mọi `addEventListener`, `setInterval`, `setTimeout`, hoặc `socket.on` đều PHẢI có hàm hủy (cleanup/teardown) tương ứng trong return của `useEffect`:
    ```javascript
    useEffect(() => {
      const handleResize = () => { /* ... */ };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    ```
* **Performance Budget:**
  * Giám sát số lượng Draw Calls (mục tiêu: < 50 draw calls cho mobile web).
  * Luôn dùng Texture nén (WebP) và mô hình nén (Draco GLB).

---

## 🧪 5. QUY TRÌNH NGHIỆM THU TRƯỚC KHI BÀN GIAO (SENIOR DEFINITION OF DONE)

Một task chỉ được coi là hoàn thành khi đáp ứng đủ 4 tiêu chí:
1. [ ] **Build sạch:** Chạy lệnh build (`npm run build`) không có bất kỳ lỗi cú pháp, cảnh báo nghiêm trọng hay import thừa.
2. [ ] **Không lỗi Console:** Trình duyệt không có lỗi đỏ (`Uncaught Error`, `WebGL context lost`, `Warning: Each child in a list should have a unique key`).
3. [ ] **Mobile Responsive:** Giao diện co giãn chuẩn trên cả màn hình nhỏ (375px - iPhone SE) lẫn màn hình lớn.
4. [ ] **Tài liệu hóa:** Cập nhật trạng thái tiến độ vào checklist dự án để cả team nắm bắt.
