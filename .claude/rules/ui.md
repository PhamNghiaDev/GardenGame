---
paths:
  - 'src/ui/**/*'
---

# Giao diện

- Đọc dữ liệu từ store và gọi action. Dùng hàm thuần sẵn có để suy ra nội dung hiển thị, giữ luật tăng trưởng, kinh tế và khóa cây trong `src/game`.
- Dùng scene chung cho Full và Compact. Trong Compact, bỏ render HUD, nút, icon thao tác, Coin, Túi đồ, Shop, Exit và lớp tương tác.
- Dùng token pastel, bo góc mềm và chuyển động nhẹ theo [phong cách hình ảnh](../../docs/art-style.md).
- Gọi adapter platform cho cửa sổ nổi. Kiểm tra cả Full và Compact sau thay đổi UI.
