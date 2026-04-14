import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { fmt, fmtDate } from "@/components/ui/DataRow";
import { isAssetB } from "@/lib/assetClass";

interface Props {
  project: ICProject;
}

/** End of tenor window from first planned disbursement (for “± days from project tenor” hint). */
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

export function PayorInvoiceSection({ project }: Props) {
  const rows = project.payorInvoices;
  if (!rows || rows.length === 0) return null;
  if (!isAssetB(project.assetClass)) return null;

  const tenorEnd = tenorEndIso(project);

  return (
    <SectionCard title="Proposed Project's Payor / PO / Invoice Details">
      <div className="mt-2 space-y-2">
        <p className="text-xs text-gray-500 leading-relaxed">
          One row per payor / PO or invoice line for <strong>this</strong> proposed submission (B_MOD). Due dates can be
          shown with offset from project tenor when tenor is available.
        </p>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs min-w-[960px] border border-gray-100 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-left border-b border-gray-100">
                <th className="py-2 px-2 font-medium w-8">#</th>
                <th className="py-2 pr-2 font-medium">Payor (PO / Invoice)</th>
                <th className="py-2 pr-2 font-medium">PO / Invoice #</th>
                <th className="py-2 pr-2 font-medium">Due date</th>
                <th className="py-2 pr-2 font-medium text-right">Amount</th>
                <th className="py-2 pr-2 font-medium">Payor type</th>
                <th className="py-2 pr-2 font-medium">Payee projects</th>
                <th className="py-2 pr-2 font-medium">Notes</th>
                <th className="py-2 pr-2 font-medium">Risk</th>
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
                    <td className="py-2 pr-2 text-right font-medium text-gray-900">
                      {cur === "USD" ? `$${(r.amount / 1).toLocaleString("en-US")}` : fmt(r.amount)}
                    </td>
                    <td className="py-2 pr-2 text-gray-600">{r.payorType}</td>
                    <td className="py-2 pr-2 text-gray-600">{r.payeeProjects}</td>
                    <td className="py-2 pr-2 text-gray-600 max-w-[200px] leading-snug">{r.notes}</td>
                    <td className="py-2 pr-2">
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                        {r.riskLevel}
                      </span>
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
