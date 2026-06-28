# Changelog — economy-app

Most recent entries at the top.

---

## 2026-06-27 — FT-06/07/08: progress bars, summary sheets, CSV export, comparison bars, DateTimePicker fix

### Frontend — progress bars (IncomesTab + ExpensesTab)

- Replaced Esperado/Confirmado bordered two-column card with a 52px pill progress bar (matches dashboard style)
- `fillPct = Math.min(100, confirmed / expected * 100)`; bar hidden when `expected === 0` (no denominator)
- Segment labels inside bar when ≥ 15% wide; fallback labels + text below bar when too narrow
- Bar is tappable (`role="button"`, `tabIndex={0}`) → opens summary sheet
- Hint below bar: "Toca para ver detalles" (10px muted)
- CSS: `.progressWrap`, `.progressBar`, `.progressFillEarn`, `.progressFillSpend`, `.progressFillLabel`, `.progressRemainLabel`, `.progressMeta`, `.progressMetaConfirm*`, `.progressMetaExpected`, `.progressHint`

### Frontend — IncomeSummarySheet + useIncomeInsight (FT-07)

- `IncomeSummarySheet.tsx` at `features/transactions/components/`
- `useIncomeInsight.hook.ts` at `features/transactions/hooks/`; fetches `GET /api/v1/analytics/incomes/insight?month=YYYY-MM`
- Insight text: 4 variants based on `confirmed_sources` vs `total_sources`
- Header: title + CSV export icon button (file_download / hourglass_empty while loading)
- Standard closing/revealed pattern (260ms reveal)

### Frontend — ExpenseSummarySheet + useExpenseComparison (FT-08)

- `ExpenseSummarySheet.tsx` at `features/transactions/components/`
- `useExpenseComparison.hook.ts` at `features/transactions/hooks/`; fetches `GET /api/v1/analytics/expenses/comparison?month=YYYY-MM`
- Top 5 categories by current spending; delta badge (↑ pink / ↓ green / "Nuevo")
- Mini comparison bars per category row: two 6px tracks, shared scale across all displayed deltas
  - Current month: `--c-spend` (solid pink)
  - Previous month: `rgba(194, 24, 91, 0.28)` (muted pink)
  - 800ms ease-out transition; `maxAmount` computed from `flatMap([current, previous])`
- CSS: `.summaryDeltaRow` (flex-column), `.summaryDeltaTop`, `.summaryBarGroup`, `.summaryBarTrack`, `.summaryBarFillCurrent`, `.summaryBarFillPrevious`, `.summarySheetHeader`, `.summaryExportIconBtn`, `.summaryInsight`, `.summaryCompSection`, `.summaryDeltaCategory`, `.summaryDeltaRight`, `.summaryDeltaAmount`, `.summaryDeltaUp`, `.summaryDeltaDown`, `.summaryDeltaMuted`

### Frontend — CSV export via apiGetBlob (FT-06)

- `apiGetBlob(path)` added to `api.client.ts`: fetches with JWT header, returns `Blob`
- Download pattern: `URL.createObjectURL(blob)` → hidden `<a>` → `a.click()` → `URL.revokeObjectURL()`
- File names: `ingresos_YYYY-MM.csv` / `gastos_YYYY-MM.csv`

### Frontend — DateTimePicker fix for non-current months

- New `month?: string` prop on `DateTimePicker.component.tsx`
- When `month !== currentMonthStr()`: mounts in `picking` mode; chips never shown; no Cancelar in picking; confirmed→picking (not chips)
- `ExpenseModals.tsx`: imports `useEffect`; computes `viewedMonth`, `isCurrentViewMonth`, `addFormDate`; `useEffect` syncs form date to `firstOfMonthISO(viewedMonth)` on add modal open; both DateTimePickers receive `month={viewedMonth}`
- `IncomeModals.tsx`: same pattern using `ctx.incomeHook.month`
- Helper `firstOfMonthISO(month)`: `new Date(y, m-1, 1, 12, 0, 0).toISOString()` (noon local time)

### Frontend — UI-UX-RULES.md

- Added "Sheet dismiss — no close or X buttons" rule: backdrop-only dismiss; exceptions for destructive/multi-step/full-screen modals

### Backend — analytics module

New module at `legacy-python-backend/app/features/analytics/`:
- `schemas.py`: `IncomeInsightResponse`, `CategoryDelta`, `ExpenseComparisonResponse`
- `repository.py`: `income_insight()`, `expense_comparison()`, `incomes_for_export()`, `expenses_for_export()`; `_month_range()` + `_prev_month()` helpers
- `service.py`: delegates to repository; CSV generation via `csv.writer` + `io.StringIO`
- `router.py`: 4 endpoints (`insight`, `comparison`, `incomes/export/csv`, `expenses/export/csv`)
- `main.py`: `include_router(analytics_router, prefix="/api/v1")`

### TASKS.md

- FT-06/07/08 marked done
- FT-09 (bank import), FT-10 (Google login), FT-11 (multi-currency), FT-12 (bank balance) added as future discussion items

---

## 2026-06-27 — Transactions UI polish + MoneyInput keyboard bug fix

### UI/UX

- Detail sheet action buttons: Editar (green) + Eliminar (pink) side-by-side in 60px row; no fill colors
- Removed Cancelar from both detail sheets (backdrop closes)
- Removed ✕ close button from Modal component
- ConfirmModal: danger button LEFT, Cancelar RIGHT
- Removed all Cerrar/Cancelar-only buttons from all modals and sheets

### Bug fix — MoneyInput keyboard stacking inside Modal

- Root cause: `transform: translateY()` on `.body`/`.header` in Modal.module.css created a CSS containing block; `position: fixed` NumericKeyboard anchored to that block instead of viewport
- Fix: removed all `transform` from Modal reveal classes; only `opacity` transitions now (no visual regression)

---

## 2026-06-20 — Datetime, income sources, ghost-click fix, DateTimePicker (Cycle 05)

### Backend

- **Migration 008**: `incomes.date` and `expenses.date` changed from `DATE` → `TIMESTAMP WITHOUT TIME ZONE` (preserves hour + minute)
- `incomes` and `expenses` models, schemas, repositories updated to use `dt.datetime` instead of `dt.date`
- All repositories: `date=data.date.replace(tzinfo=None)` before ORM insert — strips UTC offset that asyncpg rejects on naive TIMESTAMP columns
- `VALID_CATEGORIES` expanded: added `Internet`, `Gym`, `Carro`, `Claude`, `Caprichos`, `Tecnologia`, others
- `_month_range()` in incomes, expenses, budgets repositories now returns `tuple[dt.datetime, dt.datetime]`

### Frontend — new components

- `HourMinuteInput.component.tsx` + `.module.css` at `features/core/components/`: two tappable fields (HH 00–23, MM 00–59) each backed by `NumericKeyboard`. Tapping HH opens numpad labeled "Hora: 14". Done auto-advances to MM ("Minutos: 35"). Done on MM fires `onChange(hour, minute)`.
- `DateTimePicker.component.tsx` + `.module.css` at `features/core/components/`: three-mode date+time picker
  - **chips mode**: Hoy / Ayer / Hace 2 días / Otra fecha chips. Quick selection always captures current time.
  - **picking mode**: chips hidden; `[date input | HourMinuteInput]` on one row; full-width Confirmar + Cancelar buttons below.
  - **confirmed mode**: formatted date pill (`📅 20 jun. 2026 · 14:35`) + full-width Cancelar button to return to chips.

### Frontend — bug fixes

- **NumericKeyboard ghost-click fix**: keyboard now tracks a `closing` state on unmount. For 320ms after `open` goes false, a transparent full-screen backdrop stays mounted (`pointer-events: all`) to absorb synthesized click events that would otherwise land on elements revealed beneath the keyboard. Keyboard panel gets `slideDown` animation + `pointer-events: none` during this window.
- **Nested `<button>` fix** in Transactions tab info buttons: changed inner `<button>` to `<span role="button">` to fix React hydration warning.
- **`today()` renamed** to `nowISO()` in Transactions container — all call sites updated.

### Frontend — income sources confirm flow

- Unified `confirmSrcModal` state replaces two separate `enterAmountSource` / `handleConfirmSource` flows. Both "✓ Confirmar" (fixed) and "Ingresar monto" (variable) open the same modal; fixed sources pre-fill amount from `base_amount`.
- All 7 date entry modals (5 in Transactions, 2 in Finance) replaced with `<DateTimePicker>`.

### Frontend — dashboard

- `disponible` hero value clamps to `Math.max(0, disponible)` — never shows negative.
- When `disponible < 0` (and income exists), a breakdown row shows: Por ahorrar · Gastos · Te faltan.

### Frontend — finance / budget

- `useBudget.confirmPayment(category, amount, date)` added: posts to `/api/v1/expenses` and reloads.
- "Confirmar pago" button appears on budget rows where `budget > 0 && spent === 0`.
- Confirm payment modal uses `<DateTimePicker>`.

---

## 2026-06-18 — English renaming cycle (tasks 14–20)

**All Spanish code identifiers renamed to English. UI text stays Spanish.**

- Renamed feature hooks: `useGastos`→`useExpenses`, `useIngresos`→`useIncomes`, `usePresupuesto`→`useBudget`, `usePatrimonio`→`useNetWorth`, `useDecisora`→`useDecision`
- Renamed feature containers: `GastosContainer`→`ExpensesContainer`, `IncomesContainer`, `BudgetContainer`, `NetWorthContainer`, `DecisionContainer`, `FinanceContainer`, `TransactionsContainer`, `PurchasesContainer`, `ProfileContainer`, `SettingsContainer`
- Renamed feature folders: `gastos/`→`expenses/`, `ingresos/`→`incomes/`, `presupuesto/`→`budgets/`, `ajustes/`→`settings/`, `perfil/`→`profile/`, `decisor/`→`decision/`, `movimientos/`→`transactions/`, `finanzas/`→`finance/`, `compras/`→`purchases/`, `patrimonio/`→`networth/`
- Renamed CSS modules to match English folder names
- App routes renamed: `/ajustes`→`/settings`, `/perfil`→`/profile`, `/movimientos`→`/transactions`, `/finanzas`→`/finance`, `/compras`→`/purchases`
- Old Spanish routes (`/gastos`, `/ingresos`, `/presupuesto`, `/patrimonio`, `/decisor`, `/wishlist`) kept as redirects to English equivalents
- `BottomNav.component.tsx` — hrefs updated to `/transactions`, `/finance`, `/purchases`
- `TopBar.component.tsx` — TITLES map updated to English paths; profile nav → `/profile`
- `features/core/content/info.content.ts` — all top-level and sub-keys renamed to English (`transactions`, `finance`, `purchases`, `incomes`, `expenses`, `budget`, `networth`, `decision`)
- `features/core/types/api.types.ts` — `PatrimonioEntryFromAPI` → `NetWorthEntryFromAPI`
- All old Spanish-named files and folders deleted

---

## 2026-06-17 — Multi-user launch cycle (tasks 1–13)

**App made production-ready for multiple independent user accounts.**

- **Auth:** Register + login pages; JWT stored in localStorage; `AuthContext` + `AuthGuard`; all API calls send `Authorization: Bearer`
- **Onboarding wizard:** Multi-step first-time setup (`/onboarding`); one question per view with forward/back; info icon per step explaining the concept; prefilled default values; saves to `/api/v1/settings` on completion
- **Settings page** (`/settings`): Edit monthly income, savings target, goal amount; `useSettings` hook; `PUT /api/v1/settings`
- **Dynamic income:** Budget view replaces hardcoded `TOTAL_INCOME=2900` with live value from `GET /api/v1/settings`
- **Category management:** Add/delete budget categories in the budget tab
- **Profile page** (`/profile`): View account email, change password form, logout with confirm modal
- **Dashboard** (`/`): Summary cards — month income, expenses, savings rate, goal progress
- Connected to backend endpoints: `/auth/register`, `/auth/login`, `/auth/me`, `/settings`, `/incomes`, `/expenses`, `/budgets`, `/wishlist`, `/patrimonio`

---

## 2026-06-14 — Initial build

- Project scaffolded: Next.js 16 App Router, TypeScript, CSS Modules
- Feature modules built: expenses, incomes, budgets, wishlist, decision tool, net worth
- Navigation shell: `TopBar`, `BottomNav`, `NavWrapper`
- Shared components: `Modal`, `ConfirmModal`, `InfoModal`, `DotsMenu`
- INFO content system: `info.content.ts` with terminology glossary per feature
- API client: `api.client.ts` with `apiGet/apiPost/apiPut/apiDelete`
- All pages wired to backend at `http://localhost:8000`
