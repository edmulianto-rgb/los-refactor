import { ICProject, PayorSectionAssessment } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { fmt, fmtDate } from "@/components/ui/DataRow";
import { isAssetB, isAssetBInvoice } from "@/lib/assetClass";

interface Props {
  project: ICProject;
}

/** End of tenor window from first planned disbursement (for "± days from project tenor" hint). */
function tenorEndIso(project: ICProject): string | null {
  const d0 = project.disbursements[0]?.plannedDate;
  const tenor = project.dailyInterestTerms?.tenorDays;
  if (!d0 || tenor == null) return null;
  const t = new Date(d0 + "T12:00:00Z");
  t.setUTCDate(t.getUTCDate() + tenor);
  return t.toISOString().slice(0, 10);
}

function daysFromTenorEnd(dueIso: string, tenorEnd: string | null): number | null {
  if (!tenorEnd) return null;
  const d = Math.round(
    (new Date(dueIso + "T12:00:00Z").getTime() - new Date(tenorEnd + "T12:00:00Z").getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return d;
}

function AssessmentPill({ value }: { value: string }) {
  return (
    <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 leading-snug">
      {value}
    </span>
  );
}

function AssessmentRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2 items-start flex-wrap">
      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 shrink-0 leading-snug">
        {label}
      </span>
      <span>{children}</span>
    </div>
  );
}

interface SectionAssessmentBlockProps {
  assessment: PayorSectionAssessment;
  isBInvoice: boolean;
}

function SectionAssessmentBlock({ assessment, isBInvoice }: SectionAssessmentBlockProps) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 space-y-2 text-xs">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        For All Payers — Submission Assessment
      </p>

      {assessment.existenceAuthenticityDocs && (
        <AssessmentRow label="Existence & Authenticity of Supporting Docs">
          <AssessmentPill value={assessment.existenceAuthenticityDocs} />
        </AssessmentRow>
      )}

      {!isBInvoice && assessment.likelihoodPayerChangingScope && (
        <AssessmentRow label="Likelihood of Payer Changing Scope & Timeline">
          <AssessmentPill value={assessment.likelihoodPayerChangingScope} />
        </AssessmentRow>
      )}

      {!isBInvoice && assessment.competencyHistoryKP && (
        <AssessmentRow label="Competency & History of Karmapreneur">
          <AssessmentPill value={assessment.competencyHistoryKP} />
        </AssessmentRow>
      )}

      {!isBInvoice && assessment.suggestedMaxPOLimit != null && (
        <AssessmentRow label="Suggested Max PO Limit">
          <span className="font-medium text-gray-800">{fmt(assessment.suggestedMaxPOLimit)}</span>
        </AssessmentRow>
      )}

      {isBInvoice && assessment.authenticityVeracityInvoiceAndBAST && (
        <AssessmentRow label="Authenticity & Veracity of Invoice and BAST">
          <AssessmentPill value={assessment.authenticityVeracityInvoiceAndBAST} />
        </AssessmentRow>
      )}

      {isBInvoice && assessment.suggestedMaxInvoiceLimit != null && (
        <AssessmentRow label="Suggested Max Invoice Limit">
          <span className="font-medium text-gray-800">{fmt(assessment.suggestedMaxInvoiceLimit)}</span>
        </AssessmentRow>
      )}
    </div>
  );
}

export function PayorInvoiceSection({ project }: Props) {
  const rows = project.payorInvoices;
  if (!rows || rows.length === 0) return null;
  if (!isAssetB(project.assetClass)) return null;

  const tenorEnd = tenorEndIso(project);
  const isBInvoice = isAssetBInvoice(project.assetClass);
  const assessment = project.payorSectionAssessment;

  return (
    <SectionCard title="Proposed Project's Payor / PO / Invoice Details">
      <div className="mt-2 space-y-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          One row per payor / PO or invoice line for <strong>this</strong> proposed submission (B_MOD). Due dates can be
          shown with offset from project tenor when tenor is available.
        </p>

        {assessment && (
          <SectionAssessmentBlock assessment={assessment} isBInvoice={isBInvoice} />
        )}

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs min-w-[1200px] border border-gray-100 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-left border-b border-gray-100">
                <th className="py-2 px-2 font-medium w-8">#</th>
                <th className="py-2 pr-2 font-medium">Payor (PO / Invoice)</th>
                <th className="py-2 pr-2 font-medium">PO / Invoice #</th>
                <th className="py-2 pr-2 font-medium">Due date</th>
                <th className="py-2 pr-2 font-medium text-right">Proportionalized PO / Invoice Amount</th>
                <th className="py-2 pr-2 font-medium">Notes</th>
                <th className="py-2 pr-2 font-medium">Strength of Payer</th>
                <th className="py-2 pr-2 font-medium">History — Paying On Time</th>
                <th className="py-2 pr-2 font-medium text-right">Suggested IDR Ceiling for This Payor</th>
                <th className="py-2 pr-2 font-medium text-right">Outstanding Principal Owed for This Payor</th>
                <th className="py-2 pr-2 font-medium">Limit Validation for This Payor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((r, i) => {
                const cur = r.currency === "USD" ? "USD" : "IDR";
                const offset = daysFromTenorEnd(r.dueDate, tenorEnd);
                return (
                  <tr key={r.id} className="align-top">
                    <td className="py-2 px-2 text-gray-400">{i + 1}</td>
                    <td className="py-2 pr-2 font-medium text-gray-800">{r.payorLabel}</td>
                    <td className="py-2 pr-2 text-gray-700 font-mono text-[11px]">{r.poOrInvoiceNumber}</td>
                    <td className="py-2 pr-2 text-gray-700">
                      <div>{fmtDate(r.dueDate)}</div>
                      {offset != null && (
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {offset > 0 ? "+" : ""}
                          {offset}d from tenor end (disb + tenor)
                        </div>
                      )}
                    </td>
                    <td className="py-2 pr-2 text-right">
                      <div className="font-medium text-gray-900">
                        {cur === "USD"
                          ? `$${((r.proportionalizedAmount ?? r.amount) / 1).toLocaleString("en-US")}`
                          : fmt(r.proportionalizedAmount ?? r.amount)}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        Actual: {cur === "USD" ? `$${(r.amount / 1).toLocaleString("en-US")}` : fmt(r.amount)}
                      </div>
                    </td>
                    <td className="py-2 pr-2 text-gray-600 max-w-[200px] leading-snug">{r.notes}</td>
                    <td className="py-2 pr-2">
                      {r.strengthOfPayer ? (
                        <AssessmentPill value={r.strengthOfPayer} />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-2 pr-2">
                      {r.historyPayerPayingOnTime ? (
                        <AssessmentPill value={r.historyPayerPayingOnTime} />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-2 pr-2 text-right font-medium text-gray-800">
                      {r.suggestedIDRCeilingForPayor != null ? fmt(r.suggestedIDRCeilingForPayor) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-2 pr-2 text-right font-medium text-gray-800">
                      {r.outstandingPrincipalForPayor != null ? fmt(r.outstandingPrincipalForPayor) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-2 pr-2 text-xs">
                      {(() => {
                        const ceiling = r.suggestedIDRCeilingForPayor;
                        const outstanding = r.outstandingPrincipalForPayor ?? 0;
                        const prop = r.proportionalizedAmount ?? r.amount;
                        if (ceiling == null) return <span className="text-gray-300">—</span>;
                        const total = outstanding + prop;
                        if (total < ceiling) {
                          return <span className="text-green-600 font-medium">PO / Invoice Amount does not exceed Suggested Remaining Limit for This Payor</span>;
                        }
                        return <span className="text-red-600 font-medium">PO / Invoice Amount exceeds Suggested Remaining Limit for This Payor</span>;
                      })()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </SectionCard>
  );
}
