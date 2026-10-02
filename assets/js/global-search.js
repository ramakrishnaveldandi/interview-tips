/* ==========================================================
   Global search on the home page.
   Data: window.SEARCH_INDEX from assets/js/search-index.js
   (regenerate with: node tools/build-search-index.js)
   ========================================================== */
(function () {
  "use strict";

  const LEVEL_ORDER = { easy: 0, medium: 1, hard: 2 };
  const PAGE_SIZE = 40;

  document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("global-search");
    const data = window.SEARCH_INDEX;
    if (!root) return;
    if (!data) { root.querySelector(".gs-hint").textContent = "Search index not found — run node tools/build-search-index.js"; return; }

    const input = root.querySelector("#gs-input");
    const levelBtns = Array.prototype.slice.call(root.querySelectorAll("[data-level-filter]"));
    const interviewBtn = root.querySelector("#gs-interview");
    const codingBtn = root.querySelector("#gs-coding");
    const topicSelect = root.querySelector("#gs-topic");
    const clearBtn = root.querySelector("#gs-clear");
    const results = root.querySelector("#gs-results");
    const summary = root.querySelector("#gs-summary");
    const hint = root.querySelector(".gs-hint");

    const topicName = {};
    data.topics.forEach(function (t) { topicName[t.file] = t.topic; });

    // Topic dropdown with question counts
    const perTopic = {};
    data.items.forEach(function (i) { perTopic[i.p] = (perTopic[i.p] || 0) + 1; });
    data.topics.slice().sort(function (a, b) { return a.topic.localeCompare(b.topic); }).forEach(function (t) {
      const o = document.createElement("option");
      o.value = t.file;
      o.textContent = t.topic + " (" + (perTopic[t.file] || 0) + ")";
      topicSelect.appendChild(o);
    });

    // Pre-compute lowercase search fields once
    const docs = data.items.map(function (i) {
      return {
        item: i,
        q: i.q.toLowerCase(),
        meta: (topicName[i.p] + " " + i.c + " " + i.s + " " + (i.x || "")).toLowerCase(),
        a: i.a.toLowerCase()
      };
    });

    const state = { q: "", levels: new Set(), interview: false, coding: false, topic: "", limit: PAGE_SIZE };

    // ---- URL state (?q=…&level=easy,hard&interview=1&topic=java.html) so searches can be shared
    function readUrl() {
      const p = new URLSearchParams(location.search);
      state.q = p.get("q") || "";
      (p.get("level") || "").split(",").filter(Boolean).forEach(function (l) { state.levels.add(l); });
      state.interview = p.get("interview") === "1";
      state.coding = p.get("coding") === "1";
      state.topic = p.get("topic") || "";
    }
    function writeUrl() {
      const p = new URLSearchParams();
      if (state.q) p.set("q", state.q);
      if (state.levels.size) p.set("level", Array.from(state.levels).join(","));
      if (state.interview) p.set("interview", "1");
      if (state.coding) p.set("coding", "1");
      if (state.topic) p.set("topic", state.topic);
      const qs = p.toString();
      try { history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash); } catch (e) { /* file:// in some browsers */ }
    }

    function syncControls() {
      input.value = state.q;
      levelBtns.forEach(function (b) {
        const on = state.levels.has(b.dataset.levelFilter);
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      interviewBtn.classList.toggle("active", state.interview);
      interviewBtn.setAttribute("aria-pressed", String(state.interview));
      codingBtn.classList.toggle("active", state.coding);
      codingBtn.setAttribute("aria-pressed", String(state.coding));
      topicSelect.value = state.topic;
    }

    // ---- Matching & ranking
    function tokens(q) { return q.toLowerCase().split(/\s+/).filter(Boolean); }

    function score(d, toks, phrase) {
      let s = 0;
      for (let k = 0; k < toks.length; k++) {
        const t = toks[k];
        const inQ = d.q.indexOf(t);
        if (inQ !== -1) s += 10 + (inQ === 0 || /\W/.test(d.q.charAt(inQ - 1)) ? 4 : 0);
        else if (d.meta.indexOf(t) !== -1) s += 4;
        else if (d.a.indexOf(t) !== -1) s += 1;
        else return -1;                       // every word must appear somewhere
      }
      if (phrase && d.q.indexOf(phrase) !== -1) s += 25;
      return s;
    }

    function search() {
      const toks = tokens(state.q);
      const phrase = toks.length > 1 ? state.q.toLowerCase().trim() : "";
      const out = [];
      for (let i = 0; i < docs.length; i++) {
        const d = docs[i], it = d.item;
        if (state.levels.size && !state.levels.has(it.l)) continue;
        if (state.interview && !it.t) continue;
        if (state.coding && !it.k) continue;
        if (state.topic && it.p !== state.topic) continue;
        const s = toks.length ? score(d, toks, phrase) : 0;
        if (s < 0) continue;
        out.push({ d: d, s: s });
      }
      out.sort(function (x, y) {
        return (y.s - x.s) ||
          ((LEVEL_ORDER[x.d.item.l] || 0) - (LEVEL_ORDER[y.d.item.l] || 0)) ||
          topicName[x.d.item.p].localeCompare(topicName[y.d.item.p]);
      });
      return { list: out, toks: toks };
    }

    // ---- Rendering
    function esc(s) {
      return s.replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
    }
    function highlight(str, toks) {
      let html = esc(str);
      if (!toks.length) return html;
      const re = new RegExp("(" + toks.map(function (t) { return esc(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")", "gi");
      return html.replace(re, "<mark>$1</mark>");
    }
    function excerpt(a, toks) {
      if (!a) return "";
      let at = 0;
      const lower = a.toLowerCase();
      for (let k = 0; k < toks.length; k++) {
        const i = lower.indexOf(toks[k]);
        if (i !== -1) { at = Math.max(0, i - 60); break; }
      }
      if (at > 0) {                                   // start at a word boundary, not mid-word
        const space = a.indexOf(" ", at);
        if (space !== -1 && space - at < 20) at = space + 1;
      }
      const cut = a.slice(at, at + 190);
      return (at > 0 ? "…" : "") + cut + (at + 190 < a.length ? "…" : "");
    }

    function render() {
      const active = state.q.trim() || state.levels.size || state.interview || state.coding || state.topic;
      clearBtn.classList.toggle("hidden", !active);
      if (!active) {
        results.innerHTML = "";
        summary.textContent = "";
        hint.classList.remove("hidden");
        return;
      }
      hint.classList.add("hidden");
      const r = search();
      const total = r.list.length;
      summary.textContent = total + (total === 1 ? " question" : " questions") +
        (total ? (function (n) { return " across " + n + (n === 1 ? " topic" : " topics"); })(new Set(r.list.map(function (x) { return x.d.item.p; })).size) : "");

      if (!total) {
        results.innerHTML = '<p class="empty">No questions match. Try fewer words or remove a filter.</p>';
        return;
      }

      const html = r.list.slice(0, state.limit).map(function (x) {
        const it = x.d.item;
        return '<a class="gs-result" href="' + it.p + "#" + it.id + '">' +
          '<div class="gs-meta">' +
            '<span class="gs-topic">' + esc(topicName[it.p]) + "</span>" +
            (it.c ? '<span class="gs-section">' + esc(it.c) + "</span>" : "") +
            (it.l ? '<span class="level ' + it.l + '">' + it.l + "</span>" : "") +
            (it.t ? '<span class="tag-interview">🎯 Interview</span>' : "") +
            (it.k ? '<span class="tag-coding">💻 Coding</span>' : "") +
            (it.s ? '<span class="gs-source">' + esc(it.s) + "</span>" : "") +
          "</div>" +
          '<div class="gs-q">' + highlight(it.q, r.toks) + "</div>" +
          (it.x ? '<div class="gs-cx">⏱️ ' + highlight(it.x, r.toks) + "</div>" : "") +
          '<div class="gs-a">' + highlight(excerpt(it.a, r.toks), r.toks) + "</div>" +
        "</a>";
      }).join("");

      results.innerHTML = html + (total > state.limit
        ? '<button type="button" class="tool-btn gs-more" id="gs-more">Show more (' + (total - state.limit) + " remaining)</button>"
        : "");
      const more = document.getElementById("gs-more");
      if (more) more.addEventListener("click", function () { state.limit += PAGE_SIZE; render(); });
    }

    function update() { state.limit = PAGE_SIZE; writeUrl(); render(); }

    // ---- Events
    let timer;
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () { state.q = input.value; update(); }, 120);
    });
    levelBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        const l = b.dataset.levelFilter;
        if (state.levels.has(l)) state.levels.delete(l); else state.levels.add(l);
        syncControls(); update();
      });
    });
    interviewBtn.addEventListener("click", function () { state.interview = !state.interview; syncControls(); update(); });
    codingBtn.addEventListener("click", function () { state.coding = !state.coding; syncControls(); update(); });
    topicSelect.addEventListener("change", function () { state.topic = topicSelect.value; update(); });
    clearBtn.addEventListener("click", function () {
      state.q = ""; state.levels.clear(); state.interview = false; state.coding = false; state.topic = "";
      syncControls(); update(); input.focus();
    });
    // Press "/" anywhere to jump to the search box
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== input && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault(); input.focus();
      }
    });

    root.querySelector("#gs-total").textContent = data.items.length;
    readUrl();
    syncControls();
    render();
  });
})();
