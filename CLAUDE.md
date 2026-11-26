**KHÔNG CÂY CHẾT.** Cây đạt trưởng thành rồi chờ thu hoạch, kể cả khi bỏ quên hoặc tắt game. Giữ trải nghiệm thư giãn, không héo, sâu bệnh, phạt hay đếm ngược gây áp lực.

# Balcony Garden

- Full có HUD, Shop và Túi đồ. Compact chỉ render ban công và các chậu cây.
- Giữ asset gốc của dự án, dùng bảng màu pastel và chuyển động nhẹ. Hỏi trước khi thay asset gốc, đổi luật thiết kế chưa chốt hoặc thêm thư viện nặng.
- Đặt luật và thông số cân bằng trong `src/game`. Giữ tiến độ và dữ liệu cũ khi thay đổi save.

## Lệnh

| Việc                       | Lệnh                                                          |
| -------------------------- | ------------------------------------------------------------- |
| Cài dependencies và chạy   | `pnpm install`, `pnpm dev`                                    |
| Kiểm tra                   | `pnpm check` (lint → typecheck → test), `pnpm build`          |
| Chạy từng bước             | `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:watch` |
| Định dạng và xem bản build | `pnpm format`, `pnpm lint:fix`, `pnpm preview`                |

Dùng pnpm 10.15.0 và Node.js 22.13+ trong dòng 22 hoặc Node.js 24+. Trên PowerShell, dùng `pnpm.cmd` nếu máy chặn `pnpm.ps1`.

## Cấu trúc

```text
src/
  game/       luật TypeScript thuần, config và test
  store/      Zustand, lưu dữ liệu và migrate
  ui/         scene, HUD, Shop, Túi đồ
  art/        asset và SVG
  platform/   adapter cửa sổ nổi
  audio/      wrapper Howler
.claude/
  rules/      quy tắc áp theo đường dẫn
  skills/     quy trình add-plant, milestone, commit
  agents/     review thiết kế và code
  hooks/      hook Node trên Windows
docs/         thiết kế, tiến độ, roadmap và ADR
```

## Kiểm tra UI bằng Playwright MCP

1. Chạy `pnpm dev`. Mở phiên Claude Code trong dự án và duyệt server `playwright` khi được hỏi lần đầu.
2. Dùng `browser_navigate` mở `http://localhost:5173/` (Full) và `http://localhost:5173/?compact` (Compact). Nếu Vite báo địa chỉ khác, dùng địa chỉ `Local` của Vite.
3. Dùng `browser_snapshot` để kiểm tra nội dung và `browser_take_screenshot` để chụp mỗi chế độ. Compact phải chỉ còn scene. Ảnh tên tự động nằm trong `.playwright-mcp/`.

## Tài liệu

- [GDD](docs/GDD.md), [phong cách hình ảnh](docs/art-style.md) và [người chơi mục tiêu](docs/player.md)
- [Roadmap M1–M9](docs/ROADMAP.md) và [tiến độ hiện tại](docs/PROGRESS.md)
- [Quyết định kỹ thuật](docs/decisions/)
- `docs/prototype/ver2.2.html`: prototype gốc (1.6 MB), chỉ tra tọa độ hoặc asset khi cần. Không sửa, không đọc cả file.

Cập nhật tiến độ khi kết thúc milestone, khi bàn giao hoặc trước khi chủ động chạy `/compact`.
