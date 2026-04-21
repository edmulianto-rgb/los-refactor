import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataRow, fmt, fmtDate } from "@/components/ui/DataRow";
import { ExternalLink, MapPin } from "lucide-react";
import { isAssetB } from "@/lib/assetClass";

interface Props {
  project: ICProject;
}

export function ProjectTerms({ project }: Props) {
  const { fixedReturnTerms: frt, disbursements, branches } = project;
  const assetB = isAssetB(project.assetClass);

  const totalDisbursed = disbursements.reduce((s, d) => s + d.plannedAmount, 0);
  const disbursementTarget = project.trancheTargetAmount ?? project.requestedAmount;
  const disbursementMismatch = totalDisbursed !== disbursementTarget;

  return (
    <SectionCard title="Project Terms Details">
      <div className="mt-2 space-y-6">
        <p className="text-[10px] text-gray-500 -mt-1 mb-2">
          Economics, caps, and payment terms are compared in <strong>Past Projects Recap</strong> (sections B–F). This card keeps schedule, branch grid, and amortization detail only.
        </p>

        {/* Disbursement schedule */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Disbursement Schedule</h4>
          {assetB && (
            <div className="text-xs text-gray-700 mb-2">
              <span className="font-semibold text-gray-500 uppercase tracking-wide text-[10px]">Project target amount</span>
              <div className={`mt-0.5 font-medium ${disbursementMismatch ? "text-red-600" : "text-gray-900"}`}>
                {fmt(disbursementTarget)}
                {disbursementMismatch && (
                  <span className="block text-[11px] font-normal mt-1 text-red-600">
                    Warning: Not same as Project Target Amount (schedule total {fmt(totalDisbursed)})
                  </span>
                )}
              </div>
            </div>
          )}
          {!assetB && disbursementMismatch && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-2">
              Warning: Not same as Project Target Amount (disbursements total {fmt(totalDisbursed)}, target{" "}
              {fmt(disbursementTarget)})
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b">
                  <th className="text-left py-1 pr-4 font-medium">Disbursement #</th>
                  <th className="text-left py-1 pr-4 font-medium">Planned Disbursement Date</th>
                  <th className="text-right py-1 font-medium">Planned Disbursement Amount</th>
                </tr>
              </thead>
              <tbody>
                {disbursements.map((d) => (
                  <tr key={d.tranche} className="border-b border-gray-50">
                    <td className="py-1.5 pr-4 text-gray-700">Disbursement {d.tranche}</td>
                    <td className="py-1.5 pr-4 text-gray-600">{fmtDate(d.plannedDate)}</td>
                    <td className="py-1.5 text-right font-medium text-gray-900">{fmt(d.plannedAmount)}</td>
                  </tr>
                ))}
                <tr className={`font-semibold ${disbursementMismatch ? "text-red-600" : "text-gray-800"} bg-gray-50`}>
                  <td className="py-1.5 pr-4">Total Disbursements</td>
                  <td></td>
                  <td className="py-1.5 text-right">{fmt(totalDisbursed)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Branch Details */}
        {branches.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Branch Details</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[500px]">
                <thead>
                  <tr className="text-gray-400 border-b">
                    <th className="text-left pb-2 pr-3 font-medium">Branch Name</th>
                    <th className="text-left pb-2 pr-3 font-medium">Branch Area</th>
                    <th className="text-left pb-2 pr-3 font-medium">GMaps Link</th>
                    <th className="text-left pb-2 pr-3 font-medium">Notes</th>
                    <th className="text-left pb-2 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {branches.map((b) => (
                    <tr key={b.id} className="align-top">
                      <td className="py-2 pr-3 font-medium text-gray-900">{b.name}</td>
                      <td className="py-2 pr-3 text-gray-600">{b.area}</td>
                      <td className="py-2 pr-3">
                        {b.gmapsLink ? (
                          <a href={b.gmapsLink} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                            <MapPin className="w-3 h-3" /> Maps <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="py-2 pr-3 text-gray-600 max-w-[200px]">{b.notes}</td>
                      <td className="py-2 text-gray-500">{b.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fixed Return Terms */}
        {frt && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Fixed Repayment Schedule</h4>
            <div className="overflow-x-auto mb-3">
              <table className="text-xs w-full min-w-[420px]">
                <thead>
                  <tr className="text-gray-400 border-b">
                    <th className="text-left py-1 pr-3 font-medium">Month</th>
                    <th className="text-right py-1 pr-3 font-medium">Principal</th>
                    <th className="text-right py-1 pr-3 font-medium">Interest</th>
                    <th className="text-right py-1 pr-3 font-medium">Carry</th>
                    <th className="text-right py-1 font-medium">Installment</th>
                  </tr>
                </thead>
                <tbody>
                  {frt.repaymentSchedule.map((row) => {
                    const inst = row.principal + row.interest + row.carry;
                    return (
                      <tr key={row.month} className="border-b border-gray-50">
                        <td className="py-1 pr-3 text-gray-600">Month {row.month}</td>
                        <td className="py-1 pr-3 text-right text-gray-700">{fmt(row.principal)}</td>
                        <td className="py-1 pr-3 text-right text-gray-700">{fmt(row.interest)}</td>
                        <td className="py-1 pr-3 text-right text-gray-700">{fmt(row.carry)}</td>
                        <td className="py-1 text-right font-medium text-gray-800">{fmt(inst)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200 bg-gray-50 font-semibold text-gray-800">
                    <td className="py-1.5 pr-3">Total</td>
                    <td className="py-1.5 pr-3 text-right">{fmt(frt.totalPrincipal)}</td>
                    <td className="py-1.5 pr-3 text-right">{fmt(frt.totalInterest)}</td>
                    <td className="py-1.5 pr-3 text-right">{fmt(frt.carry)}</td>
                    <td className="py-1.5 text-right">{fmt(frt.totalRepayment)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs text-gray-700 space-y-0.5">
              <div className="font-medium text-gray-500 mb-1">Fixed Repayment Summary</div>
              <div className="font-semibold">{fmt(frt.totalRepayment)} Total Fixed Repayment</div>
              <div className="text-gray-500">
                {(frt.totalRepayment / project.requestedAmount).toFixed(2)}x of Total Project Amount
              </div>
              <div className="mt-1 space-y-0.5">
                <div>{fmt(frt.totalPrincipal)} Principal</div>
                <div>{fmt(frt.totalInterest)} Interest</div>
                <div>{fmt(frt.carry)} Carry</div>
              </div>
              {project.submissionProjectedBEPMonths != null && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-500">Projected BEP (mos)</span>{" "}
                  <span className="font-semibold text-gray-900">{project.submissionProjectedBEPMonths}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Daily Interest — service fee basis only (rates, tenor, min period are in Recap B/C) */}
        {project.dailyInterestTerms && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Daily Interest — Service Fee Basis</h4>
            <div className="space-y-0">
              <DataRow label="Service Fee Daily Interest Basis" value={project.dailyInterestTerms.serviceFeeDailyBasis} />
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">
              Interest rate, service fee rate, tenor, min payment period — see <strong>Past Projects Recap (B, C)</strong> above.
            </p>
          </div>
        )}

        <p className="text-[10px] text-gray-400">
          Late fee terms (basis, grace period, daily rates) — see <strong>Past Projects Recap (F)</strong> above.
        </p>

        {project.termSheetLink && (
          <a
            href={project.termSheetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
          >
            Term Sheet Link <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </SectionCard>
  );
}
