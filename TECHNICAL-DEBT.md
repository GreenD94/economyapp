# Technical Debt & Future Plans — Economy App

Items documented here are known limitations or planned improvements that are intentionally deferred.
Check this file before adding a feature that might conflict with a planned change.

---

## Multi-currency support

**Current state:** Currency symbol is hardcoded as `$` in the `MoneyInput` component default prop.
Number format is hardcoded to European locale (dot thousands, comma decimal).

**Planned behavior:**
- User chooses their currency in Settings (e.g., USD, EUR, COP, MXN).
- `GET /api/v1/settings` returns `currency_symbol` and `currency_locale` fields.
- `MoneyInput` reads the symbol from a context/hook, not from a hardcoded prop default.
- Number formatting switches based on locale:
  - European: `1.234,56` (dot thousands, comma decimal) — current default
  - US/UK: `1,234.56` (comma thousands, dot decimal)

**What to do when implementing:**
1. Add `currency_symbol` (string) and `currency_locale` (string, e.g. `'es-CO'`) to the `settings` table via a new migration.
2. Expose them in `GET /api/v1/settings` response.
3. Create a `useCurrency()` hook that reads these from settings context.
4. Replace the hardcoded `'$'` default in `MoneyInput` with `useCurrency().symbol`.
5. Replace hardcoded format logic in `MoneyInput` with `Intl.NumberFormat(locale, { minimumFractionDigits: 2 })`.

**Impact:** `MoneyInput` component, all screens that display formatted money amounts, Settings screen (add currency picker).

---

## Category management

**Current state:** Budget categories are seeded at onboarding. Users cannot add or delete categories from the UI — only edit amounts.

**Planned behavior:**
- A "Manage categories" screen in Settings or Finances.
- Users can add custom categories, rename existing ones, and delete empty ones.
- Categories with existing expense history cannot be deleted — only archived.

---

## Savings current value

**Current state:** `current_savings` is set to `0` at onboarding. The app does not automatically calculate it from income and expense history.

**Planned behavior:**
- `current_savings` is updated automatically each month: previous balance + income − expenses.
- Alternatively: user enters it manually at the start of each month from a bank statement prompt.

---

## Projection model

**Current state:** Net worth projections assume a fixed monthly savings amount forever.

**Planned behavior:**
- Projections account for income changes and seasonal expense spikes.
- "What if" simulator: user adjusts savings rate and sees updated timeline.
