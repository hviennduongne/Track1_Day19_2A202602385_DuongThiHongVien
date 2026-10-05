# Track 1 — Day 18: Prototype Testing Lab
## Case B — AI Notes: Personal Learning Notes

---

## 1. Thông tin cá nhân & nhóm

| | |
|---|---|
| **MHV** | 2A202602432 |
| **Họ tên** | Ninh Quang Minh |
| **Case đã chọn** | Case B — AI Notes: Personal Learning Notes (từ Day 17) |
| **Tên nhóm** | Nhóm 2 Người |
| **Thành viên** | Ninh Quang Minh, Dương Thị Hồng Viên |

---

## 2. Hypothesis Problem (Day 18)

> **Khi** vừa học xong một bài online có nhiều framework hoặc nội dung mới, **học viên** gặp khó khăn trong việc **tổng hợp điểm quan trọng và chỗ mình chưa hiểu thành một bản ghi chú dùng được để ôn hoặc làm bài**, **vì** ghi chú thủ công trong lúc học làm gãy mạch (pause, chuyển tab, tua lại) còn bản tóm tắt AI chung chung không phản ánh chỗ họ đã hiểu và chưa hiểu, **dẫn đến** ghi chú lộn xộn hoặc bị bỏ dở và phải mở lại video tua tìm khi cần.

---

## 3. Three Solution Options (Micro-prototypes)

Để giải quyết vấn đề trên, nhóm thiết kế 3 phương án (Option) với mức độ tự động hóa và phân chia quyền quyết định giữa AI và người dùng (User) khác nhau:

- **Option A (Chủ động - Chatbot Style):**
  - **Luồng hoạt động:** User tự viết ghi chú hoàn toàn. Khi gặp khó khăn, User bôi đen đoạn cần hỏi -> bấm "Hỏi AI". AI trả lời ngắn gọn giải thích đoạn đó.
  - **Quyền quyết định:** User toàn quyền tạo nội dung. AI chỉ đóng vai trò "từ điển" giải đáp thắc mắc theo ngữ cảnh khi được gọi.

- **Option B (Cùng tạo - Co-creation):** (Do Ninh Quang Minh phụ trách)
  - **Luồng hoạt động:** AI quét dấu vết học tập và chủ động hỏi User mức độ hiểu ở từng phần (Đã nắm / Mơ hồ / Chưa hiểu). Dựa trên phản hồi, AI tạo ra một bản nháp ghi chú cá nhân hóa.
  - **Quyền quyết định:** AI soạn nội dung, nhưng User điều hướng AI bằng cách xác nhận mức độ hiểu trước. User có quyền chỉnh sửa lại bản nháp sau cùng.

- **Option C (Tự động - Auto Draft):** (Do Ninh Quang Minh phụ trách)
  - **Luồng hoạt động:** AI tự động viết toàn bộ bản ghi chú ngay lập tức dựa trên dấu vết. AI gắn các cờ cảnh báo (Ví dụ: "Không có dữ liệu, AI tự tóm tắt chung chung").
  - **Quyền quyết định:** AI làm toàn bộ công việc nặng. User đóng vai trò "Người duyệt" (Reviewer): Đọc cảnh báo, bấm "Giữ", "Bỏ", hoặc tự sửa tay từng đoạn.

🔗 **[Mở Prototype A/B/C chung của nhóm](prototype-link.md)**

---

## 4. Đóng góp của tôi trong nhóm

- Dựng khung dự án HTML/CSS/JS ban đầu theo cấu trúc giao diện 3 cột chuyên nghiệp (Sidebar, Center pane, AI Panel) lấy cảm hứng từ nền tảng VLearn.
- Trực tiếp lập trình **Option B** (AI khảo sát mức độ hiểu) và **Option C** (Auto Draft) vì nhóm thiếu thành viên.
- Ráp nối code `option-a.js` của Viên vào dự án chung, hỗ trợ Viên tích hợp API OpenRouter để Option A hoạt động mượt mà hơn.
- Tiến hành chạy 2 phiên Test với người ngoài nhóm (Vũ, Dũng) và ghi nhận kết quả chi tiết.
- Chủ trì tổng hợp `group-feedback-synthesis.md` từ 3 phiên test.

---

## 5. Prototype Feedback

- Bấm để xem chi tiết **[2 Phiếu ghi chép (Feedback Notes)](prototype-feedback-note.md)** do chính tôi làm facilitator.
- Bấm để xem **[Bản tổng hợp 3 phiên & Next Change của nhóm](group-feedback-synthesis.md)**.

---

## 6. AI Support Log

Bấm để xem **[Nhật ký sử dụng AI (AI Support Log)](ai-support-log.md)** của tôi.
