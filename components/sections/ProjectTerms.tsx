import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataRow, fmt, fmtPct, fmtDate } from "@/components/ui/DataRow";
import { ExternalLink, MapPin } from "lucide-react";

interface Props {
  project: ICProject;
}

// Late fee defaults per CSV spec
const DEFAULT_INVESTOR_DAILY_PCT = 0.08;
const DEFAULT_ASN_DAILY_PCT = 0.02;

export function ProjectTerms({ project }: Props) {
  const { revenueShareTerms: rst, fixedReturnTerms: frt, disbursements, branches, lateFee } = project;

  const totalDisbursed = disbursements.reduce((s, d) => s + d.plannedAmount, 0);
  const disbursementTarget = project.trancheTargetAmount ?? project.requestedAmount;
  const disbursementMismatch = totalDisbursed !== disbursementTarget;

  // Revenue projection summary
  const revArray = rst?.revProjectionArray ?? [];
  const avgRevenue = revArray.length > 0 ? revArray.reduce((s, r) => s + r.revenue, 0) / revArray.length : null;
  const maxRevEntry = revArray.length > 0 ? revArray.reduce((a, b) => (b.revenue > a.revenue ? b : a)) : null;
  const minRevEntry = revArray.length > 0 ? revArray.reduce((a, b) => (b.revenue < a.revenue ? b : a)) : null;

  return (
    <SectionCard title="Project Terms Details">
      <div className="mt-2 space-y-6">

        {/* Disbursement schedule */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Disbursement Schedule</h4>
          {disbursementMismatch && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-2">
              Warning: Not same as Project Target Amount (disbursements total {fmt(totalDisbursed)}, target {fmt(disbursementTarget)})
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

        {/* Revenue Share Terms */}
        {rst && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Revenue Share Terms</h4>
            <div className="space-y-0">
              <DataRow label="Source of Revenue Accrued" value={rst.sourceOfRevenueAccrued} />

              {/* Branch build-out duration — only if branches exist */}
              {branches.length > 0 && (
                <DataRow label="Branch Build-out Duration (months)" value="Per branch opening schedule" />
              )}

              <DataRow
                label="Revenue Share Frequency"
                value={
                  rst.frequency !== "Monthly" ? (
                    <span className="text-amber-600">
                      {rst.frequency}{" "}
                      <span className="text-xs">Warning: not monthly (the default setting)</span>
                    </span>
                  ) : rst.frequency
                }
              />
              <DataRow label="Revenue Share Due Date" value={rst.dueDate} />
              <DataRow label="Revenue Share Cap Type" value={rst.capType} />
              {rst.capType === "Return Cap" && rst.capMultiple != null && (
                <DataRow
                  label="Cap Multiple"
                  value={`${rst.capMultiple}x Investor Cap / ${(rst.capMultiple * (1 + rst.carryPct / 100)).toFixed(2)}x Total Cap`}
                />
              )}
              {rst.capType === "Time Cap" && rst.capTimePeriodMonths != null && (
                <DataRow label="Time Cap Period (months)" value={`${rst.capTimePeriodMonths} months`} />
              )}
              <DataRow
                label="Revenue Share Start Date"
                value={
                  rst.revShareStartType === "Fixed" && rst.revShareStartDate
                    ? `Fixed Revenue Share Start Date on ${fmtDate(rst.revShareStartDate)}`
                    : "Anchored to Branch Opening"
                }
              />
              <DataRow
                label="Revenue Share %"
                value={`${fmtPct(rst.preBEPRevSharePct)} Pre-BEP Revenue Share / ${fmtPct(rst.postBEPRevSharePct)} Post-BEP Revenue Share`}
              />
              <DataRow
                label="Carry"
                value={
                  rst.carryType === "Fixed Platform Fee"
                    ? `${fmtPct(rst.carryPct)} Fixed Platform Fee`
                    : `${rst.carryType}: ${fmtPct(rst.carryPct)}`
                }
              />
              {rst.minReturn != null && (
                <DataRow
                  label="Investor Minimum Return"
                  value={
                    rst.minReturnMultiple != null
                      ? `Gross up to ${rst.minReturnMultiple}x at month ${rst.minReturnPayableMonths}`
                      : rst.capType === "Time Cap"
                      ? `Continual up to ${fmtPct(rst.minReturn)} within ${rst.minReturnPayableMonths} months`
                      : `${fmtPct(rst.minReturn)} within ${rst.minReturnPayableMonths} months`
                  }
                />
              )}
            </div>

            {/* Revenue projection summary (full monthly array lives in data; span = row count) */}
            {avgRevenue !== null && maxRevEntry && minRevEntry && (
              <div className="mt-3 space-y-2">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Revenue projections (monthly model)
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs text-gray-700">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                    <span className="text-gray-400">Avg/month</span>
                    <span className="text-right font-medium">{fmt(Math.round(avgRevenue))}</span>
                    <span className="text-gray-400">Peak (Month {maxRevEntry.month})</span>
                    <span className="text-right">{fmt(maxRevEntry.revenue)}</span>
                    <span className="text-gray-400">Floor (Month {minRevEntry.month})</span>
                    <span className="text-right">{fmt(minRevEntry.revenue)}</span>
                    <span className="text-gray-400">Projection span</span>
                    <span className="text-right">{revArray.length} months</span>
                  </div>
                </div>
                {project.submissionProjectedBEPMonths != null && (
                  <div className="text-xs text-gray-700">
                    <span className="text-gray-500">Projected BEP (mos)</span>{" "}
                    <span className="font-semibold text-gray-900">{project.submissionProjectedBEPMonths}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

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
            </div>
          </div>
        )}

        {/* Daily Interest (PO / invoice) */}
        {project.dailyInterestTerms && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Daily Interest Terms</h4>
            <div className="space-y-0">
              <DataRow
                label="Interest Rate (30-Day)"
                value={fmtPct(project.dailyInterestTerms.interestRate30DayPct)}
              />
              <DataRow
                label="Service Fee Rate (30-Day)"
                value={fmtPct(project.dailyInterestTerms.serviceFee30DayPct)}
              />
              <DataRow label="Tenor (days)" value={`${project.dailyInterestTerms.tenorDays} days`} />
              <DataRow
                label="Minimum Interest Period (days)"
                value={`${project.dailyInterestTerms.minInterestPeriodDays} days`}
              />
              <DataRow label="Service Fee Daily Interest Basis" value={project.dailyInterestTerms.serviceFeeDailyBasis} />
            </div>
          </div>
        )}

        {/* Late Fees */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Late Fees</h4>
          <div className="space-y-0">
            <DataRow
              label="Late Fee Basis"
              value={
                lateFee.basis !== "Overdue Amount" ? (
                  <span>
                    {lateFee.basis}{" "}
                    <span className="text-xs text-amber-600">Warning: different from default value of Overdue Amount for this project type</span>
                  </span>
                ) : lateFee.basis
              }
            />
            <DataRow
              label="Late Fee Grace Period (days)"
              value={
                lateFee.gracePeriodDays !== 5 ? (
                  <span>
                    {lateFee.gracePeriodDays} days{" "}
                    <span className="text-xs text-amber-600">Warning: different from default value of 5 days for this project type</span>
                  </span>
                ) : `${lateFee.gracePeriodDays} days`
              }
            />
            <DataRow
              label="Daily Late Fee %"
              value={
                <div className="space-y-0.5">
                  <div>{fmtPct(lateFee.dailyPctInvestors)} per day ({fmtPct(lateFee.dailyPctInvestors)} to Investors, {fmtPct(lateFee.dailyPctASN)} to ASN)</div>
                  {lateFee.dailyPctInvestors !== DEFAULT_INVESTOR_DAILY_PCT && (
                    <div className="text-xs text-amber-600">
                      Warning: different from default value {fmtPct(DEFAULT_INVESTOR_DAILY_PCT)} per day to Investors for this project type
                    </div>
                  )}
                  {lateFee.dailyPctASN !== DEFAULT_ASN_DAILY_PCT && (
                    <div className="text-xs text-amber-600">
                      Warning: different from default value {fmtPct(DEFAULT_ASN_DAILY_PCT)} per day to ASN for this project type
                    </div>
                  )}
                </div>
              }
            />
          </div>
        </div>

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
