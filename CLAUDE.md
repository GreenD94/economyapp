@../UI-UX-RULES.md
@UI-UX-RULES.md
@SPIRIT.md

# economy-app — AI Agent Briefing

## What this project is

A **personal finance tracker** web app — mobile-first, single user per account. Users track incomes, expenses, budgets, wishlist, and net worth savings progress.

**Stack:** Next.js 16 App Router · TypeScript · CSS Modules · React hooks · `use client`

**Frontend only.** All data comes from `legacy-python-backend` via REST API at `http://localhost:8000`.

---

## The rules you must never break

1. **CSS Modules only** — no Tailwind, no inline styles, no global class names
2. **Feature folder structure** — every feature lives in `features/<module>/containers/`, `features/<module>/hooks/`, `features/<module>/styles/`
3. **`use client` on all containers** — they use state and hooks
4. **Auth via JWT in localStorage** — `auth_token` + `auth_user`; injected automatically by `api.client`
5. **English identifiers everywhere** — file names, folder names, exported functions, type names, internal variables must all be English. UI text shown to users may remain Spanish.
6. **No hardcoded financial values** — income, savings target, and goal amount come from `/api/v1/settings`
7. **Layer separation** — page → container → hook → api.client. No direct fetch in components.
8. **200-line max** — no frontend `.tsx` or `.ts` file may exceed 200 lines. If a container grows beyond this, extract: tab content → `components/`, state + logic → `hooks/`, shared types → `feature.types.ts`. Shared components go in `features/core/components/`.

---

## Architecture in one paragraph

`app/<route>/page.tsx` renders a container from `features/<module>/containers/`. Each container holds all state and logic; it may import one or more hooks from `features/<module>/hooks/`. Hooks call `apiGet/apiPost/apiPut/apiDelete` from `features/core/utils/api.client.ts`. Shared UI components (Modal, ConfirmModal, InfoModal, DotsMenu) live in `features/core/components/`. Info copy (terminology, explanations) lives in `features/core/content/info.content.ts` under English keys.

---

## Route map

| URL | Container | Feature |
|---|---|---|
| `/` | `DashboardContainer` | `dashboard` |
| `/transactions` | `TransactionsContainer` | `transactions` |
| `/finance` | `FinanceContainer` | `finance` |
| `/purchases` | `PurchasesContainer` | `purchases` |
| `/settings` | `SettingsContainer` | `settings` |
| `/profile` | `ProfileContainer` | `profile` |
| `/login` | `LoginContainer` | `auth` |
| `/register` | `RegisterContainer` | `auth` |
| `/onboarding` | `OnboardingContainer` | `onboarding` |

Legacy Spanish routes (`/gastos`, `/ingresos`, `/presupuesto`, `/patrimonio`, `/decisor`, `/wishlist`) redirect to the English equivalents above.

---

## Feature modules

| Folder | Container | Hook(s) | What it does |
|---|---|---|---|
| `auth` | `LoginContainer`, `RegisterContainer` | `useAuth` (context) | JWT login, register, logout |
| `dashboard` | `DashboardContainer` | `useDashboard` | Summary cards: month income, expenses, savings |
| `transactions` | `TransactionsContainer` | `useIncomes`, `useExpenses` | Tab: incomes / expenses with month nav |
| `finance` | `FinanceContainer` | `useBudget`, `useNetWorth` | Tab: budget categories / net worth |
| `purchases` | `PurchasesContainer` | `useWishlist`, `useDecision` | Tab: wishlist / decision tool |
| `settings` | `SettingsContainer` | `useSettings` | Edit income, savings target, goal |
| `profile` | `ProfileContainer` | — | Change password, logout |
| `onboarding` | `OnboardingContainer` | — | Multi-step first-time setup wizard |
| `incomes` | — | `useIncomes` | Income CRUD |
| `expenses` | — | `useExpenses` | Expense CRUD + category filter |
| `budgets` | — | `useBudget` | Budget categories + spent vs budgeted |
| `networth` | — | `useNetWorth` | Net worth actuals + projected |
| `wishlist` | — | `useWishlist` | Wishlist items |
| `decision` | `DecisionContainer` | `useDecision` | Purchase decision scoring tool |
| `navigation` | `BottomNav`, `TopBar`, `NavWrapper` | — | Shell navigation |
| `core` | shared components + utils | — | Modal, ConfirmModal, InfoModal, DotsMenu, api.client, info.content, api.types |

---

## INFO content system

`features/core/content/info.content.ts` exports `INFO` with top-level English keys:

```
INFO.transactions.incomes   INFO.transactions.expenses
INFO.finance.budget         INFO.finance.networth
INFO.purchases.wishlist     INFO.purchases.decision
INFO.settings.*             INFO.onboarding.*
```

Each leaf has `{ title, howItWorks: string[], glossary: { term, def }[] }`.
Used by `<InfoModal>` in every container via the info icon button.

---

## API client

`features/core/utils/api.client.ts` exports `apiGet`, `apiPost`, `apiPut`, `apiDelete`.
They automatically inject `Authorization: Bearer <token>` from localStorage.
Base URL: `http://localhost:8000`.

---

## Auth flow

1. `/login` → `POST /api/v1/auth/login` → stores `auth_token` + `auth_user` in localStorage
2. `AuthContext` reads localStorage on mount; provides `{ token, user, isLoading, logout }`
3. `AuthGuard` (in `app/layout.tsx`) redirects to `/login` if no token on protected routes
4. `/onboarding` is public — new users land here after register if settings not yet set

---

## How to run

```bash
# Frontend only
cd economy-app
npm run dev        # http://localhost:3000

# Full stack (run backend first)
cd legacy-python-backend
.\start.ps1        # PowerShell — starts Docker + DB + API at http://localhost:8000
```

---

## Where to look for things

| Question | Where to look |
|---|---|
| What's built? | `FEATURES.md` |
| What needs to be done? | `TASKS.md` |
| What was last worked on? | `SESSION.md` |
| What changed and when? | `CHANGELOG.md` |
| Shared UI components | `features/core/components/` |
| API helper | `features/core/utils/api.client.ts` |
| Info copy | `features/core/content/info.content.ts` |
| Shared types | `features/core/types/api.types.ts` |
| App entry + layout | `app/layout.tsx` |
| Route pages | `app/<route>/page.tsx` |
