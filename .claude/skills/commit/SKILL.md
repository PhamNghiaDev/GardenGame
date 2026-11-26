---
name: commit
description: Tạo một commit theo Conventional Commits khi người dùng yêu cầu commit các thay đổi của dự án.
disable-model-invocation: true
---

1. Kiểm tra `git status --short`, `git diff` và `git diff --cached`. Xác định các thay đổi thuộc commit được yêu cầu.
2. Chạy `pnpm check` từ gốc dự án, hoặc `pnpm.cmd check` khi PowerShell chặn script. Nếu check lỗi, báo lỗi và dừng việc commit.
3. Stage file thuộc phạm vi rồi kiểm tra lại diff đã stage. Commit khi check pass với thông điệp Conventional Commits dạng `type(scope): mô tả ngắn`. Ví dụ `feat(shop): add plant unlock`.
4. Báo hash và tên commit thực tế. Chỉ push khi người dùng yêu cầu push.
