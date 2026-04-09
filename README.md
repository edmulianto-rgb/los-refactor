# IC Review App — Prototype

Interactive IC Review card prototype for KarmaClub's Investment Committee.

**Stack:** Next.js 16 · TypeScript · Tailwind CSS  
**Status:** Prototype with mocked data — Phase 1 concept

---

## What's inside

- **Pending reviews list** — Shows all 3 mock projects with warning counts at a glance
- **Full IC Review card** — All 12 sections from the data contract:
  1. Project Header (brand, asset class, approval type)
  2. PIC (submitter, analysts)
  3. Project Details (sector, amount, project counts)
  4. Plafond (proposed/current limits, remaining headroom — red if negative)
  5. Financial Reviews (last 2 reviews, staleness warning)
  6. Karmapreneur Details (referral chain)
  7. KP Contacts (SLIK summaries, UBO exposure — yellow highlight)
  8. Past & Proposed Projects (table, DPD colour-coding, OTF IRR)
  9. Project Terms (disbursement schedule, revenue share or fixed return, branches)
  10. Credit Memo & Notes (memos, notes feed)
  11. PT Details (bank info, SLIK — pink highlight, mismatch warnings)
  12. Approval & Voting (vote buttons, notes textarea, conditions subsequent)
- **Warnings engine:** plafond breach, stale financial review, SLIK missing, DPD flags, sector mismatch, amount mismatch
- Collapsible sections, colour-coded tags

## Mock data scenarios


| Project                | KP        | Asset   | Scenario                                            |
| ---------------------- | --------- | ------- | --------------------------------------------------- |
| Warung Sehat Nusantara | New KP    | Asset A | First project, plafond requested                    |
| Kopi Kencana           | Repeat KP | Asset C | 4th project, DPD history on past project            |
| Batik Pesona Nusantara | Repeat KP | Asset D | Limit nearly exhausted, SLIK missing for key person |


---

## Run locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm i -g vercel
vercel login     # follow the browser prompt
vercel --prod    # deploy; grab the URL
```

### Option B — GitHub + Vercel dashboard

1. Create a new repo on GitHub (can be private):
  ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ic-review-app.git
   git push -u origin main
  ```
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the GitHub repo
3. Accept all defaults (Next.js is auto-detected)
4. Deploy — Vercel gives you a public URL immediately
5. Share the URL; teammates can click-to-comment via the Vercel Toolbar

---

## Important prototype notes

- Voting and approval actions are **UI-only** — no Coda API calls in this prototype
- In production, "Submit Vote" would trigger Coda automation (status change + Slack notifications)
- OTF MOIC and PvA show "N/A" — these are confirmed unavailable from the LMS Reporting Layer
- All data is mocked and does not reflect real projects

