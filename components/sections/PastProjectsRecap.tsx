import React from "react";
import { ICProject, PastProject, ReturnType } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { Tag, statusVariant } from "@/components/ui/Tag";
import { fmt, fmtDate, fmtPct } from "@/components/ui/DataRow";
import { getPastProjectsRecapRows } from "@/lib/pastProjectsRecap";
import { sortPastProjectsRecapRows } from "@/lib/pastProjectsRecapSort";

interface Props {
  project: ICProject;
}

// ── Return type helpers ────────────────────────────────────────────────────────

function isRevShare(rt: ReturnType): boolean {
  return rt === "Revenue Share (Return-Capped)" || rt === "Revenue Share (Time-Capped)" || rt === "Fixed + Revenue Share";
}
function isFixedPlusRS(rt: ReturnType): boolean {
  return rt === "Fixed + Revenue Share";
}
function isFixedReturn(rt: ReturnType): boolean {
  return rt === "Fixed Return";
}
function isDailyInterest(rt: ReturnType): boolean {
  return rt === "Daily Interest";
}
function hasFixedLeg(rt: ReturnType): boolean {
  return rt === "Fixed Return" || rt === "Fixed + Revenue Share";
}
function hasFixedROIC(rt: ReturnType): boolean {
  return rt === "Fixed Return" || rt === "Daily Interest";
}
function hasBEP(rt: ReturnType): boolean {
  return rt !== "Daily Interest";
}

function returnTypeShort(rt: ReturnType): string {
  const map: Record<ReturnType, string> = {
    "Revenue Share (Return-Capped)": "Revenue Share (Return-Cap)",
    "Revenue Share (Time-Capped)": "Revenue Share (Time-Cap)",
    "Fixed + Revenue Share": "Fixed + Revenue Share",
    "Fixed Return": "Fixed Return",
    "Daily Interest": "Daily Interest",
  };
  return map[rt] ?? rt;
}

/** Financing type cell: Fixed + Revenue Share includes RS cap flavor from terms. */
function financingTypeLabel(
  returnType: ReturnType,
  rsCapType?: "Return Cap" | "Time Cap" | null
): string {
  if (returnType !== "Fixed + Revenue Share") {
    return returnTypeShort(returnType);
  }
  if (rsCapType === "Return Cap") return "Fixed + Revenue Share (Return-Cap)";
  if (rsCapType === "Time Cap") return "Fixed + Revenue Share (Time-Cap)";
  return "Fixed + Revenue Share";
}

function returnTypeBadgeColor(rt: ReturnType): string {
  if (rt === "Revenue Share (Return-Capped)") return "bg-violet-100 text-violet-800";
  if (rt === "Revenue Share (Time-Capped)") return "bg-purple-100 text-purple-800";
  if (rt === "Fixed + Revenue Share") return "bg-indigo-100 text-indigo-800";
  if (rt === "Fixed Return") return "bg-blue-100 text-blue-800";
  if (rt === "Daily Interest") return "bg-orange-100 text-orange-800";
  return "bg-gray-100 text-gray-600";
}

function irrClass(irr: number | null): string {
  if (irr === null) return "text-gray-400";
  if (irr < 15) return "text-red-600 font-semibold";
  if (irr < 20) return "text-amber-600 font-semibold";
  return "text-emerald-700 font-semibold";
}

function na(): React.ReactNode {
  return <span className="text-gray-300">—</span>;
}

function warn(msg: string): React.ReactNode {
  return (
    <span className="text-[10px] text-amber-600 font-medium leading-tight block mt-0.5">{msg}</span>
  );
}

// ── Value renderers: proposed project (from ICProject) ────────────────────────

function proposedFinancingType(proj: ICProject): React.ReactNode {
  const label = financingTypeLabel(proj.returnType, proj.revenueShareTerms?.capType);
  return (
    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${returnTypeBadgeColor(proj.returnType)}`}>
      {label}
    </span>
  );
}

function proposedPT(proj: ICProject): React.ReactNode {
  return proj.ptDetails.length > 0 ? proj.ptDetails.map((pt) => pt.name).join(", ") : na();
}

function proposedRevSharePct(proj: ICProject): React.ReactNode {
  if (!isRevShare(proj.returnType) || !proj.revenueShareTerms) return na();
  const rst = proj.revenueShareTerms;
  return (
    <div className="space-y-0.5">
      <div>{fmtPct(rst.preBEPRevSharePct)} Pre-BEP</div>
      <div>{fmtPct(rst.postBEPRevSharePct)} Post-BEP</div>
    </div>
  );
}

function proposedCap(proj: ICProject): React.ReactNode {
  if (!isRevShare(proj.returnType) || !proj.revenueShareTerms) return na();
  const rst = proj.revenueShareTerms;
  if (rst.capType === "Return Cap" && rst.capMultiple != null) {
    return <div><span className="font-medium">{rst.capMultiple}x</span> investor return cap</div>;
  }
  if (rst.capType === "Time Cap" && rst.capTimePeriodMonths != null) {
    return <div><span className="font-medium">{rst.capTimePeriodMonths} months</span> time cap</div>;
  }
  return na();
}

function proposedRevShareStart(proj: ICProject): React.ReactNode {
  if (!isRevShare(proj.returnType) || !proj.revenueShareTerms) return na();
  const rst = proj.revenueShareTerms;
  if (rst.revShareStartType === "Fixed" && rst.revShareStartDate) {
    return (
      <div className="space-y-0.5">
        <div className="font-medium">Fixed start date</div>
        <div>{fmtDate(rst.revShareStartDate)}</div>
      </div>
    );
  }
  return <div className="text-gray-700">Anchored to Branch Opening</div>;
}

function pastRevShareStart(p: PastProject): React.ReactNode {
  if (!isRevShare(p.returnType)) return na();
  const s = p.revShareTermsSnapshot;
  if (!s) return na();
  if (s.revShareStartType === "Fixed" && s.revShareStartDate) {
    return (
      <div className="space-y-0.5">
        <div className="font-medium">Fixed start date</div>
        <div>{fmtDate(s.revShareStartDate)}</div>
      </div>
    );
  }
  if (s.revShareStartType === "Anchored to Branch Opening" || (s.revShareStartType == null && s.revShareStartDate == null)) {
    return <div className="text-gray-700">Anchored to Branch Opening</div>;
  }
  return na();
}

function proposedFixedLeg(proj: ICProject): React.ReactNode {
  if (!hasFixedLeg(proj.returnType)) return na();
  if (isFixedReturn(proj.returnType) && proj.fixedReturnTerms) {
    const frt = proj.fixedReturnTerms;
    return (
      <div className="space-y-0.5">
        <div className="font-medium">{fmt(frt.totalRepayment)}</div>
        <div className="text-gray-500">total repayment</div>
        <div className="text-gray-500">{frt.repaymentSchedule.length} monthly installments</div>
      </div>
    );
  }
  if (isFixedPlusRS(proj.returnType) && proj.fixedReturnTerms) {
    const frt = proj.fixedReturnTerms;
    return (
      <div className="space-y-0.5">
        <div className="font-medium">{fmt(frt.totalRepayment)}</div>
        <div className="text-gray-500">fixed leg repayment</div>
        <div className="text-gray-500">{frt.repaymentSchedule.length} monthly installments</div>
      </div>
    );
  }
  return na();
}

function proposedCarry(proj: ICProject): React.ReactNode {
  if (proj.revenueShareTerms) {
    const rst = proj.revenueShareTerms;
    return `${fmtPct(rst.carryPct)} ${rst.carryType}`;
  }
  return na();
}

function proposedInvestorROIC(proj: ICProject): React.ReactNode {
  if (!hasFixedROIC(proj.returnType)) return na();
  if (isDailyInterest(proj.returnType) && proj.dailyInterestTerms) {
    const dit = proj.dailyInterestTerms;
    return (
      <div className="space-y-0.5">
        <div className="font-medium">{fmtPct(dit.interestRate30DayPct)} per 30 days</div>
        <div className="text-gray-400 text-[10px]">to investors</div>
      </div>
    );
  }
  if (isFixedReturn(proj.returnType) && proj.fixedReturnTerms) {
    const frt = proj.fixedReturnTerms;
    const months = frt.repaymentSchedule.length;
    if (months > 0) {
      const perMonth = (frt.totalInterest / frt.totalPrincipal / months) * 100;
      return (
        <div className="space-y-0.5">
          <div className="font-medium">{perMonth.toFixed(3)}% per month</div>
          <div className="text-gray-400 text-[10px]">investor interest rate</div>
        </div>
      );
    }
  }
  return na();
}

function proposedTotalROIC(proj: ICProject): React.ReactNode {
  if (!hasFixedROIC(proj.returnType)) return na();
  if (isDailyInterest(proj.returnType) && proj.dailyInterestTerms) {
    const dit = proj.dailyInterestTerms;
    const total = dit.interestRate30DayPct + dit.serviceFee30DayPct;
    return (
      <div className="space-y-0.5">
        <div className="font-medium">{fmtPct(total)} per 30 days</div>
        <div className="text-gray-400 text-[10px]">investor + carry (service fee)</div>
      </div>
    );
  }
  if (isFixedReturn(proj.returnType) && proj.fixedReturnTerms) {
    const frt = proj.fixedReturnTerms;
    const months = frt.repaymentSchedule.length;
    if (months > 0) {
      const perMonth = ((frt.totalInterest + frt.carry) / frt.totalPrincipal / months) * 100;
      return (
        <div className="space-y-0.5">
          <div className="font-medium">{perMonth.toFixed(3)}% per month</div>
          <div className="text-gray-400 text-[10px]">investor + carry (total implied)</div>
        </div>
      );
    }
  }
  return na();
}

function proposedTerm(proj: ICProject): React.ReactNode {
  if (isDailyInterest(proj.returnType) && proj.dailyInterestTerms) {
    return <div className="font-medium">{proj.dailyInterestTerms.tenorDays} days</div>;
  }
  const term = proj.revenueShareTerms
    ? proj.revenueShareTerms.capType === "Time Cap"
      ? proj.revenueShareTerms.capTimePeriodMonths ?? null
      : null
    : null;
  const projected = proj.pastProjects.find((p) => p.isCurrentSubmission)?.projectedTermMonths ?? null;
  return (
    <div className="space-y-0.5">
      <div className="font-medium">{projected != null ? `${projected} months` : "—"}</div>
      {term != null && <div className="text-gray-400 text-[10px]">= cap period</div>}
    </div>
  );
}

function proposedBranchOpening(proj: ICProject): React.ReactNode {
  if (!isRevShare(proj.returnType)) return na();
  if (proj.branches.length === 0) return <span className="text-gray-400">N/A — no branch opening</span>;
  return (
    <div className="space-y-0.5">
      {proj.branches.map((b) => (
        <div key={b.id}>
          <span className="font-medium">{b.name}</span>
          {b.type === "Opening Branch" && <span className="text-gray-400"> (Opening)</span>}
        </div>
      ))}
      <div className="text-gray-400 text-[10px]">Scheduled per disbursement</div>
    </div>
  );
}

function proposedMinPeriod(proj: ICProject): React.ReactNode {
  if (!isDailyInterest(proj.returnType)) return na();
  if (proj.dailyInterestTerms) {
    return <div className="font-medium">{proj.dailyInterestTerms.minInterestPeriodDays} days</div>;
  }
  return na();
}

function proposedPvA(proj: ICProject): React.ReactNode {
  if (!isRevShare(proj.returnType)) return na();
  return <span className="text-gray-400">N/A — not yet started</span>;
}

function proposedIRR(proj: ICProject): React.ReactNode {
  const p = proj.pastProjects.find((p) => p.isCurrentSubmission);
  if (!p) return na();
  return (
    <div className="space-y-0.5">
      <div className="text-gray-400 text-[10px]">OTF N/A — not yet started</div>
      <div className={irrClass(p.projectedIRR)}>{fmtPct(p.projectedIRR)} projected</div>
    </div>
  );
}

function proposedMOIC(proj: ICProject): React.ReactNode {
  const p = proj.pastProjects.find((pp) => pp.isCurrentSubmission);
  if (!p) return na();
  return (
    <div className="space-y-0.5">
      <div className="text-gray-400 text-[10px]">OTF N/A</div>
      <div className="text-gray-700">{p.projectedMOIC} projected</div>
    </div>
  );
}

function proposedBEP(proj: ICProject): React.ReactNode {
  if (!hasBEP(proj.returnType)) return na();
  const p = proj.pastProjects.find((pp) => pp.isCurrentSubmission);
  if (!p) return na();
  return (
    <div className="space-y-0.5">
      <div className="text-gray-400 text-[10px]">OTF N/A</div>
      <div className="text-gray-700">Month {p.projectedBEPMonths} projected</div>
    </div>
  );
}

function proposedMinReturn(proj: ICProject): React.ReactNode {
  if (!isRevShare(proj.returnType) || !proj.revenueShareTerms) return na();
  const rst = proj.revenueShareTerms;
  if (rst.minReturnMultiple != null && rst.minReturnPayableMonths != null) {
    return (
      <div>
        <div className="font-medium">Gross up to {rst.minReturnMultiple}x</div>
        <div className="text-gray-500">at month {rst.minReturnPayableMonths}</div>
      </div>
    );
  }
  if (rst.minReturn != null && rst.minReturnPayableMonths != null) {
    return (
      <div>
        <div className="font-medium">Continual min {fmtPct(rst.minReturn)}</div>
        <div className="text-gray-500">within {rst.minReturnPayableMonths} months</div>
      </div>
    );
  }
  return <span className="text-gray-400">None</span>;
}

function proposedDPD(_proj: ICProject): React.ReactNode {
  return <span className="text-gray-400">N/A — not yet disbursed</span>;
}

function proposedRevProjections(proj: ICProject): React.ReactNode {
  if (!isRevShare(proj.returnType) || !proj.revenueShareTerms) return na();
  const arr = proj.revenueShareTerms.revProjectionArray;
  if (arr.length === 0) return na();
  const avg = arr.reduce((s, r) => s + r.revenue, 0) / arr.length;
  const peak = arr.reduce((a, b) => (b.revenue > a.revenue ? b : a));
  const floor = arr.reduce((a, b) => (b.revenue < a.revenue ? b : a));
  return (
    <div className="space-y-0.5">
      <div><span className="text-gray-400">Avg</span> {fmt(Math.round(avg))}/mo</div>
      <div><span className="text-gray-400">Peak</span> {fmt(peak.revenue)}</div>
      <div><span className="text-gray-400">Floor</span> {fmt(floor.revenue)}</div>
      <div className="text-gray-400 text-[10px]">{arr.length} month projection</div>
    </div>
  );
}

function proposedSourceOfRevenue(proj: ICProject): React.ReactNode {
  if (!isRevShare(proj.returnType) || !proj.revenueShareTerms) return na();
  return <span className="text-gray-700 text-[10px] leading-snug">{proj.revenueShareTerms.sourceOfRevenueAccrued}</span>;
}

function proposedPaymentFreq(proj: ICProject): React.ReactNode {
  if (isRevShare(proj.returnType) && proj.revenueShareTerms) {
    const rst = proj.revenueShareTerms;
    return (
      <div className="space-y-0.5">
        <div>Revenue share: {rst.frequency}, {rst.dueDate}</div>
        <div className="text-gray-400 text-[10px]">Carry: same schedule</div>
      </div>
    );
  }
  if (isDailyInterest(proj.returnType)) {
    return <div>At maturity (bullet repayment)</div>;
  }
  if (isFixedReturn(proj.returnType)) {
    return <div>Monthly installment</div>;
  }
  return na();
}

function proposedLateFee(proj: ICProject): React.ReactNode {
  const lf = proj.lateFee;
  return (
    <div className="space-y-0.5">
      <div><span className="text-gray-400">Basis:</span> {lf.basis}</div>
      <div><span className="text-gray-400">Grace:</span> {lf.gracePeriodDays} days</div>
      <div><span className="text-gray-400">To investors:</span> {fmtPct(lf.dailyPctInvestors)}/day</div>
      <div><span className="text-gray-400">To ASN:</span> {fmtPct(lf.dailyPctASN)}/day</div>
    </div>
  );
}

// ── Value renderers: past project (from PastProject) ─────────────────────────

function pastFinancingType(p: PastProject): React.ReactNode {
  const label = financingTypeLabel(p.returnType, p.revShareTermsSnapshot?.capType);
  return (
    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${returnTypeBadgeColor(p.returnType)}`}>
      {label}
    </span>
  );
}

function pastPT(p: PastProject): React.ReactNode {
  return p.extendedTermsSnapshot?.ptName ?? na();
}

function pastRevSharePct(p: PastProject): React.ReactNode {
  if (!isRevShare(p.returnType) || !p.revShareTermsSnapshot) return na();
  const s = p.revShareTermsSnapshot;
  return (
    <div className="space-y-0.5">
      <div>{fmtPct(s.preBEPRevSharePct)} Pre-BEP</div>
      <div>{fmtPct(s.postBEPRevSharePct)} Post-BEP</div>
    </div>
  );
}

function pastCap(p: PastProject): React.ReactNode {
  if (!isRevShare(p.returnType) || !p.revShareTermsSnapshot) return na();
  const s = p.revShareTermsSnapshot;
  if (s.capType === "Return Cap" && s.capMultiple != null) {
    return <div><span className="font-medium">{s.capMultiple}x</span> investor return cap</div>;
  }
  if (s.capType === "Time Cap" && s.capTimePeriodMonths != null) {
    return <div><span className="font-medium">{s.capTimePeriodMonths} months</span> time cap</div>;
  }
  return na();
}

function pastFixedLeg(p: PastProject): React.ReactNode {
  if (!hasFixedLeg(p.returnType)) return na();
  const ext = p.extendedTermsSnapshot;
  if (!ext?.fixedLegTotalAmount) return na();
  const label = isFixedReturn(p.returnType) ? "total repayment" : "fixed leg repayment";
  return (
    <div className="space-y-0.5">
      <div className="font-medium">{fmt(ext.fixedLegTotalAmount)}</div>
      <div className="text-gray-500">{label}</div>
      {ext.fixedLegInstallmentMonths && (
        <div className="text-gray-500">{ext.fixedLegInstallmentMonths} monthly installments</div>
      )}
    </div>
  );
}

function pastCarry(p: PastProject): React.ReactNode {
  const s = p.revShareTermsSnapshot;
  if (s?.carryPct != null) {
    return `${fmtPct(s.carryPct)} ${s.carryType ?? ""}`.trim();
  }
  return na();
}

function pastInvestorROIC(p: PastProject): React.ReactNode {
  if (!hasFixedROIC(p.returnType)) return na();
  const ext = p.extendedTermsSnapshot;
  if (ext?.investorROICPerPeriod != null) {
    return (
      <div className="space-y-0.5">
        <div className="font-medium">{fmtPct(ext.investorROICPerPeriod)} {ext.roicPeriodLabel}</div>
        <div className="text-gray-400 text-[10px]">to investors</div>
      </div>
    );
  }
  if (isDailyInterest(p.returnType) && p.dailyInterestRecap) {
    return (
      <div className="space-y-0.5">
        <div className="font-medium">{fmtPct(p.dailyInterestRecap.interestRate30DayPct)} per 30 days</div>
        <div className="text-gray-400 text-[10px]">to investors</div>
      </div>
    );
  }
  return na();
}

function pastTotalROIC(p: PastProject): React.ReactNode {
  if (!hasFixedROIC(p.returnType)) return na();
  const ext = p.extendedTermsSnapshot;
  if (ext?.totalImpliedROICPerPeriod != null) {
    return (
      <div className="space-y-0.5">
        <div className="font-medium">{fmtPct(ext.totalImpliedROICPerPeriod)} {ext.roicPeriodLabel}</div>
        <div className="text-gray-400 text-[10px]">investor + carry (total implied)</div>
      </div>
    );
  }
  if (isDailyInterest(p.returnType) && p.dailyInterestRecap) {
    const total = p.dailyInterestRecap.interestRate30DayPct + p.dailyInterestRecap.serviceFee30DayPct;
    return (
      <div className="space-y-0.5">
        <div className="font-medium">{fmtPct(total)} per 30 days</div>
        <div className="text-gray-400 text-[10px]">investor + service fee (total)</div>
      </div>
    );
  }
  return na();
}

function pastTerm(p: PastProject): React.ReactNode {
  if (isDailyInterest(p.returnType)) {
    const days = p.dailyInterestRecap?.tenorDays ?? null;
    return days != null ? <div className="font-medium">{days} days</div> : na();
  }
  return (
    <div className="space-y-0.5">
      {p.otfTermMonths != null && <div className="font-medium">{p.otfTermMonths} months OTF</div>}
      <div className={p.otfTermMonths != null ? "text-gray-400 text-[10px]" : "font-medium"}>
        {p.projectedTermMonths} months {p.otfTermMonths != null ? "original" : "projected"}
      </div>
    </div>
  );
}

function pastBranchOpening(p: PastProject): React.ReactNode {
  if (!isRevShare(p.returnType)) return na();
  const ext = p.extendedTermsSnapshot;
  if (!ext?.branchOpeningScheduledDate) return <span className="text-gray-400">N/A — no branch opening</span>;
  const scheduled = fmtDate(ext.branchOpeningScheduledDate);
  const actual = ext.branchOpeningActualDate ? fmtDate(ext.branchOpeningActualDate) : null;
  return (
    <div className="space-y-0.5">
      <div><span className="text-gray-400">Sched:</span> {scheduled}</div>
      {actual && <div><span className="text-gray-400">Actual:</span> {actual}</div>}
    </div>
  );
}

function pastMinPeriod(p: PastProject): React.ReactNode {
  if (!isDailyInterest(p.returnType)) return na();
  const days = p.dailyInterestRecap?.minInterestPeriodDays;
  return days != null ? <div className="font-medium">{days} days</div> : na();
}

function pastPvA(p: PastProject): React.ReactNode {
  if (!isRevShare(p.returnType)) return na();
  if (p.pvaPct == null) return <span className="text-gray-400">—</span>;
  const cls = p.pvaPct >= 100 ? "text-emerald-700 font-semibold" : p.pvaPct >= 85 ? "text-amber-600 font-semibold" : "text-red-600 font-semibold";
  return <span className={cls}>{fmtPct(p.pvaPct)}</span>;
}

function pastIRR(p: PastProject): React.ReactNode {
  return (
    <div className="space-y-0.5">
      {p.otfIRR != null && <div className={irrClass(p.otfIRR)}>{fmtPct(p.otfIRR)} OTF</div>}
      <div className={`${irrClass(p.projectedIRR)} ${p.otfIRR != null ? "text-[10px] text-gray-400 font-normal" : ""}`}>
        {fmtPct(p.projectedIRR)} {p.otfIRR != null ? "original proj." : "projected"}
      </div>
    </div>
  );
}

function pastMOIC(p: PastProject): React.ReactNode {
  return (
    <div className="space-y-0.5">
      {p.otfMOIC != null
        ? <div className="font-medium">{p.otfMOIC}x OTF</div>
        : <div className="text-gray-400 text-[10px]">OTF N/A from LMS</div>
      }
      <div className="text-gray-500">{p.projectedMOIC} projected</div>
    </div>
  );
}

function pastBEP(p: PastProject): React.ReactNode {
  if (!hasBEP(p.returnType)) return na();
  return (
    <div className="space-y-0.5">
      <div className="text-gray-400 text-[10px]">OTF N/A from LMS</div>
      <div className="text-gray-700">Month {p.projectedBEPMonths} projected</div>
    </div>
  );
}

function pastMinReturn(p: PastProject): React.ReactNode {
  if (!isRevShare(p.returnType) || !p.revShareTermsSnapshot) return na();
  const s = p.revShareTermsSnapshot;
  if (s.minReturnMultiple != null && s.minReturnPayableMonths != null) {
    return (
      <div>
        <div className="font-medium">Gross up to {s.minReturnMultiple}x</div>
        <div className="text-gray-500">at month {s.minReturnPayableMonths}</div>
      </div>
    );
  }
  if (s.minReturn != null && s.minReturnPayableMonths != null) {
    return (
      <div>
        <div className="font-medium">Continual min {fmtPct(s.minReturn)}</div>
        <div className="text-gray-500">within {s.minReturnPayableMonths} months</div>
      </div>
    );
  }
  return <span className="text-gray-400">None</span>;
}

function pastDPD(p: PastProject): React.ReactNode {
  if (p.status === "Proposed") return <span className="text-gray-400">N/A — not yet disbursed</span>;
  const hasAny = p.currentDPD > 0 || p.maxDPD > 0;
  if (!hasAny) return <span className="text-emerald-700">Clean</span>;
  return (
    <div className="space-y-0.5">
      {p.currentDPD > 0 && <div className="text-red-600 font-semibold">{p.currentDPD}d current</div>}
      {p.maxDPD > 0 && (
        <div className={p.maxDPD > 30 ? "text-red-600 font-medium" : "text-amber-600"}>
          {p.maxDPD}d max ever
        </div>
      )}
      {p.overdueHistory?.map((ev, i) => (
        <div key={i} className="text-[10px] text-gray-500">
          {fmtDate(ev.dueDate)} — {ev.daysOverdue}d —{" "}
          <span className={ev.status === "Unpaid" ? "text-red-600" : "text-gray-400"}>{ev.status}</span>
        </div>
      ))}
    </div>
  );
}

function pastRevProjections(p: PastProject): React.ReactNode {
  if (!isRevShare(p.returnType)) return na();
  const ext = p.extendedTermsSnapshot;
  if (!ext?.avgRevenuePerMonth) return na();
  return (
    <div className="space-y-0.5">
      <div><span className="text-gray-400">Avg</span> {fmt(ext.avgRevenuePerMonth)}/mo</div>
      {ext.peakRevenuePerMonth && <div><span className="text-gray-400">Peak</span> {fmt(ext.peakRevenuePerMonth)}</div>}
      {ext.floorRevenuePerMonth && <div><span className="text-gray-400">Floor</span> {fmt(ext.floorRevenuePerMonth)}</div>}
      {ext.revProjectionSpanMonths && (
        <div className="text-gray-400 text-[10px]">{ext.revProjectionSpanMonths} month projection</div>
      )}
    </div>
  );
}

function pastSourceOfRevenue(p: PastProject): React.ReactNode {
  if (!isRevShare(p.returnType)) return na();
  const src = p.revShareTermsSnapshot?.sourceOfRevenueAccrued;
  if (!src) return na();
  return <span className="text-gray-700 text-[10px] leading-snug">{src}</span>;
}

function pastPaymentFreq(p: PastProject): React.ReactNode {
  const ext = p.extendedTermsSnapshot;
  if (ext?.paymentFrequency) return <div>{ext.paymentFrequency}</div>;
  if (isDailyInterest(p.returnType)) return <div>At maturity (bullet repayment)</div>;
  if (isFixedReturn(p.returnType)) return <div>Monthly installment</div>;
  if (isRevShare(p.returnType)) return <div>Monthly revenue share</div>;
  return na();
}

function pastLateFee(p: PastProject): React.ReactNode {
  const lf = p.lateFeeRecap;
  const di = p.dailyInterestRecap;

  const basis = lf?.basis ?? di?.lateFeeBasis ?? null;
  const grace = lf?.gracePeriodDays ?? di?.gracePeriodDays ?? null;
  const inv = lf?.dailyPctInvestors ?? di?.dailyPctInvestors ?? null;
  const asn = lf?.dailyPctASN ?? di?.dailyPctASN ?? null;

  if (!basis) return na();

  const basisWarn =
    (isFixedReturn(p.returnType) && basis !== "Outstanding Amount")
      ? warn("Expected: Outstanding Amount for Fixed Return")
      : (isRevShare(p.returnType) && basis !== "Overdue Amount")
      ? warn("Expected: Overdue Amount for Revenue Share")
      : null;

  const graceWarn =
    (isFixedReturn(p.returnType) && grace !== 0)
      ? warn("Expected: 0 days for Fixed Return")
      : (isRevShare(p.returnType) && grace !== 5)
      ? warn("Expected: 5 days for Revenue Share")
      : null;

  return (
    <div className="space-y-0.5">
      <div>
        <span className="text-gray-400">Basis:</span> {basis}
        {basisWarn}
      </div>
      <div>
        <span className="text-gray-400">Grace:</span> {grace} days
        {graceWarn}
      </div>
      {inv != null && <div><span className="text-gray-400">To investors:</span> {fmtPct(inv)}/day</div>}
      {asn != null && <div><span className="text-gray-400">To ASN:</span> {fmtPct(asn)}/day</div>}
    </div>
  );
}

// ── Main comparison table ─────────────────────────────────────────────────────

interface FieldSection {
  sectionLabel: string;
  fields: FieldDef[];
}

interface FieldDef {
  id: string;
  label: string;
  sublabel?: string;
  nuanceNote?: string;
  /** Show this row at all given the return types present in the set. */
  showForSet(allTypes: ReturnType[]): boolean;
  /** Is this field applicable to this specific project? If not, render N/A. */
  applicableForProject(rt: ReturnType, allTypes: ReturnType[]): boolean;
  valueProposed(proj: ICProject): React.ReactNode;
  valuePast(p: PastProject, proj: ICProject): React.ReactNode;
}

function buildFieldSections(allTypes: ReturnType[]): FieldSection[] {
  const setHasRevShare = allTypes.some(isRevShare);
  const setHasDI = allTypes.some(isDailyInterest);
  const setHasFixed = allTypes.some(isFixedReturn);
  const setHasFixedPlusRS = allTypes.some(isFixedPlusRS);
  const setHasFixedLeg = allTypes.some(hasFixedLeg);
  const setHasFixedROIC = allTypes.some(hasFixedROIC);

  void setHasFixed;
  void setHasFixedPlusRS;

  return [
    {
      sectionLabel: "A — Identity & Structure",
      fields: [
        {
          id: "financing-type",
          label: "Financing type",
          showForSet: () => true,
          applicableForProject: () => true,
          valueProposed: proposedFinancingType,
          valuePast: (p) => pastFinancingType(p),
        },
        {
          id: "pt",
          label: "PT (legal entity)",
          sublabel: "Same PT = shared liability exposure",
          showForSet: () => true,
          applicableForProject: () => true,
          valueProposed: proposedPT,
          valuePast: pastPT,
        },
        {
          id: "amount",
          label: "Amount",
          showForSet: () => true,
          applicableForProject: () => true,
          valueProposed: (proj) => <span className="font-medium">{fmt(proj.requestedAmount)}</span>,
          valuePast: (p) => <span className="font-medium">{fmt(p.amount)}</span>,
        },
        {
          id: "outstanding",
          label: "Principal outstanding",
          sublabel: "N/A if not yet disbursed or fully repaid",
          showForSet: () => true,
          applicableForProject: () => true,
          valueProposed: (_proj) => <span className="text-gray-400">N/A — not yet disbursed</span>,
          valuePast: (p) =>
            p.outstandingAmount > 0
              ? <span className="font-medium">{fmt(p.outstandingAmount)}</span>
              : <span className="text-gray-400">{p.status === "Proposed" ? "N/A" : "—"}</span>,
        },
      ],
    },
    {
      sectionLabel: "B — Return Structure",
      fields: [
        {
          id: "rev-share-pct",
          label: "Revenue share %",
          sublabel: "Pre-BEP and Post-BEP shown separately",
          showForSet: () => setHasRevShare,
          applicableForProject: (rt) => isRevShare(rt),
          valueProposed: proposedRevSharePct,
          valuePast: (p) => pastRevSharePct(p),
        },
        {
          id: "cap",
          label: "Cap",
          sublabel: "Return Cap = MOIC cap · Time Cap = month cap",
          nuanceNote: "Different cap types represent different risk profiles — always label explicitly",
          showForSet: () => setHasRevShare,
          applicableForProject: (rt) => isRevShare(rt),
          valueProposed: proposedCap,
          valuePast: (p) => pastCap(p),
        },
        {
          id: "rev-share-start",
          label: "Revenue share start",
          sublabel: "Fixed date vs anchored to branch opening",
          showForSet: () => setHasRevShare,
          applicableForProject: (rt) => isRevShare(rt),
          valueProposed: proposedRevShareStart,
          valuePast: (p) => pastRevShareStart(p),
        },
        {
          id: "fixed-amount",
          label: "Fixed amount / repayment",
          sublabel: "Fixed Return = full schedule · Fixed + Revenue Share = fixed leg only",
          showForSet: () => setHasFixedLeg,
          applicableForProject: (rt) => hasFixedLeg(rt),
          valueProposed: proposedFixedLeg,
          valuePast: (p) => pastFixedLeg(p),
        },
        {
          id: "carry",
          label: "Target carry",
          sublabel: "Rate + type",
          showForSet: () => true,
          applicableForProject: () => true,
          valueProposed: proposedCarry,
          valuePast: (p) => pastCarry(p),
        },
        {
          id: "investor-roic",
          label: "Fixed payment investor ROIC",
          sublabel: "Per month (Fixed Return) · Per 30 days (Daily Interest)",
          nuanceNote: "Unit differs by type — label explicitly when comparing across Fixed Return and Daily Interest",
          showForSet: () => setHasFixedROIC,
          applicableForProject: (rt) => hasFixedROIC(rt),
          valueProposed: proposedInvestorROIC,
          valuePast: (p) => pastInvestorROIC(p),
        },
        {
          id: "total-roic",
          label: "Fixed payment total implied ROIC",
          sublabel: "Investor rate + carry · Same unit caveat as above",
          showForSet: () => setHasFixedROIC,
          applicableForProject: (rt) => hasFixedROIC(rt),
          valueProposed: proposedTotalROIC,
          valuePast: (p) => pastTotalROIC(p),
        },
      ],
    },
    {
      sectionLabel: "C — Timeline & Operations",
      fields: [
        {
          id: "term",
          label: "Term",
          sublabel: "Months for Revenue Share / Fixed · Days for Daily Interest",
          showForSet: () => true,
          applicableForProject: () => true,
          valueProposed: proposedTerm,
          valuePast: (p) => pastTerm(p),
        },
        {
          id: "branch-opening",
          label: "Branch opening",
          sublabel: "Scheduled vs actual",
          showForSet: () => setHasRevShare,
          applicableForProject: (rt) => isRevShare(rt),
          valueProposed: proposedBranchOpening,
          valuePast: (p) => pastBranchOpening(p),
        },
        {
          id: "min-payment-period",
          label: "Minimum payment period",
          sublabel: "Shown if any project in this set is Daily Interest",
          showForSet: () => setHasDI,
          applicableForProject: (rt) => isDailyInterest(rt),
          valueProposed: proposedMinPeriod,
          valuePast: (p) => pastMinPeriod(p),
        },
      ],
    },
    {
      sectionLabel: "D — Performance Metrics",
      fields: [
        {
          id: "pva",
          label: "PvA",
          sublabel: "Plan vs actual revenue %",
          showForSet: () => setHasRevShare,
          applicableForProject: (rt) => isRevShare(rt),
          valueProposed: proposedPvA,
          valuePast: (p) => pastPvA(p),
        },
        {
          id: "irr",
          label: "IRR",
          sublabel: "OTF and original projected",
          showForSet: () => true,
          applicableForProject: () => true,
          valueProposed: proposedIRR,
          valuePast: (p) => pastIRR(p),
        },
        {
          id: "moic",
          label: "MOIC",
          sublabel: "OTF and original projected · OTF not available from LMS",
          showForSet: () => true,
          applicableForProject: () => true,
          valueProposed: proposedMOIC,
          valuePast: (p) => pastMOIC(p),
        },
        {
          id: "bep",
          label: "BEP",
          sublabel: "N/A for Daily Interest instruments",
          showForSet: () => allTypes.some(hasBEP),
          applicableForProject: (rt) => hasBEP(rt),
          valueProposed: proposedBEP,
          valuePast: (p) => pastBEP(p),
        },
        {
          id: "min-return",
          label: "Minimum return",
          sublabel: "Gross Up (MOIC floor) or Continual Revenue Share (minimum MOIC)",
          showForSet: () => setHasRevShare,
          applicableForProject: (rt) => isRevShare(rt),
          valueProposed: proposedMinReturn,
          valuePast: (p) => pastMinReturn(p),
        },
        {
          id: "dpd",
          label: "DPD",
          sublabel: "Max days ever past due + incident history",
          showForSet: () => true,
          applicableForProject: () => true,
          valueProposed: proposedDPD,
          valuePast: (p) => pastDPD(p),
        },
      ],
    },
    {
      sectionLabel: "E — Revenue Model",
      fields: [
        {
          id: "rev-projections",
          label: "Revenue projections",
          sublabel: "Avg / Peak / Floor per month + projection span",
          showForSet: () => setHasRevShare,
          applicableForProject: (rt) => isRevShare(rt),
          valueProposed: proposedRevProjections,
          valuePast: (p) => pastRevProjections(p),
        },
        {
          id: "source-of-revenue",
          label: "Source of revenue accrued",
          sublabel: "Definition used in revenue share calculation — affects cross-project comparability",
          showForSet: () => setHasRevShare,
          applicableForProject: (rt) => isRevShare(rt),
          valueProposed: proposedSourceOfRevenue,
          valuePast: (p) => pastSourceOfRevenue(p),
        },
      ],
    },
    {
      sectionLabel: "F — Payment Mechanics",
      fields: [
        {
          id: "payment-frequency",
          label: "Payment frequency",
          sublabel: "Revenue Share: 3 sub-lines (revenue share / fixed payment / carry) · Fixed: monthly only",
          showForSet: () => true,
          applicableForProject: () => true,
          valueProposed: proposedPaymentFreq,
          valuePast: (p) => pastPaymentFreq(p),
        },
        {
          id: "late-fee",
          label: "Late fee",
          sublabel: "Basis · Grace period · Rate to investor · Rate to ASN",
          nuanceNote: "Basis: Revenue Share & PO = Overdue Amount; Fixed Return = Outstanding Amount. Grace: Revenue Share & PO = 5d; Fixed Return = 0d.",
          showForSet: () => true,
          applicableForProject: () => true,
          valueProposed: proposedLateFee,
          valuePast: (p) => pastLateFee(p),
        },
      ],
    },
  ];
}

function ProjectComparisonTable({ project, projects }: { project: ICProject; projects: PastProject[] }) {
  const allReturnTypes = projects.map((p) => p.returnType);
  const sections = buildFieldSections(allReturnTypes);
  const proposedIdx = projects.findIndex((p) => p.isCurrentSubmission);

  return (
    <div className="mt-4 border border-gray-100 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: `${Math.max(700, projects.length * 200 + 200)}px` }}>
          <thead>
            <tr className="border-b border-gray-200">
              <th className="sticky left-0 z-10 bg-gray-50 py-2 pl-4 pr-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-52 border-r border-gray-100">
                Field
              </th>
              {projects.map((p, i) => (
                <th
                  key={p.id}
                  className={`py-2 px-3 text-left align-top font-normal min-w-[180px] max-w-[240px] ${
                    i === proposedIdx ? "bg-blue-50/70 border-b-2 border-blue-200" : "bg-gray-50"
                  }`}
                >
                  <div className="font-semibold text-gray-800 text-xs leading-snug line-clamp-2" title={p.projectName}>
                    {p.projectName}
                  </div>
                  <div className="mt-1">
                    <Tag label={p.status} variant={statusVariant(p.status)} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => {
              const visibleFields = section.fields.filter((f) =>
                f.showForSet(allReturnTypes)
              );
              if (visibleFields.length === 0) return null;
              return (
                <React.Fragment key={section.sectionLabel}>
                  {/* Section header row */}
                  <tr className="bg-gray-100/80">
                    <td
                      colSpan={projects.length + 1}
                      className="py-1.5 pl-4 pr-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {section.sectionLabel}
                    </td>
                  </tr>
                  {/* Field rows */}
                  {visibleFields.map((field) => (
                    <tr key={field.id} className="border-b border-gray-50 hover:bg-gray-50/40">
                      {/* Label column */}
                      <td className="sticky left-0 z-10 bg-white py-2.5 pl-4 pr-3 align-top border-r border-gray-100 w-52">
                        <div className="font-medium text-gray-700 leading-snug">{field.label}</div>
                        {field.sublabel && (
                          <div className="text-[10px] text-gray-400 mt-0.5 leading-snug">{field.sublabel}</div>
                        )}
                        {field.nuanceNote && (
                          <div className="text-[10px] text-amber-600 mt-0.5 leading-snug">⚠ {field.nuanceNote}</div>
                        )}
                      </td>
                      {/* Value columns */}
                      {projects.map((p, colIdx) => {
                        const applicable = field.applicableForProject(p.returnType, allReturnTypes);
                        const isProposedCol = colIdx === proposedIdx;
                        return (
                          <td
                            key={p.id}
                            className={`py-2.5 px-3 align-top text-gray-800 leading-snug ${
                              isProposedCol ? "bg-blue-50/25" : ""
                            }`}
                          >
                            {applicable
                              ? p.isCurrentSubmission
                                ? field.valueProposed(project)
                                : field.valuePast(p, project)
                              : <span className="text-gray-300">—</span>
                            }
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Summary bar ───────────────────────────────────────────────────────────────

function SummaryBar({ projects }: { projects: PastProject[] }) {
  const totalAmount = projects.reduce((s, p) => s + p.amount, 0);
  const outstanding = projects
    .filter((p) => !p.isCurrentSubmission)
    .reduce((s, p) => s + p.outstandingAmount, 0);
  const proposed = projects.filter((p) => p.isCurrentSubmission).reduce((s, p) => s + p.amount, 0);
  const completedWithIRR = projects.filter((p) => p.otfIRR != null);
  const avgIRR =
    completedWithIRR.length > 0
      ? completedWithIRR.reduce((s, p) => s + (p.otfIRR ?? 0), 0) / completedWithIRR.length
      : null;

  const statusCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  projects.forEach((p) => {
    statusCounts[p.status] = (statusCounts[p.status] ?? 0) + 1;
    typeCounts[p.returnType] = (typeCounts[p.returnType] ?? 0) + 1;
  });

  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Total amount incl. proposed</div>
        <div className="font-semibold text-gray-900 mt-0.5 text-sm">{fmt(totalAmount)}</div>
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Outstanding (excl. proposed)</div>
        <div className="font-semibold text-gray-900 mt-0.5 text-sm">{fmt(outstanding)}</div>
        <div className="text-[10px] text-gray-500">{fmt(outstanding + proposed)} incl. proposed</div>
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Avg OTF IRR (completed)</div>
        <div className={`font-semibold mt-0.5 text-sm ${avgIRR != null ? irrClass(avgIRR) : "text-gray-400"}`}>
          {avgIRR != null ? fmtPct(avgIRR) : "—"}
        </div>
        <div className="text-[10px] text-gray-500">{completedWithIRR.length} project(s) with OTF IRR</div>
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Project mix</div>
        <div className="mt-0.5 space-y-0.5">
          {Object.entries(statusCounts).map(([s, n]) => (
            <div key={s} className="text-[10px] text-gray-600">{n}× {s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export function PastProjectsRecap({ project }: Props) {
  const allRows = project.pastProjects;
  const projects = sortPastProjectsRecapRows(getPastProjectsRecapRows(allRows));

  if (projects.length === 0) {
    return (
      <SectionCard title="Proposed and Past Projects Recap">
        <p className="text-sm text-gray-400 italic mt-2 px-1">No projects in this recap yet.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Proposed and Past Projects Recap">
      <div className="mt-2 space-y-2">
        <ProjectComparisonTable project={project} projects={projects} />
        <SummaryBar projects={projects} />

        <p className="text-[10px] text-gray-400 italic pt-1">
          ⚠ OTF MOIC and PvA are not currently available from the LMS Reporting Layer.
          Rows sorted: Proposed first, then by IC approval date (newest first).
        </p>
      </div>
    </SectionCard>
  );
}
