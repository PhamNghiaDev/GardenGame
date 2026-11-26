---
name: add-plant
description: Thêm một loài cây vào Balcony Garden khi có tên, thông số, bộ asset và yêu cầu mở khóa.
---

1. Đọc `CLAUDE.md`, phần cây trồng trong `docs/GDD.md` và mốc M6 trong `docs/ROADMAP.md`. Xác nhận thông số và asset còn thiếu trước khi đưa loài vào game.
2. Thêm định danh ổn định và thông số gieo, bán, lớn, mở khóa vào `src/game/config/plants.ts`.
3. Dùng bộ asset được cung cấp cho từng giai đoạn (PNG hoặc SVG), đặt trong `src/art/assets/<plant-id>/` theo cách của Rosie. Chỉ vẽ SVG inline (có `viewBox`, dùng token pastel) khi loài chưa có asset, và hỏi trước khi vẽ. Kiểm tra vị trí neo gốc cây tại miệng chậu.
4. Nối logic khóa/mở và mua hạt trong `src/game`. Loài khóa vẫn xuất hiện trong Shop. Duy trì quyền đã mở khi tải lại. Áp dụng quy tắc migration nếu đổi schema.
5. Thêm test cho ngưỡng lớn, điều kiện mua/mở khóa, số vàng và quyền mở sau tải lại. Chạy `pnpm check`.
6. Kiểm tra trên Shop khi còn khóa và sau khi mở. Mua hạt, gieo, kiểm tra ảnh các giai đoạn và Compact.
