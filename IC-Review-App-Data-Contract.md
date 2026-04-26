# IC Review App — Data Contract

**Status:** Draft v1  
**Last updated:** April 2026  
**Scope:** Phase 1 — IC Review interface reading from Coda (Coda as source of truth)

---

## Legend


| Tag        | Meaning                                                  |
| ---------- | -------------------------------------------------------- |
| `WRITABLE` | Field can be written via Coda API                        |
| `FORMULA`  | Computed by Coda; read-only via API                      |
| `LMS`      | Synced from LMS (Reporting Layer); read-only in Coda     |
| `NEW`      | Does not exist in Coda yet; must be built                |
| `TBD`      | Source or storage unclear; needs decision                |
| `CHANGED`  | Coda field type needs to change before new app goes live |


Column types: `text`, `num`, `curr` (currency), `dp` (date), `dt` (datetime), `lookup`, `sl` (select), `check` (checkbox), `link`, `canvas`, `person`, `reaction`

---

## 1. Project Header


| Display Label   | Source Table | Coda Column     | Type           | R/W      | Notes                                                                                           |
| --------------- | ------------ | --------------- | -------------- | -------- | ----------------------------------------------------------------------------------------------- |
| Brand (KP Name) | Project      | `KP/Brand`      | lookup → Brand | WRITABLE | Append "(New)" if Brand has no prior approved projects                                          |
| Project Name    | Project      | `Project Name`  | text           | WRITABLE | UI should suggest `Suggested Project Name (one-time use)` [FORMULA] and allow analyst to accept |
| Approval Type   | Project      | `Approval Type` | lookup         | WRITABLE | Display as tag; values: Project, Plafond, Project+Plafond, PO/Invoice+Plafond, PO/Invoice       |


---

## 2. PIC


| Display Label                                                                                                       | Source Table                                                                                              | Coda Column         | Type                                                                                                              | R/W                                                                                                        | Notes                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [Submitter](https://linear.app/karmaclub/document/replacing-coda-for-ic-review-team-alignment-2a749908dcc5)         | [Project](https://linear.app/karmaclub/document/replacing-coda-for-ic-review-team-alignment-2a749908dcc5) | `Created by`        | [person](https://linear.app/karmaclub/document/replacing-coda-for-ic-review-team-alignment-2a749908dcc5)          | [FORMULA](https://linear.app/karmaclub/document/replacing-coda-for-ic-review-team-alignment-2a749908dcc5)  | [Auto-set by Coda at row creation](https://linear.app/karmaclub/document/replacing-coda-for-ic-review-team-alignment-2a749908dcc5) |
| [Primary Analyst](https://linear.app/karmaclub/document/replacing-coda-for-ic-review-team-alignment-2a749908dcc5)   | [Project](https://linear.app/karmaclub/document/replacing-coda-for-ic-review-team-alignment-2a749908dcc5) | `Primary Analyst`   | [lookup → people](https://linear.app/karmaclub/document/replacing-coda-for-ic-review-team-alignment-2a749908dcc5) | [WRITABLE](https://linear.app/karmaclub/document/replacing-coda-for-ic-review-team-alignment-2a749908dcc5) |                                                                                                                                    |
| [Secondary Analyst](https://linear.app/karmaclub/document/replacing-coda-for-ic-review-team-alignment-2a749908dcc5) | [Project](https://linear.app/karmaclub/document/replacing-coda-for-ic-review-team-alignment-2a749908dcc5) | `Secondary Analyst` | [lookup → people](https://linear.app/karmaclub/document/replacing-coda-for-ic-review-team-alignment-2a749908dcc5) | [WRITABLE](https://linear.app/karmaclub/document/replacing-coda-for-ic-review-team-alignment-2a749908dcc5) |                                                                                                                                    |


---

## [3. Project Details](https://linear.app/karmaclub/document/replacing-coda-for-ic-review-team-alignment-2a749908dcc5)


| Display Label                         | Source Table | Coda Column                                                | Type     | R/W       | Notes                                                                                                                                |
| ------------------------------------- | ------------ | ---------------------------------------------------------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Project # for KP                      | Project      | `Project Number (derived)`                                 | num      | FORMULA   | Derived; read-only                                                                                                                   |
| Brand's Active Projects               | Brand        | `Active Projects`                                          | text     | FORMULA   | Roll-up on Brand table                                                                                                               |
| Brand's Completed Projects            | Brand        | `Completed Projects`                                       | text     | FORMULA   | Roll-up on Brand table                                                                                                               |
| Brand's Before IC Projects            | Brand        | `Before IC Projects`                                       | text     | FORMULA   | Roll-up on Brand table; deduct current project from count when displaying                                                            |
| Brand's Pending Disbursement Projects | Brand        | `Pending Disbursement Projects`                            | text     | FORMULA   | Roll-up on Brand table                                                                                                               |
| Main Sector                           | Project      | `Main Sector`                                              | lookup   | WRITABLE  | Display as tag                                                                                                                       |
| Sub-Sector                            | Project      | `Sub-Sector`                                               | lookup   | WRITABLE  | Display as tag; conditional on sector                                                                                                |
| Sector Warning                        | Project      | —                                                          | —        | APP LOGIC | Warn if sector/sub-sector differs from any of the KP's prior projects: "Warning: Previous project [X] from [KP] had sector [A/B]..." |
| Syariah                               | Project      | `Syariah`                                                  | check    | WRITABLE  | Only display if TRUE; show as "Syariah" tag                                                                                          |
| Asset Class                           | Project      | `Asset Class`                                              | lookup   | WRITABLE  | Display as tag                                                                                                                       |
| Requested Amount                      | Project      | `Denomination Currency` + `IDR/ USD Project Target Amount` | sl + num | WRITABLE  | Format as "[Ccy] [Amount]"                                                                                                           |
| Amount Warning                        | Project      | `Analyst's Warning on Target Project Amount`               | text     | FORMULA   | Already computed in Coda; display as-is                                                                                              |
| Financing Use                         | Project      | `Financing Use`                                            | lookup   | WRITABLE  | Display as tag                                                                                                                       |


---

## 4. Plafond

### 4a. Proposed (only shown if Approval Type includes Plafond)


| Display Label           | Source Table | Coda Column                                   | Type | R/W           | Notes                                                                |
| ----------------------- | ------------ | --------------------------------------------- | ---- | ------------- | -------------------------------------------------------------------- |
| Proposed Total Limit    | Project      | `IDR Requested Total Limit`                   | curr | WRITABLE      | Highlight green if different from current; show "+/- X from current" |
| Proposed PO Sub-Limit   | Project      | `IDR Requested Sub-Limit for PO`              | curr | WRITABLE      | Same highlight logic                                                 |
| Proposed WC Sub-Limit   | Project      | `IDR Requested Sub-Limit for Working Capital` | curr | WRITABLE      | Same highlight logic                                                 |
| Outstanding (Total)     | Brand        | `IDR Principal Outstanding`*                  | curr | FORMULA (LMS) | Read from Brand; sourced from Reporting Layer: Brands                |
| Limit Remaining (Total) | Brand        | `IDR Remaining Total Limit`                   | curr | FORMULA       | = Limit - Buffer - Outstanding; warn if negative                     |
| Limit Remaining (PO)    | Brand        | `IDR Remaining Sub-Limit for PO`              | curr | FORMULA       | Warn if negative                                                     |
| Limit Remaining (WC)    | Brand        | `IDR Remaining Sub-Limit for Working Capital` | curr | FORMULA       | Warn if negative                                                     |

Limit **expiry** is shown only with effective dates in the plafond table’s first column (same Brand field `Limit Expiry Date` as in §4b below), not as a separate column.

### 4b. Current / Expired


| Display Label        | Source Table | Coda Column                         | Type | R/W      | Notes                                               |
| -------------------- | ------------ | ----------------------------------- | ---- | -------- | --------------------------------------------------- |
| Current Total Limit  | Brand        | `IDR Total Limit`                   | curr | WRITABLE |                                                     |
| Current PO Sub-Limit | Brand        | `IDR Sub-Limit for PO`              | curr | WRITABLE |                                                     |
| Current WC Sub-Limit | Brand        | `IDR Sub-Limit for Working Capital` | curr | WRITABLE |                                                     |
| Limit Effective Date | Brand        | `Limit Effective Date`              | dp   | WRITABLE |                                                     |
| Limit Expiry Date    | Brand        | `Limit Expiry Date`                 | dp   | WRITABLE | In the IC card plafond grid: show end date in the Limit Status column (effective–expiry range + days-from-today), not a duplicate column. |
| Limit Status         | Brand        | `Limit Status`                      | text | FORMULA  | e.g. "Active", "Expired"                            |


### 4c. Superseded (historical limits)


| Display Label                     | Source | Notes                                                                                                                                                                                                |
| --------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Superseded Total / PO / WC Limits | `NEW`  | Coda stores only the current limit per KP; no history. **Build limit history table in the new app.** When a new limit is approved via Financial Review or project approval, snapshot the old values. |


---

## 5. Financial Reviews (linked to Brand)


| Display Label               | Source Table     | Coda Column                   | Type   | R/W       | Notes                                             |
| --------------------------- | ---------------- | ----------------------------- | ------ | --------- | ------------------------------------------------- |
| Submission Date             | Financial Review | `Submission Date`             | dt     | WRITABLE  | Display as date                                   |
| Financial Reports Reviewed  | Financial Review | `Financial Reports Reviewed`  | lookup | WRITABLE  | Enum values from Enum: Financial Reports Reviewed |
| Reports' Period Ending Date | Financial Review | `Reports' Period Ending Date` | dp     | WRITABLE  |                                                   |
| Limit Recommendation        | Financial Review | `Limit Recommendation`        | sl     | WRITABLE  | Keep / Increase / Decrease                        |
| Review Notes                | Financial Review | `Financial Review Notes [td]` | canvas | WRITABLE  | Display all notes from that review                |
| Warning: Stale review       | —                | —                             | —      | APP LOGIC | Flag if submission date > 2 months ago            |


Display the most recent 2 reviews, sorted by `Submission Date` descending.

---

## 6. Karmapreneur Details


| Display Label       | Source Table | Coda Column           | Type            | R/W      | Notes                                                                                           |
| ------------------- | ------------ | --------------------- | --------------- | -------- | ----------------------------------------------------------------------------------------------- |
| Referral Source     | Project      | `Referral Source`     | lookup          | WRITABLE | Values: Cold Calling · Karma.Club Website · Karma Staff · Karmapreneur · Ex-Karma Staff · Potential Karmapreneur · Karma Node · KarmaClub Member · 2nd+ project. Displayed as source name only (Cold Calling / Karma.Club Website) or "Name (Source)" / "Name (Source – Brand)" for person-based sources. If 2nd+ project, first project's referral is shown instead. |
| Specific Referror   | Project      | `Specific Referror`   | lookup → People | WRITABLE |                                                                                                 |
| Referror's KP/Brand | People       | `Belongs to KP/Brand` | text            | FORMULA  | Derived from referror's linked projects                                                         |
| Other Referees      | People       | `Referred KP/Brand`   | lookup          | FORMULA  | Shows all other KPs the referror has referred; read from People row linked as Specific Referror |


---

## 7. Karmapreneur Contacts

One row per person linked via `Project.Karmapreneur Contacts`. Displayed as a list.


| Display Label                | Source Table | Coda Column                   | Type             | R/W      | Notes                                                                                                     |
| ---------------------------- | ------------ | ----------------------------- | ---------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| Name                         | People       | `Name`                        | text             | WRITABLE |                                                                                                           |
| Role                         | People       | `Role`                        | lookup           | WRITABLE |                                                                                                           |
| Notes on Person              | People       | `Notes on Person`             | canvas           | WRITABLE | IC-only view                                                                                              |
| Connections — Referror of    | People       | `Referred Project`            | lookup (formula) | FORMULA  | List of projects where this person is the Specific Referror                                               |
| Connections — Associated KPs | People       | `Referred KP/Brand`           | lookup (formula) | FORMULA  | KPs derived from referred projects                                                                        |
| Key Person?                  | People       | `Key Person for Project`      | lookup (formula) | FORMULA  | TRUE if person appears in `Project.Select Key Person(s)`                                                  |
| SLIK-Key Person File URL     | People       | `SLIK-KeyPerson File URL`     | link             | WRITABLE | IC-only view                                                                                              |
| SLIK-Key Person Exec Summary | People       | `SLIK-KeyPerson Exec Summary` | text             | WRITABLE | Highlight yellow; IC-only view                                                                            |
| UBO Exposure                 | People       | `UBO Exposure`                | none             | FORMULA  | Formula: sum of Outstanding Principal for all projects where this person is a Key Person and status ≥ 7.0 |


---

## 8. Proposed & Past Projects Recap Table

One row per project linked to this KP (via `Brand.Projects`). Includes the current proposed project.

### Project-level fields (from Project table)


| Display Label                        | Source Table    | Coda Column                        | Type   | R/W                | Notes                                                                                                                                    |
| ------------------------------------ | --------------- | ---------------------------------- | ------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Project Name                         | Project         | `Project Name`                     | text   | FORMULA            |                                                                                                                                          |
| Status                               | Project         | `Status [#]`                       | lookup | FORMULA            | "Proposed", "Active", "Completed", "Rescheduled"                                                                                         |
| Financing Type (Return Type)         | Project         | `Return Type`*                     | text   | FORMULA            | Revenue Share (Time-Capped), Fixed Return, etc.                                                                                          |
| Amount                               | Project         | `IDR-Equiv. Project Target Amount` | curr   | FORMULA            | IDR equivalent for comparison                                                                                                            |
| Outstanding Amount                   | Project         | `Outstanding Principal`            | curr   | FORMULA            | From Reporting Layer: Projects                                                                                                           |
| Term — Original projected            | Project         | `Projected Term (mos)*`            | num    | FORMULA            |                                                                                                                                          |
| Term — OTF                           | Reporting Layer | —                                  | —      | ⚠️ NOT AVAILABLE   | Column does not exist in Reporting Layer: Projects. LMS does not currently sync an OTF term metric.                                      |
| PvA (avg actual / projected revenue) | Reporting Layer | —                                  | —      | ⚠️ NOT AVAILABLE   | Column does not exist in Reporting Layer: Projects. LMS does not sync a PvA metric.                                                      |
| OTF IRR                              | Project         | `OTF IRR*`**                       | num    | FORMULA            | Computed from LMS actuals                                                                                                                |
| Original Projected IRR               | Project         | `Investor IRR`*                    | per    | FORMULA            | From calculator                                                                                                                          |
| OTF MOIC                             | Reporting Layer | —                                  | —      | ⚠️ NOT AVAILABLE   | Column does not exist in Reporting Layer: Projects. LMS does not sync an OTF MOIC metric.                                                |
| Original Projected MOIC              | Project         | `MOIC*`                            | text   | FORMULA            |                                                                                                                                          |
| Projected BEP                        | Project         | `Projected BEP (mos)*`             | num    | FORMULA            |                                                                                                                                          |
| DPD — Current                        | Project         | `Current DPD (Days)*`**            | num    | FORMULA            | LMS-derived                                                                                                                              |
| DPD — Max ever                       | Project         | `Max DPD (Days)`***                | num    | FORMULA            | LMS-derived                                                                                                                              |
| DPD History (list of overdue events) | Reporting Layer | —                                  | —      | ⚠️ AGGREGATES ONLY | Reporting Layer has `Arrears amount`, `Arrears days`, `Max arrears days last12 months` — no per-event history with dates and resolution. |


### Aggregated footer row


| Display Label                      | Logic                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| Count by Status                    | APP LOGIC — count distinct `Status [#]` values across the project list         |
| Count by Financing Type            | APP LOGIC — count distinct `Return Type`* values                               |
| Total Outstanding (incl. proposed) | Sum `Outstanding Principal` + proposed project amount                          |
| Total Outstanding (excl. proposed) | Sum `Outstanding Principal` for non-proposed projects                          |
| Average Term                       | Average of `Projected Term (mos)*`                                             |
| Average OTF IRR                    | Average of `OTF IRR*`** (from `Otf investor irr` in Reporting Layer: Projects) |
| Average OTF MOIC                   | ⚠️ NOT AVAILABLE — OTF MOIC does not exist in Reporting Layer                  |
| Average PvA                        | ⚠️ NOT AVAILABLE — PvA does not exist in Reporting Layer                       |


---

## 9. Project Terms

### Disbursement Schedule


| Display Label                     | Source Table  | Coda Column                                                                                           | Type     | R/W       | Notes                                                                    |
| --------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------- | -------- | --------- | ------------------------------------------------------------------------ |
| (Extracted) Project Target Amount | Project       | `(Extracted) IDR/USD Project Target Amount`*                                                          | num      | FORMULA   | Warn if ≠ entered Project Target Amount                                  |
| Disbursement rows                 | Disbursements | `Planned Disbursement Amount - Analyst (editable)` + `Planned Disbursement Date - Analyst (editable)` | num + dp | WRITABLE  | One row per Disbursements table row linked to this project               |
| Total Disbursements               | Disbursements | —                                                                                                     | —        | APP LOGIC | Sum of all planned disbursement amounts; warn if ≠ Project Target Amount |


### Revenue Share Terms (only if Return Type includes Revenue Share)


| Display Label              | Source Table | Coda Column                                                                                                                                      | Type      | R/W       | Notes                                                                                                   |
| -------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | --------- | ------------------------------------------------------------------------------------------------------- |
| Source of Revenue Accrued  | Project      | `Source of Revenue Accrued`                                                                                                                      | lookup    | WRITABLE  |                                                                                                         |
| Revenue Share Frequency    | Project      | `Rev Share Frequency*`                                                                                                                           | text      | FORMULA   | Warn if ≠ Monthly                                                                                       |
| Revenue Share Due Date     | Project      | `Rev Share Due Date*`                                                                                                                            | text      | FORMULA   |                                                                                                         |
| Cap Type                   | Project      | `Rev Share Cap Type*`                                                                                                                            | text      | FORMULA   | Return Cap / Time Cap                                                                                   |
| Cap Multiple               | Project      | `If Return Cap: Investor Cap EXC. Carry (multiple of invested fund)*`                                                                            | num       | FORMULA   | Display as "X Investor Cap / Y Total Cap"                                                               |
| Time Cap Period            | Project      | `If Time Cap: Time Cap Period (months)*`                                                                                                         | text      | FORMULA   |                                                                                                         |
| Revenue Share Start Date   | Project      | `Rev Share Anchor Type*` + `If Absolute Start Date: Rev Share Start Date*`                                                                       | text + dp | FORMULA   | Display as "Anchored to Branch Opening" or "Fixed on [date]"                                            |
| Revenue Share %            | Project      | `Pre-BEP Rev Share %*` + `Post-BEP Rev Share %*`                                                                                                 | per + per | FORMULA   | Display as "X Pre-BEP / Y Post-BEP"                                                                     |
| Carry                      | Project      | `Rev Share Carry Type*` + fee fields                                                                                                             | —         | FORMULA   | Display as "X Pre-BEP Carry / Y Post-BEP Carry" or "X Fixed Platform Fee"; warn if below policy minimum |
| Investor Minimum Return    | Project      | `Minimum Return*` + `Minimum Return (multiple of invested fund)*` + `Minimum Return Payable In (mos)*` + `Minimum Investor Return Payment Type*` | various   | FORMULA   | Complex display; see CSV row 251–259 for exact format and warnings                                      |
| Revenue Projection Array   | Project      | `Revenue Projection Array*`                                                                                                                      | text      | FORMULA   | Display as parsed table                                                                                 |
| Revenue Projection Summary | Project      | `Revenue Projection Array*`                                                                                                                      | —         | APP LOGIC | Derive avg/max/min/count from parsed array                                                              |
| Breakeven Revenue / Month  | Project      | —                                                                                                                                                | —         | FORMULA   | From calculator extraction                                                                              |


### Branch Details (only if project opens branches)


| Display Label             | Source Table | Coda Column                                 | Type   | R/W       | Notes                                                                                   |
| ------------------------- | ------------ | ------------------------------------------- | ------ | --------- | --------------------------------------------------------------------------------------- |
| Branch Build-out Duration | Project      | `Number of Months for Building New Branch*` | num    | FORMULA   |                                                                                         |
| Branch Name               | Branches     | `Name`                                      | text   | WRITABLE  | One row per branch                                                                      |
| Branch Area               | Branches     | `Branch Area`                               | text   | WRITABLE  |                                                                                         |
| GMaps Link                | Branches     | `GMaps Link`                                | link   | WRITABLE  |                                                                                         |
| Branch Notes              | Branches     | `Notes`                                     | canvas | WRITABLE  |                                                                                         |
| Branch Type               | Project      | —                                           | —      | APP LOGIC | "Opening Branch" or "Accruing Branch" derived from which relation (Opening vs Accruing) |


### Fixed Return Terms (only if Return Type includes Fixed Return)


| Display Label            | Source Table | Coda Column                                                     | Type    | R/W     | Notes                                               |
| ------------------------ | ------------ | --------------------------------------------------------------- | ------- | ------- | --------------------------------------------------- |
| Fixed Repayment Schedule | Project      | `Repayment Schedule Array*`                                     | text    | FORMULA | Display as parsed table                             |
| Fixed Repayment Summary  | Project      | `Fixed Repayment Covers 100% Invested Fund*` + repayment fields | various | FORMULA | Display total repayment, principal, interest, carry |


### Late Fees & Other Terms


| Display Label         | Source Table | Coda Column                                                   | Type      | R/W      | Notes                                                                   |
| --------------------- | ------------ | ------------------------------------------------------------- | --------- | -------- | ----------------------------------------------------------------------- |
| Late Fee Basis        | Project      | `Late Fee Basis*`                                             | text      | FORMULA  | Warn if ≠ "Overdue Amount"                                              |
| Late Fee Grace Period | Project      | `Late Fee Grace period (days)`                                | num       | FORMULA  | Warn if ≠ 5 days                                                        |
| Daily Late Fee %      | Project      | `Daily Late Fee % for Investors` + `Daily Late Fee % for ASN` | per + per | FORMULA  | Display as "X per day (Y to Investors, Z to ASN)"; warn if off defaults |
| Term Sheet Link       | Project      | `Term Sheet Link`                                             | link      | WRITABLE | Display only if not null                                                |


---

## 10. Credit Memo & Notes


| Display Label               | Source Table | Coda Column                                                | Type   | R/W      | Notes                                                                          |
| --------------------------- | ------------ | ---------------------------------------------------------- | ------ | -------- | ------------------------------------------------------------------------------ |
| KP Credit Memo              | Brand        | `KP Credit Memo - Latest In Use`                           | canvas | FORMULA  | Read-only display                                                              |
| Project Credit Memo         | Project      | `Project Credit Memo`                                      | canvas | WRITABLE |                                                                                |
| Financials Link             | Project      | `NEW`                                                      | link   | **NEW**  | New field to be added to Project table; embeds or links to financials          |
| Financial Reports Reviewed  | Project      | `Financial Reports Reviewed`                               | lookup | WRITABLE | Overlaps with Financial Review table; on Project table directly                |
| Reports' Period Ending Date | Project      | `Reports' Period Ending Date`                              | dp     | WRITABLE | Overlaps with Financial Review table; on Project table directly                |
| Notes                       | Project      | `List of Project Notes` + Brand `List of Monitoring Notes` | canvas | FORMULA  | Display as scrollable card feed; project notes first, then KP monitoring notes |


---

## 11. PT Details

One row per PT linked to the project (via `Project.Select PT for this Project`).


| Display Label        | Source Table | Coda Column            | Type   | R/W       | Notes                                                                                                                  |
| -------------------- | ------------ | ---------------------- | ------ | --------- | ---------------------------------------------------------------------------------------------------------------------- |
| PT Name              | PT           | `Name`                 | text   | WRITABLE  |                                                                                                                        |
| Bank                 | PT           | `Bank`                 | lookup | WRITABLE  |                                                                                                                        |
| Account Number       | PT           | `Account Number`       | text   | WRITABLE  | Warn if ≠ any previous project using same PT                                                                           |
| Accountholder Name   | PT           | `Accountholder Name`   | text   | WRITABLE  | Warn if ≠ PT Name                                                                                                      |
| SLIK-PT File URL     | PT           | `SLIK-PT File URL`     | link   | WRITABLE  |                                                                                                                        |
| SLIK-PT Exec Summary | PT           | `SLIK-PT Exec Summary` | text   | WRITABLE  | Highlight pink                                                                                                         |
| PT Warnings          | PT           | —                      | —      | APP LOGIC | "Mismatch on accountholder and PT names"; "Account number differs from prior project"; "PT differs from prior project" |


---

## 11b. Payor / PO / Invoice Details (Asset B only)

Shown only when `assetClass` is `B - PO` or `B - Invoice`. Contains two sub-groups:

### 11b-i. For All Payers — Submission Assessment (section-level, one set per submission)

| Display Label | Asset type | Field (`payorSectionAssessment`) | Type | Notes |
| --- | --- | --- | --- | --- |
| Existence & Authenticity of Supporting Docs | B-PO + B-Invoice | `existenceAuthenticityDocs` | dropdown (1–5 scale) | Shown for both asset sub-types |
| Likelihood of Payer Changing Scope & Timeline | B-PO only | `likelihoodPayerChangingScope` | dropdown (1–5 scale) | |
| Competency & History of Karmapreneur | B-PO only | `competencyHistoryKP` | dropdown (1–5 scale) | |
| Suggested Max PO Limit | B-PO only | `suggestedMaxPOLimit` | number (IDR) | Formatted as IDR currency |
| Authenticity & Veracity of Invoice and BAST | B-Invoice only | `authenticityVeracityInvoiceAndBAST` | dropdown (1–5 scale) | |
| Suggested Max Invoice Limit | B-Invoice only | `suggestedMaxInvoiceLimit` | number (IDR) | Formatted as IDR currency |

### 11b-ii. Per Payer — Table Columns (added to `payorInvoices` rows)

| Display Label | Field (`PayorInvoiceRow`) | Type | Notes |
| --- | --- | --- | --- |
| Payor (PO / Invoice) | `payorLabel` | text | |
| PO / Invoice # | `poOrInvoiceNumber` | text (mono) | |
| Due date | `dueDate` | ISO date | Shows ± days from tenor end when tenor available |
| Proportionalized PO / Invoice Amount | `proportionalizedAmount` | number | Defaults to `amount` when not set; actual `amount` shown as gray subtext below |
| Notes | `notes` | text | |
| Strength of Payer | `strengthOfPayer` | dropdown (1–5 scale) | |
| History — Paying On Time | `historyPayerPayingOnTime` | dropdown (1–5 scale) | |
| Suggested IDR Ceiling for This Payor | `suggestedIDRCeilingForPayor` | number (IDR) | Formatted as IDR currency |
| Outstanding Principal Owed for This Payor | `outstandingPrincipalForPayor` | number (IDR) | Formatted as IDR currency |
| Limit Validation for This Payor | computed | — | Green if `outstandingPrincipalForPayor` + `proportionalizedAmount` < `suggestedIDRCeilingForPayor`; red if ≥ |
| ~~Payor type~~ | `payorType` | text | Not displayed in table (retained in data) |
| ~~Payee projects~~ | `payeeProjects` | text | Not displayed in table (retained in data) |
| ~~Risk~~ | `riskLevel` | text | Not displayed in table (retained in data) |


---

## 12. Other


| Display Label                | Source Table | Coda Column                                                                       | Type   | R/W      | Notes                                                                  |
| ---------------------------- | ------------ | --------------------------------------------------------------------------------- | ------ | -------- | ---------------------------------------------------------------------- |
| Funding Source               | Project      | `Funding Source`                                                                  | lookup | WRITABLE | Warn if "Members" selected                                             |
| Bank Details for PT Reviewed | Project      | `Bank Details for PT Reviewed by Finance/ Analyst (if not raising from KF & KCF)` | check  | WRITABLE | Only show if Funding Source includes Members; display warning if FALSE |
| Tax Withholdings             | Project      | `Is KP going to withhold taxes on behalf of investors?`                           | sl     | WRITABLE | Warn if No; warn if any prior project is also No                       |


---

## 13. Approval & Voting


| Display Label         | Source Table | Coda Column                                                | Type                   | R/W         | Notes                                                                                                                                                                                                                               |
| --------------------- | ------------ | ---------------------------------------------------------- | ---------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IC Member Votes       | Project      | `IC Member Votes`                                          | reaction → **CHANGED** | **CHANGED** | Currently `[reaction]` type — must be changed to a writable column (e.g. lookup or select) before the new app can write to it                                                                                                       |
| Approve / Reject      | Project      | `Approve IC Review [Button]` / `Reject IC Review [Button]` | button                 | FORMULA     | Buttons trigger Coda automations; new app must call the underlying API or trigger equivalent logic                                                                                                                                  |
| Approval Notes        | Notes table  | IC Review Notes type (via `Add IC Review Note [Button]`)   | canvas                 | WRITABLE    | IC notes are stored as IC Review Notes in the Notes table, not in `IC Credit Review Approve/ Reject [Slack Results]` (which is a Slack notification record). Surfaced on project via `Merged IC Review Notes [#]` [canvas] formula. |
| Conditions Subsequent | Project      | `Condition-Subsequent Tasks`                               | lookup                 | FORMULA     | Derived from CS Tasks table                                                                                                                                                                                                         |
| Special Notes for IC  | Project      | `Special Notes for IC`                                     | text                   | WRITABLE    | Analyst-submitted notes flagged for IC attention                                                                                                                                                                                    |


---

## 14. Notifications / Triggers

These are Coda automations that must be replicated or called from the new app.


| Trigger                             | Event                   | Recipient                                                           | Notes                                     |
| ----------------------------------- | ----------------------- | ------------------------------------------------------------------- | ----------------------------------------- |
| On Approval                         | IC approves             | Submitter + Primary Analyst                                         | "Project has been approved"               |
| On Approval                         | IC approves             | Finance                                                             | "Do KF/KCF Split"                         |
| On Submission                       | New submission          | #coda-ic-review Slack channel                                       | Include submission count (1st, 2nd, etc.) |
| Large Project Approval (≥ Rp 4 bio) | 1st IC approves         | Remaining IC members                                                | "Please review and approve/reject"        |
| Pending Reminder                    | 6am & 12pm daily        | IC members with pending items                                       | For any submitted, not yet decided        |
| Legal Approval Notification         | Finance confirms KF/KCF | Legal (Suci, Nurul via [fat@karmaclub.id](mailto:fat@karmaclub.id)) | Include KF and KCF amounts                |


---

## 15. New Fields Required

The following fields do not yet exist in Coda and must be created before or alongside the new app:


| Field                             | Table                | Type | Notes                                                                      |
| --------------------------------- | -------------------- | ---- | -------------------------------------------------------------------------- |
| `Financials Link`                 | Project              | link | Embed or link to KP financial documents                                    |
| Limit history (Superseded limits) | New table or new app | —    | Coda only stores current limit; all history must be tracked in the new app |


---

## 16. Field Type Changes Required Before Go-Live


| Field             | Table   | Current Type | Required Change                                                                                                      |
| ----------------- | ------- | ------------ | -------------------------------------------------------------------------------------------------------------------- |
| `IC Member Votes` | Project | reaction     | Change to a writable type (e.g. lookup → People, or multi-select) so the new app can write IC vote decisions via API |


---

## 17. Engineering Validation Points (Phase 1)

### Blocking


| #   | Validation                                                                                                           | Why it matters                                                                                                                              |
| --- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Can the Coda API read `canvas` fields (KP Credit Memo, Project Credit Memo, Financial Review Notes)?                 | These are rich text; the API may return raw markdown or a blob — confirm format and whether it renders correctly in the new app             |
| 2   | Can `reaction` columns be migrated to a writable type without data loss?                                             | `IC Member Votes` must be writable; validate that changing column type preserves any existing vote data                                     |
| 3   | Can the API read formula columns reliably (e.g. `OTF IRR`***, `UBO Exposure`, Brand rollups)?                        | Formula columns should be readable but may have latency if not cached; confirm they return values (not nulls) via API                       |
| 4   | Can the API write to `canvas` fields (Project Credit Memo, PT SLIK summaries)?                                       | Required for IC to add notes and for analysts to upload SLIK summaries                                                                      |
| 5   | What is the Coda API rate limit, and can it handle loading all related tables for a single project card in one call? | A single IC card pulls from Project, Brand, People (multiple), PT, Disbursements, Financial Review, Reporting Layer — that's 7+ table reads |
| 6   | Can the app construct a stable deep-link URL to a specific Coda row?                                                 | Used as fallback "Open in Coda" link; confirm format is `https://coda.io/d/{docId}/r/{rowId}` and that it navigates correctly               |


### Risk (validate before GA, not blocking for prototype)


| #   | Validation                                                                                                                           | Why it matters                                                                                                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 7   | LMS Reporting Layer freshness — how often does it sync?                                                                              | OTF IRR, PvA, DPD, Outstanding from LMS may be stale; show last-sync timestamp in the UI                                                                            |
| 8   | Can the app trigger Coda Approve/Reject button logic via API, or does it need to replicate the formula logic directly?               | The Approve button runs a multi-step Coda automation; the new app may need to mirror this logic (status change + Slack notification) rather than calling the button |
| 9   | Revenue Projection Array and Repayment Schedule Array are stored as text blobs extracted from Google Sheets — confirm parsing format | These are calculator-extracted JSON strings; ensure the new app can parse them reliably                                                                             |
