import { ICProject, PlafondInfo } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { fmt, fmtDate } from "@/components/ui/DataRow";
import { Warning } from "@/components/ui/Warning";

interface Props {
  project: ICProject;
}

function daysFromToday(isoDate: string): number {
  return Math.round((new Date(isoDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function LimitCell({
  limit,
  outstanding,
  remaining,
  proposedLimit,
  currentLimit,
}: {
  limit: number | null;
  outstanding?: number;
  remaining?: number | null;
  proposedLimit?: number | null;
  currentLimit?: number | null;
}) {
  if (limit === null) return <span className="text-gray-300 text-xs">—</span>;

  const delta =
    proposedLimit != null && currentLimit != null
      ? proposedLimit - currentLimit
      : null;

  const isNegRemaining = remaining !== null && remaining !== undefined && remaining < 0;

  return (
    <div className="text-xs space-y-0.5">
      <div className={`font-semibold ${delta !== null && delta !== 0 ? "text-emerald-700" : "text-gray-800"}`}>
        {fmt(limit)}
        {delta !== null && delta !== 0 && (
          <span className="ml-1 text-emerald-600 font-normal">
            ({delta > 0 ? "+" : ""}
            {fmt(delta)})
          </span>
        )}
      </div>
      {outstanding != null && (
        <div className="text-gray-500">Outstanding: {fmt(outstanding)}</div>
      )}
      {remaining != null && (
        <div className={`font-medium ${isNegRemaining ? "text-red-600" : "text-gray-700"}`}>
          Remaining: {fmt(remaining)}
          {isNegRemaining && " ⚠️"}
        </div>
      )}
    </div>
  );
}

export function PlafondSection({ project }: Props) {
  const p = project.plafond;
  const showPlafond = project.approvalType.includes("Plafond") || p.current !== null;
  if (!showPlafond) return null;

  const negativeWarnings: string[] = [];
  if (p.remainingTotal < 0) negativeWarnings.push(`Total Limit Remaining is negative (${fmt(p.remainingTotal)})`);
  if (p.remainingWC < 0) negativeWarnings.push(`WC Sub-Limit Remaining is negative (${fmt(p.remainingWC)})`);
  if (p.remainingPO < 0) negativeWarnings.push(`PO Sub-Limit Remaining is negative (${fmt(p.remainingPO)})`);

  const badge = negativeWarnings.length > 0 ? (
    <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
      {negativeWarnings.length} issue{negativeWarnings.length > 1 ? "s" : ""}
    </span>
  ) : null;

  return (
    <SectionCard title="Plafond" badge={badge}>
      <div className="mt-2 space-y-3">
        {negativeWarnings.map((w, i) => (
          <Warning key={i} message={w} level="error" />
        ))}

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs min-w-[560px]">
            <thead>
              <tr className="border-b text-gray-400 text-left">
                <th className="pb-2 pr-3 font-medium w-36">Limit Status</th>
                <th className="pb-2 pr-3 font-medium">Total Limit</th>
                <th className="pb-2 pr-3 font-medium">PO Sub-Limit</th>
                <th className="pb-2 pr-3 font-medium">WC Sub-Limit</th>
                <th className="pb-2 font-medium">Max Review Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {/* Proposed row */}
              {p.proposed && (
                <tr>
                  <td className="py-3 pr-3 font-semibold text-purple-700 align-top">Proposed</td>
                  <td className="py-3 pr-3 align-top">
                    <LimitCell
                      limit={p.proposed.totalLimit}
                      outstanding={p.outstandingTotal}
                      remaining={p.remainingTotal}
                      proposedLimit={p.proposed.totalLimit}
                      currentLimit={p.current?.totalLimit ?? null}
                    />
                  </td>
                  <td className="py-3 pr-3 align-top">
                    <LimitCell
                      limit={p.proposed.poSubLimit}
                      outstanding={undefined}
                      remaining={p.remainingPO}
                      proposedLimit={p.proposed.poSubLimit}
                      currentLimit={p.current?.poSubLimit ?? null}
                    />
                  </td>
                  <td className="py-3 pr-3 align-top">
                    <LimitCell
                      limit={p.proposed.wcSubLimit}
                      outstanding={p.outstandingTotal}
                      remaining={p.remainingWC}
                      proposedLimit={p.proposed.wcSubLimit}
                      currentLimit={p.current?.wcSubLimit ?? null}
                    />
                  </td>
                  <td className="py-3 align-top text-gray-400">—</td>
                </tr>
              )}

              {/* Current / Expired row */}
              {p.current && (
                <tr>
                  <td className="py-3 pr-3 align-top">
                    <div className={`font-semibold ${p.current.limitStatus === "Active" ? "text-emerald-700" : "text-red-600"}`}>
                      {p.current.limitStatus}
                    </div>
                    <div className="text-gray-500 mt-0.5">
                      {fmtDate(p.current.effectiveDate)} – {fmtDate(p.current.expiryDate)}
                    </div>
                    <div className="text-gray-400">
                      ({daysFromToday(p.current.expiryDate)} days from today)
                    </div>
                  </td>
                  <td className="py-3 pr-3 align-top">
                    <LimitCell
                      limit={p.current.totalLimit}
                      outstanding={p.outstandingTotal}
                      remaining={p.proposed ? null : p.remainingTotal}
                    />
                  </td>
                  <td className="py-3 pr-3 align-top">
                    <LimitCell
                      limit={p.current.poSubLimit}
                      remaining={p.proposed ? null : p.remainingPO}
                    />
                  </td>
                  <td className="py-3 pr-3 align-top">
                    <LimitCell
                      limit={p.current.wcSubLimit}
                      outstanding={p.outstandingTotal}
                      remaining={p.proposed ? null : p.remainingWC}
                    />
                  </td>
                  <td className="py-3 align-top text-gray-600">
                    {fmtDate(p.current.expiryDate)}
                  </td>
                </tr>
              )}

              {/* Superseded rows */}
              {p.superseded.map((s, i) => (
                <tr key={i} className="text-gray-400">
                  <td className="py-2 pr-3 align-top">
                    <div className="text-gray-400 font-medium">Superseded</div>
                    <div className="text-gray-300 text-[11px]">
                      {fmtDate(s.effectiveDate)} – {fmtDate(s.expiryDate)}
                    </div>
                  </td>
                  <td className="py-2 pr-3 align-top text-xs">{fmt(s.totalLimit)}</td>
                  <td className="py-2 pr-3 align-top text-xs">{fmt(s.poSubLimit)}</td>
                  <td className="py-2 pr-3 align-top text-xs">{fmt(s.wcSubLimit)}</td>
                  <td className="py-2 align-top text-gray-300">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionCard>
  );
}
