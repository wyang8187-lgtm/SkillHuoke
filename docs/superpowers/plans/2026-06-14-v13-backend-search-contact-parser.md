# V1.3 Backend Search And Contact Parsing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local backend search API that keeps API keys off the front end and parses public website contact pages for email, phone, WhatsApp, and LinkedIn clues.

**Architecture:** Add focused server modules under `server/`: `contact-parser.mjs` extracts contact data from public HTML, `search-service.mjs` calls Google/Bing/SerpAPI and enriches results, and `search-server.mjs` serves both static files and `/api/search`. The existing front end keeps static GitHub Pages mode but calls the backend when available.

**Tech Stack:** Node.js built-in `http`, `fs`, `path`, URL APIs, built-in `fetch`, plain browser JavaScript, existing no-build static app.

---

### Task 1: Contact Parser

**Files:**
- Create: `server/contact-parser.mjs`
- Create: `server/contact-parser.test.mjs`

- [ ] Write failing tests for extracting email, phone, WhatsApp, LinkedIn, and likely contact links from public HTML.
- [ ] Implement minimal extraction helpers.
- [ ] Run parser tests until green.

### Task 2: Backend Search Service

**Files:**
- Create: `server/search-service.mjs`
- Create: `server/search-service.test.mjs`
- Modify: `src/v12b-search.mjs` only if shared behavior is needed.

- [ ] Write failing tests with fake `fetch` for provider URL construction, backend result normalization, Contact-page enrichment, and missing API key errors.
- [ ] Implement provider calls and enrichment using dependency injection for fetch.
- [ ] Run service tests until green.

### Task 3: HTTP Server

**Files:**
- Create: `server/search-server.mjs`
- Modify: `scripts/serve.mjs`
- Modify: `package.json`

- [ ] Add local `/api/search` endpoint accepting POST JSON.
- [ ] Serve existing static `src/` files from the same server.
- [ ] Add npm scripts `start` and `start:static` so V1.3 local run uses backend by default.

### Task 4: Frontend Integration

**Files:**
- Modify: `src/index.html`
- Modify: `index.html`
- Modify: `src/app.js`
- Modify: `src/styles.css`
- Modify: `src/github-pages.test.mjs`

- [ ] Change version label to V1.3.
- [ ] Update search UI copy so API keys are configured on backend.
- [ ] Change `runInternetSearch()` to call `/api/search`, with fallback messaging when opened as static file or GitHub Pages.
- [ ] Show parsed contact fields and parse status in search result cards.
- [ ] Preserve one-click add to customer pool.

### Task 5: Docs And Upload Package

**Files:**
- Modify: `README.md`
- Create upload folder: `C:\Users\w2775\Documents\找客\SkillHuoke-V1.3-Upload`

- [ ] Document backend environment variables and run command.
- [ ] Run all tests and syntax checks.
- [ ] Verify localhost page structure.
- [ ] Create upload folder and ZIP.
