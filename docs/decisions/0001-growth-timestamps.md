# ADR 0001 · Tính tiến độ cây bằng timestamp

- Trạng thái — Chấp nhận cho scaffold
- Ngày — 2026-11-26

## Bối cảnh

Cây cần tiến triển qua lần đóng game hoặc đưa tab xuống nền. Đến trưởng thành, cây chờ người chơi quay lại. Đồng hồ máy có thể bị chỉnh lùi.

## Các phương án

- Timer cộng dồn ghi thêm tiến độ theo mỗi tick. Tab nền có thể bị giảm tần suất, game đã tắt không có tick và save phải ghi thường xuyên.
- Timestamp cho phép tính lại tiến độ từ mốc gieo và checkpoint khi game mở lại hoặc khi UI cần đọc giai đoạn.

## Quyết định

Dùng `plantedAt` và checkpoint tùy chọn `{ at, elapsedMs }`. Hệ thống thuần nhận `now` từ caller. Khi chưa có checkpoint, lấy `plantedAt` và tiến độ 0 làm mốc.

Cộng phần thời gian kể từ mốc, chặn phần tăng thêm ở tối thiểu 0 rồi kẹp tổng tại ngưỡng trưởng thành. Khi `now` lùi trước checkpoint, giữ tiến độ đã ghi. Xác định giai đoạn từ ngưỡng trong config của loài. UI có thể yêu cầu tính lại khi đến mốc hiển thị hoặc quay lại tab.

## Hệ quả và kiểm tra

- Ghi checkpoint khi chuyển giai đoạn, tưới hoặc khi trang ẩn. Việc ghi mốc phải giữ thứ tự thời gian khi đồng hồ lùi.
- Save v2 thêm `wetUntil`. Phần thời gian còn ẩm sau checkpoint hưởng hệ số tưới, còn tưới lại ghi checkpoint trước khi kéo dài hiệu lực.
- Unit test `getPlantStage(pot, now)` kiểm tra chậu trống, sát ngưỡng, đúng ngưỡng, offline 30 ngày và đồng hồ lùi trước hoặc sau khi có checkpoint.
