<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ic-field-guide-rules -->
# IC Field Guide — always update with the app

When you add, remove, or rename any field on the IC review card (any component under
`components/sections/`, any new or changed property in `data/types.ts` that surfaces
on the card, or any logic change that affects what is shown), the following must happen
in the same task — not as a separate follow-up:

1. **`FIELDS` dictionary** in `field-guide.html` — add/remove/edit the entry.
   Also update `sectionFieldMap` if the field gains or loses a left-nav chip.
2. **`IC-Review-App-Data-Contract.md`** — add/remove the row in the matching section.
3. **Every `<template id="tpl-guide-…">` block** in `field-guide.html` that displays
   that section — update the chip or row to match what the app now renders.
4. **Sync and verify:**
   ```
   cp field-guide.html public/field-guide.html && npm run check:field-guide
   ```
   The check must pass (exit 0) before the task is complete.

The field guide is not a separate product. Keeping it current is part of the definition
of done for any IC card field change.
<!-- END:ic-field-guide-rules -->
