#!/usr/bin/env node
/**
 * Guardrails for static field-guide HTML.
 *
 * Run after any app change that touches the IC overview:
 *   cp field-guide.html public/field-guide.html && npm run check:field-guide
 *
 * Checks:
 *   1. field-guide.html and public/field-guide.html are byte-identical.
 *   2. Known structural invariants (plafond header, required sections per template).
 *   3. Field coverage parity:
 *      - Every field chip (select('XX')) in templates has a FIELDS dictionary entry.
 *      - Every field in sectionFieldMap (left-nav chips) has a FIELDS dictionary entry.
 *      This means: no field visible on the guide is undocumented, and no nav chip
 *      points to a field that no longer exists.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const fgPath = path.join(root, "field-guide.html");
const pubPath = path.join(root, "public", "field-guide.html");

let errors = 0;
function fail(msg) {
  console.error(`  FAIL  ${msg}`);
  errors++;
}
function warn(msg) {
  console.warn(`  warn  ${msg}`);
}

const fg = fs.readFileSync(fgPath, "utf8");
const pub = fs.readFileSync(pubPath, "utf8");

// ── 1. Sync check ─────────────────────────────────────────────────────────────
if (fg !== pub) {
  fail(
    "field-guide.html and public/field-guide.html are not identical.\n" +
      "       Fix: cp field-guide.html public/field-guide.html"
  );
}

// ── 2. Structural invariants ──────────────────────────────────────────────────
if (fg.includes("<th>Requested Limit")) {
  fail('Plafond column header must be "Total Limit", not "Requested Limit".');
}

const TEMPLATE_IDS = [
  "tpl-guide-holycow",
  "tpl-guide-cum",
  "tpl-guide-shushu",
  "tpl-guide-cea",
  "tpl-guide-assetd",
  "tpl-guide-mitra-agro",
];

const templateBodies = {};
for (const id of TEMPLATE_IDS) {
  const re = new RegExp(`<template\\s+id="${id}"[^>]*>([\\s\\S]*?)</template>`, "i");
  const m = fg.match(re);
  if (!m) { fail(`Missing <template id="${id}">`); continue; }
  templateBodies[id] = m[1];

  const body = m[1];
  if (!body.includes("Financing Type"))       fail(`Template ${id}: missing "Financing Type" row in Project Details.`);
  if (!body.includes("Karmapreneur Details")) fail(`Template ${id}: missing "Karmapreneur Details" section.`);
  if (!body.includes("Project #"))            fail(`Template ${id}: missing "Project #" in Karmapreneur Details.`);

  if (body.includes('card-section-title">Plafond') && !body.includes("<th>Total Limit")) {
    fail(`Template ${id}: Plafond card present but "<th>Total Limit" header not found.`);
  }
}

// ── 3. Field coverage parity ──────────────────────────────────────────────────

// 3a. Parse FIELDS keys from the JS dictionary in the HTML.
const fieldsBlockMatch = fg.match(/const FIELDS\s*=\s*\{([\s\S]*?)\n\};/);
if (!fieldsBlockMatch) {
  fail("Could not parse FIELDS object from field-guide.html — check script needs updating.");
} else {
  const fieldsKeys = new Set(
    [...fieldsBlockMatch[1].matchAll(/^\s{2}([A-Z][A-Z0-9]*):\s*\{/gm)].map((m) => m[1])
  );

  // 3b. Parse sectionFieldMap to get all nav-chip field IDs.
  const mapBlockMatch = fg.match(/const sectionFieldMap\s*=\s*\{([\s\S]*?)\n\};/);
  if (!mapBlockMatch) {
    fail("Could not parse sectionFieldMap from field-guide.html — check script needs updating.");
  } else {
    const navFields = new Set(
      [...mapBlockMatch[1].matchAll(/"([A-Z][A-Z0-9]*)"/g)].map((m) => m[1])
    );

    // Every field in sectionFieldMap must exist in FIELDS.
    for (const id of navFields) {
      if (!fieldsKeys.has(id)) {
        fail(`sectionFieldMap nav chip "${id}" has no FIELDS dictionary entry.`);
      }
    }
  }

  // 3c. Collect every select('XX') chip reference across all templates.
  const templateRefs = new Set();
  for (const [id, body] of Object.entries(templateBodies)) {
    for (const [, fid] of body.matchAll(/onclick="select\('([A-Z][A-Z0-9]*)'\)"/g)) {
      templateRefs.add(fid);
    }
  }

  // Every field chip referenced in any template must exist in FIELDS.
  for (const id of templateRefs) {
    if (!fieldsKeys.has(id)) {
      fail(`Template chip select('${id}') has no FIELDS dictionary entry — add it or remove the chip.`);
    }
  }

  // Soft warning: field in FIELDS but never shown in any template (may be intentional).
  for (const id of fieldsKeys) {
    if (!templateRefs.has(id)) {
      warn(`FIELDS entry "${id}" is not referenced in any template chip (may be intentional if section is prose-only).`);
    }
  }
}

// ── Result ────────────────────────────────────────────────────────────────────
if (errors > 0) {
  console.error(`\ncheck-field-guide: ${errors} error(s). Fix above before committing.`);
  process.exit(1);
}
console.log("check-field-guide: OK");
