# Proposed vs Past Project Field — Warning and Error Messages

**Purpose:** Canonical list of **error**, **warning**, and **info** messages for the **Proposed & Past Projects Recap** comparison (and closely related project-level checks). Use this when implementing UI banners, row-level callouts, or Coda validations.

**Severity**

| Level | Meaning |
|--------|--------|
| **Error** | Blocks or strongly gates approval until resolved (policy, missing compliance, or hard data conflict). |
| **Warning** | IC should explicitly acknowledge; may still proceed with documented rationale. |
| **Info** | Context only; no action required unless IC chooses to dig in. |

**Related references:** `IC_Review_Field_Order_Reference.md` (field applicability), `IC-Review-App-Data-Contract.md` / `IC-Review-App-Data-Contract.csv` (Coda + app logic), `lib/warnings.ts` (global project warnings), `components/sections/PastProjectsRecap.tsx` (recap table + late-fee checks).

---

## A — Identity & structure

### Financing type

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | This is the **first** project for the **Brand** (KP) with this **return type** / financing structure — no prior disbursed or completed row in the recap set shares the same normalized `Return Type` (and cap flavor, if applicable). | **New structure for this brand:** This financing type has not appeared on a prior project for this brand. Confirm structure, pricing, and ops are intentional. |
| **Warning** | Proposed financing type **differs** from **all** past projects in the comparison set (brand is changing structure). | **Structural change:** Proposed financing type differs from every prior project shown. Document rationale in credit memo or IC notes. |
| **Info** | Proposed type matches at least one past project but not others (mixed structures in foot print). | **Mixed financing types** in history — comparisons on rev-share-only or fixed-only rows may show N/A for some columns. |

### PT (legal entity)

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Proposed project uses a **different PT** from the immediately prior project for the same brand (legal counterparty change). | **PT change vs prior project:** Confirm exposure, guarantees, and bank details were re-verified for the new entity. |
| **Info** | Multiple distinct PTs appear across the comparison column (already visible in table). | *(Optional banner)* **Multiple PTs** in project history — aggregate exposure is not limited to a single legal entity. |

### Amount

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Requested / tranche amount **exceeds** current plafond (non–plafond submission). | `Warning: Requested Project Amount exceeds Current Plafond` *(see `ProjectDetails.tsx`)* |
| **Warning** | Requested / tranche amount **exceeds** proposed plafond (plafond-line submission). | `Warning: Requested Project Amount exceeds Proposed Plafond` |
| **Warning** | Coda / analyst formula flag present. | Display **`Analyst's Warning on Target Project Amount`** as provided (no rewrite). |
| **Warning** | Sum of disbursement lines ≠ project target amount. | Warn if **total disbursements ≠ Project Target Amount** *(data contract)* |

### Principal outstanding

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Past project marked active / disbursed but outstanding is **null or zero** unexpectedly vs LMS. | **Outstanding mismatch:** Verify LMS / reporting layer sync if outstanding should be non-zero. *(tie to engineering validation: LMS freshness)* |
| **Info** | Proposed column correctly shows not-yet-disbursed. | *(No message — use static N/A copy in UI.)* |

---

## B — Return structure

### Revenue share % (Pre-BEP / Post-BEP)

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | **Rev share frequency ≠ Monthly** (when applicable). | Warn if **≠ Monthly** *(data contract)* |
| **Info** | Pre-BEP and Post-BEP **identical**. | *(Optional)* Rates are identical pre- and post-BEP — still showing both per policy. |

### Cap (MOIC cap vs time cap)

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Cap **type** differs across rev-share projects in the same set without clear labeling in data. | **Cap type differs across projects:** Return-capped (MOIC) vs time-capped (months) are not interchangeable — confirm IC understands the distinction. |
| **Warning** | Proposed cap is **looser** than a prior project on the same brand (higher MOIC cap or longer time cap). | **Looser cap vs prior:** Confirm intentional concession and pricing. *(thresholds TBD with PM)* |

### Revenue share start

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Anchor type **differs** from prior rev-share project (e.g. fixed date vs branch-opening anchored) for same brand. | **Revenue share start rule changed vs prior project** — verify waterfall and calculator inputs. |

### Fixed amount / repayment

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | **Extracted** project target from schedule **≠** entered project target. | Warn if **`(Extracted) Project Target Amount` ≠ entered target** *(data contract)* |
| **Info** | Display sub-label when **Fixed + Revenue Share** (fixed leg only vs full fixed return). | Use recap **sublabel** to avoid misreading exposure *(field reference doc)* |

### Target carry

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Carry **below policy minimum** (when policy table exists). | Warn if **below policy minimum** *(data contract)* |
| **Warning** | **Unit or carry type** inconsistent with financing type (e.g. variable vs fixed fee mis-tagged). | **Carry presentation mismatch:** Verify `Rev Share Carry Type` and fee fields match structure. |

### Fixed payment investor ROIC / total implied ROIC

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Comparing **Fixed Return** and **Daily Interest** in one set without explicit **per month** vs **per 30 days** labels. | **ROIC unit mix:** Label **per month** vs **per 30 days** explicitly before comparing across types. *(field reference + recap nuance)* |

---

## C — Timeline & operations

### Term

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | **OTF** term materially **longer** than original projected for a completed or mature project. | **Term extension vs original:** Confirm documented reason (amendment, hardship, default workout). *(materiality TBD)* |

### Branch opening

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Actual opening **later** than scheduled beyond threshold (field reference: positive months = late). | **Branch opening late vs schedule** by **X** months — verify impact on rev-share start and projections. *(threshold TBD)* |
| **Info** | Row N/A — non-branch financing use. | *(No banner; table N/A.)* |

### Minimum payment period

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Daily-interest project **missing** minimum payment period when required by product rules. | **Minimum payment period missing** for Daily Interest structure. |

---

## D — Performance metrics

### PvA (plan vs actual revenue)

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Actual materially **below** plan after sufficient elapsed months. | **PvA underperforming** — confirm whether BEP / minimum return mechanics still protect investors. *(threshold TBD)* |

### IRR / MOIC

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | **OTF** metric missing while project is active and LMS should have populated it. | **OTF IRR/MOIC unavailable** — check reporting layer sync timestamp. *(engineering risk list)* |
| **Info** | Only one of OTF vs original available. | Label which variant is shown *(recap sublabel behavior)* |

### BEP

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Info** | Shown for Daily Interest / PO. | **N/A for short-tenor / daily interest** — no breakeven construct. *(field reference)* |

### Minimum return

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Mechanism or multiple **below 1x** or otherwise **off policy** per Coda formula rules. | Warn if **below 1x or off** *(data contract CSV)* |

### DPD

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | **max DPD over 30** days on a past project. | `{projectName}: max DPD {n} days.` *(level `warn` in `lib/warnings.ts`)* |
| **Info** | **max DPD between 1 and 30** days. | Same line, level **`info`** in `lib/warnings.ts` |
| **Error** | *(If ever blocking by policy)* | TBD — currently informational/warn only in app. |

---

## E — Revenue model

### Revenue projections

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Parsed projection array **missing** or **stale** for a rev-share proposed deal. | **Revenue projections missing** — required for rev-share risk assessment. |

### Source of revenue accrued

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | **Different definitions** across projects in the same recap set (string normalize + compare). | **Source of revenue definition differs** across projects — **rev share % is not directly comparable** without adjustment. |

---

## F — Payment mechanics

### Payment frequency

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Rev share project and frequency is **not** the expected multi-line monthly pattern. | Does not match **expected rev-share payment frequency presentation** *(verify against `Rev Share Frequency` and policy)* |

### Late fee

Past recap cells use these **inline warnings** when stored values conflict with **return-type defaults** *(implemented in `PastProjectsRecap.tsx`)*:

| Severity | When | Message |
|----------|------|---------|
| **Warning** | Fixed Return but basis ≠ **Outstanding Amount** | `Expected: Outstanding Amount for Fixed Return` |
| **Warning** | Revenue Share but basis ≠ **Overdue Amount** | `Expected: Overdue Amount for Revenue Share` |
| **Warning** | Fixed Return but grace ≠ **0** days | `Expected: 0 days for Fixed Return` |
| **Warning** | Revenue Share but grace ≠ **5** days | `Expected: 5 days for Revenue Share` |

**Daily Interest / PO** *(align with data contract nuance — extend implementation if not already firing):*

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Daily Interest / PO but late fee basis ≠ **Overdue Amount** | `Expected: Overdue Amount for Daily Interest` |
| **Warning** | Daily Interest / PO but grace ≠ **5** days | `Expected: 5 days for Daily Interest` |

**Global late-fee fields** *(project terms, data contract)*:

| Severity | When | Message (proposed) |
|----------|------|-------------------|
| **Warning** | Late fee basis ≠ **Overdue Amount** where policy expects it. | Warn if **≠ "Overdue Amount"** *(for types where that applies)* |
| **Warning** | Late fee grace ≠ **5** days where policy expects 5. | Warn if **≠ 5 days** |
| **Warning** | Daily late fee % **off defaults**. | Warn if **off defaults** *(per investor/ASN split)* |

---

## Global issues (surface near recap or project header)

These are **not** single recap rows but often appear alongside the recap.

| Section | Severity | Message |
|---------|----------|---------|
| Plafond — total remaining | **Error** | `Total Limit Remaining is negative (Rp …). Plafond increase required before disbursement.` |
| Plafond — WC remaining | **Error** | `WC Sub-Limit Remaining is negative (Rp …).` |
| Plafond — PO remaining | **Error** | `PO Sub-Limit Remaining is negative (Rp …).` |
| Financial reviews | **Error** | `No financial review on record.` |
| Financial reviews | **Warning** | `Warning: More than {n} months ago (submitted {date}).` |
| KP contacts | **Error** | `SLIK-Key Person file missing for key person: {name}. Must be received before approval.` |
| Project details | **Warning** | Sector warning string from Coda / app logic: prior project sector mismatch. |
| PT details | **Warning** | PT warnings: accountholder vs PT name; account number vs prior project; PT differs from prior project *(data contract)* |

---

*Last updated: April 2026*
