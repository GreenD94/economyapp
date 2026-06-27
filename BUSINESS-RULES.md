# Economy App — Business Rules

All domain logic decisions made in design sessions. When code contradicts this file, the code is wrong. Update this file whenever a new business rule is established or changed.

---

## Income types

Three types exist as values on the `incomes.type` column. They are enforced by a Pydantic enum in the backend schema.

| Type | Meaning | Source link |
|---|---|---|
| `Fijo` | Recurring income, fixed amount each cycle | Linked to a fixed income source (`source_id` not null) |
| `Variable` | Recurring income, amount changes each cycle | Linked to a variable income source (`source_id` not null) |
| `Extra` | One-time or sporadic income (bonuses, gifts, freelance, sales) | Always manual (`source_id` null) |

### Display rules — context-dependent

**When the income being edited/created is source-linked (`source_id` not null):**
- Show only `Fijo` and `Variable`.
- Never show `Extra`. A source-confirmed income came from a recurring template — by definition it is not "extra".

**When the income is manual (`source_id` null):**
- Show all three: `Fijo`, `Variable`, `Extra`.
- `Extra` is the sensible default for a one-off manual entry.

**"Extra" is a distinct UX entry point**, even though internally it is just another `type` string. It must never appear in the source-confirmation flow.

### Backend validation

`incomes.type` must be validated against `["Fijo", "Variable", "Extra"]` in the Pydantic schema using `Literal` or a custom validator. No other values are accepted. The backend currently has no validation here — this is a known gap (see TASKS.md).

---

## Income entries: create vs edit

### Create form (`Agregar ingreso` — manual entries only)

Fields: date · source label · amount · tipo  
**No notes field.** Creating an income entry does not require a reason.

### Edit form (`Editar ingreso`)

Fields: date · source label · amount · tipo · **note**  
**Has a notes field.** Every edit must log an optional reason.

The note is part of the **edit log** (`income_edits` table), not a property of the income record itself.

### Edit log (`income_edits` table — planned, not yet built)

Every time an income entry is edited, a record must be created:

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT PK | |
| `income_id` | BIGINT FK → incomes.id | Which income was changed |
| `user_id` | BIGINT FK → users.id | Who changed it |
| `old_data` | JSONB | Full snapshot of the income before the edit |
| `new_data` | JSONB | Full snapshot of the income after the edit |
| `note` | TEXT nullable | User-provided reason for the change |
| `edited_at` | TIMESTAMP WITHOUT TIME ZONE | When the edit happened |

**Why build this now:** future feature is "undo / revision history". Without the log, old data is permanently lost. Log now, build the UI later.

**Current state:** table does not exist. See TASKS.md task `BR-03`.

---

## Source-confirmed incomes vs manual incomes

Two distinct kinds of income entries share the same `incomes` table. They are distinguished by `source_id`:

| Kind | `source_id` | Created via | Tipo options |
|---|---|---|---|
| Source-confirmed | not null | "✓ Confirmar" / "Ingresar monto" in Fuentes section | Fijo, Variable only |
| Manual | null | "+" button in Otros ingresos section | Fijo, Variable, Extra |

**The edit modal is shared** but must adapt its Tipo options based on whether `source_id` is null or not.

**Confirmation link is immutable in the edit modal.** Editing an income entry does not change which source it is linked to (`source_id` stays as-is). Managing the source link is done in the Fuentes de ingreso section, not in the edit modal.

---

## Text input security

All free-text fields (source labels, income source labels, notes, expense descriptions, wishlist item names, category names) must have max-length constraints at both layers:

**Backend (Pydantic):**
- Short labels/names (source, label, category, description): `max_length=150`
- Notes/reasons: `max_length=500`
- This prevents unbounded storage and protects against trivial abuse

**Frontend (React):**
- Add `maxLength` attribute on all `<input>` and `<textarea>` elements that accept free text, mirroring the backend limits
- Never use `dangerouslySetInnerHTML` with user-supplied strings — React's default JSX rendering escapes HTML automatically; this guarantee is broken the moment you use `dangerouslySetInnerHTML`
- No user-supplied value should ever be inserted into a `style`, `href`, `src`, or `on*` attribute without sanitization

**Current state:** no max-length constraints exist anywhere in the codebase. See TASKS.md task `BR-04`.
