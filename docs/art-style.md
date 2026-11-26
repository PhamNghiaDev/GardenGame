# Phong cách hình ảnh

Balcony Garden dùng cảnh 2D dịu, ấm và hơi thủ công. Giữ hình gốc của nền, ban công, chậu và Cúc Rosie từ [prototype](prototype/ver2.2.html). Full và Compact dùng chung khung 4:3 để giữ vị trí cây và chậu khi cửa sổ đổi kích thước.

## Bảng màu pastel

Đọc giá trị thực tế từ token trong [styles.css](../src/styles.css). Bảng dưới ghi các màu chính để đối chiếu gu hình ảnh.

| Dùng cho            | Token                        | Màu       |
| ------------------- | ---------------------------- | --------- |
| Viền ngoài ban công | `--color-garden-wall`        | `#ede8d4` |
| Nền scene           | `--color-garden-stage`       | `#fffdec` |
| Nền nút và popup    | `--color-garden-button`      | `#fff4e4` |
| Viền nút            | `--color-garden-button-edge` | `#f0cfa6` |
| Shop                | `--color-garden-shop`        | `#fff0cc` |
| Bình tưới           | `--color-garden-water`       | `#e4f4fb` |
| Exit và nút đóng    | `--color-garden-exit`        | `#ffe3dc` |
| Chữ                 | `--color-garden-ink`         | `#6b4a3a` |

Dùng mảng pastel sáng và chữ nâu đủ tương phản. Giữ cạnh viền, trạng thái focus và dấu chọn dễ nhận ra. Tránh chớp sáng và màu neon.

## Hình dáng và chuyển động

- Bo góc mềm cho nút, thẻ và popup. Dùng dạng viên thuốc cho nhãn ngắn và số vàng.
- SVG mới cần `viewBox` với kích thước hiển thị theo khung. Cảnh đặt ảnh gốc bằng lớp `<image>`. Giữ vị trí neo ở miệng chậu nhất quán qua các giai đoạn.
- Dùng chuyển nhẹ khi cây đổi giai đoạn, vài giọt nước khi tưới và chữ nổi ngắn khi thu hoạch. Tuân theo `prefers-reduced-motion`.
- Compact ưu tiên cảnh yên tĩnh. Chỉ render khung ban công và các chậu cùng cây đang lớn.
