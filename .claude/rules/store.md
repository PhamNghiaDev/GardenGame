---
paths:
  - 'src/store/**/*'
---

# Store và save

- Store quản lý trạng thái và gọi logic thuần trong `src/game`. Chế độ Full/Compact và trạng thái popup thuộc phiên.
- Khi đổi cấu trúc save, tăng `SAVE_VERSION`, viết `migrateSave` cho phiên bản bị ảnh hưởng và thêm test với dữ liệu cũ thực tế.
- Không bao giờ xóa save người chơi. Giữ bản gốc khi nhập save, khi đọc lỗi và khi gặp schema chưa hỗ trợ.
- Test các trường được thêm hoặc đổi cùng dữ liệu cần bảo toàn như số vàng, tồn kho, checkpoint, quyền mở khóa và tùy chọn âm thanh.
