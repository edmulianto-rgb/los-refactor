# Replacing Coda for IC Review — Team Alignment

**Author:** Edwin Mulianto  
**Date:** April 2026  
**Status:** For discussion and alignment  
**Audience:** Engineering, Product, IC Team

---

## TL;DR

We are proposing to build a dedicated **IC Review application** to replace the current Coda-based credit review experience. The goal is to give the Investment Committee a significantly better interface for reviewing and approving project submissions — one that surfaces all the information they need in one place, with clear warnings and context, rather than requiring them to navigate Coda's raw table view.

We are not migrating everything out of Coda at once. **Phase 1 is read-only**: the new app pulls data from Coda, and IC members review and vote in the new interface. Coda remains the system of record for now.

---

## Why We're Doing This

### The problem with the current IC experience

The IC review today happens entirely in Coda. While Coda works well for analyst workflows, it was never designed to be a decision-support tool. The current experience has three core problems:

**1. Coda's presentation is too constrained.**  
The current IC view already attempts to surface all relevant information and context in one place — but Coda's layout system limits how much control we have over structure, hierarchy, and visual clarity. Key signals like past project performance (OTF IRR, PvA, DPD), plafond headroom, and key person exposure are present, but Coda's grid-and-card model makes them hard to scan quickly. There is a ceiling to how good this experience can get within Coda's constraints.

**2. Improving it costs too much.**  
Every UX improvement in Coda requires disproportionate build effort. Without a development environment or proper logging, even small changes to the IC view take significant time to develop, test, and debug. We are hitting diminishing returns on investment.

---

## What We're Proposing

### Phase 1: IC Review Interface (read-mostly)

**What it is:** A standalone web application that displays a structured, well-formatted IC review card for each project submitted for credit review. IC members can review all relevant data in one view and record their vote and notes.

**What Coda does:** Coda remains the system of record. All data is read from Coda via API. Votes and approval notes are written back to Coda via API. Analysts continue to submit projects through Coda as they do today.

**What changes for IC members:** They no longer need to open Coda. They receive a link to the new app for each pending review, review the card, vote, and are done.

**What doesn't change (yet):** Analyst submission workflow, Finance and Legal workflows, all Coda automations and Slack notifications.

### Future phases (not in scope now)

- **Phase 2:** Analyst submission moves to the new app (Coda becomes a pure backend / slave).
- **Phase 3:** Finance and Legal workflows move to the new app.
- **Phase 4:** Full migration out of Coda for all LOS workflows.

Sequencing rationale: IC review is the highest-impact, most self-contained change we can make right now. It requires no change to analyst workflows and has a clear before/after improvement for IC members.

---

## What the IC Review Card Shows

The new interface will display the following sections for each project, sourced from Coda:


| Section                   | Key Information                                                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Project Header**        | Brand name, Project name, Approval type                                                                                                                                    |
| **PIC**                   | Submitter, Primary and Secondary Analyst                                                                                                                                   |
| **Project Details**       | Asset class, sector, amount, financing use, project count for this KP                                                                                                      |
| **Plafond**               | Proposed limits, current limits, outstanding amounts, remaining headroom, limit expiry                                                                                     |
| **Financial Reviews**     | Last 2 financial review submissions with notes and recommendations                                                                                                         |
| **Karmapreneur Details**  | Referral source, referror connections                                                                                                                                      |
| **Karmapreneur Contacts** | Key persons, SLIK summaries, UBO exposure                                                                                                                                  |
| **Past Projects Recap**   | All prior projects for this KP: status, return type, amount, outstanding, OTF IRR; DPD aggregates (current, max). Note: OTF MOIC and PvA not currently available from LMS. |
| **Project Terms**         | Disbursement schedule, revenue share or fixed return terms, branch details, late fee terms                                                                                 |
| **Credit Memo & Notes**   | KP credit memo, project credit memo, financials link, notes feed                                                                                                           |
| **PT Details**            | Legal entity, bank details, SLIK results                                                                                                                                   |
| **Approval**              | Vote, approval notes, conditions subsequent                                                                                                                                |


The card surfaces warnings automatically — for example, if the proposed amount exceeds the plafond, if a KP's past IRR is below threshold, or if a key person's SLIK is missing.

---

## Key Decisions We Need to Make Together

The following decisions need alignment before engineering can begin. None of these are blocking for exploration/prototyping, but they need to be resolved before the first working version is released.

### Decision 1: Scope of Phase 1 writeback

**Context:** Phase 1 is primarily a read-only interface. The only writes from the new app back to Coda are:

- IC vote
- Approval notes
- Approve / Reject action (which triggers status change and Slack notifications)

**Decision needed:** Confirm that these three write operations are sufficient for Phase 1 — and that we are comfortable with the IC using the new app for decisions, even while analysts still submit via Coda.

---

### Decision 2: Limit history — data structure review

**Context:** Coda does have limit history data. The KP Changelog table tracks field-level changes to KP records and likely contains historical limit values — but the structure needs to be reviewed before we can confirm it can be queried and displayed cleanly in the new app.

**Decision needed:** Assign someone to review the KP Changelog table structure and confirm: (1) whether historical limit values are captured reliably, (2) what the query pattern looks like to reconstruct limit history per KP, and (3) whether the data is clean enough to display without manual cleanup.

**Impact if not reviewed:** If the changelog structure turns out to be unsuitable, we fall back to showing only the current and proposed limits in Phase 1, with no superseded history.

---

### Decision 3: Financials Link field

**Context:** The IC review card includes a "Financials Link" section — a link to the KP's financial documents (presumably in Google Drive). This field does not currently exist in Coda.

**Decision needed:** Should this field be added to the Project table in Coda, or stored only in the new app? If in Coda, engineering needs to add it before go-live.

---

## Key Risks


| Risk                                                              | Likelihood | Impact | Mitigation                                                                                                                              |
| ----------------------------------------------------------------- | ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Coda API cannot read `canvas` fields reliably                     | Medium     | High   | Validate in spike before building; may need to strip to plain text                                                                      |
| Coda API rate limits can't support loading 7+ tables per card     | Low        | Medium | Batch calls; cache on server side; build an API abstraction layer                                                                       |
| LMS Reporting Layer data may be stale                             | Medium     | Medium | Show last-sync timestamp on card (Reporting Layer has a `Synchronized on` column); never display LMS data without a freshness indicator |
| Schema drift — Coda columns renamed or restructured after go-live | Medium     | High   | Build an API abstraction layer that maps Coda column IDs (not names) to app field names; document the contract                          |


---

## What We Need From Engineering (Phase 1 Spike)

Before committing to a full build, we need a short validation spike (suggested: 3–5 days) to confirm the following:

### Blocking (must pass before build begins)

1. **Canvas field readability** — Can the Coda API return the content of `canvas` columns (credit memos, SLIK summaries, financial review notes) in a format that can be rendered in the new app?
2. **Formula column readability** — Do formula columns (e.g. `OTF IRR`***, `UBO Exposure`, Brand rollups) return values via the API, or do they return null?
3. **Canvas field writability** — Can the API write to canvas fields (required for IC notes)?
4. **API rate limits** — Can we load all data for a single project card within rate limits? How many calls does it require?
5. **Row deep-link URL** — Can we retrieve a stable direct link to a Coda row for the "Open in Coda" fallback?