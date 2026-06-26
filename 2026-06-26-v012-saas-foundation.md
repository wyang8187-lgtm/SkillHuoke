# v0.12 SaaS Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the visible SaaS foundation for company workspaces, mode separation, quota display, and future data isolation.

**Architecture:** Create a small workspace metadata module used by layout, sidebar, dashboard, settings, and dashboard API. Keep all database behavior unchanged while exposing `workspaceId` as the next contract.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, lucide-react, existing UI Card/Badge/Button components.

---

### Task 1: Workspace Metadata

**Files:**
- Create: `src/lib/workspace.ts`
- Modify: `src/app/api/dashboard/stats/route.ts`

- [ ] Define a demo workspace object with id, name, mode, plan, quota, owner role, and isolation status.
- [ ] Add workspace metadata to the dashboard stats API response.
- [ ] Run `corepack pnpm run ts-check`.

### Task 2: Shell SaaS Indicators

**Files:**
- Modify: `src/components/layout/main-layout.tsx`
- Modify: `src/components/layout/sidebar.tsx`

- [ ] Show workspace name and SaaS mode in desktop and mobile headers.
- [ ] Show workspace/plan in the sidebar user area.
- [ ] Keep existing mobile navigation and global search behavior.

### Task 3: Dashboard SaaS Banner

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] Add a SaaS foundation banner with workspace, plan, quota, and data isolation status.
- [ ] Keep existing charts, tasks, recommendations, and recent activities.

### Task 4: Settings SaaS Page

**Files:**
- Modify: `src/app/settings/page.tsx`

- [ ] Replace mojibake settings text with clean Chinese.
- [ ] Add company profile, current plan, usage quota, API status, and data isolation cards.
- [ ] Keep links to personal, API keys, team, params, and data pages.

### Task 5: Release Packaging

**Files:**
- Modify: `package.json`
- Modify: `README.md`

- [ ] Bump version to `0.12.0`.
- [ ] Update README release notes.
- [ ] Run `corepack pnpm run ts-check`, `corepack pnpm run lint:build`, and `corepack pnpm run build`.
- [ ] Generate `AI-Lead-Platform-v0.12.0-OpenSource.zip`.
