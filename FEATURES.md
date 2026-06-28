# Feature Inventory — economy-app

Status: `done` · `partial` · `missing`

---

## Pages

| Route | Container | Status | Notes |
|---|---|---|---|
| `/` | `DashboardContainer` | `done` | Summary cards: income, expenses, savings, goal |
| `/transactions` | `TransactionsContainer` | `done` | Tabs: incomes / expenses with month nav |
| `/finance` | `FinanceContainer` | `done` | Tabs: budget categories / net worth |
| `/purchases` | `PurchasesContainer` | `done` | Tabs: wishlist / decision tool |
| `/settings` | `SettingsContainer` | `done` | Edit income, savings target, goal |
| `/profile` | `ProfileContainer` | `done` | View email, change password, logout |
| `/login` | `LoginContainer` | `done` | JWT login |
| `/register` | `RegisterContainer` | `done` | Create account |
| `/onboarding` | `OnboardingContainer` | `done` | Multi-step first-time setup wizard |

---

## Feature Modules

### auth

| Layer | Status | Notes |
|---|---|---|
| `LoginContainer` | `done` | JWT stored in localStorage; redirects to `/onboarding` if no settings |
| `RegisterContainer` | `done` | Creates account then redirects to `/login` |
| `AuthContext` | `done` | Provides `token`, `user`, `isLoading`, `logout` |
| `AuthGuard` | `done` | Redirects unauthenticated users to `/login` |

---

### transactions (incomes + expenses)

| Layer | Status | Notes |
|---|---|---|
| `useIncomes` hook | `done` | CRUD, month filter, month navigation |
| `useIncomeSources` hook | `done` | CRUD for recurring income source templates |
| `useExpenses` hook | `done` | CRUD, month filter, multi-select category+type filter |
| `useExpenseSources` hook | `done` | CRUD for recurring expense source templates (Cycle 06) |
| `TransactionsContainer` | `done` | Tabs: incomes (Fuentes + Otros) / expenses (Frecuentes + Otros); month nav; summary sheet on bar tap |
| Income progress bar + IncomeSummarySheet | `done` | 52px pill bar (confirmed/expected); tap → insight sheet; CSV export icon |
| Expense progress bar + ExpenseSummarySheet | `done` | 52px pill bar; tap → comparison sheet with mini bars per category; CSV export icon |
| `useIncomeInsight` hook | `done` | Fetches `GET /api/v1/analytics/incomes/insight?month=`; insight text |
| `useExpenseComparison` hook | `done` | Fetches `GET /api/v1/analytics/expenses/comparison?month=`; category deltas with mini bars |
| Inline filter panel (Gastos) | `done` | Grid height transition; ExpenseFilterKeyboard bottom sheet; chips show selected names; red dot |
| Backend — incomes | `done` | `GET/POST/PUT/DELETE /api/v1/incomes`; date stored as TIMESTAMP |
| Backend — expenses | `done` | `GET/POST/PUT/DELETE /api/v1/expenses`; date stored as TIMESTAMP; 18 valid categories |
| Backend — income sources | `done` | `GET/POST/PUT/DELETE /api/v1/income-sources` |
| Backend — expense sources | `done` | `GET/POST/PUT/DELETE /api/v1/expense-sources` (Cycle 06) |
| Backend — analytics | `done` | `/api/v1/analytics/incomes/insight`, `/expenses/comparison`, `/incomes/export/csv`, `/expenses/export/csv` |

---

### finance (budget + net worth)

| Layer | Status | Notes |
|---|---|---|
| `useBudget` hook | `done` | Fetches budgets + settings; month nav; `confirmPayment(cat, amt, date)` posts expense |
| `useNetWorth` hook | `done` | Actuals + 9-month projections |
| `FinanceContainer` | `done` | Tabs: budget / networth; "Confirmar pago" flow with DateTimePicker modal |
| Backend | `done` | `GET/PUT /api/v1/budgets/{category}`, `GET/POST /api/v1/patrimonio` |

---

### purchases (wishlist + decision)

| Layer | Status | Notes |
|---|---|---|
| `useWishlist` hook | `done` | CRUD, server-computed verdict |
| `useDecision` hook | `done` | Local scoring: price, health, productivity, comfort, days |
| `DecisionContainer` | `done` | Sliders + score display |
| `PurchasesContainer` | `done` | Tabs: wishlist / decision |
| Backend | `done` | `GET/POST/PUT/DELETE /api/v1/wishlist` |

---

### settings

| Layer | Status | Notes |
|---|---|---|
| `useSettings` hook | `done` | `GET/PUT /api/v1/settings` |
| `SettingsContainer` | `done` | Form with info icons; saved confirmation message |
| Backend | `done` | `GET/PUT /api/v1/settings` |

---

### profile

| Layer | Status | Notes |
|---|---|---|
| `ProfileContainer` | `done` | View email, change password, logout with ConfirmModal |
| Backend | `done` | `PUT /api/v1/auth/change-password` |

---

### onboarding

| Layer | Status | Notes |
|---|---|---|
| `OnboardingContainer` | `done` | 5 steps: goal → income → savings → expenses → categories; forward/back; info icon each step; prefilled defaults |
| Backend | `done` | Uses `PUT /api/v1/settings` on completion |

---

### dashboard

| Layer | Status | Notes |
|---|---|---|
| `DashboardContainer` | `done` | Month income vs expenses, savings rate, goal progress bar |

---

### navigation

| Component | Status | Notes |
|---|---|---|
| `BottomNav` | `done` | `/transactions`, `/finance`, `/purchases` |
| `TopBar` | `done` | Title by route, profile button → `/profile` |
| `NavWrapper` | `done` | Hidden on `/login`, `/register`, `/onboarding` |

---

### core

| Component/Util | Status | Notes |
|---|---|---|
| `Modal` | `done` | Generic overlay modal |
| `ConfirmModal` | `done` | Confirm/cancel destructive actions |
| `InfoModal` | `done` | Two tabs: how it works + glossary |
| `DotsMenu` | `done` | Kebab menu with action items |
| `MoneyInput` | `done` | European-format money input with NumericKeyboard |
| `NumericKeyboard` | `done` | Phone-pad digit keyboard; ghost-click safe (closing-backdrop pattern) |
| `HourMinuteInput` | `done` | Two-field HH:MM picker backed by NumericKeyboard; auto-advances H→M |
| `DateTimePicker` | `done` | Three-mode: chips → picking → confirmed; `month` prop skips chips for non-current months (starts in picking, pre-filled day 1) |
| `api.client.ts` | `done` | `apiGet/apiPost/apiPut/apiDelete/apiGetBlob`; auto-injects Bearer token |
| `info.content.ts` | `done` | INFO object with English keys; terminology per feature |
| `api.types.ts` | `done` | Shared TypeScript types for API responses |

---

## Summary

| Area | Status |
|---|---|
| Auth (register + login + guard) | ✅ Done |
| Onboarding wizard | ✅ Done |
| Settings page | ✅ Done |
| Transactions (incomes + expenses) | ✅ Done |
| Income sources (recurring templates) | ✅ Done |
| Expense sources (recurring templates) | ✅ Done |
| Finance (budget + net worth) | ✅ Done |
| Budget "Confirmar pago" flow | ✅ Done |
| Purchases (wishlist + decision) | ✅ Done |
| Profile page | ✅ Done |
| Dashboard | ✅ Done |
| Navigation shell | ✅ Done |
| English identifiers throughout | ✅ Done |
| Backend API | ✅ Done (all economy + analytics endpoints) |
| NumericKeyboard (ghost-click safe) | ✅ Done |
| HourMinuteInput | ✅ Done |
| DateTimePicker (3-mode + past-month fix) | ✅ Done |
| Progress bars (Ingresos + Gastos tabs) | ✅ Done |
| Income insight sheet (FT-07) | ✅ Done |
| Expense comparison sheet + mini bars (FT-08) | ✅ Done |
| CSV export — incomes + expenses (FT-06) | ✅ Done |
| Inline filter panel + keyboard (Gastos) | ✅ Done |
