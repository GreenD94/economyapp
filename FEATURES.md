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
| `useExpenses` hook | `done` | CRUD, month filter, category filter |
| `TransactionsContainer` | `done` | Tabs: incomes (Fuentes + Otros sections) / expenses; unified confirm-source modal with DateTimePicker |
| Backend — incomes | `done` | `GET/POST/PUT/DELETE /api/v1/incomes`; date stored as TIMESTAMP |
| Backend — expenses | `done` | `GET/POST/PUT/DELETE /api/v1/expenses`; date stored as TIMESTAMP; 18 valid categories |
| Backend — income sources | `done` | `GET/POST/PUT/DELETE /api/v1/income-sources` |

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
| `DateTimePicker` | `done` | Three-mode picker: chips (Hoy/Ayer/Hace 2 días) → picking (date+time row) → confirmed (text display) |
| `api.client.ts` | `done` | `apiGet/apiPost/apiPut/apiDelete`; auto-injects Bearer token |
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
| Finance (budget + net worth) | ✅ Done |
| Budget "Confirmar pago" flow | ✅ Done |
| Purchases (wishlist + decision) | ✅ Done |
| Profile page | ✅ Done |
| Dashboard | ✅ Done |
| Navigation shell | ✅ Done |
| English identifiers throughout | ✅ Done |
| Backend API | ✅ Done (all economy endpoints) |
| NumericKeyboard (ghost-click safe) | ✅ Done |
| HourMinuteInput | ✅ Done |
| DateTimePicker (3-mode) | ✅ Done |
