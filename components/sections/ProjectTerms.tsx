import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataRow, fmt, fmtPct, fmtDate } from "@/components/ui/DataRow";
import { Warning } from "@/components/ui/Warning";
import { ExternalLink, MapPin } from "lucide-react";

interface Props {
  project: ICProject;
}

export function ProjectTerms({ project }: Props) {
  const { revenueShareTerms: rst, fixedReturnTerms: frt, disbursements, branches, lateFee } = project;

  const totalDisbursed = disbursements.reduce((s, d) => s + d.plannedAmount, 0);
  const disbursementMismatch = totalDisbursed !== project.requestedAmount;

  return (
    <SectionCard title="Project Terms">
      <div className="mt-2 space-y-5">
        {/* Disbursement schedule */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Disbursement Schedule</h4>
          {disbursementMismatch && (
            <Warning
              message={`Total disbursements (${fmt(totalDisbursed)}) ≠ requested amount (${fmt(project.requestedAmount)})`}
              level="warn"
              className="mb-2"
            />
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b">
                  <th className="text-left py-1 pr-4 font-medium">Tranche</th>
                  <th className="text-right py-1 pr-4 font-medium">Amount</th>
                  <th className="text-left py-1 font-medium">Planned Date</th>
                </tr>
              </thead>
              <tbody>
                {disbursements.map((d) => (
                  <tr key={d.tranche} className="border-b border-gray-50">
                    <td className="py-1.5 pr-4 text-gray-700">Tranche {d.tranche}</td>
                    <td className="py-1.5 pr-4 text-right font-medium text-gray-900">{fmt(d.plannedAmount)}</td>
                    <td className="py-1.5 text-gray-600">{fmtDate(d.plannedDate)}</td>
                  </tr>
                ))}
                <tr className="font-semibold text-gray-800 bg-gray-50">
                  <td className="py-1.5 pr-4">Total</td>
                  <td className="py-1.5 pr-4 text-right">{fmt(totalDisbursed)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Branches */}
        {branches.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Branch Details</h4>
            <div className="space-y-2">
              {branches.map((b) => (
                <div key={b.id} className="border border-gray-100 rounded-lg px-4 py-3 bg-gray-50">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium text-sm text-gray-900">{b.name}</span>
                      <span className="text-xs text-gray-500">{b.area}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{b.type}</span>
                      {b.gmapsLink && (
                        <a href={b.gmapsLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                          Maps <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  {b.notes && <p className="text-xs text-gray-600 mt-1">{b.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue Share Terms */}
        {rst && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Revenue Share Terms</h4>
            <div className="space-y-0">
              <DataRow label="Revenue Source" value={rst.sourceOfRevenueAccrued} />
              <DataRow label="Frequency" value={
                <span className={rst.frequency !== "Monthly" ? "text-amber-600 font-medium" : undefined}>
                  {rst.frequency} {rst.frequency !== "Monthly" ? "⚠️ non-standard" : ""}
                </span>
              } />
              <DataRow label="Due Date" value={rst.dueDate} />
              <DataRow label="Cap Type" value={rst.capType} />
              {rst.capType === "Return Cap" && rst.capMultiple && (
                <DataRow label="Return Cap" value={`${rst.capMultiple}x`} />
              )}
              {rst.capType === "Time Cap" && rst.capTimePeriodMonths && (
                <DataRow label="Time Cap" value={`${rst.capTimePeriodMonths} months`} />
              )}
              <DataRow label="Rev Share Start" value={
                rst.revShareStartType === "Fixed" && rst.revShareStartDate
                  ? `Fixed: ${fmtDate(rst.revShareStartDate)}`
                  : "Anchored to Branch Opening"
              } />
              <DataRow label="Rev Share %" value={`${fmtPct(rst.preBEPRevSharePct)} pre-BEP / ${fmtPct(rst.postBEPRevSharePct)} post-BEP`} />
              <DataRow label="Carry" value={`${rst.carryType}: ${fmtPct(rst.carryPct)}`} />
              {rst.minReturn && (
                <DataRow label="Minimum Return" value={`${fmtPct(rst.minReturn)} within ${rst.minReturnPayableMonths} months`} />
              )}
            </div>

            {rst.revProjectionArray.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-1">Revenue Projection</div>
                <div className="overflow-x-auto">
                  <table className="text-xs w-full">
                    <thead>
                      <tr className="text-gray-400 border-b">
                        <th className="text-left py-1 pr-3 font-medium">Month</th>
                        <th className="text-right py-1 font-medium">Projected Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rst.revProjectionArray.map((row) => (
                        <tr key={row.month} className="border-b border-gray-50">
                          <td className="py-1 pr-3 text-gray-600">Month {row.month}</td>
                          <td className="py-1 text-right text-gray-700">{fmt(row.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fixed Return Terms */}
        {frt && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Fixed Return Terms</h4>
            <div className="space-y-0 mb-3">
              <DataRow label="Total Repayment" value={<span className="font-semibold">{fmt(frt.totalRepayment)}</span>} />
              <DataRow label="Principal" value={fmt(frt.totalPrincipal)} />
              <DataRow label="Interest" value={fmt(frt.totalInterest)} />
              <DataRow label="Carry" value={fmt(frt.carry)} />
            </div>
            <div className="text-xs text-gray-500 mb-1">Repayment Schedule</div>
            <div className="overflow-x-auto">
              <table className="text-xs w-full">
                <thead>
                  <tr className="text-gray-400 border-b">
                    <th className="text-left py-1 pr-3 font-medium">Month</th>
                    <th className="text-right py-1 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {frt.repaymentSchedule.map((row) => (
                    <tr key={row.month} className="border-b border-gray-50">
                      <td className="py-1 pr-3 text-gray-600">Month {row.month}</td>
                      <td className="py-1 text-right text-gray-700">{fmt(row.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Late fees */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Late Fees</h4>
          <div className="space-y-0">
            <DataRow label="Basis" value={
              <span className={lateFee.basis !== "Overdue Amount" ? "text-amber-600" : undefined}>
                {lateFee.basis}
              </span>
            } />
            <DataRow label="Grace Period" value={
              <span className={lateFee.gracePeriodDays !== 5 ? "text-amber-600" : undefined}>
                {lateFee.gracePeriodDays} days
              </span>
            } />
            <DataRow label="Daily Late Fee" value={`${fmtPct(lateFee.dailyPctInvestors)} (Investors) / ${fmtPct(lateFee.dailyPctASN)} (ASN)`} />
          </div>
        </div>

        {project.termSheetLink && (
          <a
            href={project.termSheetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
          >
            View Term Sheet <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </SectionCard>
  );
}
