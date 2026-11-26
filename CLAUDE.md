# Balcony Garden

**KHÔNG CÓ CƠ CHẾ CÂY CHẾT.** Tắt game bao lâu, quên tưới hoặc quên thu hoạch thì cây vẫn chỉ đạt trưởng thành tối đa và chờ ở đó. Không có héo, sâu bệnh, phạt hay đếm ngược gây áp lực.

## Thiết kế

- Game làm vườn thư giãn, zero-stress. Ban công ấm áp, đồ họa 2D flat, nét mềm và màu pastel.
- Có 5 loài cây. Cúc Rosie mở từ đầu. Bốn loài còn lại luôn hiện trong Shop và mở khóa vĩnh viễn bằng vàng.
- Vòng lặp là mua hạt → gieo vào 3 chậu → tưới → trưởng thành → thu hoạch vào Túi đồ → bán trong Shop lấy vàng → mở cây mới và trang trí ban công.
- Full dùng nền ban công với chậu trên sàn và thềm. Coin và Túi đồ ở góc trên trái, Exit ở góc trên phải, Shop ở góc dưới trái và bình tưới ở góc dưới phải. Shop có hai tab mua hạt và bán cây.
- Compact chỉ render khung ban công tối giản và chậu cây. Ẩn hoàn toàn HUD, nút, icon, Shop, Túi đồ, Coin và Exit. Scene SVG dùng chung giữa hai chế độ.
- Dùng hình gốc tách từ `ver2.2.html` cho nền, ban công, chậu, Rosie và icon có sẵn. Hỏi trước khi thay asset gốc.
- Các quyết định đang mở nằm trong [GDD](docs/GDD.md). Hỏi trước khi biến placeholder hay hành vi của prototype thành luật game.

## Stack và lệnh

Vite, TypeScript strict, React 19, Zustand persist với localStorage, Tailwind CSS 4, SVG inline, Document PiP, Howler, Vitest, ESLint và Prettier. Dùng pnpm 10.15.0 và Node.js 22.13+ trong dòng 22 hoặc Node.js 24+.

- `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm preview`
- `pnpm lint`, `pnpm lint:fix`, `pnpm format`, `pnpm typecheck`
- `pnpm test`, `pnpm test:watch`, `pnpm check` (lint → typecheck → test)
- Chơi ở `/` (Full). Bấm `C` để đổi chế độ hoặc mở `/?compact` cho Compact. Dùng `pnpm.cmd dev` nếu PowerShell chặn `pnpm.ps1`.

## Chỗ đặt code

| Thư mục                     | Nội dung                                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `src/game/config`           | Mọi thông số cân bằng game. `plants.ts` chứa thông số của cả 5 loài, `economy.ts` chứa thiết lập khởi đầu và cấu hình chậu.     |
| `src/game/systems`          | Luật game dạng hàm thuần, với unit test cạnh file nguồn. Growth, Shop, Inventory và unlock đặt ở đây.                           |
| `src/store`                 | Store, action gọi luật game, phiên bản save và migration. State Full/Compact chỉ thuộc phiên hiện tại.                          |
| `src/ui`                    | HUD, Shop, Túi đồ và scene ban công. Component đọc state và gọi action.                                                         |
| `src/art`, `src/styles.css` | Ảnh gốc trong `src/art/assets`, icon SVG inline và token màu pastel. Scene SVG dùng `viewBox` và các lớp ảnh gốc qua `<image>`. |
| `src/platform`, `src/audio` | Adapter Document PiP cho web, dành chỗ cho Tauri v2. Wrapper Howler chỉ tải khi cần và đọc tùy chọn âm thanh đã lưu.            |

## Thời gian và save

- Hàm game nhận `now` từ caller, không đọc đồng hồ hay DOM. Tính tiến độ từ `plantedAt` và checkpoint gần nhất. Dùng timestamp tuyệt đối, không cộng dồn bằng `setInterval`.
- Kẹp tiến độ ở mức trưởng thành, giữ checkpoint khi đồng hồ lùi và tính lại ở lúc mở game. Bổ sung test cho offline 30 ngày, đồng hồ lùi và các ngưỡng tăng trưởng khi đổi hệ thống.
- Khi đổi cấu trúc save, tăng `SAVE_VERSION`, thêm migration từ từng phiên bản đã phát hành còn được hỗ trợ và test dữ liệu cũ. Giữ nguyên dữ liệu gốc khi đọc hoặc migrate lỗi. Tránh thao tác xóa hoặc đặt lại save cũ.
- Giữ bundle nhỏ. Hỏi trước khi thêm thư viện nặng như engine game hoặc UI kit. Các giá trị cân bằng trong component phải lấy từ config.

## Definition of done

- `pnpm check` và `pnpm build` pass. Luật mới có unit test.
- Kiểm tra Full và Compact trên trình duyệt. Compact chỉ hiện scene.
- Soát luật không cây chết, bố cục, màu pastel và khả năng đọc save cũ khi có thay đổi.
- Bám [roadmap](docs/ROADMAP.md) và xin duyệt các thay đổi luật game. Bản React đã chuyển luồng chơi Rosie từ prototype và tab bán cây ở M5.
