# Tech Interview Hub

A fast, static website of interview questions with answers and code examples for Java full-stack developers.

| Page | Topic |
|---|---|
| `index.html` | Home page with links to every topic |
| `java.html` | Core Java: OOP, collections, concurrency, JVM, Java 8 |
| `java17.html` | Java 17 LTS features |
| `java25.html` | Java 25 LTS features |
| `java-versions.html` | Java 8 vs 17 vs 25: comparison and migration |
| `spring-boot.html` | Spring Boot |
| `jpa.html` | JPA / Spring Data JPA |
| `hibernate.html` | Hibernate |
| `security-oauth2.html` | Spring Security, JWT, OAuth2 |
| `sso.html` | SSO with OIDC / SAML (Keycloak, Okta, Entra ID) |
| `angular.html` | Angular (signals, RxJS, routing, forms) |
| `database.html` | SQL and database design |

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
