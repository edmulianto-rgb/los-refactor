# IC Review — Field Order & Applicability Reference

**Purpose:** Master reference for which fields to show in IC Review comparisons, in what order, and how to handle nuances when comparing projects of different return types.

**Return type key:**

| Symbol | Return type |
|--------|-------------|
| 🟢 | All return types |
| 🟣 | Revenue share (incl. Fixed + Rev Share) |
| 🟡 | Revenue share + fixed only |
| 🔵 | Fixed return only |
| 🟠 | Daily interest (PO) only |

---

## Section 1 — Identity & Structure

| # | Field | Applicable | Notes / Nuances |
|---|-------|------------|-----------------|
| 1 | **Financing type** | 🟢 | Tag label. Use: Revenue Share (Return-Capped) / Revenue Share (Time-Capped) / Fixed+Revenue Share / Fixed Return / PO (Daily Interest). |
| 2 | **PT** | 🟢 | Legal entity. Note: projects under the same PT share liability exposure — flag this when comparing. |
| 3 | **Amount** | 🟢 | Disbursed or proposed amount. |
| 4 | **Principal outstanding** | 🟢 | Show N/A if not yet disbursed (proposed stage). For PO/daily interest, show N/A until repayment begins. |

---

## Section 2 — Return Structure

| # | Field | Applicable | Notes / Nuances |
|---|-------|------------|-----------------|
| 5 | **Revenue share %** | 🟣 | Always show Pre-BEP and Post-BEP separately. If equal, still show both for clarity. |
| 6 | **Cap** | 🟣 | ⚠️ **Nuance:** Two formats depending on cap type — Return-Capped = MOIC cap (e.g. 1.4x investor return cap); Time-Capped = month cap (e.g. 36 month time cap). Always label the cap type explicitly — they represent different risk profiles. |
| 7 | **Revenue share start** | 🟣 | When revenue share accrual begins: **fixed start date** (calendar) vs **anchored to branch opening**. Maps to Coda anchor type + optional absolute start date. **Prototype:** shown in **Past Projects Recap** (cross-project comparison table, section B — Return Structure). It is **not** repeated under Project Terms Details, to keep that section limited to disbursement schedule, branch tables, fixed amortization, and other non-recap mechanics. |
| 8 | **Fixed amount** | 🟡 🔵 | ⚠️ **Nuance:** Two interpretations — in Fixed+RevShare = only the fixed leg (partial of total); in Fixed Return = full repayment amount. Always show installment schedule in both cases. Consider a sub-label to avoid misreading exposure. |
| 9 | **Target carry** | 🟢 | Always show rate + type. Format by return type: Rev Share = "6.5% Revenue Share"; Fixed Return = "5% Fixed"; PO/Daily Interest = "0.6% per 30 days Fixed". |
| 10 | **Fixed payment investor ROIC** | 🔵 🟠 | ⚠️ **Nuance:** Unit differs by type — Fixed Return = "per month"; Daily Interest = "per 30 days". Label unit explicitly, especially when comparing Fixed and Daily Interest projects in the same set. |
| 11 | **Fixed payment total implied ROIC** | 🔵 🟠 | ⚠️ **Nuance:** Same unit caveat as field 10. Includes carry on top of investor rate. Always show alongside field 10. |

---

## Section 3 — Timeline & Operations

| # | Field | Applicable | Notes / Nuances |
|---|-------|------------|-----------------|
| 12 | **Term** | 🟢 | In months for Rev Share / Fixed Return. In days for PO / Daily Interest. Show OTF vs original projected if they differ. |
| 13 | **Branch opening** | 🟣 | Scheduled vs actual date. Show diff in months (positive = late). N/A for non-branch projects (e.g. working capital, PO financing). |
| 14 | **Minimum payment period** | 🟠 | ⚠️ **Nuance:** Set-level rule — show this field if ANY project in the comparison set is Daily Interest, even if other projects in the same comparison are Fixed or Rev Share. |

---

## Section 4 — Performance Metrics

| # | Field | Applicable | Notes / Nuances |
|---|-------|------------|-----------------|
| 15 | **PvA** | 🟣 | Plan vs actual revenue. Show % and months elapsed. N/A if project not yet started. |
| 16 | **IRR** | 🟢 | Show OTF and original projected. If only one exists, label clearly which. |
| 17 | **MOIC** | 🟢 | Show OTF and original projected. OTF = N/A if project not yet started. |
| 18 | **BEP** | 🟣 🔵 | ⚠️ **Nuance:** Shown for Rev Share and Fixed Return. N/A for Daily Interest / PO — short-tenor instruments have no breakeven concept. Show OTF vs original projected where applicable. |
| 19 | **Minimum return** | 🟣 | Label mechanism explicitly: Gross Up (MOIC floor guaranteed at X months) or Continual Rev Share (minimum MOIC regardless of timeline). |
| 20 | **DPD** | 🟢 | Max days ever past due + full incident history. N/A if not yet disbursed. |

---

## Section 5 — Revenue Model

| # | Field | Applicable | Notes / Nuances |
|---|-------|------------|-----------------|
| 21 | **Revenue projections** | 🟣 | Average / peak / floor per month + projection span in months. N/A for Fixed Return and Daily Interest. |
| 22 | **Source of revenue accrued** | 🟣 | Definition of revenue used in the rev share calculation (e.g. gross sales less discount, pre-tax, pre-service charge, pre-EDC/QRIS fees). Critical for cross-project comparability — different definitions make rev share % non-comparable. |

---

## Section 6 — Payment Mechanics

| # | Field | Applicable | Notes / Nuances |
|---|-------|------------|-----------------|
| 23 | **Payment frequency** | 🟢 | ⚠️ **Nuance:** Two formats — Rev Share: show 3 sub-lines (investor rev share / investor fixed payment / carry — all on 15th). Fixed Return: "Monthly" only. Do not collapse Rev Share into a single line. |
| 24 | **Late fee** | 🟢 | ⚠️ **Nuance:** Two key differences when comparing across return types. **Basis** — Rev Share & PO = Overdue Amount (only the past-due portion); Fixed Return = Outstanding Amount (full remaining balance). Materially different fee exposure. **Grace period** — Rev Share & PO = 5 days; Fixed Return = 0 days. Always show all four sub-fields: rate to investor / rate to ASN / basis / grace period. |

---

## Quick Reference — Fields by Return Type

| Field | 🟢 All | 🟣 Rev Share | 🟡 RS + Fixed | 🔵 Fixed | 🟠 Daily Interest |
|-------|--------|-------------|--------------|---------|-----------------|
| Financing type | ✓ | ✓ | ✓ | ✓ | ✓ |
| PT | ✓ | ✓ | ✓ | ✓ | ✓ |
| Amount | ✓ | ✓ | ✓ | ✓ | ✓ |
| Principal outstanding | ✓ | ✓ | ✓ | ✓ | ✓ |
| Revenue share % | — | ✓ | ✓ | — | — |
| Cap | — | ✓ | ✓ | — | — |
| Revenue share start | — | ✓ | ✓ | — | — |
| Fixed amount | — | — | ✓ | ✓ | — |
| Target carry | ✓ | ✓ | ✓ | ✓ | ✓ |
| Fixed payment investor ROIC | — | — | — | ✓ | ✓ |
| Fixed payment total implied ROIC | — | — | — | ✓ | ✓ |
| Term | ✓ | ✓ | ✓ | ✓ | ✓ |
| Branch opening | — | ✓ | ✓ | — | — |
| Minimum payment period | — | — | — | — | ✓ * |
| PvA | — | ✓ | ✓ | — | — |
| IRR | ✓ | ✓ | ✓ | ✓ | ✓ |
| MOIC | ✓ | ✓ | ✓ | ✓ | ✓ |
| BEP | — | ✓ | ✓ | ✓ | — |
| Minimum return | — | ✓ | ✓ | — | — |
| DPD | ✓ | ✓ | ✓ | ✓ | ✓ |
| Revenue projections | — | ✓ | ✓ | — | — |
| Source of revenue accrued | — | ✓ | ✓ | — | — |
| Payment frequency | ✓ | ✓ | ✓ | ✓ | ✓ |
| Late fee | ✓ | ✓ | ✓ | ✓ | ✓ |

*\* Show if ANY project in the comparison set is Daily Interest.*

---

*Last updated: April 2026*
