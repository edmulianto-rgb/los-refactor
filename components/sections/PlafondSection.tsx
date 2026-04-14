import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { fmt, fmtDate } from "@/components/ui/DataRow";
import { Warning } from "@/components/ui/Warning";

interface Props {
  project: ICProject;
}

function daysFromToday(isoDate: string): number {
  return Math.round((new Date(isoDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

/** Absolute limit + optional outstanding / remaining. */
function AbsoluteLimitCell({
  limit,
  outstanding,
  remaining,
}: {
  limit: number | null;
  outstanding?: number;
  remaining?: number | null;
}) {
  if (limit === null) return <span className="text-gray-300 text-xs">—</span>;

  const isNegRemaining = remaining !== null && remaining !== undefined && remaining < 0;

  return (
    <div className="text-xs space-y-0.5">
      <div className="font-semibold text-gray-800">{fmt(limit)}</div>
      {outstanding != null && <div className="text-gray-500">Outstanding: {fmt(outstanding)}</div>}
      {remaining != null && (
        <div className={`font-medium ${isNegRemaining ? "text-red-600" : "text-gray-700"}`}>
          Remaining: {fmt(remaining)}
          {isNegRemaining && " ⚠️"}
        </div>
      )}
    </div>
  );
}

/** Change vs current, then proposed ceiling as **(to Rp …)**. */
function RequestedDeltaCell({ proposed, current }: { proposed: number; current: number }) {
  const delta = proposed - current;
  const signed =
    delta > 0
      ? `+${fmt(delta)}`
      : delta < 0
      ? `-${fmt(Math.abs(delta))}`
      : fmt(proposed);
  const deltaColor =
    delta > 0 ? "text-emerald-700" : delta < 0 ? "text-red-600" : "text-gray-800";
  return (
    <div className="text-xs space-y-0.5">
      <div className={`font-semibold ${deltaColor}`}>{signed}</div>
      <div className="text-gray-400 text-[10px] leading-snug">(to {fmt(proposed)})</div>
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

  const showProposedDeltas = Boolean(p.proposed && p.current);

  return (
    <SectionCard title="Plafond" badge={badge}>
      <div className="mt-2 space-y-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          On the <strong className="text-gray-600">Proposed</strong> row, each limit shows the{" "}
          <strong>change</strong> versus current (with <strong className="text-gray-600">+</strong> /{" "}
          <strong className="text-gray-600">−</strong>) and the <strong>proposed ceiling</strong> on the line below as{" "}
          <em>(to Rp …)</em>. <strong className="text-gray-600">Current</strong> and{" "}
          <strong className="text-gray-600">Superseded</strong> rows show absolute limits. Red banners only if a stored
          remaining sub-limit is negative.
        </p>
        {negativeWarnings.map((w, i) => (
          <Warning key={i} message={w} level="error" />
        ))}

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs min-w-[560px] border border-gray-100 rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 text-left">
                <th className="py-2 px-3 font-medium w-36">Limit Status</th>
                <th className="py-2 pr-3 font-medium">Total Limit</th>
                <th className="py-2 pr-3 font-medium">PO Sub Limit</th>
                <th className="py-2 pr-3 font-medium">Working Capital Sub Limit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {showProposedDeltas && (
                <tr className="bg-purple-50/30">
                  <td className="py-3 px-3 font-semibold text-purple-800 align-top">Proposed</td>
                  <td className="py-3 pr-3 align-top">
                    <RequestedDeltaCell proposed={p.proposed!.totalLimit} current={p.current!.totalLimit} />
                  </td>
                  <td className="py-3 pr-3 align-top">
                    <RequestedDeltaCell proposed={p.proposed!.poSubLimit} current={p.current!.poSubLimit} />
                  </td>
                  <td className="py-3 pr-3 align-top">
                    <RequestedDeltaCell proposed={p.proposed!.wcSubLimit} current={p.current!.wcSubLimit} />
                  </td>
                </tr>
              )}

              {p.current && (
                <tr>
                  <td className="py-3 px-3 align-top">
                    <div className="font-semibold text-gray-900">Current</div>
                    <div className={`text-[11px] font-medium mt-0.5 ${p.current.limitStatus === "Active" ? "text-emerald-700" : "text-red-600"}`}>
                      {p.current.limitStatus}
                    </div>
                    <div className="text-gray-500 mt-0.5">
                      {fmtDate(p.current.effectiveDate)} – {fmtDate(p.current.expiryDate)}
                    </div>
                    <div className="text-gray-400 text-[11px]">
                      ({daysFromToday(p.current.expiryDate)} days from today)
                    </div>
                  </td>
                  <td className="py-3 pr-3 align-top">
                    <AbsoluteLimitCell
                      limit={p.current.totalLimit}
                      outstanding={p.outstandingTotal}
                      remaining={showProposedDeltas ? null : p.remainingTotal}
                    />
                  </td>
                  <td className="py-3 pr-3 align-top">
                    <AbsoluteLimitCell
                      limit={p.current.poSubLimit}
                      remaining={showProposedDeltas ? null : p.remainingPO}
                    />
                  </td>
                  <td className="py-3 pr-3 align-top">
                    <AbsoluteLimitCell
                      limit={p.current.wcSubLimit}
                      outstanding={p.current.wcSubLimit > 0 ? p.outstandingTotal : undefined}
                      remaining={showProposedDeltas ? null : p.remainingWC}
                    />
                  </td>
                </tr>
              )}

              {p.superseded.map((s, i) => (
                <tr key={i} className="text-gray-400">
                  <td className="py-2 px-3 align-top">
                    <div className="font-medium text-gray-500">Superseded</div>
                    <div className="text-gray-300 text-[11px]">
                      {fmtDate(s.effectiveDate)} – {fmtDate(s.expiryDate)}
                    </div>
                  </td>
                  <td className="py-2 pr-3 align-top text-xs">{fmt(s.totalLimit)}</td>
                  <td className="py-2 pr-3 align-top text-xs">{fmt(s.poSubLimit)}</td>
                  <td className="py-2 pr-3 align-top text-xs">{fmt(s.wcSubLimit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showProposedDeltas && (
          <p className="text-[10px] text-gray-400">
            After approval: proposed ceilings {fmt(p.proposed!.totalLimit)} total / {fmt(p.proposed!.poSubLimit)} PO /{" "}
            {fmt(p.proposed!.wcSubLimit)} WC. Headroom on proposed line: remaining {fmt(p.remainingTotal)} total,{" "}
            {fmt(p.remainingPO)} PO, {fmt(p.remainingWC)} WC (outstanding {fmt(p.outstandingTotal)}).
          </p>
        )}
      </div>
    </SectionCard>
  );
}
