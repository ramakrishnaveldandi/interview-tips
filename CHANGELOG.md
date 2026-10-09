# Changelog

Bump `"version"` in `version.json` and add an entry here whenever you publish a change.
The live site's footer shows this version plus the exact commit that is deployed.

## 1.11.0 — 2026-10-10
- Imported 9thoct.zip (12 screenshots: 20 scenario-based interview questions + an OOP concepts carousel).
  9 new 🎯 Interview questions: API returning 500s, works locally but fails in production (Spring Boot);
  source vs target record-count mismatch (Database); plain-text passwords, sudden 401 spike (Security);
  critical bug before release, teammate not delivering, unknown task, new technology (Behavioral — new
  "Learning & problem-solving" section). 7 existing questions tagged 🎯 Interview; OOP slides already covered.

## 1.10.0 — 2026-10-06
- Imported new_attachments.zip (core-java, interview and java-version-differences Q&A files, 130 questions):
  60 new questions added to the matching pages, duplicates merged instead of repeated, 27 existing questions tagged 🎯 Interview.
- Core Java: new sections Strings, Generics, Inner classes/enums/annotations, Serialization & I/O, Design patterns & immutability,
  Predict the output; additions to OOP, Exceptions, Iteration, Concurrency, JVM internals and Coding questions.
- Java 17 / 25 / versions / streams: var, String & HttpClient APIs, parallel streams vs virtual threads, gatherer anatomy,
  PermGen→Metaspace, corrected feature-finalisation table, functional interfaces, forEach vs for-each.
- Spring/JPA/Hibernate/DB: REST vs SOAP, scenario & design questions, save vs saveAndFlush vs flush, EntityGraph, e-Tendering schema.
- Factual errors in the source files corrected (preview/final versions, removals, Q42 CME behaviour, gatherer outputs…);
  all Java outputs verified on JDK 25.
- Global search ignores filler words ("REST vs SOAP" now matches).

## 1.9.0 — 2026-10-03
- Spring Boot: new "Idempotent vs non-idempotent operations" section (6 questions) — safe vs idempotent HTTP methods,
  Idempotency-Key implementation for payments, idempotent Kafka consumers, idempotent SQL (upserts, guarded updates),
  retries + timeouts + backoff.
- Core Java: new "Fail-fast vs fail-safe" section (5 questions) replacing the short version — iterator internals
  (modCount / expectedModCount), snapshot vs weakly consistent, single-thread CME trap, fail-fast design principle,
  fail-fast vs fail-safe vs fail-open in distributed systems. Java outputs verified on JDK 25.

## 1.8.0 — 2026-10-02
- New 💻 Coding tag on 69 coding questions across Core Java, Streams, Spring Boot, Security, Database (SQL) and Angular.
- ⏱️ Time/space complexity shown on 58 of them (algorithmic and concurrency problems); searchable, e.g. "O(n log n)".
- Home-page global search: 💻 Coding filter (combines with level, 🎯 Interview and topic); topic pages get "💻 Coding only".
- Questions can now carry several tags (data-tag="interview coding").

## 1.7.0 — 2026-10-02
- Home page: global search across all 493 questions on every page, with Easy / Medium / Hard,
  🎯 Interview and topic filters, highlighted matches, shareable URLs and "/" keyboard shortcut.
  Results deep-link to the exact question. Index built by tools/build-search-index.js (also in the deploy workflow).

## 1.6.0 — 2026-10-02
- New page: Behavioral & HR — 36 questions reported from JPMorgan Chase, Goldman Sachs, Salesforce and Deloitte
  (answer frameworks + sample STAR answers) and 10 questions to ask the interviewer.
- 🎯 Interview tag: 96 questions tagged (badge, company source line, "Interview questions only" filter).
- Spring Boot: 16 new essentials questions (Spring core, REST, validation, DTOs, logging, @Async, @Scheduled, best practices);
  JPA: repository interfaces; Security: end-to-end JWT filter flow with 401/403 handling.
- "🧠 How this works" step-by-step explanation under all 375 code examples.
- Fixes: Hibernate batch flush condition; JWT example now returns 401 (not the default 403) for missing/invalid tokens.

## 1.5.0 — 2026-10-02
- Core Java: replaced the short Collections section with an in-depth Collections Framework guide (28 questions):
  hierarchy, complexity, List/Set/Map/Queue implementations, HashMap internals, ConcurrentHashMap internals,
  HashMap vs ConcurrentHashMap, BlockingQueues (LinkedBlockingQueue vs ArrayBlockingQueue), immutability, Sequenced Collections.

## 1.4.0 — 2026-10-02
- Core Java: thread pools & ExecutorService deep dive, virtual threads (Java 21 → 25), 11 thread-pool coding questions.
- New page: Java Streams & parallel streams (concepts + 31 coding questions with real outputs).
- New page: AI & Claude Code 101 (CLAUDE.md, CLAUDE.local.md, permissions, hooks, skills, subagents, MCP).
- Security: OWASP Top 10:2025 and OWASP API Security Top 10 with vulnerable code and fixes.

## 1.3.0 — 2026-10-02
- Footer shows "Last updated" with the date of the latest content commit.

## 1.2.0 — 2026-10-02
- Footer shows the version, deploy build number, live commit and a "changes since this deploy" link.

## 1.1.0 — 2026-10-02
- Added Core Java coding questions (11) and Spring Boot coding questions (9).

## 1.0.0 — 2026-10-02
- First release: home page and 11 topic pages, 247 questions.
