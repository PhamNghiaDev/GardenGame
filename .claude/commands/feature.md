---
description: Triển khai một tính năng Balcony Garden theo thiết kế và milestone đã duyệt.
argument-hint: '[tính năng hoặc milestone]'
---

Tính năng được yêu cầu là $ARGUMENTS.

1. Đọc `CLAUDE.md`, mục liên quan trong `docs/GDD.md` và milestone tương ứng trong `docs/ROADMAP.md`.
2. Kiểm tra code hiện có, nêu phạm vi, thiết kế và cách kiểm tra. Hỏi khi cần chốt luật game còn mở.
3. Implement luật trong `src/game` kèm unit test, rồi nối action vào store. Nếu đổi schema save, tăng version, viết migration và kiểm tra dữ liệu cũ.
4. Làm UI bằng token pastel và SVG theo thiết kế. Kiểm tra Full và Compact, kể cả khi tính năng chỉ xuất hiện ở Full.
5. Chạy `pnpm check` và `pnpm build`. Báo kết quả thực tế, phần chưa kiểm chứng và quyết định đã thống nhất.
