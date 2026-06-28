# UI/UX Rules — Economy App

Extends and overrides `../UI-UX-RULES.md` (general rules). Rules here take precedence.

---

## MANDATORY — Before any UI/UX work

**Before writing, editing, or reviewing any frontend component or CSS, the AI agent MUST:**

1. Read this file (`economy-app/UI-UX-RULES.md`) in full.
2. Read the general rules file (`D:\github\saborea\UI-UX-RULES.md`) in full.
3. Cross-check every element against both files before generating code.
4. If a rule is unclear or two rules conflict, surface the conflict to the user — do not guess.

**No exceptions.** A component that looks correct but violates these rules will be rejected and must be rewritten. The cost of reading rules upfront is far lower than rewriting components after the fact.

---

## Sheet dismiss — no close or X buttons

Bottom sheets and modals **never** have a "Cerrar", "Cancelar", or ✕ button unless the sheet contains a **destructive or multi-step flow** that needs an explicit escape (e.g. a confirm-delete sheet where cancelling is the safe action).

For all informational and detail sheets, the backdrop click handles dismissal. Adding a close button is redundant — the user already knows to tap outside.

**Rule:** Do not add `Cerrar` / `×` / `Cancelar` as the last element of a sheet just to "provide a way to close." If the only purpose of the button is to dismiss, remove it.

**Exceptions where a cancel/close button IS required:**
- ConfirmModal (destructive action): `Cancelar` is the primary safe exit — backdrop should not be the only escape for a delete.
- Multi-step modal: a top-left back button (not the same as a close button) is needed for step navigation.
- Modals with no visible backdrop (full-screen): user has no other affordance to dismiss.

---

## Sheet / modal content animations

**Read the full rule in `../UI-UX-RULES.md` → "Bottom-sheet / modal content reveal".**

Quick reference for this project:

- **`<Modal>` component** (`features/core/components/Modal.component.tsx`): already implements JS-controlled reveal. All content inside `<Modal>` fades in automatically — no per-child animation needed.
- **Custom sheets** (`SourceDetailSheet`, `IncomeDetailSheet`): each has its own `revealed` state with `setTimeout(260ms)` on mount. All content is wrapped in a single `.detailBody` div that gets `.detailRevealed` after the delay.
- **Never add `animation:` to any element inside a sheet** — CSS animations fire at t=0 and complete before the sheet is visible. Use `transition` only, triggered by a JS class change after the slide completes.
- **Conditional fields** use the `.fieldReveal` / `.fieldRevealVisible` CSS grid trick from `Modal.module.css` — never `{condition && <field>}`.

---

## Color system

### Brand / UI colors

| Variable | Value | Semantic use |
|---|---|---|
| `--c-hdr` | `#1a5c38` | Primary color — buttons, active states, header bg |
| `--c-hdr-txt` | `#ffffff` | Text on primary-colored surfaces |
| `--c-alt` | `#f0f9f4` | Light green tint — selected card bg, pill active bg |
| `--c-green-border` | `#2e7d32` | Border on selected/positive elements |
| `--c-red-bg` | `#ffebee` | Error state background |
| `--c-red-border` | `#c62828` | Error state border |

### Money semantic colors

These 4 color families are locked to their financial meaning. Never swap them.

| Variable | Value | Meaning | Applies to |
|---|---|---|---|
| `--c-earn` | `#2e7d32` | **Earning** — money in | Income totals, income cards, income tab accent |
| `--c-earn-bg` | `#e8f5e9` | Earning background | Income card tint |
| `--c-spend` | `#c2185b` | **Spending** — money out | Expense totals, expense cards, expense tab accent, budget spent segment |
| `--c-spend-bg` | `#fce4ec` | Spending background | Expense card tint, chips |
| `--c-save` | `#1565c0` | **Saving** — goal progress | Goal bar, accumulated savings, net worth, patrimonio |
| `--c-save-bg` | `#e3f2fd` | Saving background | Savings segment tint |
| `--c-avail` | `#f9a825` | **Available** — safe to spend | Disponible hero, budget remainder, unallocated segment |
| `--c-avail-bg` | `#fff8e1` | Available background | Available tint |

> `--c-spend` replaces the old `--c-pink` / `--c-pink-bg` — same value, now semantically named.

---

## Progress bar segment colors

Overrides the general rule. Segment colors follow the money semantic system:

| Segment | Color variable | Meaning |
|---|---|---|
| Accumulated / saved | `--c-save` (blue) | Saving |
| Spent this month | `--c-spend` (pink) | Spending |
| Savings target | `--c-save` (blue, lighter or same) | Saving |
| Available / remainder | `--c-avail` (yellow) | Available |

## Progress bar tap hint

The "Toca para ver detalles" hint below every tappable bar must always be **centered horizontally**. Never left- or right-aligned. CSS: `text-align: center`. Applies to both the master budget bar and all bolsillo mini-bars.

---

## Navigation structure

- **TopBar**: home/dashboard icon on the left · app title centered · ⓘ optional on right.
- **BottomNav** (3 tabs only):
  | Tab | Route | Contains |
  |---|---|---|
  | Movimientos | `/transactions` | Ingresos tab + Gastos tab |
  | Finanzas | `/finance` | Presupuesto tab + Patrimonio tab |
  | Compras | `/purchases` | Wishlist tab + Decisor tab |
- Dashboard (`/`) accessed via home icon in TopBar — not a bottom tab.

---

## Dashboard

- **Hero bar**: full-width pill bar showing goal progress (`accumulated / goal`).
  - Accumulated segment: `--c-save` (blue)
  - Remaining segment: grey
- **Mes actual**: 3-segment combined bar.
  - Spent segment: `--c-spend` (pink)
  - Savings segment: `--c-save` (blue)
  - Available segment: `--c-avail` (yellow)
- `Disponible` (remaining after expenses + savings) shown centered, in `--c-avail` (yellow).
- Date/time shown in 12h format below the section title.
- Category spending shown as a **pie chart**, not a list.

---

## Transactions (Movimientos)

- **Ingresos tab**: `--c-earn` accent (green).
- **Gastos tab**: `--c-spend` accent (pink).
- Category filter chips use the active tab's accent color.

---

## Wishlist (Compras — Wishlist tab)

Card color coding by verdict:

| Verdict | Card background | Card border |
|---|---|---|
| COMPRAR SIN CULPA / COMPRAR YA | `#e8f5e9` | `#2e7d32` |
| ESPERA 72 HORAS / ESPERA 7 DIAS | `#fff8e1` | `#f9a825` |
| DESCARTADO | `#ffebee` | `#c62828` |
| COMPRADO | `#f5f5f5` | `#9e9e9e` |

- **Pending amount hero**: `--c-save` (blue), centered, first element on the page.
- **Filter pills** use the verdict colors: Verde · Amarillo · Rojo · Gris.
- Additional filters (name, price, priority) are hidden behind a filter icon — not shown by default.

---

## Decisor (Compras — Decisor tab)

- **No** `articulo` / item name field — the tool scores the decision, not the item.
- Precio + días esperando on the **same row**.
- Rating inputs use **face icons**: 36px unselected · 44px selected.
- 5 selected face colors: `red` · `pink` · `yellow` · `light-green` · `strong-green`.
- **No numeric score shown** — verdict is color only (red / yellow / green).

---

## Auth flow (unified Login + Register)

- Single `AuthContainer` handles both `/login` and `/register`.
- Mode determined by pathname — no separate components.
- Google-style: **one field per step**, slide transition between steps.
- Eye toggle on all 3 password fields (login password, register password, confirm password) — each independent.
- Live rule-list validation per field (see general rules for format).

### Email existence checks (economy-app specific)

**Login (`/login`, email step):**
- Check fires on "Siguiente" press — not while typing.
- Button switches to `"Verificando..."` + disabled while the API call runs.
- On not found: add `"Este correo no está registrado"` to the rule list and stay on the email step.
- On network error: proceed to password step anyway — the password attempt will fail with a natural API error.
- Reset the "not found" error as soon as the user edits the email field.

**Register (`/register`, email step):**
- Check is debounced — fires 600ms after the user stops typing, only when the email passes format validation.
- Siguiente button shows `"Verificando..."` + disabled while checking.
- On exists: add `"Este correo ya está registrado"` to the rule list and block progression.
- Reset the "exists" error as soon as the user edits the email field.

**Endpoint:** `GET /api/v1/auth/check-email?email=<email>` — public (no auth required).

**API client 401 behavior:**
- Only redirect to `/login` if the user already had a stored token (genuine session expiry).
- If the user had no token and gets a 401 (wrong login credentials), do NOT redirect — just surface the error in the rule list. Redirecting on a failed login attempt resets the user back to the email step, which is disorienting.

---

## Onboarding wizard

- 4 steps: Goal amount · Income sources · Fixed expenses (skippable) · Plan reveal.
- Step 2: income sources list (see "Income sources" section below). At least one source required to proceed.
- Step 3: 13 fixed-expense categories with amount inputs. Always enabled — 0 is valid.
- Step 3 button order: Siguiente → Volver → Omitir este paso (text link at bottom).
- Step 4: 3 pace pills (Relajado 20% · Recomendado 35% · Agresivo 50% of available income).
- After finish: creates income sources via API, saves settings with computed `monthly_income`, creates budgets → redirect to `/`.
- Question title: centered horizontally on all steps.

### Step theming

Each onboarding step IS one financial concept. The entire step — dots, title, button, input, keyboard, info modal — uses that concept's color palette. Page and input backgrounds stay white; the color lives in the accents.

Implementation: CSS custom properties defined on the `.page` container per step. All child components inherit via cascade with `var(--step-color, var(--c-hdr))` fallback.

| Step | Concept | `--step-light` | `--step-mid` | `--step-color` |
|---|---|---|---|---|
| 1 — ¿Cuánto quieres ahorrar? | Saving | `#bbdefb` | `#64b5f6` | `#1565c0` |
| 2 — ¿Cuánto ganas al mes? | Earning | `#c8e6c9` | `#66bb6a` | `#2e7d32` |
| 3 — ¿Cuánto gastas al mes? | Spending | `#f8bbd9` | `#f48fb1` | `#c2185b` |
| 4 — Tu plan de ahorro | Saving | `#bbdefb` | `#64b5f6` | `#1565c0` |

**Tone assignment per element:**

| Tone | Elements |
|---|---|
| `--step-light` | Inactive dots · input border at rest · expense list border · expense row dividers · digit key press · active pace-pill background |
| `--step-mid` | ⓘ info button · backspace key icon · category icons in expense list |
| `--step-color` | Title text · active dot · Siguiente button · input border on focus · MoneyInput currency symbol · MoneyInput digits · blinking cursor · keyboard value display · keyboard "Listo" button · modal title · InfoModal active tab · InfoModal term labels |
| Unchanged (grey) | Volver button · Omitir link · digit keyboard buttons · inactive dots background (uses `--step-light` instead of grey) |

---

## Income sources

The app models income as **recurring templates** (sources), not as one-off entries. This lets the app know what to expect every month and prompt the user to confirm or enter amounts — rather than requiring the user to remember to log every payment.

### Source model

| Field | Values | Description |
|---|---|---|
| Label | text | e.g. "Salario Shokworks", "Comisiones ventas" |
| Type | `fixed` / `variable` | Fixed = known amount every cycle. Variable = user enters actual amount each cycle (commissions, freelance) |
| Frequency | `weekly` / `biweekly` / `monthly` | Payment cycle |
| Base amount | number or null | Null if variable |

**Monthly equivalent formula** (used for plan calculation):

| Frequency | Multiplier |
|---|---|
| `monthly` | × 1 |
| `biweekly` | × 2 |
| `weekly` | × 4.33 |

Variable sources contribute $0 to the plan until actually confirmed. The plan updates automatically as real amounts are entered month by month.

### Onboarding step 2 — building the source list

The user adds sources one by one via a modal form:
- Label (text input)
- Type toggle: `Fijo` / `Variable` — pill buttons
- Frequency toggle: `Semanal` / `Quincenal` / `Mensual` — pill buttons
- Amount MoneyInput — shown only when type is `Fijo`; hidden for `Variable`

Each added source appears as a row in a scrollable list showing label + frequency badge + type badge + monthly equivalent (or "Variable"). A running "Total mensual estimado" line updates live. Requires at least one source to advance to step 3.

### Transactions — Ingresos tab structure

The Ingresos tab is split into two sections:

**"Fuentes de ingreso"** — one card per configured source:
- Fixed, not yet confirmed → `[✓ Confirmar]` button → one tap creates an income entry with the base_amount and links it to the source via `source_id`
- Variable, not yet confirmed → `[Ingresar monto]` button → opens a MoneyInput modal → user enters actual amount → creates income entry
- Already confirmed → shows amount in green + DotsMenu (edit amount · quitar confirmación)

**"Otros ingresos"** — manual one-off entries with no source link (bonuses, gifts, side income that doesn't repeat):
- `[+]` button → add income modal (same as before but `source_id: null`)
- Cards shown below the add button

**Summary row** (between month nav and sections):
- Esperado: sum of `monthly_equivalent` of all active sources (the plan number)
- Confirmado: sum of all actual income entries for the month (sources + manual)

### Source card — tappable row with fill progress

Source cards in "Fuentes de ingreso" are **tappable rows** (no DotsMenu). Tapping opens `SourceDetailSheet`.

**Card visual:**
- Background fill (`#f0fbf1`) grows left-to-right: width = `(confirmedCount / expectedSlots) * 100%`, `transition: 600ms ease`.
- Card needs `position: relative; overflow: hidden` to clip the fill.
- Card content on `position: relative; z-index: 1`.
- Right side shows `"X/Y"` counter in green **only when partially confirmed** (not 0/N and not N/N).
- No DotsMenu, no exposed Confirmar button on the card face.

**SourceDetailSheet content:**
- Header: source label + frequency · type subtitle.
- Centered row of `check_circle` (green) / `radio_button_unchecked` (grey) icons — one per expected payment slot.
- One row per slot: label + date (if confirmed) or countdown (if pending).
- **Confirmar button only renders when `slot.date <= today`** — future slots show countdown only.
- Quitar button for confirmed slots (opens unconfirm modal after sheet closes).
- Footer: "Editar fuente" + "Cerrar" — sheet dismisses before opening any modal (`closeAndThen` pattern).

### "Otros ingresos" cards — tappable row

Manual income cards (source_id = null) are **tappable rows** (no DotsMenu). Tapping opens `IncomeDetailSheet` — a simple action sheet with Editar · Eliminar · Cancelar.

### Payment slot schedule (hardcoded)

| Frequency | Slot dates | `due_day` used? |
|---|---|---|
| `monthly` | Day `due_day` of the month | ✅ Yes |
| `biweekly` | Day 1 and day 15 | ❌ Ignored |
| `weekly` | Days 1, 8, 15, 22 (and 29 if month allows) | ❌ Ignored |

Biweekly and weekly schedules are hardcoded conventions. Do not ask the user when they receive these payments — the answer is always "1st and 15th" / "first of each week."

### Source form — due_day field visibility

The "¿Qué día del mes lo recibes?" field (`DayInput`) only renders when `frequency === 'monthly'`. It is hidden for weekly and biweekly sources — they use the hardcoded schedule above. Never show a field the user cannot meaningfully answer.

### Sources are managed from Transactions

The `[+]` button in the "Fuentes de ingreso" section header opens an "Agregar fuente" modal — same form as onboarding. Sources persist across months. Delete a source via the `SourceDetailSheet` footer.

### Data model

```
income_sources: id, user_id, label, income_type, frequency, base_amount, is_active
incomes:        id, user_id, source_id (nullable FK), date, source, amount, type, notes
```

`incomes.source_id` links a confirmed entry back to its template. Manual entries have `source_id = null`. This distinction drives the two-section layout in the Ingresos tab.

---

## Form labels — conversational questions (economy-app applied labels)

All modal and settings forms use question-style labels per the general rule. Exceptions (compact paired rows) keep noun labels. Reference:

| Form | Field | Label applied |
|---|---|---|
| Add/edit income source | type toggle | ¿El monto de esta fuente...? |
| Add/edit income source | frequency toggle | ¿Cada cuánto lo recibes? |
| Add/edit income source | amount | ¿Cuánto recibes por pago? |
| Add/edit manual income | source | ¿De dónde viene este ingreso? |
| Add/edit manual income | amount | ¿Cuánto recibiste? |
| Add/edit expense | date | ¿Cuándo pagaste? |
| Add/edit expense | description | ¿Qué compraste o pagaste? |
| Add/edit expense | amount | ¿Cuánto gastaste? |
| Add/edit expense | category pills | ¿A qué categoría pertenece? |
| Add/edit expense | tipo pills | ¿Cómo clasificas este gasto? |
| Add/edit expense | amount | ¿Cuánto gastaste? |
| Settings | goal_amount | ¿Cuánto quieres ahorrar en total? |
| Settings | monthly_income | ¿Cuánto ganas al mes? |
| Settings | monthly_savings_target | ¿Cuánto quieres ahorrar cada mes? |
| Wishlist add/edit | item name | ¿Qué quieres comprar? |
| Wishlist add/edit | price | ¿Cuánto cuesta? |
| Wishlist add/edit | priority | ¿Qué tan prioritario es? |
| Add/edit net worth | month field | ¿Para qué mes es este registro? |
| Add/edit net worth | amount field | ¿Cuánto ahorraste este mes? |

**Exception (compact row, noun labels kept):** expense modal `Categoría` + `Tipo` side-by-side row — full question text overflows at half-modal width. Income modals no longer use a side-by-side row for Monto + Tipo; each is its own full-width field.

---

## Onboarding fixed expense step — category list

Only include categories where the user pays **the exact same amount every month** (or near-exact for utilities). The purpose of this step is to establish a reliable baseline for the savings plan — not to enumerate every possible expense.

**Included (7):**
- Arriendo / Renta — always fixed
- Electricidad — semi-fixed utility
- Agua — semi-fixed utility
- Gas — semi-fixed utility
- Internet — fixed contract
- Teléfono — fixed plan
- Gym — fixed membership

**Excluded and why:**
- Alimentación — varies week to week; belongs in variable spending
- Transporte / Gasolina — depends on trips taken
- Higiene personal — stocked irregularly, not monthly
- Casa / Hogar — irregular purchases
- Salud / Médico — unpredictable, often zero
- Mantenimiento de carro — quarterly at best

Variable expenses are tracked through the expenses system over time. The onboarding plan is only as accurate as the fixed inputs — including variable categories introduces noise and forces users to invent numbers.

---

## Budget categories

- Every category must be a specific, identifiable expense type.
- **Never create a generic catchall** like "Suscripciones" or "Varios".
- If a user has a subscription (Netflix, Spotify), they log it as a regular expense under the closest category.

### The Movimientos vs Presupuesto split — which categories go where

This is the most important UX rule for the finance system. The two systems are not interchangeable.

| System | Purpose | Categories that belong here |
|---|---|---|
| **Movimientos → Gastos frecuentes** | Recurring bills with a known due date. User "confirms" a specific payment on a specific date. | Arriendo, Electricidad, Agua, Gas, Internet, Telefono, Gym, Carro, Claude |
| **Finance → Presupuesto** | Spending envelopes without a fixed date. User spends freely; each logged expense reduces the bar. | Alimentacion, Transporte, Higiene, Salud, Casa, Ocio, Imprevistos, Caprichos, Tecnologia |

**The link:** when a user logs any expense in Movimientos (or Otros gastos) with a category tag, the backend automatically reduces `spent_this_month` for that budget category in Presupuesto. The systems are connected through the category tag — they are not redundant.

**Frontend constant:** `BUDGET_CATEGORIES` in `features/finance/finance.types.ts` — the 9 envelope categories. Use this to populate the category picker in the Presupuesto add-category modal and to filter the list (never show Movimientos-type categories in the budget picker).

---

## Settings / financial values

- **Never hardcode** income, savings target, or goal amount — all values come from `/api/v1/settings`.
- Settings are created during onboarding and editable at `/settings`.

---

## MoneyInput component

All money inputs use `features/core/components/MoneyInput.component.tsx`. See general rules for full spec. Economy-app specific:

- Currency symbol prop default: `'$'` until user settings API returns a configured symbol.
- Display format: European — `4.232,00` · `23,03` · `1.000.000,00`

---

## NumericKeyboard — ghost-click safety (closing-backdrop pattern)

When the keyboard dismisses, the browser synthesizes a `click` event. If the keyboard unmounts immediately, that click lands on whatever element is now visible at those coordinates — triggering buttons the user never intended.

**Fix:** on dismiss, enter a `closing` state for 320ms before full unmount:
- Transparent full-screen backdrop stays mounted with `pointer-events: all` — absorbs the ghost click silently.
- Keyboard panel plays `slideDown` animation with `pointer-events: none`.
- After 320ms both unmount.

This is implemented in `NumericKeyboard.component.tsx` via `mounted` / `closing` state driven by a `useEffect` on the `open` prop. All consumers are unaffected — they just toggle `open`.

---

## HourMinuteInput component

Used whenever an input requires hour + minute (not just date). Located at `features/core/components/HourMinuteInput.component.tsx`.

- Two tappable display fields separated by `:` — HH (00–23) and MM (00–59).
- Tapping HH opens `NumericKeyboard` labeled `"Hora: 14"`. Done auto-advances focus to MM.
- MM opens keyboard labeled `"Minutos: 35"`. Done closes keyboard and fires `onChange(hour, minute)`.
- Uses same blinking cursor pattern as other custom inputs — `border-bottom` animation on active field.
- Props: `hour: number`, `minute: number`, `onChange: (h, m) => void`.

---

## DateTimePicker component

All date+time entry points use `features/core/components/DateTimePicker.component.tsx`. Never build inline chip rows or inline date inputs directly in a modal.

**Three modes (internal state machine):**

| Mode | Trigger | Layout |
|---|---|---|
| `chips` | Default | Row of chips: Hoy · Ayer · Hace 2 días · Otra fecha |
| `picking` | Tap "Otra fecha" | Chips hidden; `[<input type="date">  <HourMinuteInput>]` on one row; Confirmar + Cancelar buttons below (each full-width) |
| `confirmed` | Tap "Confirmar" in picking mode | Formatted pill `📅 20 jun. 2026 · 14:35`; Cancelar button returns to chips mode |

**Rules:**
- Chips (Hoy/Ayer/Hace 2 días) always capture the current time via `.toISOString()` — not just the date.
- When "Otra fecha" is tapped, all chips disappear — do not show both chips and the date inputs at once.
- Date input and HourMinuteInput sit on the same row (`display: flex`).
- Confirmar and Cancelar are stacked vertically, each full-width — not side by side.
- After Confirmar: the parent receives the ISO string and the picker shows only the formatted display + Cancelar.
- Cancelar from confirmed mode returns to `chips` — not back to picking.
- Internal `draft` state isolates edits until Confirmar fires — parent only gets the ISO on confirm, not on every keystroke.
- Props: `value: string` (ISO), `onChange: (iso: string) => void`, `label?: string`.

---

## Dashboard — disponible floor

`disponible` (remaining after expenses + savings) is always displayed as `Math.max(0, disponible)` — never negative. When the underlying value is negative (overspent), a breakdown row appears below the hero showing: Por ahorrar · Gastos · Te faltan [amount]. Color: `--c-save-bg` background.

---

## Expense categories (VALID_CATEGORIES)

Backend source of truth: `legacy-python-backend/app/features/expenses/schemas.py` → `VALID_CATEGORIES`.
Frontend mirror: `features/expenses/hooks/useExpenses.hook.ts` → `CATEGORIES`.

Current list (18):
`Arriendo` · `Electricidad` · `Agua` · `Gas` · `Internet` · `Telefono` · `Alimentacion` · `Transporte` · `Higiene` · `Salud` · `Casa` · `Gym` · `Carro` · `Claude` · `Ocio` · `Imprevistos` · `Caprichos` · `Tecnologia`

Keep both files in sync when adding/removing categories.

---

## Income form — create vs edit rules

The add-income and edit-income modals share the same fields but have one intentional difference.

**Create form (Agregar ingreso):**
- Fields: date · source · amount · tipo
- No notes field — no reason needed when creating

**Edit form (Editar ingreso):**
- Fields: date · source · amount · tipo · note
- Note field uses the `NoteInput` component (slide-up panel, native keyboard)
- The note is an **edit log reason**, not a property of the income — it goes into `income_edits`, not into the income record
- Label for note field: `"¿Por qué estás editando este ingreso?"` (conversational, optional)

Both forms must be structurally identical in every other way: same labels, same placeholders, same component choices, same field order.

---

## Income tipo — display rules per context

The Tipo toggle (Fijo / Variable / Extra) must adapt based on whether the income is source-linked.

**Source-linked income (source_id not null):**
- Show only `Fijo` and `Variable`
- Never show `Extra` — source incomes are recurring by definition

**Manual income (source_id null — "Otros ingresos"):**
- Tipo field is **not shown** — all manual entries are `Extra` by definition
- `type` is always sent as `"Extra"` hardcoded; the user never chooses it
- Reason: "Otros ingresos" are one-off entries (bonus, gift, side income). Recurring income belongs in "Fuentes de ingreso", not here
- Monto is always full-width

See `BUSINESS-RULES.md` for the full domain definition of each type.

---

## NoteInput component

Used in the edit-income form (and any future form that captures an optional edit reason). Located at `features/core/components/NoteInput.component.tsx`.

**Collapsed state (no note):**
- Shows a subtle `+ Agregar nota` grey text link — not a button, not prominent
- Same visual weight as a muted secondary text; it must not compete with form fields

**Collapsed state (note exists):**
- Shows the note text truncated to 1 line, tappable to re-open

**Expanded state (panel open):**
- A `position: fixed` bottom panel slides up (same visual pattern as NumericKeyboard)
- Contains a native `<input>` or `<textarea>` that auto-focuses — native keyboard appears above the panel
- Panel has a `Listo` button (full-width) to confirm and close
- Ghost-click closing-backdrop pattern applies: 320ms transparent overlay after dismiss absorbs the synthesized click from the native keyboard dismissal

**Props:** `value: string`, `onChange: (v: string) => void`, `placeholder?: string`

---

## Text input security rules

- All `<input>` and `<textarea>` that accept free text must have a `maxLength` attribute matching the backend limit
- Short labels (source, description, name): `maxLength={150}`
- Notes and reasons: `maxLength={500}`
- Never use `dangerouslySetInnerHTML` with user-supplied strings
- Never interpolate user-supplied text into `style`, `href`, `src`, or event handler attributes

See `BUSINESS-RULES.md` for backend equivalent rules.

---

## Spacing grid — 4px rule (NEW — MANDATORY)

**All margin, padding, and gap values must be multiples of 4.**

| Allowed | Tokens |
|---|---|
| 4px | `--space-xs` |
| 8px | `--space-sm` |
| 12px | — (use `var(--space-sm)` + explicit override only when needed) |
| 16px | `--space-md` |
| 24px | `--space-lg` |
| 32px | `--space-xl` |

**Never use** 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18... as spacing values. If you find yourself reaching for one of these numbers, round up or down to the nearest multiple of 4.

**Preference rule:** prefer multiples of 8 (8, 16, 24, 32) when space allows. Use 4 only when 8 is too much.

**Font size is exempt** from the grid rule — use the defined scale (`--font-size-sm: 13px`, `--font-size-md: 15px`, `--font-size-lg: 18px`, `--font-size-xl: 22px`). Fine-grained font values like `11px` for captions are acceptable as font-size only.

**Applies to:** `margin`, `padding`, `gap`, `top`, `left`, `bottom`, `right` in fixed/absolute positioned elements, `border-width` (but 1px borders are always OK), `border-radius` when used as a generic corner value.

---

## Page & list entry animations

Every page container gets `animation: fadeIn 400ms ease both` — defined in `globals.css`.

Item cards inside a list get a staggered entrance:
```css
.card { animation: fadeInUp 280ms ease both; animation-delay: calc(var(--i, 0) * 60ms); }
```
Set `style={{ '--i': index } as React.CSSProperties}` on each card to activate the stagger.

Section headers get `animation: fadeInUp 260ms ease both` — slightly faster than cards.

**keyframes (globals.css):**
```css
@keyframes fadeIn    { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; } }
@keyframes fadeInUp  { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; } }
```

**Never add** additional CSS animations on elements inside bottom sheets — see sheet reveal rules above.

---

## Tab bar

The top tab bar is sticky, sits below the TopBar, and uses an underline indicator — **never a pill/filled background**.

```css
.tabs {
  display: flex;
  border-bottom: 2px solid var(--c-border);
  background: var(--c-bg);
  position: sticky;
  top: 0;
  z-index: 10;
}
.tab {
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px; /* overlaps the container border-bottom */
  font-size: var(--font-size-md); font-weight: 500; color: var(--c-text-muted);
}
.tabActive { color: var(--c-hdr); font-weight: 700; border-bottom-color: var(--c-hdr); }
.tabActivePink { color: var(--c-spend); font-weight: 700; border-bottom-color: var(--c-spend); }
```

- Info icon inside tab bar: `font-size: 16px` Material Symbol, no border, padding 0.
- Tab switching animates content with `slideInFromRight` / `slideInFromLeft` (280ms, cubic-bezier(0.4, 0, 0.2, 1)).

---

## Month navigation bar

Appears directly below the tab bar on Ingresos, Gastos tabs.

```css
.monthNav {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  background: var(--c-surface); border-bottom: 1px solid var(--c-border);
}
.monthBtn { font-size: 22px; color: var(--c-hdr); padding: 0 var(--space-sm); }
.monthLabel { font-weight: 600; font-size: var(--font-size-md); text-transform: capitalize; }
```

- Arrows are `‹` and `›` characters (not Material icons).
- Month label is always **capitalized** (`text-transform: capitalize`).
- Background is `var(--c-surface)` — one shade darker than page background.

---

## Section headers

**Exact canonical pattern from Transactions:**

```css
.sectionHeader {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-md) var(--space-md) var(--space-xs);
  animation: fadeInUp 260ms ease both;
}
.sectionLabel {
  font-size: var(--font-size-sm); font-weight: 700; color: var(--c-text-muted);
  text-transform: uppercase; letter-spacing: 0.05em;
}
```

**Count suffix** (e.g., "3 gastos"): inline `<span>` inside `.sectionLabel`, same element, with:
```css
.sectionCount { font-weight: 400; font-size: 11px; text-transform: none; letter-spacing: 0; opacity: 0.7; }
```

---

## Cards

All lists use cards — never `<table>`. Every card follows this structure:

```css
/* Card container */
.card {
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);  /* 8px */
  animation: fadeInUp 280ms ease both;
  animation-delay: calc(var(--i, 0) * 60ms);
}

/* Card main row */
.cardTop {
  display: flex; align-items: center;
  padding: var(--space-sm) var(--space-md);
  gap: var(--space-sm);
}

/* Card title — expands to fill available space */
.cardName { flex: 1; font-weight: 700; font-size: var(--font-size-md); }

/* Card amount — right-aligned, semantic color */
.cardAmount { font-size: var(--font-size-sm); font-weight: 600; }
.cardAmountEarn  { color: var(--c-earn); }
.cardAmountSpend { color: var(--c-spend); }

/* Card secondary row — badges, date, notes */
.cardSub {
  display: flex; gap: var(--space-sm);
  padding: 0 var(--space-md) var(--space-sm);
  font-size: var(--font-size-sm); color: var(--c-text-muted);
  flex-wrap: wrap;
}
```

**Tappable card** (entire row opens a detail sheet): add `cursor: pointer; -webkit-tap-highlight-color: transparent; role="button" tabIndex={0}` to the card div.

**Never** use `overflow: hidden` on a tappable card that previously contained a DotsMenu — only add it when the card contains a background-fill element with no dropdown menus.

---

## Chips (inline category/type badges)

Small status badges that appear inside `.cardSub`:

```css
.chip {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  background: var(--c-info);  /* light blue — income / neutral */
  color: var(--c-hdr);
  font-weight: 600;
}
.chipGastos { background: var(--c-spend-bg); color: var(--c-spend); }  /* pink — expense */
```

- Use `var(--c-info)` background for income-related and neutral chips.
- Use `var(--c-spend-bg)` for expense-related chips.
- Never use red for expense chips — red is error only.

---

## Progress bar — full spec

```css
.progressWrap { padding: var(--space-sm) var(--space-md) 0; }

.progressBar {
  position: relative;
  height: 52px; border-radius: 26px;
  background: var(--c-border);
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.progressFillEarn, .progressFillSpend {
  position: absolute; inset: 0 auto 0 0;
  border-radius: 26px;
  transition: width 2s ease-out;  /* 2s — intentionally slow, feels satisfying */
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.progressFillEarn  { background: var(--c-earn); }
.progressFillSpend { background: var(--c-spend); }

/* Label inside fill — only shows if segment ≥ 15% wide */
.progressFillLabel { color: #fff; font-size: 11px; font-weight: 700; padding: 0 12px; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }

/* Remainder label — only shows if fill < 85% */
.progressRemainLabel { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 11px; font-weight: 700; color: var(--c-text-muted); }

/* Meta row below bar */
.progressMeta { display: flex; justify-content: space-between; margin-top: 6px; padding: 0 4px; min-height: 16px; }
.progressMetaConfirm      { font-size: 11px; font-weight: 600; color: var(--c-earn); }
.progressMetaConfirmSpend { font-size: 11px; font-weight: 600; color: var(--c-spend); }
.progressMetaExpected     { font-size: 11px; font-weight: 600; color: var(--c-text-muted); margin-left: auto; }

/* Tap hint */
.progressHint { text-align: center; font-size: 10px; color: var(--c-text-muted); opacity: 0.6; margin: 4px 0 0; pointer-events: none; }
```

**Logic rules:**
- Amount inside fill only when `fillPct >= 15` — otherwise label would be clipped.
- Remainder label only when `fillPct < 85` — otherwise it would overlap the fill.
- Meta row only shows when `fillPct < 15` OR `fillPct >= 85` (edge cases where bar alone is ambiguous).
- Confirm meta shown when `fillPct < 15 && confirmed > 0`.
- Expected meta shown when `fillPct >= 85 && fillPct < 100`.

---

## Count-up animation on hero numbers

Use the `useCountUp(target, duration, delay)` hook for all summary totals and progress totals. Never show a static number that "jumps" to its value.

```ts
const animConfirmed = useCountUp(totalConfirmed, 750, 300); // 750ms, starts at 300ms
const animExpected  = useCountUp(totalExpected,  750, 300);
```

Apply to: progress bar amounts, total cards, dashboard hero numbers, summary sheet values. Do NOT apply to individual card amounts — too noisy when many items render at once.

---

## Source card with background-fill progress

Income source cards use a horizontal background fill to show payment completion ratio visually:

```css
.sourceCard { position: relative; overflow: hidden; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.sourceCardFill {
  position: absolute; top: 0; left: 0; bottom: 0;
  background: #f0fbf1;  /* very light green — income */
  transition: width 600ms ease;
  pointer-events: none; z-index: 0;
}
.sourceCardTop { position: relative; z-index: 1; /* content above fill */ }
```

Width formula: `(confirmedCount / slots.length) * 100%`.

**Counter (X/Y):** show only when partially confirmed (`confirmedCount > 0 && confirmedCount < slots.length`). Never show at 0/N (nothing yet) or N/N (fully done — the fill communicates it).

---

## Toggle pills (form field option selectors)

Used inside modals for choosing between 2–4 mutually-exclusive options (income type, frequency, etc.):

```css
.toggleRow { display: flex; gap: var(--space-xs); width: 100%; }
.toggleOption {
  flex: 1; padding: var(--space-xs) 0;
  background: var(--c-bg); border: 1px solid var(--c-border); border-radius: var(--radius-sm);
  font-size: var(--font-size-sm); font-weight: 500; color: var(--c-text-muted);
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.toggleOptionActive         { border-color: var(--c-hdr);   background: var(--c-alt);       color: var(--c-hdr);   font-weight: 700; }
.toggleOptionActiveSpend    { border-color: var(--c-spend);  background: var(--c-spend-bg);  color: var(--c-spend); font-weight: 700; }
```

Scrollable pill row (for long lists like categories):
```css
.toggleRowScroll { display: flex; gap: var(--space-xs); overflow-x: auto; scrollbar-width: none; padding-bottom: 2px; }
.toggleRowScroll::-webkit-scrollbar { display: none; }
.toggleOptionAuto { flex: none; padding: var(--space-xs) var(--space-sm); white-space: nowrap; /* same border/bg/color as .toggleOption */ }
```

---

## Standard page states

Every list section must render exactly one of these three non-data states. No custom wording, no other patterns.

```css
.loading { padding: var(--space-xl); text-align: center; color: var(--c-text-muted); }
.error   { padding: var(--space-md); color: var(--c-red-border); background: var(--c-red-bg); border-radius: var(--radius); margin: var(--space-md); }
.empty   { padding: var(--space-xl); text-align: center; color: var(--c-text-muted); font-size: var(--font-size-sm); }
```

Text conventions:
- Loading: `"Cargando..."`
- Error: raw error string from hook
- Empty (no data): context-specific short sentence (`"Sin fuentes configuradas."`, `"Sin gastos este mes."`)
- Empty (filtered, no match): indicate filter is active (`"Sin gastos con estos filtros."`)

---

## Bottom sheet anatomy

Every bottom sheet in the app follows the same structure:

```
┌─────────────────────────────────┐  ← border-radius: 16px 16px 0 0
│  Header (title + optional sub)  │  ← padding: 16px 16px 8px; border-bottom: 1px solid border
│─────────────────────────────────│
│  Body content (scrollable)      │  ← flex: 1; overflow-y: auto
│─────────────────────────────────│
│  Action rows (52px each)        │  ← full-width; see "Sheet action rows"
│─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │  ← 4px solid var(--c-surface) before cancel/danger group
│  Cancel (52px, centered)        │
└─────────────────────────────────┘
```

```css
.detailSheet {
  position: fixed; left: 0; right: 0; bottom: 0;
  background: var(--c-bg); border-radius: 16px 16px 0 0;
  z-index: 201; padding-bottom: env(safe-area-inset-bottom, 16px);
  animation: detailSheetIn 250ms ease forwards;
  max-height: 80vh; overflow-y: auto;
}
.detailSheetClosing { animation: detailSheetOut 300ms ease forwards; pointer-events: none; }

@keyframes detailSheetIn  { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes detailSheetOut { from { transform: translateY(0); } to { transform: translateY(100%); } }

.detailHeader { padding: var(--space-md) var(--space-md) var(--space-sm); border-bottom: 1px solid var(--c-border); }
.detailTitle  { display: block; font-size: var(--font-size-lg); font-weight: 700; color: var(--c-hdr); }
.detailSub    { display: block; font-size: var(--font-size-sm); color: var(--c-text-muted); margin-top: 2px; }
```

**Content reveal:** all content inside the sheet is wrapped in a single `.detailBody` div. JS adds `.detailRevealed` after 260ms (10ms past the 250ms slide-in). Uses `transition`, never `animation`.

```css
.detailBody    { opacity: 0; transform: translateY(6px); transition: opacity 240ms ease, transform 240ms ease; }
.detailRevealed { opacity: 1; transform: translateY(0); }
```

**Backdrop:** `z-index: 200`, `background: rgba(0,0,0,0.4)`, 220ms fade-in / 300ms fade-out.

---

## Sheet footer — two-button row (Edit + Cancel)

When a sheet's primary action is "edit this item" (not a menu of many actions), use a two-button footer:

```css
.detailFooter {
  display: flex; gap: var(--space-sm); padding: var(--space-md);
  border-top: 4px solid var(--c-surface);
  margin-top: var(--space-sm);
}
.detailEditBtn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: var(--space-xs);
  padding: var(--space-sm) 0; background: none;
  border: 1px solid var(--c-hdr); border-radius: var(--radius-sm);
  font-size: var(--font-size-sm); font-weight: 600; color: var(--c-hdr);
}
.detailEditBtn .material-symbols-outlined { font-size: 16px; }
.detailCancelBtn {
  flex: 1; padding: var(--space-sm) 0; background: none;
  border: 1px solid var(--c-border); border-radius: var(--radius-sm);
  font-size: var(--font-size-sm); font-weight: 600; color: var(--c-text-muted);
}
```

Note: these use `var(--radius-sm)` (4px) — NOT `var(--radius)` (8px). Sheet footer buttons are compact.

---

## Date quick chips (3-chip pattern)

Compact date selection used in expense / income add modals before the full DateTimePicker is needed:

```css
.dateChips { display: flex; gap: var(--space-xs); flex-wrap: wrap; }
.dateChip {
  padding: 8px var(--space-sm);
  border: 1px solid var(--c-border); border-radius: 20px;
  background: var(--c-bg); font-size: var(--font-size-sm); color: var(--c-text);
  transition: border-color 0.15s, background 0.15s;
}
.dateChipActive { border-color: var(--c-hdr); background: var(--c-alt); color: var(--c-hdr); font-weight: 600; }
.dateChipOther  { border: none; background: none; font-size: var(--font-size-sm); color: var(--c-text-muted); text-decoration: underline; text-underline-offset: 3px; }
```

"Otra fecha" is a text link — no pill, no border, just underlined muted text.

---

## Summary insight box

Used in summary sheets to show a key takeaway (income insight, expense insight):

```css
.summaryInsight {
  margin: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: var(--c-earn-bg); border-radius: var(--radius);
  font-size: var(--font-size-sm); color: var(--c-earn); font-weight: 500; line-height: 1.5;
}
.summaryInsightSpend { background: var(--c-spend-bg); color: var(--c-spend); }
```

One insight box per summary sheet. No icon. Content is a short sentence generated from the user's actual data.

---

## Comparison mini-bars (summary sheet)

Thin 6px bars used to compare current vs previous month spending per category:

```css
.summaryBarTrack { position: relative; height: 6px; background: var(--c-border); border-radius: 3px; overflow: hidden; }
.summaryBarFillCurrent  { position: absolute; inset: 0 auto 0 0; background: var(--c-spend); border-radius: 3px; transition: width 800ms ease-out; }
.summaryBarFillPrevious { position: absolute; inset: 0 auto 0 0; background: rgba(194, 24, 91, 0.28); border-radius: 3px; transition: width 800ms ease-out; }
```

Section title above comparison rows: `font-size: 11px; font-weight: 700; color: var(--c-text-muted); text-transform: uppercase; letter-spacing: 0.05em`.

Delta badges: `font-size: 11px; font-weight: 700`. Colors: up = `var(--c-spend)`, down = `var(--c-earn)`, neutral = `var(--c-text-muted)`.

---

## Inline filter panel (collapsible)

The Gastos filter uses an inline panel that expands/collapses — no modal, no bottom sheet. The expand/collapse uses the CSS grid row trick:

```css
.filterPanel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 280ms ease; }
.filterPanelOpen { grid-template-rows: 1fr; border-bottom: 1px solid var(--c-border); }
.filterPanelInner { overflow: hidden; }
```

**Filter icon state**: when filters are active AND the panel is closed, show a small red dot on the filter icon:
```css
.filterDot { position: absolute; top: 3px; right: 3px; width: 6px; height: 6px; border-radius: 50%; background: var(--c-spend); }
```

Filter icon button: 28×28px, no border, `color: var(--c-text-muted)`. Active: `color: var(--c-spend)`.

**Selected filter chips** show as name chips INSIDE the filter question row (not as a count). Example: showing "Alimentacion · Casa" under the category question.

---

## Category picker keyboard (ExpenseSrcPickerKeyboard)

The reusable picker for selecting a category or classification from a list with search + add-new. Located at `features/transactions/components/ExpenseSrcPickerKeyboard.tsx`.

**When to use:** any time the user selects a value from a list that:
- Has > 5 items (scrolling is needed), OR
- Needs a search bar, OR
- Allows adding new options

**Never use** a `<select>` or a static pill grid for these lists.

**Structure:**
- Backdrop at z-index 200, sheet at z-index 201 (above the modal overlay)
- Header: back arrow + title + add-new toggle (`add` / `close` icon)
- Optional add-new input row (native `<input>`, autofocus, `maxLength={100}`, Agregar button)
- Optional search row (search icon + input + clear button)
- Pills grid (flex-wrap) — active pill has solid fill in semantic color

**Props:** `mode: 'category' | 'classification'`, `options: string[]`, `selected: string`, `onSelect: (v) => void`, `onAddNew: (v) => void`, `onClose: () => void`

**Ghost-click rule:** in `onSelect`, only call `onSelect(value)` — do NOT call `setPickerOpen(false)` or any close logic. The component's own close animation calls `onClose()` after 300ms. The parent must only set state in `onClose`.

---

## Slot detail items

Used in SourceDetailSheet to show individual payment slots:

```css
.detailSlot {
  display: flex; align-items: center; padding: var(--space-sm); gap: var(--space-sm);
  border: 1px solid var(--c-border); border-radius: var(--radius-sm);
  background: var(--c-surface);
}
.detailSlotDone { background: #f0fbf1; border-color: #c8e6c9; }
.detailSlotLabel { display: block; font-size: var(--font-size-sm); font-weight: 600; color: var(--c-text); }
.detailSlotDate      { font-size: 11px; color: #4caf50; font-weight: 500; }
.detailSlotDateSpend { font-size: 11px; color: var(--c-spend); font-weight: 500; }
.detailSlotCountdown { font-size: 11px; color: var(--c-text-muted); }
```

**Temporal guard:** Confirmar button only renders when `slot.date <= today`. Future slots show a countdown span instead.

---

## Form modal (Modal.component.tsx) — anatomy

Modal forms use classes from `Modal.module.css`. Never reinvent these classes in feature-specific CSS.

| Element | Class | CSS notes |
|---|---|---|
| Field wrapper | `.formField` | `flex-direction: column; gap: 4px; margin-bottom: 16px` |
| Field label | `.formLabel` | `font-size: 13px; font-weight: 600; color: var(--c-text-muted)` |
| Text input / select | `.formInput` / `.formSelect` | `padding: 8px; border: 1px solid border; border-radius: 4px; background: var(--c-info); width: 100%` |
| Two-column row | `.formRow` | `display: flex; gap: 8px` |
| Action row | `.formActions` | `display: flex; gap: 8px; margin-top: 16px` |
| Primary button | `.submitBtn` | `flex: 1; background: var(--c-hdr); color: white; border-radius: 8px; font-weight: 600` |
| Secondary button | `.secondaryBtn` | `flex: 1; background: none; border: 1px solid border; border-radius: 8px` |
| Hint / warning | `.modalHint` | Left pink border, spend-bg background — use sparingly, only for critical warnings |

**Submit button visibility rule:** wrap in `{condition && <button className={modalStyles.submitBtn}>}` — never use `disabled`. Button renders only when all required fields are filled.

**Conditional fields:** use `.fieldReveal` / `.fieldRevealVisible` grid-row trick (already in `Modal.module.css`) — never `{condition && <field>}`.

---

## Shared CSS extraction (`features/core/styles/shared.module.css`)

The patterns above have been extracted into `features/core/styles/shared.module.css`. Import from there when building new features instead of re-defining:

```ts
import shared from '@/features/core/styles/shared.module.css';
```

Available shared classes: `sectionHeader`, `sectionLabel`, `sectionCount`, `sectionAddBtn`, `sectionAddBtnSpend`, `card`, `cardTop`, `cardName`, `cardAmount`, `cardAmountEarn`, `cardAmountSpend`, `cardSub`, `chip`, `chipSpend`, `loading`, `error`, `empty`, `monthNav`, `monthBtn`, `monthLabel`, `sheetAction`, `sheetActionDanger`, `sheetActionCancel`, `sheetSeparator`, `toggleRow`, `toggleOption`, `toggleOptionActive`, `toggleOptionActiveSpend`, `summaryInsight`, `summaryInsightSpend`.
