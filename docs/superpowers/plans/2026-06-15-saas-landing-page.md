# SaaS Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished SkillHuoke SaaS landing page that leads into the existing trial workspace without breaking the current MVP.

**Architecture:** Keep the existing static HTML/CSS/JS architecture. Add a marketing landing layer above the current `app-shell`, reuse the existing workspace IDs and scripts, and mirror markup between the root GitHub Pages entrypoint and the local `src` entrypoint.

**Tech Stack:** Static HTML, CSS, existing browser JavaScript, Node test scripts.

---

### Task 1: Lock Landing Page Requirements With Tests

**Files:**
- Modify: `src/github-pages.test.mjs`

- [ ] **Step 1: Add assertions for the landing page shell**

Add checks for `Skill获客`, `把外贸找客户变成可运行的 AI 工作流`, `开始试运营`, `查看工作台`, and `id="trial"`.

- [ ] **Step 2: Run test to verify it fails before implementation**

Run: `node src/github-pages.test.mjs`
Expected: FAIL because the new landing shell is not in `index.html` yet.

### Task 2: Add Landing Page Markup

**Files:**
- Modify: `index.html`
- Modify: `src/index.html`

- [ ] **Step 1: Add hero, workflow, trust, outreach, and trial CTA sections**

Add the approved SaaS landing page before the existing app workspace. Keep all existing form, table, detail, and script IDs unchanged.

- [ ] **Step 2: Preserve two entrypoint path models**

Keep root scripts/styles prefixed with `./src/`. Keep `src/index.html` scripts/styles local with `./`.

### Task 3: Restyle the Experience

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Add landing design tokens and responsive sections**

Use true white, teal, graphite, and restrained cobalt. Avoid decorative orbs, nested cards, and large rounded elements.

- [ ] **Step 2: Adapt the existing workspace into a trial product section**

Keep the workspace compact, scannable, and practical; improve header/sidebar behavior under the landing page.

### Task 4: Verify and Serve

**Files:**
- Existing test suite and local browser output

- [ ] **Step 1: Run checks**

Run: `npm run check` and `npm test`.

- [ ] **Step 2: Run the local server**

Run: `npm run start:static` or `npm start`, depending on whether backend search is needed.

- [ ] **Step 3: Inspect in browser**

Open the local URL, verify desktop and mobile layout, CTA anchor behavior, existing workspace rendering, and absence of obvious overflow.
