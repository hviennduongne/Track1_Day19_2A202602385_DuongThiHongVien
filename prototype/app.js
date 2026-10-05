/*
 * APP SHELL — dùng chung cho Option A, B, C.
 * - Router theo hash: #/ (bối cảnh chung), #/<option>/<step>, #/<option>/done (kết quả)
 * - Mỗi option là một file riêng (option-a.js, option-b.js, option-c.js) gọi App.registerOption({...}).
 * - Annotation cho facilitator chỉ hiện khi URL có ?facilitator=1.
 *
 * Interface một option cần cung cấp:
 *   id, initState(), render(step, st) -> html, annotation(step) -> {expect, watch, dontExplain},
 *   handle(action, dataset, st), input(dataset, value, st), finalNote(st) -> [{sectionId, text}],
 *   editStep  (step quay lại khi bấm "Sửa lại" ở màn kết quả)
 */
(function () {
  const F = window.FIXTURE;
  const FACILITATOR = new URLSearchParams(location.search).get("facilitator") === "1";
  const registry = {};

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function sectionById(id) { return F.lesson.sections.find((s) => s.id === id); }
  function tracesOf(id) { return F.traces.filter((t) => t.sectionId === id); }
  function traceChip(tr) {
    const ty = F.traceTypes[tr.type];
    return `<span class="trace trace-${tr.type}">${ty.icon} ${ty.label} · ${tr.t} — “${esc(tr.text)}”</span>`;
  }
  function transcriptBox(sec) {
    return `<div class="transcript">
      <div class="transcript-title">Trích đoạn bài · Phần ${sec.no} (${sec.start}–${sec.end})</div>
      <div class="slide">Slide: ${esc(sec.slide)}</div>
      ${sec.transcript.map((l) => `<div><span class="ts">[${l.t}]</span> ${esc(l.text)}</div>`).join("")}
    </div>`;
  }

  const App = {
    F, FACILITATOR, state: null,
    registerOption(def) { registry[def.id] = def; },
    esc, sectionById, tracesOf, traceChip, transcriptBox,
    go(hash) { if (location.hash === hash) render(); else location.hash = hash; },
    render() { render(); },
    parseRoute() { return parseRoute(); }
  };
  window.App = App;

  function initState() {
    const s = { showLesson: false, done: {}, opt: {}, facOpen: true };
    Object.values(registry).forEach((d) => { s.opt[d.id] = d.initState(); });
    return s;
  }

  function parseRoute() {
    const h = location.hash.replace(/^#\/?/, "");
    const [opt, step] = h.split("/");
    if (opt && registry[opt]) return { opt, step: step || "" };
    return { opt: null, step: "" };
  }

  
  function getCenterPane() {
    const L = F.lesson;
    const lessonDetail = App.state.showLesson
      ? `<div class="lesson-detail">${L.sections.map((s) => `
          <div class="lesson-sec"><strong>Phần ${s.no} — ${esc(s.title)}</strong> <span class="muted">${s.start}–${s.end}</span>
          ${transcriptBox(s)}</div>`).join("")}</div>`
      : "";
    const traces = F.traces.map((tr) => {
      const sec = sectionById(tr.sectionId);
      return `<li>${traceChip(tr)} <span class="muted">Phần ${sec.no} — ${esc(sec.title)}</span></li>`;
    }).join("");
    return `
      <div class="vl-center" id="center-pane">
        <div class="vl-slide-viewer">
          <h1>${esc(L.title)}</h1>
          
          <div class="vl-slide-controls">
            <i class="fa-solid fa-pen"></i> <i class="fa-solid fa-book-open"></i> <i class="fa-solid fa-magnifying-glass-minus"></i> 100% <i class="fa-solid fa-magnifying-glass-plus"></i> <i class="fa-solid fa-text-width"></i>
          </div>
        </div>

        <section class="card" style="margin-top: 24px">
          <div class="eyebrow">Bài học hiện tại</div>
          <h1 style="font-size:1.4rem; margin-bottom:8px">${esc(L.title)}</h1>
          <div class="meta" style="margin-bottom:12px">${L.sections.length} phần · ${L.duration} · <span class="ok"><i class="fa-solid fa-check"></i> Đã xem hết</span></div>
          <button class="link" data-action="toggle-lesson">
            <i class="fa-solid ${App.state.showLesson ? 'fa-chevron-up' : 'fa-chevron-down'}"></i> 
            ${App.state.showLesson ? "Ẩn nội dung transcript" : "Xem nội dung transcript"}
          </button>
          ${lessonDetail}
        </section>

        <section class="card" style="margin-top: 24px">
          <h2 style="font-size:1.1rem; margin-bottom:12px">Dấu vết bạn đã để lại</h2>
          <ul class="trace-list">${traces}</ul>
        </section>
        
        <section class="card task" style="margin-top: 24px">
          <h2 style="font-size:1.1rem; margin-bottom:8px; color: #1a73e8"><i class="fa-solid fa-bullseye"></i> Nhiệm vụ của Tester</h2>
          <p style="margin:0">${esc(F.task)}</p>
        </section>
      </div>
    `;
  }

  function renderHome() {
    const slots = F.optionSlots.map((slot) => {
      const built = !!registry[slot.id];
      const done = App.state.done[slot.id];
      return `<div class="opt-card ${built ? "" : "disabled"}">
        <div class="opt-label">${slot.label}</div>
        <div class="muted small">${built ? "Khám phá cách AI hoạt động trong phương án này." : "Đang được phát triển..."}</div>
        ${built
          ? `<button class="btn primary" data-action="open" data-opt="${slot.id}"><i class="fa-solid fa-wand-magic-sparkles"></i> Mở ${slot.label}</button>`
          : `<button class="btn" disabled>Chưa có prototype</button>`}
        ${done ? `<div class="ok small" style="margin-top:4px"><i class="fa-solid fa-check-circle"></i> Đã lưu sổ tay</div>` : ""}
      </div>`;
    }).join("");

    const panel = `
      <div class="vl-panel-header">
        <div class="vl-panel-title"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Notes (Lab)</div>
      </div>
      <div class="vl-panel-body" style="background:#f8f9fa;">
        <div class="expect" style="background:#fff; border-color:#dadce0; color:#5f6368">
          <i class="fa-solid fa-circle-info"></i> Hãy chọn một phương án thiết kế dưới đây để trải nghiệm sự khác biệt.
        </div>
        ${slots}
      </div>
      <div class="vl-panel-footer" style="justify-content:center">
        <button class="link danger small" data-action="reset-all"><i class="fa-solid fa-rotate-left"></i> Làm lại từ đầu (Xóa mọi thay đổi)</button>
      </div>`;

    return getCenterPane() + `<aside class="vl-panel">${panel}</aside>`;
  }

  function renderDone(optId) {
    const def = registry[optId];
    const notes = def.finalNote(App.state.opt[optId]);
    const panel = `
      <div class="vl-panel-header">
        <div class="vl-panel-title"><i class="fa-solid fa-book-bookmark" style="color:#1a73e8"></i> Sổ ghi chú</div>
        <button class="btn btn-icon" data-action="home" title="Đóng sổ tay"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="vl-panel-body">
        <div class="expect" style="background:#e8f0fe; border-color:#d2e3fc; color:#1967d2">
          <i class="fa-solid fa-check-circle"></i> Ghi chú đã lưu trong phiên này. Tải lại trang hoặc Làm lại từ đầu sẽ xóa dữ liệu.
        </div>
        ${notes.map(n => {
          const sec = sectionById(n.sectionId);
          return `<div class="note-sec">
            <strong>Phần ${sec.no} — ${esc(sec.title)}</strong>
            <div class="note-text">${esc(n.text)}</div>
          </div>`;
        }).join("")}
      </div>
      <div class="vl-panel-footer">
        <button class="btn" data-action="edit-again" data-opt="${optId}"><i class="fa-solid fa-pen"></i> Sửa lại</button>
        <button class="btn primary" data-action="home">Hoàn tất</button>
      </div>`;
    return getCenterPane() + `<aside class="vl-panel">${panel}</aside>`;
  }

  function render() {
    const r = parseRoute();
    const app = document.getElementById("app");
    
    // Save scroll pos
    const panelBody = document.querySelector('.vl-panel-body');
    const scrollPos = panelBody ? panelBody.scrollTop : 0;
    const centerBody = document.querySelector(".vl-center");
    const centerScrollPos = centerBody ? centerBody.scrollTop : 0;
    
    let html, ann, label;

    if (!r.opt) {
      html = renderHome(); ann = F.homeAnnotation; label = "Bài cảnh chung";
    } else {
      const def = registry[r.opt];
      const slot = F.optionSlots.find((s) => s.id === r.opt);
      label = slot.label;
      if (r.step === "done") { html = renderDone(r.opt); ann = def.annotation("done"); }
      else {
        const panelInner = def.render(r.step, App.state.opt[r.opt]); 
        html = getCenterPane() + `<aside class="vl-panel">${panelInner}</aside>`;
        ann = def.annotation(r.step);
      }
    }
    app.innerHTML = html;
    renderFacilitator(ann, label);
    
    // Restore scroll pos
    setTimeout(() => {
      const newPanelBody = document.querySelector('.vl-panel-body');
      if (newPanelBody) newPanelBody.scrollTop = scrollPos;
      
      const newCenterBody = document.querySelector('.vl-center');
      if (newCenterBody) newCenterBody.scrollTop = centerScrollPos;
    }, 0);
  }

  function renderFacilitator(ann, label) {
    const fac = document.getElementById("fac");
    if (!FACILITATOR || !ann) { fac.hidden = true; return; }
    fac.hidden = false; // Always render it, toggle logic can just minimize it
    fac.innerHTML = `
      <div class="fac-head">
        <div><i class="fa-solid fa-user-secret"></i> Facilitator: ${esc(label)}</div>
        <button class="link" data-action="fac-toggle">${App.state.facOpen ? 'Thu gọn' : 'Mở rộng'}</button>
      </div>
      ${App.state.facOpen ? `
        <div><strong>Expectation:</strong> ${esc(ann.expect)}</div>
        <div><strong>Watch for:</strong> ${esc(ann.watch)}</div>
        <div><strong style="color:#d93025">Do NOT explain:</strong> ${esc(ann.dontExplain)}</div>
      ` : ""}
    `;
  }

  /* ---------- EVENTS ---------- */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const a = el.dataset.action;
    const r = parseRoute();
    switch (a) {
      case "home": App.go("#/"); return;
      case "open": App.go(`#/${el.dataset.opt}`); return;
      case "toggle-lesson": App.state.showLesson = !App.state.showLesson; render(); return;
      case "fac-toggle": App.state.facOpen = !App.state.facOpen; render(); return;
      case "edit-again": App.go(`#/${el.dataset.opt}/${registry[el.dataset.opt].editStep}`); return;
      case "reset-all":
        if (window.confirm("Xóa mọi thay đổi ở tất cả phương án và quay về bối cảnh chung?")) {
          App.state = initState(); App.go("#/");
        }
        return;
      default:
        if (r.opt) {
          const res = registry[r.opt].handle(a, el.dataset, App.state.opt[r.opt]);
          if (res !== false) render();
        }
    }
  });

  document.addEventListener("input", (e) => {
    const el = e.target.closest("[data-field]");
    if (!el) return;
    const r = parseRoute();
    if (r.opt) registry[r.opt].input(el.dataset, el.value, App.state.opt[r.opt]);
  });

  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });
  window.addEventListener("DOMContentLoaded", () => { App.state = initState(); render(); });
})();