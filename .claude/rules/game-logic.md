---
paths:
  - 'src/game/**/*'
---

# Logic game

- Viết TypeScript thuần. Truyền thời điểm `now` vào từ bên gọi. Tránh phụ thuộc React, DOM, Zustand và đồng hồ hệ thống.
- Đặt mọi thông số cân bằng trong `src/game/config`. Hệ thống đọc config, UI hiển thị dữ liệu do hệ thống cung cấp.
- Tính tiến độ bằng timestamp, từ `plantedAt` hoặc checkpoint và thời gian được tưới. Kẹp ở trưởng thành tối đa và giữ tiến độ đã lưu khi đồng hồ lùi. Cây bỏ quên tiếp tục lớn và chờ thu hoạch.
- Đặt unit test cạnh logic mới hoặc được sửa. Bao quát hành vi chính, biên chuyển giai đoạn, offline 30 ngày và đồng hồ lùi khi thay đổi tăng trưởng. Kiểm tra số dư và tồn kho khi đổi giao dịch.
- Tham khảo [GDD](../../docs/GDD.md) và [ADR timestamp](../../docs/decisions/0001-growth-timestamps.md).
