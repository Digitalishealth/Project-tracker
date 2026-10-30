# Project tracker agent guide

This is the maintained policy for the local React/Vite project tracker with dashboard, table, Kanban and Gantt views.

## Map and commands

`src/App.jsx` and `src/components` implement the interface; `src/hooks/useProjects.js` manages project state; `src/utils/storage.js` persists browser-local data and imports/exports; `src/data/seedData.js` provides initial examples; `src/constants` contains enums; `src/utils/icsExport.js` exports calendar data.

Use npm and `package-lock.json`: `npm run dev`, `npm run build`, `npm run lint`, `npm run preview`. There is no declared test or typecheck script; report this gap. Inspect `vite.config.js` before changing single-file packaging. Do not hand-edit `dist` or mistake committed output for a current verified build.

## Data boundaries

Preserve project IDs, dates, status/priority semantics, import/export integrity and browser persistence. Imported JSON replaces project state; do not test with a user's live browser data or silently reset it to seeds. Keep project/client notes, personal information and secrets out of seed fixtures, logs and shared exports. Local storage is not authenticated multi-user storage or a durable backup. Adding cloud sync, tenancy, external calendars or automatic sharing changes privacy and authority boundaries and requires explicit task scope. Verify affected views and keyboard/responsive interactions for UI changes; build/lint alone do not prove those behaviours.

## Working agreement

Inspect current code, manifests and relevant task documents before editing. Complete the authorised task, including routine fixes and proportionate verification; carry forward prior approval without repeatedly asking. Delegate only bounded, independent work when useful, with explicit scope and authority. Stop at the requested scope. New spend, external writes, migrations, release, merge or deployment require applicable explicit authority; a plan or tool access does not grant it.

Keep changes small and reversible. Protect secrets, privacy, tenant isolation, access controls and audit integrity. Never use `any` for clinical, audit, tenant, identity or access-control data. Use synthetic or sanitised examples. Report changed files, checks passed, checks not run and residual risks. Distinguish implemented, release-ready and released using evidence for each. For documentation-only edits, verify paths, commands and `git diff --check`; do not install dependencies or run full application suites without a task-relevant reason.
