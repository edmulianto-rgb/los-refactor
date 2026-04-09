import { ICProject, KPContact, FinancialReview } from "@/data/types";

export interface WarningItem {
  section: string;
  level: "error" | "warn" | "info";
  message: string;
}

// ─── Plafond ─────────────────────────────────────────────────────────────────
// Per CSV: highlight red if negative. No 20% or 90-day rules specified.

export function plafondWarnings(project: ICProject): WarningItem[] {
  const warnings: WarningItem[] = [];
  const p = project.plafond;

  if (p.remainingTotal < 0) {
    warnings.push({
      section: "Plafond",
      level: "error",
      message: `Total Limit Remaining is negative (${fmtRp(p.remainingTotal)}). Plafond increase required before disbursement.`,
    });
  }
  if (p.remainingWC < 0) {
    warnings.push({
      section: "Plafond",
      level: "error",
      message: `WC Sub-Limit Remaining is negative (${fmtRp(p.remainingWC)}).`,
    });
  }
  if (p.remainingPO < 0) {
    warnings.push({
      section: "Plafond",
      level: "error",
      message: `PO Sub-Limit Remaining is negative (${fmtRp(p.remainingPO)}).`,
    });
  }

  return warnings;
}

// ─── Stale financial review ───────────────────────────────────────────────────
// Per CSV: "Warning: More than [X] months ago" if >2 months

export function financialReviewWarnings(reviews: FinancialReview[]): WarningItem[] {
  if (reviews.length === 0) {
    return [{ section: "Financial Reviews", level: "error", message: "No financial review on record." }];
  }

  const latest = reviews[0];
  const ageMs = Date.now() - new Date(latest.submissionDate).getTime();
  const months = Math.round(ageMs / (1000 * 60 * 60 * 24 * 30));

  if (months > 2) {
    return [{
      section: "Financial Reviews",
      level: "warn",
      message: `Warning: More than ${months} months ago (submitted ${latest.submissionDate}).`,
    }];
  }

  return [];
}

// ─── SLIK missing (key persons) ───────────────────────────────────────────────

export function slikWarnings(contacts: KPContact[]): WarningItem[] {
  return contacts
    .filter((c) => c.isKeyPerson && !c.slikFileUrl)
    .map((c) => ({
      section: "KP Contacts",
      level: "error" as const,
      message: `SLIK-Key Person file missing for key person: ${c.name}. Must be received before approval.`,
    }));
}

// ─── Sector mismatch ─────────────────────────────────────────────────────────

export function sectorWarning(project: ICProject): WarningItem | null {
  if (project.sectorWarning) {
    return { section: "Project Details", level: "warn", message: project.sectorWarning };
  }
  return null;
}

// ─── DPD on past projects ─────────────────────────────────────────────────────

export function dpdWarnings(project: ICProject): WarningItem[] {
  return project.pastProjects
    .filter((p) => p.maxDPD > 0)
    .map((p) => ({
      section: "Past Projects",
      level: (p.maxDPD > 30 ? "warn" : "info") as "warn" | "info",
      message: `${p.projectName}: max DPD ${p.maxDPD} days.`,
    }));
}

// ─── Amount mismatch ─────────────────────────────────────────────────────────

export function amountWarning(project: ICProject): WarningItem | null {
  if (project.amountWarning) {
    return { section: "Project Details", level: "warn", message: project.amountWarning };
  }
  return null;
}

// ─── Aggregate all ───────────────────────────────────────────────────────────

export function computeWarnings(project: ICProject): WarningItem[] {
  const all: WarningItem[] = [
    ...plafondWarnings(project),
    ...financialReviewWarnings(project.financialReviews),
    ...slikWarnings(project.kpContacts),
    ...dpdWarnings(project),
  ];

  const sw = sectorWarning(project);
  if (sw) all.push(sw);

  const aw = amountWarning(project);
  if (aw) all.push(aw);

  return all;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtRp(n: number): string {
  const abs = Math.abs(n);
  return `Rp ${new Intl.NumberFormat("id-ID").format(abs)}${n < 0 ? " (negative)" : ""}`;
}
