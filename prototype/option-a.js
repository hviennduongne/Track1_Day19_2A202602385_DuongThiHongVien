/* Option A — Dương Thị Hồng Viên. 
 * AI mechanism: User writes notes manually. If stuck, they select text and click "Hỏi AI". 
 * Canned responses for the lab: no network or API key required.
 */
(function () {
  const { F, esc, tracesOf, traceChip, transcriptBox, sectionById } = window.App;
  
  // Track selected text globally
  const selected = {};
  
  document.addEventListener('selectionchange', () => {
    const active = document.activeElement;
    if (active && active.matches('textarea[data-a-note]')) {
      const text = active.value.slice(active.selectionStart, active.selectionEnd).trim();
      if (text) selected[active.dataset.sid] = text;
    } else {
      const selection = window.getSelection();
      const node = selection && selection.anchorNode;
      const element = node && (node.nodeType === 1 ? node : node.parentElement);
      const card = element && element.closest('[data-a-card]');
      if (card && selection.toString().trim() && card.contains(selection.focusNode)) {
        selected[card.dataset.aCard] = selection.toString().trim();
      }
    }
  });

  async function callAI(quote, section) {
    // A micro-prototype illustrates interaction; it does not answer arbitrary questions.
    const replies = {
      s1: "Discovery trả lời có nên build trước khi đầu tư; Delivery tập trung build cho đúng. Hai hoạt động chạy song song (01:55, 03:10).",
      s2: "Double Diamond: Discover → Define để hiểu vấn đề, Develop → Deliver để tìm giải pháp. Mỗi hình thoi mở rộng rồi thu hẹp (05:02–09:05).",
      s3: "Opportunity là nhu cầu hoặc nỗi đau của khách hàng; Solution là thứ nhóm xây để giải quyết nhu cầu đó. Ví dụ minh họa này dựa trên transcript 11:30–12:05.",
      s4: "Bốn rủi ro: Value, Usability, Feasibility, Viability. Ưu tiên kiểm tra giả định quan trọng nhưng còn ít bằng chứng (18:40–21:30).",
      s5: "Trong bài mẫu, fake-door được chọn để quan sát hành vi bấm thật với chi phí thấp; không chứng minh mọi bài toán đều nên dùng cách này (22:58–26:10)."
    };
    return replies[section.id] || "Chưa có phản hồi mẫu cho phần này. Bạn có thể đọc transcript và tiếp tục ghi chú thủ công.";
  }

  window.App.registerOption({
    id: 'a', editStep: '',
    initState() { 
      Object.keys(selected).forEach(k => delete selected[k]); 
      return { texts: {}, replies: {}, openSrc: {}, undo: {}, loading: {} }; 
    },
    
    render(step, st) {
      return `
        <div class="vl-panel-header">
          <div class="vl-panel-title"><i class="fa-solid fa-pen-to-square" style="color:#1a73e8"></i> AI Notes (Phương án A)</div>
          <button class="btn btn-icon" data-action="home"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="vl-panel-body" style="background:#f8f9fa;">
          <div class="expect" style="background:#fff">
            <strong>Ghi chú chủ động:</strong> Bạn hãy tự viết ghi chú. Nếu chưa hiểu đoạn nào, hãy <strong>bôi đen</strong> đoạn đó (trong dấu vết, transcript hoặc ghi chú của bạn) và bấm <strong>"Hỏi AI"</strong>. Đây là phản hồi mẫu theo phần bài, không trả lời mọi câu hỏi và không đánh giá mức hiểu của bạn.
          </div>
          ${F.lesson.sections.map(s => {
            const reply = st.replies[s.id];
            const isLoading = st.loading[s.id];
            
            return `<div class="draft-card" data-a-card="${s.id}" style="margin-bottom:16px;">
              <div class="q-head" style="font-weight:600; margin-bottom:12px;">Phần ${s.no} — ${esc(s.title)}</div>
              
              <div style="margin-bottom:12px">${tracesOf(s.id).map(traceChip).join('')}</div>
              
              <textarea id="a-${s.id}" data-a-note data-field="text" data-sid="${s.id}" rows="4" placeholder="Ghi chú của bạn...">${esc(st.texts[s.id] || '')}</textarea>
              
              <div class="draft-meta" style="justify-content:space-between">
                <button class="btn small" data-action="ask-a" data-sid="${s.id}" ${isLoading ? 'disabled' : ''}>
                  <i class="fa-solid fa-sparkles"></i> ${isLoading ? 'AI đang nghĩ...' : 'Hỏi AI đoạn bôi đen'}
                </button>
                <button class="link small" data-action="source-a" data-sid="${s.id}"><i class="fa-solid fa-code-branch"></i> Transcript ${st.openSrc[s.id] ? '–' : '+'}</button>
              </div>
              
              ${st.openSrc[s.id] ? transcriptBox(s) : ''}
              
              ${reply ? `
                <div class="notice" style="background:#f1f3f4; color:#3c4043; border-color:#dadce0; margin-top:12px; display:block">
                  <div style="font-size:0.75rem; color:#80868b; margin-bottom:4px">Đoạn bạn hỏi: "${esc(reply.quote)}"</div>
                  <div style="margin-bottom:8px"><strong>AI:</strong> ${esc(reply.text)}</div>
                  <div style="display:flex; gap:8px">
                    <button class="btn small" data-action="insert-a" data-sid="${s.id}">Chèn vào ghi chú</button>
                    <button class="btn small" data-action="dismiss-a" data-sid="${s.id}">Đóng</button>
                  </div>
                </div>
              ` : ''}
              
              ${st.undo[s.id] !== undefined ? `
                <div style="margin-top:8px; font-size:0.85rem">
                  <span style="color:#0f9d58"><i class="fa-solid fa-check"></i> Đã chèn</span> • <button class="link small" data-action="undo-a" data-sid="${s.id}">Hoàn tác</button>
                </div>
              ` : ''}
            </div>`;
          }).join('')}
        </div>
        <div class="vl-panel-footer">
          <button class="btn primary" data-action="save-a" style="width:100%"><i class="fa-solid fa-floppy-disk"></i> Lưu ghi chú</button>
        </div>`;
    },
    
    handle(action, d, st) {
      const sid = d.sid;
      switch (action) {
        case 'source-a': 
          st.openSrc[sid] = !st.openSrc[sid]; 
          return;
          
        case 'ask-a': {
          let quote = selected[sid];
          if (!quote) {
            quote = st.texts[sid] ? st.texts[sid].trim() : '';
          }
          if (!quote) { 
            alert('Hãy gõ câu hỏi vào ô ghi chú hoặc bôi đen một đoạn văn bản rồi bấm Hỏi AI nhé!'); 
            return false; 
          }
          st.loading[sid] = true;
          // Trigger re-render to show loading state
          
          // Resolve a canned response only after the user requests it.
          callAI(quote, sectionById(sid)).then(answer => {
            st.loading[sid] = false;
            st.replies[sid] = { quote, text: answer };
            window.App.render();
          });
          return; // Allow current sync render to happen (showing loading state)
        }
        
        case 'insert-a': {
          if (!st.texts[sid]) st.texts[sid] = '';
          st.undo[sid] = st.texts[sid];
          st.texts[sid] = st.texts[sid] + (st.texts[sid] ? '\n' : '') + `[AI: ${st.replies[sid].text}]`;
          st.replies[sid] = null;
          return;
        }
        
        case 'dismiss-a':
          st.replies[sid] = null;
          return;
          
        case 'undo-a':
          st.texts[sid] = st.undo[sid];
          delete st.undo[sid];
          return;
          
        case 'save-a':
          window.App.go("#/a/done");
          return false;
          
        default: return false;
      }
    },
    
    input(d, val, st) {
      if (d.field === 'text') st.texts[d.sid] = val;
    },
    
    finalNote(st) {
      return F.lesson.sections.map(s => ({ sectionId: s.id, text: st.texts[s.id] || '(Không có ghi chú)' }));
    },
    
    annotation(step) {
      if (step === "done") return {
        expect: "User thấy bản ghi chú tự viết đã được lưu.",
        watch: "Họ có đọc lại không?",
        dontExplain: "Không giải thích"
      };
      return {
        expect: "User tự viết ghi chú, khi cần sẽ bôi đen text -> bấm Hỏi AI -> nhận giải thích -> tự quyết định chèn hay không.",
        watch: "User có bôi đen đúng cách không? Có đọc nguồn không hay tin hoàn toàn AI?",
        dontExplain: "Không chỉ họ cách bôi đen."
      };
    }
  });
})();
