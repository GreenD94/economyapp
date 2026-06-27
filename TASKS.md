# Tasks — economy-app

Priority: `P1` critical · `P2` important · `P3` nice-to-have

---

## P1 — Soft delete (SD cycle)

No economy data is ever hard-deleted. All deletes set `deleted_at = NOW()`. All queries filter `WHERE deleted_at IS NULL`. Auth tables (`users`, `roles`, `user_roles`), `settings`, and audit logs (`income_source_edits`, `income_unconfirm_log`) are excluded.

- [x] **SD-00** Migration 011 — `deleted_at TIMESTAMP NULL` added to: `incomes`, `expenses`, `budgets`, `wishlist`, `patrimonio`, `income_sources` (`alembic/versions/011_soft_delete.py`)
- [x] **SD-01** Soft delete `incomes` — model + repo: `list_incomes`, `get_income` filter `deleted_at IS NULL`; `delete_income` sets `deleted_at`
- [x] **SD-02** Soft delete `expenses` — model + repo: same pattern; `list_budgets` spending query also filters `Expense.deleted_at IS NULL`
- [x] **SD-03** Soft delete `budgets` — model + repo: `list_budgets`, `get_budget_by_category` filter `deleted_at IS NULL`; `delete_budget` sets `deleted_at`
- [x] **SD-04** Soft delete `wishlist` — model + repo: `list_wishlist`, `get_wishlist_item` filter `deleted_at IS NULL`; `delete_wishlist_item` sets `deleted_at`
- [x] **SD-05** Soft delete `patrimonio` — model + repo: `list_net_worth` filters `deleted_at IS NULL`; no delete endpoint exists yet
- [x] **SD-06** Soft delete `income_sources` — model + repo: `list_sources` filters `is_active = true AND deleted_at IS NULL`; `delete_source` sets `deleted_at`
- [x] **SD-07** `unconfirm_income` — now sets `deleted_at` on the income row instead of hard-deleting; audit log entry still created as before

After all SD tasks: run `npx tsc --noEmit` (zero errors) and boot backend to verify no 500s. ✅ TypeScript: zero errors. Backend boot: requires `.\reload.ps1`.

---

## Cycle 05 — Datetime, income confirm flow, DateTimePicker (2026-06-20)

- [x] **EA-C05-01** Backend: `incomes.date` + `expenses.date` → `TIMESTAMP WITHOUT TIME ZONE` (migration 008); model/schema/repo updated to `dt.datetime`; `.replace(tzinfo=None)` on insert
- [x] **EA-C05-02** Frontend: all date chips emit `.toISOString()` (full datetime, not date-only slice)
- [x] **EA-C05-03** `HourMinuteInput` component — two NumericKeyboard-backed fields (HH 0–23 / MM 0–59), auto-advances H→M on Done
- [x] **EA-C05-04** `DateTimePicker` component — 3-mode: chips / picking (date+time row) / confirmed (text display + Cancelar)
- [x] **EA-C05-05** DateTimePicker wired into all 7 date entry points (5 in Transactions, 2 in Finance)
- [x] **EA-C05-06** Income source unified confirm modal (`confirmSrcModal`) — both fixed (Confirmar) and variable (Ingresar monto) use same modal with DateTimePicker
- [x] **EA-C05-07** Budget "Confirmar pago" button + modal with DateTimePicker; `confirmPayment()` in `useBudget`
- [x] **EA-C05-08** Dashboard: disponible clamps to `Math.max(0, disponible)`; negative breakdown row when disponible < 0
- [x] **EA-C05-09** NumericKeyboard ghost-click fix — closing-backdrop pattern absorbs synthesized clicks for 320ms after keyboard dismisses
- [x] **EA-C05-10** VALID_CATEGORIES expanded (added Internet, Gym, Carro, Claude, Caprichos, Tecnologia, others); frontend CATEGORIES array synced
- [ ] **EA-C04-02** [FUTURE] Native keyboard toggle — opt-in fallback to native keyboard per input

---

## Next cycle — QA & polish

- [x] **QA-01** Next.js build clean — all 18 routes (9 main + 6 redirect + 3 misc) compiled, zero TypeScript errors (2026-06-21)
- [ ] **QA-02** Test full user flow: register → onboarding → add income → add expense → view budget → add wishlist item → check net worth
- [ ] **QA-03** Verify old Spanish redirect routes still work (`/gastos`, `/ingresos`, `/presupuesto`, `/patrimonio`, `/decisor`, `/wishlist`)
- [ ] **QA-04** Test auth guard: navigate to `/transactions` without login → should redirect to `/login`
- [ ] **QA-05** Test onboarding: register fresh account → verify redirected to `/onboarding` → complete wizard → verify settings saved

### UI/UX view audits

- [x] **QA-06** `/transactions` — Ingresos tab: fully audited, all issues resolved (2026-06-21)
- [x] **QA-07** `/transactions` — Gastos tab: 5 issues found and fixed (2026-06-21):
  - Added category filter pills row (Todas + 18 categories, pink active state, scrollable)
  - Fixed DotsMenu: sheet now fully closes before Modal opens (dismiss → 320ms → action)
  - Added expense date to card subtitle row
  - Added `title={exp.description}` to DotsMenu for action sheet context
  - Replaced orphaned `addRow` with labeled `sectionHeader` (count + category + pink + button)
- [x] **QA-08** `/transactions` — ExpenseModals: audit against UI/UX rules (2026-06-22): pill active color → spend pink; stale date default fixed; filterActiveSummary chips row added to ExpensesTab; ExpenseFilterSheet.tsx deleted
- [x] **QA-09** `/finance` — Budget tab (2026-06-22): `fmtAmt` added to finance.types; summary amounts use de-DE locale; "Monto mensual" → "¿Cuánto asignas mensualmente?"
- [x] **QA-10** `/finance` — Net worth tab (2026-06-22): `fmtAmt` for amounts; inline flex `style` → `.patriTopRight` CSS class; `maxLength={500}` on both networth notes inputs; inline styles removed from budgetDetail modal → `.detailStat` / `.detailStatValue` CSS classes
- [x] **QA-11** `/purchases` — Wishlist (2026-06-22): amounts use `fmtAmt` (de-DE); priority `<select>` → pill buttons row (`.priorityPills / .priorityPillActive`)
- [x] **QA-12** `/dashboard` (2026-06-22): `fmt` in dashboard.helpers → de-DE locale; inline styles on heroLabel + negativeRowIcon → CSS classes (`.heroLabelSavedOutside`, `.heroLabelRemainOutside`, `.negativeRowIcon`)

---

## Cycle 06 — Recurring Expense Sources (Gastos tab mirror of Ingresos)

Mirror the Ingresos tab architecture (income sources → payment slots → confirmation flow) for the Gastos tab. Expenses become templates with frequency, category, classification, and optional fixed amount. The Gastos tab gains a "Gastos frecuentes" section (recurring source cards with fill progress) and keeps "Otros gastos" for manual one-off entries.

### Backend

- [x] **EA-C06-01** Migration 013 — create `expense_sources` table: `id`, `user_id`, `label`, `category`, `classification`, `expense_type` (fixed/variable), `frequency` (weekly/biweekly/monthly), `base_amount` (Numeric nullable), `due_day` (int), `is_active` (bool), `created_at`, `deleted_at`. Down-revision: 012. (2026-06-22)
- [x] **EA-C06-02** Migration 014 — add nullable `source_id` FK → `expense_sources.id` to `expenses` table. Down-revision: 013. (2026-06-22)
- [x] **EA-C06-03** Backend module `expense_sources` — `models.py` · `schemas.py` · `repository.py` · `service.py` · `router.py` · `__init__.py`. Registered in `main.py` at `/api/v1/expense-sources`. (2026-06-22)
- [x] **EA-C06-04** Backend `expenses` update — `source_id` added to ORM + `ExpenseResponse` + `CreateExpenseRequest`; `unconfirm_expense` endpoint (`DELETE /api/v1/expenses/{id}/unconfirm`) live. (2026-06-22)

### Frontend

- [x] **EA-C06-05** Types — `ExpenseSourceFromAPI` added to `api.types.ts`; `source_id: number | null` added to `ExpenseFromAPI`; `ExpenseSourceForm`, `EMPTY_EXPENSE_SOURCE`, `ConfirmExpenseSrcState` added to `transactions.types.ts`; `getExpectedSlots` accepts `HasFrequency` interface. (2026-06-22)
- [x] **EA-C06-06** Hook `useExpenseSources` — `features/expenses/hooks/useExpenseSources.hook.ts` created; mirrors `useIncomeSources`; hits `/api/v1/expense-sources`. (2026-06-22)
- [x] **EA-C06-07** Hook `useExpenseSourceActions` — extracted composable `hooks/useExpenseSourceActions.hook.ts` (keeps `useTransactions` under 200 lines); wired into `useTransactions` via spread. (2026-06-22)
- [x] **EA-C06-08** UI `ExpensesTab` redesign — two sections: "Gastos frecuentes" (source cards with fill progress, tappable) + "Otros gastos" (manual expenses with filter). Summary row Esperado/Pagado. (2026-06-22)
- [x] **EA-C06-09** UI `ExpenseSourceDetailSheet` — created; pink/spend colors; category + classification subtitle; Confirmar/Ingresar monto per slot; `closeAndThen` pattern. (2026-06-22)
- [x] **EA-C06-10** UI `ExpenseSourceModals` — add + edit + confirm modals created; wired into `Transactions.container.tsx`. (2026-06-22)
- [x] **EA-C06-11** Onboarding update — `handleFinish` creates `expense_sources` for each fixed expense (classification: Necesidad, frequency: monthly, expense_type: fixed). Budget creation unchanged. (2026-06-22)
- [x] **EA-C06-12** Info content — `INFO.transactions.expenses` updated with two-section model (5 howItWorks + 7 glossary). (2026-06-22)

Task files: `d:\github\saborea\tasks\economy-app\cycle-06\` (CYCLE-06-OVERVIEW.md + TASK-EA-C06-01 through TASK-EA-C06-12)

---

## P1 — Refactor: 200-line rule compliance (features/)

Global rule: no frontend `.tsx` or `.ts` file may exceed 200 lines. Transactions already done (2026-06-20). Current violations and near-violations (as of 2026-06-21):

- [x] **RF-01** `auth/containers/Auth.container.tsx` (424→37 lines) — extracted: `useAuthForm` hook, `LoginSlider`, `RegisterSlider`, `AuthFormParts` components, `auth.helpers.ts`. Deleted dead `Login.container.tsx` + `Register.container.tsx` (both pages used `AuthContainer`).
- [x] **RF-02** `onboarding/containers/Onboarding.container.tsx` (431→50 lines) — extracted: `useOnboarding` hook, `GoalStep`, `SavingsStep`, `IncomeSourcesStep`, `ExpensesStep`, `PlanStep` components, `onboarding.types.ts`.
- [x] **RF-03** `finance/containers/Finance.container.tsx` (339→37 lines) — extracted: `useFinance` hook, `BudgetTab`, `NetworthTab`, `FinanceModals` components, `finance.types.ts`.
- [x] **RF-04** `dashboard/containers/Dashboard.container.tsx` (274→122 lines) — extracted: `useDashboardUI` hook, `SpendingPie`, `DashboardModals` components, `dashboard.helpers.ts`.
- [x] **RF-05** `wishlist/containers/Wishlist.container.tsx` (239→113 lines) — extracted: `useWishlistState` hook, `ItemForm` component, `wishlist.types.ts`.
- [x] **RF-06** `auth/containers/Register.container.tsx` + `Login.container.tsx` — both were dead code (deleted). Auth is unified in `Auth.container.tsx` + its extracted pieces.
- [ ] **RF-07** `transactions/components/SourceModals.tsx` (161 lines, growing) — split into `UnconfirmModal`, `ConfirmSrcModal`, `EditSourceModal`, `AddSourceModal` components; keep SourceModals as a thin composer
- [ ] **RF-08** `transactions/hooks/useTransactions.hook.ts` (137 lines, growing) — split into `useSourceActions`, `useIncomeEntryActions`, `useExpenseActions`; compose in useTransactions
- [x] **RF-09** `budgets/containers/Budget.container.tsx` (154 lines) — no action needed; under limit and cleanly organized
- [x] **RF-10** `profile/containers/Profile.container.tsx` (120 lines) — no action needed; under limit and cleanly organized

**Rule:** After each refactor, run `npx tsc --noEmit` and verify zero errors before marking done. ✅ Done (2026-06-21, zero errors).

---

## Business rules implementation (BR cycle)

- [x] **BR-01** Income form redesign — confirmed done in prior session; IncomeModals has no Tipo for manual incomes; Monto fullWidth; conversational labels (2026-06-21)
- [x] **BR-02** NoteInput component — confirmed done in prior session; slide-up panel wired into edit-income modal with ghost-click closing-backdrop (2026-06-21)
- [x] **BR-03** Backend: `income_edits` audit log — confirmed done in prior session; migration 012; model + repo; POST on every PUT /incomes/:id (2026-06-21)
- [x] **BR-04** Security: Pydantic `max_length` on incomes, expenses, income_sources schemas (Annotated + Field); frontend `maxLength` on networth notes inputs (2026-06-22)
- [x] **BR-05** Backend: `incomes.type` validated against `Literal["Fijo", "Variable", "Extra"]` in schema (2026-06-22)
- [ ] **BR-06** Remove notes field from add-income modal (create form has no notes per business rules)

---

## Animation cycle

- [x] **AN-01** Add fade-in on screen enter to all 8 screen containers (Dashboard, Transactions, Finance, Purchases, Settings, Profile, Onboarding, Auth)
- [x] **AN-02** Progress bars grow animation (0% → real width, 2s ease-out) — Dashboard hero bar + month combo bar segments
- [x] **AN-03** Number count-up (0 → value, 2s ease-out) — Dashboard: disponible, current savings, faltante; Wishlist: pending value hero
- [x] **AN-04** Number count-up — Budget totals row (NetWorth skipped — too many table rows, would be noisy)

---

## P2 — UX improvements

- [ ] **UX-01** Loading skeletons instead of plain "Cargando..." text in all containers
- [ ] **UX-02** Toast notifications for save/delete success instead of in-form saved messages
- [ ] **UX-03** Pull-to-refresh on mobile (touch devices)
- [ ] **UX-04** Empty state illustrations when lists have no items

---

## P2 — Features

- [x] **FT-01** Recurring income/expense — superseded by EA-C06 (full expense-source system built in Cycle-06)
- [ ] **FT-02** Export to CSV — download current month incomes + expenses as a CSV file (for accountants / tax season). A real finance expert always prepares your records for you.
- [ ] **FT-03** Category spending chart — bar/pie chart of expenses by category in the budget tab
- [ ] **FT-04** Delete account — from profile page
- [ ] **FT-05** Currency setting — let user pick symbol ($ / € / £ / etc.) saved in settings

### Transactions view — "finance expert" intelligence features

> **⚠️ BEFORE implementing FT-06/07/08: talk to the user about UI/UX navigation.** The `/transactions` view already has a lot going on. These features need a clear entry point / navigation pattern that doesn't overload the current layout. Agree on the approach before writing any code.

- [ ] **FT-06** CSV export for `/transactions` — Download current month's incomes + expenses as CSV. Single action (button or menu item). Fields: date, type (ingreso/gasto), source/description, amount, category (expenses), classification (expenses). Scope: current displayed month only. A hired finance expert always hands you a clean record when asked.

- [ ] **FT-07** Monthly insight line — A one-sentence proactive summary a finance expert would say: "Confirmaste 3 de 4 fuentes. Te faltan $X esta quincena." Surfaces the *gap* (confirmed vs. expected) rather than just showing raw numbers. Lives somewhere in the Ingresos tab header area. Must not add visual noise — one line, muted style.

- [ ] **FT-08** Month-over-month expense comparison — Per-category delta vs. prior month: "Alimentación: $340 este mes vs $210 el mes pasado (+62%)". A finance expert flags unusual spending months immediately. Entry point TBD (talk to user about UI/UX placement before building).

---

## P2 — Category & classification management (future)

> **Context:** Expense source categories and classifications are currently hardcoded lists. Users can add new ones from the picker keyboard (session-only, not persisted). A proper management UI is needed so additions persist and can be renamed/deleted.

- [ ] **CM-01** Backend: `expense_categories` table (`id`, `user_id`, `name`, `created_at`, `deleted_at`); same for `expense_classifications`. Migration + router + service + repo.
- [ ] **CM-02** Frontend: Persist custom categories/classifications per user via the new API. Picker keyboard "Agregar nueva" calls POST endpoint.
- [ ] **CM-03** Settings screen: "Categorías y clasificaciones" section — list view with add + soft-delete per category/classification. Likely under a new "Gastos" tab within Settings.

---

## P3 — Nice-to-have

- [ ] **NTH-01** Dark mode toggle
- [ ] **NTH-02** Offline mode / PWA manifest
- [ ] **NTH-03** Push notifications for budget overspend

---

## Completed

### Multi-user launch cycle (2026-06-17)

- [x] **EC-01** Auth: register + login + JWT guard
- [x] **EC-02** Settings API + settings page
- [x] **EC-03** Dynamic income from settings in budget view
- [x] **EC-04** Category add/delete UI in budget tab
- [x] **EC-05** Profile page (change password, logout)
- [x] **EC-06** Onboarding wizard (multi-step, one question per view)
- [x] **EC-07** Dashboard summary cards
- [x] **EC-08** All backend economy endpoints (incomes, expenses, budgets, wishlist, net worth)

### English renaming cycle (2026-06-18)

- [x] **EN-14** Rename expenses/incomes/budgets/settings hooks and containers to English
- [x] **EN-15** Rename Spanish feature folders to English
- [x] **EN-16** Rename app routes + update BottomNav and TopBar
- [x] **EN-17** Update INFO content keys and api.types to English
- [x] **EN-18** Backend: rename `patrimonio` module to `net_worth`
- [x] **EN-19** Delete all old Spanish-named files and folders
- [x] **EN-20** Create/update all MD documentation files
