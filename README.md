# Tech Interview Hub

A fast, static website of interview questions with answers and code examples for Java full-stack developers.

| Page | Topic |
|---|---|
| `index.html` | Home page with links to every topic |
| `java.html` | Core Java: OOP, collections, thread pools, virtual threads, JVM, coding |
| `java-streams.html` | Java Streams & parallel streams with coding questions |
| `java17.html` | Java 17 LTS features |
| `java25.html` | Java 25 LTS features |
| `java-versions.html` | Java 8 vs 17 vs 25: comparison and migration |
| `spring-boot.html` | Spring Boot |
| `jpa.html` | JPA / Spring Data JPA |
| `hibernate.html` | Hibernate |
| `security-oauth2.html` | Spring Security, JWT, OAuth2, OWASP Top 10:2025 |
| `sso.html` | SSO with OIDC / SAML (Keycloak, Okta, Entra ID) |
| `angular.html` | Angular (signals, RxJS, routing, forms) |
| `database.html` | SQL and database design |
| `ai-claude-code.html` | AI basics and Claude Code 101 (CLAUDE.md, hooks, skills, MCP) |

Features: dark/light theme, live search on each page, expand/collapse all, difficulty tags, copy buttons on code,
syntax highlighting, deep links (`java17.html#q3`), works on mobile and prints cleanly.

**No build step.** It's plain HTML, CSS and JavaScript, so GitHub Pages serves it as-is.

## Run locally

Open `index.html` in a browser, or start a local server:

```bash
python -m http.server 8080      # then open http://localhost:8080
```

## Deploy to GitHub Pages

```bash
git add .
git commit -m "Add interview hub site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then choose **one** of these options:

- **Option A: GitHub Actions** (the workflow is already in `.github/workflows/pages.yml`).
  Go to repo **Settings → Pages → Build and deployment → Source: GitHub Actions**. Every push to `main` deploys the site.
- **Option B: Deploy from a branch.** Go to **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.

The site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Adding a question

Copy any `<details class="qa">` block in a page. Questions are numbered automatically and the table of contents is
built from the `<h2>` of each `qa-group`. Put code inside a plain-text script tag so you don't need to escape `<` and `>`:

```html
<details class="qa" data-level="medium">
  <summary>Your question?</summary>
  <div class="answer">
    <p>Your answer.</p>
    <script type="text/plain" class="code" data-lang="java">
      List<String> names = List.of("a", "b");
    </script>
  </div>
</details>
```

## Versioning: what is deployed?

Every page footer shows **🕒 Last updated: &lt;date&gt;** and a build badge.
On the live site, "Last updated" is the date of the latest commit that is deployed.
Locally (or when deployed from a branch), it is the page file's modified time.


| Badge | Meaning |
|---|---|
| 🟢 `v1.3.0 · Deployed build #7 · a1b2c3d · deployed <date>` | Live on GitHub Pages; the hash links to the deployed commit |
| 🟠 `Deployed from branch (no build info)` | Pages source is "Deploy from a branch"; switch it to **GitHub Actions** to get build info |
| ⚪ `Local preview — not deployed` | You're viewing your local copy |

- **What's not live yet?** Click **"changes since this deploy"** in the live footer. It opens GitHub's compare view
  of every commit on `main` after the deployed one (empty means you're up to date).
- **From the terminal:** compare the live commit with your local history:
  ```bash
  curl -s https://ramakrishnaveldandi.github.io/interview-tips/version.json   # deployed commit
  git log --oneline -1 origin/main                                            # last pushed commit
  git log --oneline origin/main..main                                         # committed locally, not pushed yet
  git status --short                                                          # changed but not committed
  ```
- **Release a version:** bump `"version"` in `version.json`, add a line to `CHANGELOG.md`, then commit and push.
  The workflow fills in the commit, build number and date automatically. Leave `"env": "local"` in the committed file.
