# SkillHuoke V1.6 Runtime Layering Design

## Goal

Upgrade SkillHuoke V1.6 from version-file accumulation into a clearer runtime-layered project. The app should keep the existing user-facing workflow stable while establishing one main frontend program, one main backend program, and a shared business-rules layer.

The chosen structure is:

- Frontend layer: browser workbench, UI state, rendering, user actions.
- Backend layer: local APIs, search providers, contact parsing, batch lead tasks.
- Shared rules layer: lead model, dedupe, scoring, search strategy, outreach rules.

## Current Context

The current active project is `SkillHuoke`. It already contains V1.6 beta metadata in `package.json`, but the code still reflects earlier iteration growth:

- `src/app.js` is the frontend orchestration file and contains initial lead data, storage, rendering, workflow, CRM edits, search candidates, CSV import/export, and event binding.
- `src/v02-tools.js` through `src/v12b-search.js` preserve feature evolution by version name.
- `server/search-server.mjs` is the backend entrypoint and also handles static serving, API routing, env loading, search service construction, and error translation.
- `server/*.mjs` contains search, contact parsing, lead quality, proxy fetch, and batch workflow logic.

V1.6 should not add another version-named tool file. It should make the project easier to understand and extend.

## Target Directory Structure

```text
SkillHuoke/
  index.html
  package.json
  README.md
  src/
    main.js
    index.html
    styles.css
    app/
      bootstrap.js
      dom.js
      state.js
      render.js
      events.js
    features/
      workflow/
      search/
      leads/
      crm/
      outreach/
      import-export/
    shared/
      csv.js
      storage.js
      text.js
      constants.js
  server/
    main.mjs
    api/
      routes.mjs
      errors.mjs
    services/
      search-service.mjs
      contact-parser.mjs
      lead-quality.mjs
      batch-workflow.mjs
      proxy-fetch.mjs
    config/
      env.mjs
  shared/
    lead-model.mjs
    lead-dedupe.mjs
    lead-scoring.mjs
    search-strategy.mjs
    outreach-rules.mjs
  tests/
    frontend/
    server/
    shared/
```

The existing files may remain temporarily as compatibility shims during migration, but new V1.6 behavior should live in the layered structure.

## Main Programs

### Frontend Main Program

`src/main.js` is the browser entrypoint loaded by `src/index.html`.

Responsibilities:

- Initialize application state from demo leads and local storage.
- Collect DOM references.
- Bind UI events.
- Dispatch user actions to feature modules.
- Trigger rendering after state changes.

It should not contain business scoring rules, CSV parsing internals, search result normalization, or large HTML templates.

### Backend Main Program

`server/main.mjs` is the local backend entrypoint used by `npm start`.

Responsibilities:

- Load `.env`.
- Create configured fetch and search services.
- Register `/api/health`, `/api/search`, and `/api/batch-search`.
- Serve static frontend assets.
- Start the local HTTP server.

It should not contain provider-specific search logic, contact parsing, lead scoring, or batch-task internals.

## Feature Mapping

### `src/features/workflow`

Covers:

- Input product, country, customer type, and quantity.
- Generate search keywords.
- Display workflow running steps.
- Generate Google, LinkedIn, Facebook, and TikTok public search instructions.
- Show source types and verification rules.

### `src/features/leads`

Covers:

- Generate and maintain the lead pool table.
- Show company website, country, city, customer type, and source link.
- Show WhatsApp, phone, email, and LinkedIn status.
- Show AI matching score and priority.
- Show data quality, missing fields, and suggested actions.
- Support tags and follow-up timeline.
- Dedupe by website or company name plus country while preserving CRM state.
- Add search candidates and manual leads to the same lead pool.

### `src/features/crm`

Covers:

- CRM status.
- Follow-up notes.
- Local browser persistence.
- Follow-up record timeline events.

### `src/features/outreach`

Covers:

- English development email generation.
- WhatsApp opener generation.
- First outreach, second follow-up, and quote invitation templates.
- Natural English opening judgment.
- Product wording cleanup so Chinese product terms do not leak into English copy.

### `src/features/import-export`

Covers:

- Export the currently filtered lead CSV.
- Export Chinese-field CSV for Excel.
- Manual real-customer entry.
- Import real customer lists saved from Excel as CSV.
- Prompt users to verify fields that need manual checking.

### `src/features/search`

Covers:

- Frontend test entry for Google Custom Search, Bing, and SerpAPI.
- Search results candidate pool.
- One-click add candidate to lead pool and mark as search discovered.
- Show search failures and backend/API-key guidance.
- Display recommendation reasons, risk warnings, and next follow-up actions.
- One-click add all accepted batch candidates to CRM.

## Backend Services

### `server/api`

Defines route handling and response formatting. API routes should stay thin and delegate work to services.

Required endpoints:

- `GET /api/health`
- `POST /api/search`
- `POST /api/batch-search`

### `server/services`

Service modules handle actual backend work:

- Search provider selection and fallback: SerpAPI first, Bing second, Google last by default.
- Public website, contact page, and about page parsing.
- Public email, phone, instant messaging, and LinkedIn extraction.
- Windows proxy and `SKILLHUOKE_PROXY` support.
- Batch lead task queue by product, country, and customer type.
- Task status, discovered count, filtered count, dedupe count, and failure reason tracking.

## Shared Rules

Root `shared/` is for rules that may be used by frontend and backend:

- Lead model and field normalization.
- Website/domain and company-country dedupe keys.
- Customer authenticity score.
- Contact confidence score.
- Customer grade and recommendation conclusion.
- Noise detection for social posts, directories, and weak results.
- Development action suggestion:
  - prioritize outreach
  - verify before outreach
  - complete missing data
  - pause outreach
- Recommended contact roles by customer type:
  - Owner
  - Procurement
  - Project
  - Design
  - Sourcing
- Risk-based next actions:
  - website form
  - LinkedIn people search
  - WhatsApp verification
  - email verification

## Migration Strategy

Use a staged migration so the V1.6 app remains runnable after each step.

1. Add shared rule modules and tests for dedupe, scoring, search strategy, and outreach rule behavior.
2. Add backend `main.mjs`, `api/`, `services/`, and `config/` folders while preserving existing API behavior.
3. Add frontend `main.js`, `app/`, and `features/` folders.
4. Move pure functions out of `src/app.js` into feature modules.
5. Update `src/index.html` script loading to use `src/main.js`.
6. Keep compatibility wrappers only where needed for existing tests.
7. Update `package.json` scripts to point at new main files and test folders.
8. Update README project structure and V1.6 notes.

## Testing

Tests should cover behavior before production code moves:

- Shared lead dedupe preserves existing CRM status and follow-up notes.
- Shared scoring generates A/B/C/D grades and lowers social/directory noise.
- Search strategy generates Google, LinkedIn, Facebook, TikTok, source types, and verification rules.
- Backend health, search, and batch-search endpoints keep the same response shape.
- Frontend import/export keeps Chinese CSV fields and manual leads in the same pool.
- Frontend main bootstraps without console syntax errors.

## Out Of Scope For V1.6

- Cloud database.
- Login and team permissions.
- Automatic email or WhatsApp sending.
- Full Next.js migration.
- Paid API production deployment.
- Replacing the whole UI in one pass.

## Acceptance Criteria

- `npm test` passes.
- `npm run check` passes.
- `npm start` serves the app and reports V1.6.
- The browser workbench still supports the existing V0.1 to V1.5 feature set.
- The project has clear main programs: `src/main.js` and `server/main.mjs`.
- New folders make it obvious where workflow, leads, CRM, search, outreach, import/export, backend services, and shared business rules live.
