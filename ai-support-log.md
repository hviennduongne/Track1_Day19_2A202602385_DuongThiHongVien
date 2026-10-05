# AI Support Log — Day 18

### 1. Phạm vi AI đã hỗ trợ (Tuân thủ luật của bài Lab)

- **Đề xuất 3 options:** AI giúp biến các hướng trong Solution Parking Lot (Day 17) thành 3 options A/B/C có cơ chế phân chia quyền kiểm soát khác nhau (User tạo, Cùng tạo, AI tạo). AI cũng giúp soạn Human–AI Decision Table cho 3 phương án này.
- **Tạo dữ liệu giả (Synthetic Data):** Nội dung bài học "Product Discovery Framework" (transcript, thời gian, tên slide) và các dấu vết giả định của học viên được AI tạo ra hoàn toàn để phục vụ prototype, không phải dữ liệu thật.
- **Sinh "Canned Text" cho AI:** AI hỗ trợ viết sẵn các câu trả lời của AI ở Option B ứng với từng mức độ hiểu (short, long, example) để mô phỏng tương tác mà không cần gọi API model thật.
- **Viết code Prototype:** AI lập trình shell ứng dụng (HTML/CSS/JS) hỗ trợ routing và cơ chế plugin để ghép nối 3 phương án, đồng thời build chi tiết Option B (AI hỏi mức hiểu rồi tạo nháp) và Option C (AI tạo toàn bộ, user duyệt) vì nhóm chỉ có 2 thành viên thay vì 3.
- **Rà soát câu hỏi dẫn dắt:** AI rà soát "Outcome task" và "Observation focus" để đảm bảo không nhắc tên nút, không nhắc tính năng AI, và không dùng các câu hỏi đóng hay mớm lời.

### 2. Giới hạn tự đặt ra (Những việc AI KHÔNG LÀM)

- AI **KHÔNG** làm sạch hoặc viết lại evidence từ Day 17 (chép nguyên văn lời user từ `notes.md`).
- AI **KHÔNG** tạo quote, observation hay feedback giả mạo (các file liên quan đến test đều là template trống).
- AI **KHÔNG** tự điền tên thành viên nhóm, không tự quyết định ai build option nào.
- AI **KHÔNG** tự deploy repo lên GitHub hay thay mặt học viên nộp bài.

---

### 3. AI sai hoặc hời hợt ở đâu, và tôi tự sửa gì?

- **Giao diện ban đầu quá sơ sài:** Ban đầu, AI tạo ra một giao diện HTML/CSS cơ bản, dạng một trang cuộn dọc (single-column) không phản ánh đúng cấu trúc của một nền tảng học tập thực tế. Tôi đã phải cung cấp thêm 5 hình ảnh thiết kế mẫu từ nền tảng VLearn để hướng dẫn AI.
- **Sửa lại cấu trúc (Layout):** Sau khi nhận xét, tôi yêu cầu AI đập đi làm lại phần giao diện (UI) để chuyển sang cấu trúc 3 phần (Menu trái, Slide bài giảng ở giữa, và AI Panel ở bên phải). AI đã tiến hành thay đổi toàn bộ CSS và hệ thống component để prototype trở nên chuyên nghiệp và sát với thực tế kiểm thử hơn.
