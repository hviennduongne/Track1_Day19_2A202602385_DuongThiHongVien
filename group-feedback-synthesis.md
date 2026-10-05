# Group Feedback Synthesis

**Tên nhóm:** [CẦN ĐIỀN TÊN NHÓM]
**Thành viên:** Ninh Quang Minh, Dương Thị Hồng Viên
**Tổng số tester đã test:** 3 người (Vũ, Dũng, Mai - tester của Viên)

---

## 1. Hành vi lặp lại (Patterns across 3 testers)

- **Sự lười biếng thao tác tay (Low effort bias):** Cả 3 tester đều chê Option A (Tự gõ) vì quá tốn công sức. Họ đều có xu hướng thích AI tạo sẵn một bản nháp (Option B hoặc C) để làm điểm tựa, thay vì bắt đầu từ trang giấy trắng.
- **Rủi ro của Option C (Automation Bias):** 2/3 tester (Vũ và Mai) khi đối mặt với bản nháp toàn vẹn của Option C đã bấm nút "Giữ" liên tục. Họ lướt qua các cờ cảnh báo (màu vàng) mà không hề đọc kỹ. Họ bị ngợp thông tin và phó mặc cho AI.
- **Điểm sáng của Option B (Co-creation):** 2/3 tester chọn Option B là phương án tối ưu. Việc AI bắt user phải dừng lại 1 nhịp để "xác nhận mức độ hiểu" (Khảo sát đầu vào) tạo ra cảm giác làm chủ. Bản nháp sinh ra sau đó được tester đánh giá là "cá nhân hóa và đáng tin cậy hơn".

## 2. Lựa chọn (Winning Option & Trade-offs)

- **Option thắng cuộc:** **Option B** (2 vote), Option C (1 vote), Option A (0 vote).
- **Trade-off mà người dùng chấp nhận:** Người dùng chấp nhận đánh đổi sự tiện lợi tuyệt đối (chỉ cần bấm 1 nút tạo nháp của Option C) để lấy **sự can thiệp có chủ đích (Intentional Friction)** của Option B. Việc tốn thêm vài giây click khảo sát mức độ hiểu giúp họ có bản ghi chú sát ý hơn và không bị ngợp thông tin.

## 3. Quyết định tiếp theo (Group Next Change)

Dựa trên evidence, trong iteration tiếp theo nhóm sẽ:
- **Phát triển tiếp Option B** (AI khảo sát mức hiểu trước rồi mới tạo nháp).
- **Bổ sung tính năng từ Option C vào Option B:** Đem hệ thống "Cờ cảnh báo mâu thuẫn" (Confidence flags) của Option C gắn vào bước tạo nháp của Option B. Nếu user chọn "Đã nắm" nhưng hệ thống thấy không có dấu vết học tập nào (không highlight, không pause), AI sẽ bật cờ nhắc nhở nhẹ trước khi sinh bản nháp.

## 4. Những điều vẫn chưa được chứng minh (Still Unproven)

- Prototype hiện tại chỉ thử nghiệm trên 1 bài học rất ngắn (5 phần). Vẫn chưa chứng minh được liệu người dùng có sẵn sàng ngồi click chọn mức độ hiểu (Option B) cho một bài giảng dài 2 tiếng với 20 phần hay không (nguy cơ mệt mỏi vì khảo sát - Survey fatigue).
- Chưa kiểm chứng được khả năng duy trì thói quen: Liệu tester có quay lại nền tảng để đọc ghi chú này sau 1 tuần hay không?
