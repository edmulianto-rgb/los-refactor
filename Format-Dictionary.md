# Format Dictionary

**Purpose:** Canonical display strings for fields whose formatting depends on return type. Extend this file as the product team aligns on Coda and IC Review wording.

**Related UI:** *Past Projects Recap* / *Proposed & Past Projects Recap* comparison table (e.g. **Target carry**), unless noted otherwise.

---

## Target carry


| Return type        | First line (rate)          | Second line (kind) | Notes                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------ | -------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Revenue Share**  | `X%` (platform carry rate) | `Revenue Share`    | Use when carry is **variable** (e.g. % of revenue) — in data, `carryType` contains “variable”.                                                                                                                                                                                                                                                                                |
| **Revenue Share**  | `X%`                       | `Fixed`            | Use when carry is a **fixed** fee (e.g. fixed IDR or fixed % of float) — in data, `carryType` does *not* resolve to the variable case above (e.g. “Fixed Platform Fee”).                                                                                                                                                                                                      |
| **Fixed Return**   | `X%`                       | `Fixed`            | `X%` = carry component **per month** (of principal / agreed basis). In the app, for proposed tranches with an amortization schedule, this is derived from total carry on the fixed schedule. For past rows, Coda or **extended snapshot** can supply `targetCarryPct` or it may be **inferred** as (total implied ROIC − investor ROIC) per month when that breakdown exists. |
| **Daily Interest** | `X% per 30 days`           | `Fixed`            | `X%` = service fee (carry) on the same **per 30 days** basis as the coupon.                                                                                                                                                                                                                                                                                                   |


### Examples (illustrative)

**Revenue Share — variable**

```text
6.5%
Revenue Share
```

**Revenue Share — fixed fee**

```text
6.5%
Fixed
```

**Fixed Return**

```text
5%
Fixed
```

**Daily Interest**

```text
0.6% per 30 days
Fixed
```

---

## Adding new formats

1. Add a subsection here with: field name, return types, and example lines.
2. Point any implementation (React formatters) at this file in a short code comment, or add a one-line `See Format-Dictionary.md` in the table *sublabel* in `PastProjectsRecap.tsx` if helpful.

*Last updated: April 2026*