---
name: milestone
description: Triển khai hoặc tiếp tục một milestone M1–M9 của Balcony Garden.
---

1. Đọc `CLAUDE.md`, `docs/ROADMAP.md`, `docs/PROGRESS.md` và mục liên quan trong GDD. Chọn đúng milestone người dùng giao.
2. Lên kế hoạch theo phạm vi, file liên quan và cách kiểm tra. Xác nhận quyết định thiết kế còn mở khi chúng ảnh hưởng tới milestone.
3. Viết luật trong `src/game` cùng test trước, rồi nối store. Áp dụng migration và test save nếu đổi schema.
4. Làm UI theo rule tương ứng. Đối chiếu asset gốc và token pastel.
5. Chạy `pnpm check` và `pnpm build`. Dùng Playwright MCP kiểm tra Full và Compact, chụp ảnh khi có thay đổi UI.
6. Cập nhật `docs/PROGRESS.md`. Ghi việc đã xong, việc dở, quyết định mới và kết quả đã kiểm chứng.
