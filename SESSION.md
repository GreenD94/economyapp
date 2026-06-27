# Session Context — economy-app

**Read this first when starting a new session. Update it at the end of every session.**

---

## Last Updated: 2026-06-27

## Current State

All Cycle 01–06 + QA/RF/BR cycles complete. `/transactions` view fully audited and UI/UX declared complete. MoneyInput keyboard stacking bug fixed. New intelligence features (FT-06/07/08) planned for `/transactions` — navigation UI/UX must be discussed with user before implementing. TypeScript: zero errors.

### What changed this session (2026-06-27 — Transactions UI polish + MoneyInput bug fix)

**UI/UX changes to `/transactions`:**

1. **Editar + Eliminar buttons — side-by-side row** in both `IncomeDetailSheet.tsx` and `ExpenseDetailSheet.tsx`:
   - Replaced 3 stacked buttons (Editar / Eliminar / Cancelar) with a flex row, 60px tall, divided by a vertical border
   - Editar: green text (`--c-earn`) + edit icon, left half
   - Eliminar: pink text (`--c-spend`) + delete icon, right half
   - No background colors (user rejected pink/green fills)
   - New CSS classes: `.detailActionRow`, `.detailActionEditBtn`, `.detailActionDeleteBtn` in `Transactions.module.css`

2. **Removed Cancelar button** from both detail sheets (backdrop closes)

3. **Removed ✕ close button** from all modals (`Modal.component.tsx`) — overlay click closes; ✕ was redundant

4. **Swapped ConfirmModal button positions** (`ConfirmModal.component.tsx`) — Confirmar (danger) on LEFT, Cancelar on RIGHT. Reason: Cancelar is at the right/thumb-zone, so accidental confirmation requires a conscious left-tap.

5. **Removed all Cancelar/Cerrar buttons that only closed their modal** from: `SourceModals.tsx`, `IncomeModals.tsx`, `ExpenseModals.tsx`, `ExpenseSourceModals.tsx`, `SourceDetailSheet.tsx`, `ExpenseSourceDetailSheet.tsx`

**MoneyInput keyboard bug fix — `Modal.module.css`:**
- **Root cause:** `transform: translateY(6px)` and `transform: translateY(0)` on `.body` and `.header` created a CSS containing block for `position: fixed` descendants. Even `translateY(0)` (a no-op) permanently creates this containing block. `NumericKeyboard` uses `position: fixed; bottom: 0` and was anchoring to `.body`'s box instead of the viewport — placing the keyboard at the wrong position on screen, making it appear behind the modal title area.
- **Fix:** Removed `transform` from `.header`, `.body`, and `.revealed`. Now only `opacity` is transitioned (fade-in still works, slide animation removed). `position: fixed` children now correctly anchor to the viewport.

**Planned features (FT-06/07/08):**
- CSV export for `/transactions`
- Monthly insight summary line (Ingresos tab)
- Month-over-month expense comparison (Gastos tab)
- **UI/UX navigation must be agreed with user before implementing any of these** — /transactions is already dense

### What changed this session (2026-06-22 — QA-09/10/11/12 + BR mark done)

**QA-09 — Finance/Budget tab:**
- `finance.types.ts`: added `fmtAmt` (de-DE locale)
- `BudgetTab.tsx`: summary amounts (`totalBudget`, `totalSpent`, available) use `fmtAmt`
- `FinanceModals.tsx`: "Monto mensual" label → "¿Cuánto asignas mensualmente?"; imported `finStyles`; budgetDetail modal inline styles removed → `.detailStat`, `.detailStatLabel`, `.detailStatValue`, `.detailStatValueSpend`, `.detailStatValueAvail`, `.detailStatValueOver` CSS classes
- `Finance.module.css`: added `.detailStat`, `.detailStatLabel`, `.detailStatValue*`, `.patriTopRight`

**QA-10 — Finance/Networth tab:**
- `NetworthTab.tsx`: `toLocaleString('en', ...)` → `fmtAmt`; inline `style={{ display: 'flex', ... }}` → `styles.patriTopRight`
- `FinanceModals.tsx`: added `maxLength={500}` to both networth notes inputs (add + edit)

**QA-11 — Purchases/Wishlist:**
- `Wishlist.container.tsx`: `countPending.toLocaleString('en', ...)` → `fmtAmt`; `parseFloat(item.price).toFixed(2)` → `fmtAmt`; priority `<select>` → `.priorityPills` row of pill buttons
- `Wishlist.module.css`: `.filterSelect` class removed; added `.priorityPills`, `.priorityPill`, `.priorityPillActive`

**QA-12 — Dashboard:**
- `dashboard.helpers.ts`: `fmt` uses `de-DE` locale (was `en`)
- `Dashboard.container.tsx`: 3 inline styles removed → `.heroLabelSavedOutside`, `.heroLabelRemainOutside`, `.negativeRowIcon` CSS classes
- `Dashboard.module.css`: added those 3 classes

**Business rules (BR cycle):**
- `currency.formatters.ts`: added `fmtAmt` export (de-DE format, no currency symbol)
- BR-01, BR-02, BR-03: confirmed implemented in prior sessions; marked done in TASKS.md
- BR-04, BR-05: backend Pydantic `max_length` + `Literal` type constraints; marked done in TASKS.md

**TypeScript:** zero errors.

### What changed this session (2026-06-22 — Gastos QA-08 audit + fixes)

**QA-08 — ExpenseModals audit:**

1. **`ExpenseFilterSheet.tsx` deleted** — unused since filter was redesigned to use `ExpenseFilterKeyboard.tsx`.

2. **Expense pill active color fixed** — `toggleOptionActive` (green/primary) replaced with `toggleOptionActiveSpend` (pink, `--c-spend`) on all category and type pill buttons in both add and edit forms. Added `.toggleOptionActiveSpend` class to `Transactions.module.css`.

3. **Stale date default fixed** — `expenseForm` initial state now uses lazy `useState(() => ({ ...EMPTY_EXPENSE, date: nowISO() }))` so it's fresh on each mount. Submit and cancel resets also use `nowISO()` instead of the module-load-time constant.

4. **`filterActiveSummary` chips row added to `ExpensesTab.tsx`** — when filter panel is closed and filters are active, a horizontal chips row shows each active filter with a `×` to remove it. CSS classes `.filterActiveSummary` and `.filterActiveChip` + new `.filterActiveChipIcon` (14px icon size).

**TypeScript:** zero errors.

---

### What changed this session (2026-06-22 — Gastos filter redesign)

**Filter UX — inline panel + custom keyboard:**

1. **Multi-select client-side filtering in `useExpenses.hook.ts`:**
   - Replaced single `categoryFilter: string | null` with `categoryFilters: string[]` + `typeFilters: string[]`
   - Removed `?category=` from backend URL — all filtering is now client-side
   - `filteredExpenses` computed via `.filter()` inside the hook
   - `allCount: expenses.length` exposed for "N de M gastos" label
   - `EXPENSE_TYPES` exported: `['Necesidad', 'Calidad de vida', 'Productividad', 'Capricho']`
   - `useEffect` deps fixed to `[month]` only (no filter deps)

2. **`ExpenseFilterKeyboard.tsx`** — NEW component at `features/transactions/components/`:
   - Slides up from the bottom (like NumericKeyboard / DotsMenu bottom sheet)
   - Backdrop + `detailSheetIn` 250ms animation, JS-controlled reveal (260ms)
   - Mode prop: `'category'` (search bar + 18 wrapping pills) or `'type'` (4 pills, no search)
   - Pill tap toggles selection immediately (no "Aplicar" button — instant feedback)
   - Back arrow or backdrop tap closes the keyboard

3. **`ExpensesTab.tsx`** — inline question panel:
   - Filter `tune` button toggles an inline panel (CSS grid `0fr → 1fr` transition)
   - Panel shows two question rows: "¿Buscar por categoría?" + "¿Buscar por clasificación?"
   - Tapping a question opens `ExpenseFilterKeyboard` (slides up from bottom)
   - Under each question: selected filter names shown as pink chips (NOT a count number)
   - Filter icon: pink when panel open, red dot (`.filterDot` uses `--c-red-border`) when closed with active filters
   - When panel is closed + filters active: horizontal chips row shows all active selections with × to remove

4. **`Transactions.module.css`** additions:
   - `.filterPanel` / `.filterPanelOpen` — CSS grid height transition
   - `.filterQuestion` / `.filterQuestionIcon` / `.filterQuestionContent` / `.filterQuestionText` — column layout
   - `.filterQuestionSelected` + `.filterQuestionChip` — pink chips under question text
   - `.filterQuestionChevron` — right arrow
   - `.filterClearAll` — "Limpiar filtros" link button
   - `.filterActiveSummary` + `.filterActiveChip` — active chips row when panel is closed
   - `.filterKeyboard` / `.filterKeyboardBody` / `.filterKeyboardRevealed` — keyboard panel (reuses `detailSheetIn`)
   - `.filterPickerHeader` / `.filterPickerBack` / `.filterPickerTitle` / `.filterPickerSearch` / `.filterPickerInput` / `.filterPickerClear` / `.filterPickerPills` / `.filterPickerPill` / `.filterPickerPillActive`

5. **`ExpenseFilterSheet.tsx`** — still exists but is no longer used. Can be deleted.

6. **`Expenses.container.tsx`** (legacy) — updated to use `categoryFilters/setCategoryFilters` array API (compatibility shim: `const categoryFilter = categoryFilters[0] ?? null`).

### What changed this session (2026-06-21 — sheet animations + Gastos audit)

1. **Modal/sheet content reveal — definitive fix** — JS-controlled reveal: `useState(false)` + `useEffect` `setTimeout` fires after sheet slide completes, sets `.revealed` class, CSS `transition` (not animation) fires on class change. Applied to `Modal.component.tsx` (210ms delay), `SourceDetailSheet.tsx` (260ms), `IncomeDetailSheet.tsx` (260ms). All CSS `animation: fadeInUp` removed from sheet content elements. Pattern fully documented in `UI-UX-RULES.md` → "Bottom-sheet / modal content reveal".

2. **Conditional field smooth height** — CSS `grid-template-rows: 0fr → 1fr` transition in `Modal.module.css`. Classes `.fieldReveal` / `.fieldRevealVisible`. Applied to "¿Cuánto recibes por pago?" and "¿Qué día del mes lo recibes?" in `SourceModals.tsx`. Eliminates height-jump when fields appear/disappear.

3. **Gastos tab — 5 issues fixed:**
   - Category filter pills: scrollable row (Todas + 18 categories), pink active state, wired to `expenseHook.categoryFilter`
   - DotsMenu timing: `dismiss()` fires first, action fires after 320ms — eliminates z-index overlap with Modal
   - Expense date shown on card: `new Date(exp.date).toLocaleDateString('es', { day: 'numeric', month: 'short' })`
   - DotsMenu `title={exp.description}` — context in action sheet
   - `addRow` replaced with `sectionHeader` — labeled count + pink + button

4. **DotsMenu global fix** — click handler changed from `{ item.onClick(); dismiss(); }` to `{ dismiss(); setTimeout(() => item.onClick(), 320); }`. Applies to every DotsMenu usage across the app.

### What changed this session (2026-06-20 — UI/UX audit + refactor)

1. **Business rules documented** — `BUSINESS-RULES.md` created with income type definitions (Fijo/Variable/Extra), edit log pattern, security rules (maxLength). `UI-UX-RULES.md` updated with income form rules (create vs edit), NoteInput spec, Tipo display rules per context.

2. **`NoteInput` component** — built at `features/core/components/NoteInput.component.tsx`. Bottom-panel slide-up (z-index 400), native keyboard, ghost-click closing-backdrop (320ms). Used in edit-income form only (not add). See `UI-UX-RULES.md` for spec.

3. **"Editar fuente de ingreso" modal** — now mirrors the add-source form exactly (label, type toggle, frequency toggle, amount if fixed, day input). Triggered via DotsMenu on each source card.

4. **"Editar monto" removed from DotsMenu** — was never asked for. Gone.

5. **Transactions.container.tsx refactored** — from 602 lines to 47. Split into:
   - `features/transactions/transactions.types.ts` — types + constants + helpers (25 lines)
   - `features/transactions/hooks/useTransactions.hook.ts` — all state + action functions (110 lines)
   - `features/transactions/components/IncomesTab.tsx` — incomes tab JSX (103 lines)
   - `features/transactions/components/ExpensesTab.tsx` — expenses tab JSX (47 lines)
   - `features/transactions/components/SourceModals.tsx` — confirm/add/edit source modals (119 lines)
   - `features/transactions/components/IncomeModals.tsx` — add/edit income entry modals (80 lines)
   - `features/transactions/components/ExpenseModals.tsx` — add/edit expense modals (91 lines)

6. **200-line global rule** — added as rule #8 in `economy-app/CLAUDE.md`. All new and existing frontend files must stay under 200 lines. See `TASKS.md` → RF-01 through RF-05 for remaining files.

7. **`useIncomeSources` hook** — `updateSource` body now includes `due_day: number`.

8. **Finance.container.tsx bug fixed** — removed orphaned `setConfirmPayCustom(false)` call that referenced a non-existent state variable.

### TypeScript status

`npx tsc --noEmit` — zero errors.

### Routes (all working)
- `/` — Dashboard (income, expenses, savings, goal progress; disponible clamps to 0)
- `/transactions` — Incomes (Fuentes + Otros sections) + Gastos tabs with month navigation
- `/finance` — Budget categories (with "Confirmar pago" flow) + net worth tabs
- `/purchases` — Wishlist + decision tool tabs
- `/settings` — Edit income, savings target, goal
- `/profile` — View email, change password, logout
- `/login` — JWT login
- `/register` — Create account
- `/onboarding` — Multi-step first-time setup wizard

### Legacy Spanish redirects
`/gastos` → `/transactions` · `/ingresos` → `/transactions` · `/presupuesto` → `/finance` · `/patrimonio` → `/finance` · `/decisor` → `/purchases` · `/wishlist` → `/purchases`

## What To Do Next

**BR-06 — Remove notes field from add-income modal** (TASKS.md):
- `IncomeModals.tsx` add-income form currently has no notes field (may already be done — verify)
- If still present: remove it; create-income form must have no notes per business rules

**QA-02 through QA-05 — Functional testing** (TASKS.md):
- QA-02: full user flow (register → onboarding → CRUD all views)
- QA-03: old redirect routes work (`/gastos`, `/ingresos`, etc.)
- QA-04: auth guard (unauthenticated → `/login`)
- QA-05: onboarding wizard end-to-end

**RF-07, RF-08 — Refactor (TASKS.md, low urgency):**
- Both files still under 200 lines; defer unless they grow during feature work

**UX-01 through UX-04 — Nice-to-have polish** (TASKS.md)

## How to Run

```bash
# Backend (must start first)
cd legacy-python-backend
.\start.ps1    # PowerShell — starts Docker at http://localhost:8000

# Frontend
cd economy-app
npm run dev    # http://localhost:3000
```

## Blockers

None.

## Non-Obvious Things

### Pattern for refactoring over-200-line containers (established 2026-06-20)

Extract in this order:
1. `feature.types.ts` — types, form shape types, empty-form constants, helper functions (fmtAmt, fmtMonth, etc.)
2. `hooks/useFeature.hook.ts` — all `useState` + all action functions + computed values; returns a big object; export `FeatureCtx = ReturnType<typeof useFeature>`
3. `components/TabName.tsx` — tab JSX receives `{ ctx: FeatureCtx }` and destructures what it needs
4. `components/SectionModals.tsx` — modal groups (source modals / income modals / expense modals); same `{ ctx }` prop
5. `containers/Feature.container.tsx` — thin: calls hook, renders tab switcher + tab components + modal components + confirm + info modals

The ctx pattern avoids prop-drilling explosion: each sub-component destructures exactly what it needs from the hook return value. TypeScript infers all types from `ReturnType<typeof useFeature>`.

### ConfirmSrcModal shape change

`confirmSrcModal` no longer has a `dateOpen` field. Shape is: `{ source: IncomeSourceFromAPI; amount: string; date: string }`.

### Backend datetime handling
- `incomes.date` and `expenses.date` are `TIMESTAMP WITHOUT TIME ZONE`.
- Frontend sends ISO strings with `Z` suffix. Pydantic parses them as timezone-aware datetimes.
- Repositories must call `.replace(tzinfo=None)` before ORM insert.

### NumericKeyboard ghost-click pattern
- When `open` goes `false`, tracks `closing` state for 320ms.
- Transparent backdrop stays mounted with `pointer-events: all` to absorb synthesized click.
- Keyboard panel plays `slideDown` with `pointer-events: none`. After 320ms: both unmount.

### DateTimePicker modes
- `chips`: Hoy / Ayer / Hace 2 días / Otra fecha — chips capture current time via `.toISOString()`.
- `picking`: All chips hidden. `[<input type="date">] [<HourMinuteInput>]` on one row. Full-width Confirmar + Cancelar stacked.
- `confirmed`: Formatted pill showing `📅 20 jun. 2026 · 14:35`. Full-width Cancelar returns to chips.
- Internal `draft` state isolates edits — parent only receives ISO on Confirmar.

### Income source confirm modal
- "✓ Confirmar" (fixed) and "Ingresar monto" (variable) both open `confirmSrcModal`.
- Fixed sources pre-fill `amount` from `src.base_amount`. Variable starts with empty `amount`.

### File naming conventions
- `<Name>.container.tsx` → exports `<Name>Container`
- `use<Name>.hook.ts` → exports `use<Name>`
- `<Name>.module.css` → scoped styles
- `<feature>.types.ts` → shared types + constants for that feature

### Auth token
- Stored in `localStorage` as `auth_token` and `auth_user`
- `api.client.ts` injects automatically — never pass manually
- 401 only redirects to `/login` if the user already had a stored token (`hadToken` check)
