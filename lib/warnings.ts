import { ICProject, KPContact, FinancialReview } from "@/data/types";

export interface WarningItem {
  section: string;
  level: "error" | "warn" | "info";
  message: string;
}

// ─── Plafond breach ───────────────────────────────────────────────────────────

export function plafondWarnings(project: ICProject): WarningItem[] {
  const warnings: WarningItem[] = [];
  const p = project.plafond;

  if (p.remainingTotal < 0) {
    warnings.push({
      section: "Plafond",
      level: "error",
      message: `Remaining total limit is negative (${fmtIDR(p.remainingTotal)}). Plafond increase required before disbursement.`,
    });
  }
  if (p.remainingWC < 0) {
    warnings.push({
      section: "Plafond",
      level: "error",
      message: `Remaining WC sub-limit is negative (${fmtIDR(p.remainingWC)}).`,
    });
  }
  if (p.remainingPO < 0) {
    warnings.push({
      section: "Plafond",
      level: "error",
      message: `Remaining PO sub-limit is negative (${fmtIDR(p.remainingPO)}).`,
    });
  }

  // Warn if remaining total is low (< 20% of current limit)
  if (p.current && p.remainingTotal >= 0) {
    const pct = p.remainingTotal / p.current.totalLimit;
    if (pct < 0.2) {
      warnings.push({
        section: "Plafond",
        level: "warn",
        message: `Remaining limit is less than 20% of approved plafond (${fmtIDR(p.remainingTotal)} remaining of ${fmtIDR(p.current.totalLimit)}).`,
      });
    }
  }

  // Warn if limit is expiring within 90 days
  if (p.current && p.current.limitStatus === "Active") {
    const expiryMs = new Date(p.current.expiryDate).getTime() - Date.now();
    const days = expiryMs / (1000 * 60 * 60 * 24);
    if (days < 90) {
      warnings.push({
        section: "Plafond",
        level: "warn",
        message: `Current limit expires in ${Math.round(days)} days (${p.current.expiryDate}).`,
      });
    }
  }

  return warnings;
}

// ─── Stale financial review ───────────────────────────────────────────────────

export function financialReviewWarnings(reviews: FinancialReview[]): WarningItem[] {
  if (reviews.length === 0) {
    return [
      {
        section: "Financial Reviews",
        level: "error",
        message: "No financial review on record.",
      },
    ];
  }

  const latest = reviews[0];
  const ageMs = Date.now() - new Date(latest.submissionDate).getTime();
  const months = ageMs / (1000 * 60 * 60 * 24 * 30);

  if (months > 2) {
    return [
      {
        section: "Financial Reviews",
        level: "warn",
        message: `Most recent financial review is ${Math.round(months)} months old (submitted ${latest.submissionDate}). Consider requesting updated financials.`,
      },
    ];
  }

  return [];
}

// ─── SLIK missing ─────────────────────────────────────────────────────────────

export function slikWarnings(contacts: KPContact[]): WarningItem[] {
  const missing = contacts.filter((c) => c.isKeyPerson && !c.slikFileUrl);
  return missing.map((c) => ({
    section: "KP Contacts",
    level: "error" as const,
    message: `SLIK file missing for key person: ${c.name}. Must be received before approval.`,
  }));
}

// ─── Sector mismatch ─────────────────────────────────────────────────────────

export function sectorWarning(project: ICProject): WarningItem | null {
  if (project.sectorWarning) {
    return {
      section: "Project Details",
      level: "warn",
      message: project.sectorWarning,
    };
  }
  return null;
}

// ─── DPD on past projects ─────────────────────────────────────────────────────

export function dpdWarnings(project: ICProject): WarningItem[] {
  return project.pastProjects
    .filter((p) => p.maxDPD > 30)
    .map((p) => ({
      section: "Past Projects",
      level: "warn" as const,
      message: `${p.projectName} reached max DPD of ${p.maxDPD} days.`,
    }));
}

// ─── Amount mismatch ─────────────────────────────────────────────────────────

export function amountWarning(project: ICProject): WarningItem | null {
  if (project.amountWarning) {
    return {
      section: "Project Details",
      level: "warn",
      message: project.amountWarning,
    };
  }
  return null;
}

// ─── Aggregate all warnings ───────────────────────────────────────────────────

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

function fmtIDR(n: number): string {
  return `IDR ${new Intl.NumberFormat("id-ID").format(Math.abs(n))}${n < 0 ? " (negative)" : ""}`;
}
