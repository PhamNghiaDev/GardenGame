# Tiến độ · Balcony Garden

## Đang làm

- Sẵn sàng lên kế hoạch M6 theo [roadmap](ROADMAP.md). Cần chốt tên, thông số và asset của bốn loài đang khóa trước khi đưa chúng vào vòng chơi.

## Xong

- M1–M5 cho Cúc Rosie. Scene dùng asset gốc, có mua hạt, gieo, tưới, thu hoạch, Túi đồ và bán hoa.
- Save v2 và nhập save prototype cùng địa chỉ web. Full và Compact dùng chung scene, đổi bằng phím `C` hoặc mở `/?compact`.
- Sắp lại hướng dẫn Claude Code, hook Node, rule theo đường dẫn, skills, hai reviewer chỉ đọc và cấu hình Playwright MCP.

- Đã chạy trực tiếp ba hook bằng Node, kiểm tra Full/Compact và chụp ảnh qua Playwright MCP. `pnpm check` đã qua 15 test.

## Việc dở

- M6 · Mở khóa vĩnh viễn bốn loài và hiển thị đủ các giai đoạn của mỗi loài.
- M7 · Mở cửa sổ nổi Document PiP.
- M8 · Nhạc và hiệu ứng âm thanh.
- M9 · Mua và đặt vật trang trí.

## Quyết định mới

- Dùng `CLAUDE.md` cho luật cốt lõi và `.claude/rules/` cho quy tắc theo thư mục. Giữ thông tin bàn giao trong file này.
- Hook `PreCompact` nhắc lưu tiến độ trong chỉ dẫn nén. Cập nhật file trước khi chủ động dùng `/compact` và khi kết thúc milestone.
- Playwright MCP chạy Edge headless với phiên trình duyệt riêng. Ảnh kiểm tra tự động đi vào `.playwright-mcp/`.
