import type { ICProject, PastProject, RevenueShareTerms, RevShareTermsSnapshot } from "@/data/types";
import { fmtPct } from "@/components/ui/DataRow";

export function toRevShareSnapshot(rst: RevenueShareTerms): RevShareTermsSnapshot {
  return {
    capType: rst.capType,
    capMultiple: rst.capMultiple,
    capTimePeriodMonths: rst.capTimePeriodMonths,
    preBEPRevSharePct: rst.preBEPRevSharePct,
    postBEPRevSharePct: rst.postBEPRevSharePct,
    minReturn: rst.minReturn,
    minReturnMultiple: rst.minReturnMultiple,
    minReturnPayableMonths: rst.minReturnPayableMonths,
  };
}

/** Proposed row uses live `project.revenueShareTerms`; historical rows use `revShareTermsSnapshot` when present. */
export function getRecapRowRevShareSnapshot(project: ICProject, p: PastProject): RevShareTermsSnapshot | null {
  if (p.isCurrentSubmission && project.revenueShareTerms) {
    return toRevShareSnapshot(project.revenueShareTerms);
  }
  return p.revShareTermsSnapshot ?? null;
}

export function formatTimeCapPeriodMonths(s: RevShareTermsSnapshot): string {
  if (s.capType === "Time Cap" && s.capTimePeriodMonths != null) {
    return `${s.capTimePeriodMonths} mo`;
  }
  return "—";
}

export function formatInvestorCapExcCarry(s: RevShareTermsSnapshot): string {
  if (s.capType === "Return Cap" && s.capMultiple != null) {
    return `${s.capMultiple}x`;
  }
  return "—";
}

/** IC recap: discrete payment-type bucket (detail lives in multiple / payable columns). */
export function formatMinInvestorReturnPaymentType(s: RevShareTermsSnapshot): string {
  if (s.minReturn == null) return "—";
  if (s.minReturnMultiple != null) return "Grossed-Up";
  return "Continual Rev Share";
}

function fmtPctUpToTwoDecimals(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return `${Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(rounded)}%`;
}

/** Grossed-up: multiple (e.g. 1.2x). Continual: minimum return floor as % of invested fund. */
export function formatMinReturnMultiple(s: RevShareTermsSnapshot): string {
  if (s.minReturnMultiple != null) return `${s.minReturnMultiple}x`;
  if (s.minReturn != null) return fmtPctUpToTwoDecimals(s.minReturn);
  return "—";
}

export function formatMinReturnPayableMonths(s: RevShareTermsSnapshot): string {
  if (s.minReturnPayableMonths != null) return `${s.minReturnPayableMonths} mo`;
  return "—";
}

export type RevShareCompareMetric = {
  label: string;
  sublabel?: string;
  format: (s: RevShareTermsSnapshot) => string;
};

export const REV_SHARE_RECAP_COMPARE_METRICS: RevShareCompareMetric[] = [
  { label: "Pre-BEP Revenue share", sublabel: "percentage", format: (s) => fmtPct(s.preBEPRevSharePct) },
  { label: "Post-BEP Revenue share", sublabel: "percentage", format: (s) => fmtPct(s.postBEPRevSharePct) },
  { label: "Time Cap Period", sublabel: "(months)", format: formatTimeCapPeriodMonths },
  { label: "Investor Cap", sublabel: "EXC. Carry", format: formatInvestorCapExcCarry },
  {
    label: "Minimum Investor Return",
    sublabel: "Payment Type*",
    format: formatMinInvestorReturnPaymentType,
  },
  {
    label: "Minimum Return",
    sublabel: "(multiple of invested fund)*",
    format: formatMinReturnMultiple,
  },
  {
    label: "Minimum Return Payable In",
    sublabel: "(mos)*",
    format: formatMinReturnPayableMonths,
  },
];
