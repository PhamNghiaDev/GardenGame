# Game Design Document · Balcony Garden

## Trải nghiệm

Balcony Garden là game làm vườn thư giãn, zero-stress. Bối cảnh là ban công ấm áp với đồ họa 2D flat đáng yêu, màu pastel dịu, góc bo mềm và chuyển động nhẹ.

**KHÔNG CÓ CƠ CHẾ CÂY CHẾT.** Người chơi có thể tắt game bao lâu, quên tưới hoặc quên thu hoạch. Cây vẫn đạt tối đa rồi chờ thu hoạch. Không có héo, sâu bệnh, phạt hay đồng hồ đếm ngược gây áp lực.

## Vòng lặp chính

1. Mua hạt giống ở Shop và gieo vào một trong ba chậu.
2. Tưới và để cây lớn theo thời gian.
3. Khi trưởng thành, thu hoạch cây vào Túi đồ.
4. Bán cây trong Shop lấy vàng.
5. Dùng vàng để mở khóa vĩnh viễn loài cây mới. Mở rộng trang trí ban công ở M9.

Xẻng thu hoạch cây trưởng thành. Người chơi có thể chủ động nhổ cây non để gieo lại sau khi xác nhận. Cây quên chăm vẫn đạt trưởng thành.

Tưới cây đang lớn tăng tốc 30% trong 30 giây như prototype. Tưới lại làm mới thời lượng. Cây tiếp tục lớn theo thời gian kể cả khi chưa tưới.

## Cây trồng

Cúc Rosie mở khóa sẵn. Shop vẫn hiển thị bốn loài bị khóa và giá mở khóa. Khi đã mở, loài cây tiếp tục được mở khi tải lại save.

Các giá dưới đây tính bằng vàng. Thời gian tính từ khi gieo ở mốc 0, chưa áp dụng hiệu ứng tưới. Bản React dùng số liệu prototype cho Rosie. Các thông số cho bốn loài khóa là số tạm. Tên bốn loài khóa cũng là placeholder. [Config cây](../src/game/config/plants.ts)

| Loài             | Lúc bắt đầu | Giá hạt | Giá bán | Mầm (giây) | Trưởng thành (giây) | Giá mở khóa |
| ---------------- | ----------- | ------: | ------: | ---------: | ------------------: | ----------: |
| Cúc Rosie        | Mở          |      20 |      60 |         20 |                  45 |           0 |
| Loài cây 2 (tạm) | Khóa        |      30 |      90 |         30 |                  60 |         150 |
| Loài cây 3 (tạm) | Khóa        |      45 |     135 |         45 |                  90 |         300 |
| Loài cây 4 (tạm) | Khóa        |      60 |     180 |         60 |                 120 |         500 |
| Loài cây 5 (tạm) | Khóa        |      80 |     240 |         75 |                 150 |         800 |

Các mốc Rosie lấy từ prototype. Vàng ban đầu cũng lấy giá trị tạm của prototype. [Config kinh tế](../src/game/config/economy.ts)

## Giao diện

Scene giữ khung 4:3 và vị trí ba chậu từ [ver2.2.html](prototype/ver2.2.html). [Asset scene](../src/art/assets/scene/) chứa ảnh gốc của nền, ban công và chậu. [Asset Rosie](../src/art/assets/rosie/) chứa ba giai đoạn lớn và ảnh hoa vàng dùng chung cho hạt giống và hoa thu hoạch. Các icon HUD có sẵn được lấy từ prototype.

| Vị trí    | Full                                                |
| --------- | --------------------------------------------------- |
| Nền       | Ban công ấm áp với ba chậu trên sàn và thềm.        |
| Trên trái | Coin và icon Túi đồ.                                |
| Trên phải | Exit.                                               |
| Dưới trái | Icon Shop lớn, mở popup hai tab mua hạt và bán cây. |
| Dưới phải | Icon bình tưới lớn, dùng để tưới cây.               |

**Compact / Widget** chỉ giữ khung ban công tối giản và các chậu để xem ở góc màn hình trong lúc làm việc. Ẩn hoàn toàn nút, icon, Coin, Túi đồ, Shop và Exit. Chế độ cửa sổ nổi dùng Document PiP qua adapter platform ở M7.

Phím `C` đổi giữa Full và Compact. Mở `/?compact` để vào thẳng Compact. Exit hiển thị thông báo như prototype.

**Âm thanh** gồm nhạc nền và SFX tưới, thu hoạch, mua, bán. Tải khi cần và lưu tùy chọn tắt/bật tiếng. Hiện có nút lưu tùy chọn. Nhạc và SFX đi vào M8.

## Kiến trúc triển khai

Bản web dùng Vite, TypeScript strict, React 19, Tailwind CSS 4 và scene SVG. Zustand lưu save có phiên bản vào localStorage. Adapter cửa sổ nổi dành cho Document PiP và wrapper âm thanh dùng Howler. Vitest, ESLint và Prettier dùng để kiểm tra và định dạng code.

## Quyết định còn mở

- M2 / M5 / M6 — Thời gian lớn, tên bốn loài, giá và số vàng hoặc hạt khởi đầu chính thức.
- Save prototype được nhập từ `balcony-garden-v1` khi cùng địa chỉ web và bản React chưa có tiến độ. File HTML mở trực tiếp và địa chỉ web khác dùng vùng lưu trữ riêng. Đọc mô tả checkpoint trong [ADR 0001](decisions/0001-growth-timestamps.md).
- M7 — Cách vào Compact hoặc mở PiP từ Full, hành vi Exit và cách xử lý khi trình duyệt thiếu Document PiP.
- M9 — Trang trí có mua bằng vàng không, danh mục và cách đặt vật trang trí.
