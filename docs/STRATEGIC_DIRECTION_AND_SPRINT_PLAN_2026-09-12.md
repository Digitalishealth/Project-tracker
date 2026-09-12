# Project Tracker — Strategic Direction and Sprint Plan

**Date:** 12 September 2026  
**Status:** Consolidation candidate

## Decision

**Do not maintain this as a separate Digitalis operating system.** Its useful UI patterns — dashboard, table, Kanban, Gantt, progress/status controls and export — should be migrated into DigitalisOS where projects, CRM, finance and operating evidence can share one controlled source of truth.

Because this repository is public, do not seed it with confidential Digitalis portfolio, client or financial data.

## Sprint PTR-01 — Feature Extraction and Retirement

**Cadence:** 2 weeks

| ID | Work item | Acceptance evidence |
|---|---|---|
| PTR01-01 | Inventory unique tracker capabilities | Keep/migrate/drop table for dashboard, Kanban, Gantt, CSV, progress and filters |
| PTR01-02 | Map data model to DigitalisOS | Project/status/date/progress/bucket fields reconciled; canonical owner defined |
| PTR01-03 | Identify reusable UI components | Component/design tokens portable without localStorage coupling or sensitive sample data |
| PTR01-04 | Reproduce highest-value views in DigitalisOS | Functional parity for agreed dashboard/table/board slice |
| PTR01-05 | Define migration/export path | Existing localStorage/CSV data can be imported or deliberately discarded with backup |
| PTR01-06 | Remove sensitive sample/internal data risk | Public-history scan and safe synthetic fixtures only |
| PTR01-07 | Normalise branch/release status | Current Claude default branch no longer implies an active standalone product |
| PTR01-08 | Archive decision | README points to DigitalisOS; standalone feature backlog closed |

### Exit gate

Archive when agreed useful functions are either present in DigitalisOS or explicitly rejected, existing user data has a migration/backup path and the public repository contains no sensitive operating data.
