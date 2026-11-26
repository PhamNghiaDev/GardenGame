---
paths:
  - 'src/art/**/*'
---

# Asset

- SVG mới dùng inline và khai báo `viewBox`. Dùng CSS hoặc viewport để co giãn, giữ kích thước hiển thị linh hoạt.
- Dùng token màu trong `src/styles.css` cho SVG mới. Giữ nguyên ảnh gốc của nền, ban công, chậu và Rosie qua lớp `<image>` trong scene SVG. Hỏi trước khi thay asset gốc.
- Chuẩn bị đủ ảnh cho từng giai đoạn lớn được khai báo của mỗi loài. Dùng tọa độ neo gốc cây nhất quán để các giai đoạn đặt đúng miệng chậu.
- Đối chiếu [phong cách hình ảnh](../../docs/art-style.md) ở Full và Compact.
