/* ==========================================================
   Tech Interview Hub — shared behaviour
   Pure vanilla JS, no build step: works as-is on GitHub Pages.
   ========================================================== */
(function () {
  "use strict";

  const TOPICS = [
    { href: "java.html", label: "Core Java" },
    { href: "java17.html", label: "Java 17" },
    { href: "java25.html", label: "Java 25" },
    { href: "java-versions.html", label: "8 vs 17 vs 25" },
    { href: "spring-boot.html", label: "Spring Boot" },
    { href: "jpa.html", label: "JPA" },
    { href: "hibernate.html", label: "Hibernate" },
    { href: "security-oauth2.html", label: "Security & OAuth2" },
    { href: "sso.html", label: "SSO" },
    { href: "angular.html", label: "Angular" },
    { href: "database.html", label: "Database" },
  ];

  /* ---------- Theme (applied early to avoid flash) ---------- */
  const THEME_KEY = "tih-theme";
  function getTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* ignore */ }
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.textContent = t === "light" ? "🌙" : "☀️";
  }
  const initialTheme = getTheme() ||
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", initialTheme);

  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
    setTheme(initialTheme);
    renderCodeBlocks();
    setupQA();
    setupToTop();
  });

  /* ---------- Header / footer ---------- */
  function currentPage() {
    const p = location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }

  function renderHeader() {
    const host = document.getElementById("site-header");
    if (!host) return;
    const page = currentPage();
    const links = TOPICS.map(function (t) {
      return '<a href="' + t.href + '"' + (t.href === page ? ' class="active"' : "") + ">" + t.label + "</a>";
    }).join("");
    host.className = "site-header";
    host.innerHTML =
      '<div class="container nav">' +
      '<a class="brand" href="index.html"><span class="brand-logo">&lt;/&gt;</span>Tech Interview Hub</a>' +
      '<button class="icon-btn menu-btn" id="menu-btn" aria-label="Open menu">☰</button>' +
      '<nav class="nav-links" id="nav-links">' + links + "</nav>" +
      '<button class="icon-btn" id="theme-toggle" aria-label="Toggle theme"></button>' +
      "</div>";
    document.getElementById("theme-toggle").addEventListener("click", function () {
      setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
    document.getElementById("menu-btn").addEventListener("click", function () {
      document.getElementById("nav-links").classList.toggle("open");
    });
  }

  function renderFooter() {
    const host = document.getElementById("site-footer");
    if (!host) return;
    host.className = "site-footer";
    host.innerHTML =
      '<div class="container">' +
      "<span>© " + new Date().getFullYear() + " Tech Interview Hub · Built for Java full-stack interview prep</span>" +
      '<span><a href="index.html">Home</a> · <a href="java-versions.html">Java versions</a> · <a href="#top">Back to top ↑</a></span>' +
      "</div>";
  }

  /* ---------- Code blocks ----------
     Authors write code inside <script type="text/plain" class="code" data-lang="java">…</script>
     so that generics like List<String> and HTML templates need no escaping. */
  function renderCodeBlocks() {
    document.querySelectorAll('script[type="text/plain"].code').forEach(function (s) {
      const lang = s.dataset.lang || "plaintext";
      const raw = s.textContent.replace(/^\n+|\s+$/g, "");
      const indent = Math.min.apply(null, raw.split("\n").filter(function (l) { return l.trim(); })
        .map(function (l) { return l.match(/^ */)[0].length; }));
      const text = raw.split("\n").map(function (l) { return l.slice(indent || 0); }).join("\n");

      const wrap = document.createElement("div");
      wrap.className = "code-wrap";
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.className = "language-" + lang;
      code.textContent = text;
      pre.appendChild(code);

      const label = document.createElement("span");
      label.className = "code-lang";
      label.textContent = lang;
      const copy = document.createElement("button");
      copy.className = "copy-btn";
      copy.type = "button";
      copy.textContent = "Copy";
      copy.addEventListener("click", function () {
        const done = function () { copy.textContent = "Copied!"; setTimeout(function () { copy.textContent = "Copy"; }, 1400); };
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done); else done();
      });

      wrap.appendChild(pre);
      wrap.appendChild(label);
      wrap.appendChild(copy);
      s.replaceWith(wrap);
      if (window.hljs) window.hljs.highlightElement(code);
    });
  }

  /* ---------- Q&A: numbering, search, TOC, expand/collapse ---------- */
  function setupQA() {
    const items = Array.prototype.slice.call(document.querySelectorAll("details.qa"));
    if (!items.length) return;

    items.forEach(function (d, i) {
      const s = d.querySelector("summary");
      const level = d.dataset.level;
      const id = d.id || "q" + (i + 1);
      d.id = id;
      s.innerHTML =
        '<span class="qnum">Q' + (i + 1) + "</span>" +
        '<span class="qtext">' + s.innerHTML + "</span>" +
        (level ? '<span class="level ' + level + '">' + level + "</span>" : "");
    });

    // Table of contents from groups
    const toc = document.getElementById("toc");
    if (toc) {
      let html = "<h4>On this page</h4>";
      document.querySelectorAll(".qa-group").forEach(function (g, i) {
        const h = g.querySelector("h2");
        if (!h) return;
        g.id = g.id || "section-" + (i + 1);
        html += '<a href="#' + g.id + '">' + h.textContent + "</a>";
      });
      toc.innerHTML = html;
    }

    const search = document.getElementById("search");
    const count = document.getElementById("count");
    const empty = document.getElementById("empty");
    function updateCount(n) { if (count) count.textContent = n + " of " + items.length + " questions"; }
    updateCount(items.length);

    if (search) {
      search.addEventListener("input", function () {
        const q = search.value.trim().toLowerCase();
        let shown = 0;
        items.forEach(function (d) {
          const match = !q || d.textContent.toLowerCase().indexOf(q) !== -1;
          d.classList.toggle("hidden", !match);
          if (match) shown++;
        });
        document.querySelectorAll(".qa-group").forEach(function (g) {
          g.classList.toggle("hidden", !g.querySelector("details.qa:not(.hidden)"));
        });
        if (empty) empty.classList.toggle("hidden", shown !== 0);
        updateCount(shown);
      });
    }

    const expand = document.getElementById("expand-all");
    const collapse = document.getElementById("collapse-all");
    if (expand) expand.addEventListener("click", function () { items.forEach(function (d) { d.open = true; }); });
    if (collapse) collapse.addEventListener("click", function () { items.forEach(function (d) { d.open = false; }); });

    // Deep-link: page.html#q5 opens that question
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target && target.matches("details.qa")) { target.open = true; target.scrollIntoView(); }
    }
  }

  function setupToTop() {
    const b = document.createElement("button");
    b.className = "to-top";
    b.setAttribute("aria-label", "Back to top");
    b.textContent = "↑";
    b.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.body.appendChild(b);
    window.addEventListener("scroll", function () { b.classList.toggle("show", window.scrollY > 600); });
  }
})();
