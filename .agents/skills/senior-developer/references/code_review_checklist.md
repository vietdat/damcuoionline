# 🔍 Senior Code Review & Quality Checklist

Mỗi khi chuẩn bị commit hoặc hoàn thành một module, hãy tự review lại đoạn code theo bảng kiểm tra sau:

## 1. Kiến trúc & Thiết kế
- [ ] Component có quá 200 dòng không? Nếu có, đã tách nhỏ logic ra custom hooks hoặc sub-components chưa?
- [ ] Logic tính toán phức tạp có được tách thành pure utility functions độc lập để dễ test không?
- [ ] Có phụ thuộc vòng (circular dependencies) giữa các file không?

## 2. Quản lý State
- [ ] Có lưu state thừa (redundant state - state có thể suy ra từ props hoặc state khác) không?
- [ ] State global có bị lạm dụng không? (Chỉ đưa vào Store những gì thực sự cần chia sẻ giữa nhiều màn hình).

## 3. An toàn & Bảo mật
- [ ] Có hardcode API key, mật khẩu, hay URL nhạy cảm nào trong source code không?
- [ ] Input của người dùng (tên khách, lời chúc) đã được sanitize để chống XSS chưa?

## 4. Trải nghiệm người dùng (UX)
- [ ] Mạng chậm hoặc tải 3D lâu có hiển thị skeleton / loading spinner thân thiện không?
- [ ] Âm thanh có tùy chọn tắt/bật (Mute) cho người dùng không?
