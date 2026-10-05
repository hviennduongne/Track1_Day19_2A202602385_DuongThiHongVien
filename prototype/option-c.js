
/*
 * OPTION C — "AI tạo, user duyệt" (người build: Ninh Quang Minh)
 * Critical interaction:
 *   Bước 1 (#/c)       : AI tự động tạo toàn bộ bản nháp, kèm các cờ cảnh báo (confidence flags) ở những đoạn thiếu dữ liệu.
 *   Kêt quả (#/c/done) : user chọn Giữ / Bỏ / Sửa, sau đó lưu lại.
 */
(function () {
  const { F, esc, sectionById, tracesOf, traceChip, transcriptBox } = window.App;

  const CANNED = {
    s1: "Discovery = trả lời 'có nên build không' trước khi build. Chạy song song với Delivery (build cho đúng).",
    s2: "Double Diamond gồm hai hình thoi nối tiếp: Vấn đề (Discover -> Define) và Giải pháp (Develop -> Deliver). Lỗi hay gặp: nhảy sang hình thoi 2 khi chưa chốt vấn đề.",
    s3: "Cây 4 tầng: Outcome -> Opportunity (nhu cầu/nỗi đau của khách) -> Solution (thứ mình build) -> Thử nghiệm giả định.\n\n❓ Giải đáp: Opportunity nằm ở phía khách hàng (vấn đề họ gặp phải). Solution nằm ở phía team product (thứ mình build ra để giải quyết vấn đề đó).",
    s4: "Mỗi solution dựa trên nhiều giả định, chia thành 4 loại rủi ro: Value, Usability, Feasibility, Viability. Ưu tiên test giả định quan trọng nhất mà ít bằng chứng nhất.",
    s5: "Fake-door test: đặt nút cho tính năng chưa có để đo hành vi thật. Chọn thử nghiệm rẻ nhất mà vẫn trả lời được giả định quan trọng nhất."
  };

    function initState() {
    const s = { texts: {}, action: {}, openSrc: {} };
    F.lesson.sections.forEach(sec => {
      s.texts[sec.id] = CANNED[sec.id];
      s.action[sec.id] = "pending";
    });
    return s;
  }

  window.App.registerOption({
    id: "c",
    editStep: "",
    initState,
    
    render(step, st) {
      let pendingCount = 0;
      const cards = F.lesson.sections.map((s) => {
        const text = st.texts[s.id];
        const rows = Math.max(3, text.split("\n").reduce((n, l) => n + Math.ceil((l.length || 1) / 50), 0));
        
        let flag = null;
        const traces = tracesOf(s.id);
        if (traces.length === 0) {
            flag = { type: "warn", text: "Bạn không có dấu vết nào ở phần này. AI tạo tóm tắt chung chung." };
        } else {
            const unclearTrace = traces.find(t => t.type === "unclear");
            if (unclearTrace) {
                flag = { type: "info", text: `AI đã thêm phần giải thích dựa trên câu hỏi của bạn lúc ${unclearTrace.t}.` };
            }
        }

        const isRejected = st.action[s.id] === "reject";
        const isPending = st.action[s.id] === "pending";
        if (isPending) pendingCount++;
        
        return `<div class="draft-card" style="margin-bottom:16px; ${isRejected ? 'opacity: 0.5; background: #f8f9fa;' : ''}">
          <div class="q-head" style="font-weight:600; display:flex; justify-content:space-between; align-items:center">
            <span>Phần ${s.no} — ${esc(s.title)}</span>
            <div class="seg" style="transform: scale(0.9); transform-origin: right center">
              <button class="seg-btn ${st.action[s.id] === 'keep' ? 'active' : ''}" data-action="set-action" data-sid="${s.id}" data-val="keep"><i class="fa-solid fa-check"></i> Giữ</button>
              <button class="seg-btn ${st.action[s.id] === 'reject' ? 'active' : ''}" data-action="set-action" data-sid="${s.id}" data-val="reject"><i class="fa-solid fa-trash"></i> Bỏ</button>
            </div>
          </div>
          
          ${flag && !isRejected ? `<div class="notice" style="background: ${flag.type === 'warn' ? '#fff4e0' : '#e8f0fe'}; color: ${flag.type === 'warn' ? '#b06000' : '#1967d2'}; border-color: ${flag.type === 'warn' ? '#fde293' : '#d2e3fc'};">
            <i class="fa-solid ${flag.type === 'warn' ? 'fa-triangle-exclamation' : 'fa-info-circle'}"></i> ${flag.text}
          </div>` : ""}
          
          <textarea style="background-color: #f4fbff; border: 1px solid #c2e0ff;" data-field="text" data-sid="${s.id}" rows="${rows}" ${isRejected ? 'disabled' : ''}>${esc(text)}</textarea>
          
          <div class="draft-meta">
            <span class="muted small">${isRejected ? "Đã loại bỏ khỏi sổ tay" : isPending ? "Chưa duyệt" : "Bạn có thể sửa trực tiếp nội dung"}</span>
            <button class="link small" data-action="toggle-src" data-sid="${s.id}"><i class="fa-solid fa-code-branch"></i> Transcript ${st.openSrc[s.id] ? "–" : "+"}</button>
          </div>
          ${st.openSrc[s.id] ? transcriptBox(s) : ""}
        </div>`;
      }).join("");

      return `
        <div class="vl-panel-header">
          <div class="vl-panel-title"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Notes (Phương án C)</div>
          <button class="btn btn-icon" data-action="home"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="vl-panel-body" style="background:#f8f9fa;">
          <div class="stepbar"><i class="fa-solid fa-robot"></i> Chế độ Auto-Draft (AI Tự động tạo)</div>
          <div class="expect" style="background:#fff">
            <strong>Cơ chế Auto-Draft:</strong> AI đã tự động phân tích và viết sẵn toàn bộ ghi chú. Bạn đóng vai trò là "Người duyệt" (Reviewer). Hãy duyệt qua, giữ lại những phần hữu ích và bỏ đi những phần không cần thiết.
          </div>
          <div>${cards}</div>
        </div>
        <div class="vl-panel-footer" style="flex-direction:column; align-items:stretch; gap:8px;">
          ${pendingCount > 0 ? `<div style="text-align:center; font-size:0.85rem; color:#d93025">Còn ${pendingCount} phần chưa duyệt</div>` : ""}
          <button class="btn primary" data-action="save" style="width:100%" ${pendingCount > 0 ? 'disabled' : ''}><i class="fa-solid fa-floppy-disk"></i> Lưu các phần đã giữ</button>
        </div>`;
    },
handle(action, d, st) {
      const sid = d.sid;
      switch (action) {
        case "set-action": 
          st.action[sid] = d.val;
          return; // trigger re-render
        case "toggle-src": 
          st.openSrc[sid] = !st.openSrc[sid]; 
          return;
        case "save": 
          window.App.go("#/c/done"); 
          return false;
        default: return false;
      }
    },

    input(d, val, st) {
      st.texts[d.sid] = val;
    },

    finalNote(st) {
      return window.App.F.lesson.sections
        .filter(s => st.action[s.id] === 'keep')
        .map(s => ({ sectionId: s.id, text: st.texts[s.id] }));
    },

    annotation(step) {
      if (step === "done") return {
        expect: "User thấy sổ tay chỉ chứa những phần đã chọn 'Giữ'.",
        watch: "Họ có đọc lại không, hay đóng luôn?",
        dontExplain: "Không giải thích tính năng sửa."
      };
      return {
        expect: "User duyệt (đọc lướt), bấm 'Bỏ' ở những phần không cần thiết (đặc biệt là phần AI tạo chung chung), và có thể sửa lại text nếu AI viết sai.",
        watch: "Họ có đọc nhãn cảnh báo (màu vàng/xanh) không? Có bấm 'Bỏ' không hay giữ hết?",
        dontExplain: "Không nhắc họ đọc cảnh báo hay nhắc họ có thể bấm Bỏ."
      };
    }
  });
})();
