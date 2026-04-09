import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataRow, fmt, fmtDate } from "@/components/ui/DataRow";
import { Warning } from "@/components/ui/Warning";
import { plafondWarnings } from "@/lib/warnings";

interface Props {
  project: ICProject;
}

function LimitCell({ value, warn }: { value: number; warn?: boolean }) {
  const isNeg = value < 0;
  return (
    <span className={`font-semibold ${isNeg ? "text-red-600" : warn ? "text-amber-600" : "text-gray-900"}`}>
      {fmt(value)}
      {isNeg && " ⚠️"}
    </span>
  );
}

export function PlafondSection({ project }: Props) {
  const warnings = plafondWarnings(project);
  const { plafond } = project;

  const badge = warnings.filter((w) => w.level === "error").length > 0 ? (
    <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
      {warnings.filter((w) => w.level === "error").length} issue{warnings.filter((w) => w.level === "error").length > 1 ? "s" : ""}
    </span>
  ) : null;

  return (
    <SectionCard title="Plafond" badge={badge}>
      <div className="mt-2 space-y-4">
        {warnings.map((w, i) => (
          <Warning key={i} message={w.message} level={w.level} />
        ))}

        {/* Proposed */}
        {plafond.proposed && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Proposed</h4>
            <div className="bg-purple-50 border border-purple-100 rounded-lg px-4 py-3 space-y-0">
              <DataRow label="Proposed Total Limit" value={<LimitCell value={plafond.proposed.totalLimit} />} />
              {plafond.proposed.poSubLimit > 0 && (
                <DataRow label="Proposed PO Sub-Limit" value={<LimitCell value={plafond.proposed.poSubLimit} />} />
              )}
              {plafond.proposed.wcSubLimit > 0 && (
                <DataRow label="Proposed WC Sub-Limit" value={<LimitCell value={plafond.proposed.wcSubLimit} />} />
              )}
            </div>
          </div>
        )}

        {/* Current */}
        {plafond.current && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Current
              <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${plafond.current.limitStatus === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                {plafond.current.limitStatus}
              </span>
            </h4>
            <div className="space-y-0">
              <DataRow label="Total Limit" value={fmt(plafond.current.totalLimit)} />
              {plafond.current.poSubLimit > 0 && <DataRow label="PO Sub-Limit" value={fmt(plafond.current.poSubLimit)} />}
              {plafond.current.wcSubLimit > 0 && <DataRow label="WC Sub-Limit" value={fmt(plafond.current.wcSubLimit)} />}
              <DataRow
                label="Effective → Expiry"
                value={`${fmtDate(plafond.current.effectiveDate)} → ${fmtDate(plafond.current.expiryDate)}`}
              />
            </div>
          </div>
        )}

        {/* Outstanding & Remaining */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Utilisation</h4>
          <div className="space-y-0">
            <DataRow label="Outstanding (Total)" value={fmt(plafond.outstandingTotal)} />
            <DataRow label="Remaining Total" value={<LimitCell value={plafond.remainingTotal} warn={plafond.remainingTotal < plafond.outstandingTotal * 0.2} />} />
            {plafond.current?.poSubLimit ? (
              <DataRow label="Remaining PO" value={<LimitCell value={plafond.remainingPO} />} />
            ) : null}
            {plafond.current?.wcSubLimit ? (
              <DataRow label="Remaining WC" value={<LimitCell value={plafond.remainingWC} />} />
            ) : null}
          </div>
        </div>

        {/* Superseded */}
        {plafond.superseded.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Superseded Limits</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 border-b">
                    <th className="text-left py-1 pr-4 font-medium">Total Limit</th>
                    <th className="text-left py-1 pr-4 font-medium">PO Sub-Limit</th>
                    <th className="text-left py-1 pr-4 font-medium">WC Sub-Limit</th>
                    <th className="text-left py-1 font-medium">Period</th>
                  </tr>
                </thead>
                <tbody>
                  {plafond.superseded.map((s, i) => (
                    <tr key={i} className="border-b border-gray-50 text-gray-600">
                      <td className="py-1.5 pr-4">{fmt(s.totalLimit)}</td>
                      <td className="py-1.5 pr-4">{fmt(s.poSubLimit)}</td>
                      <td className="py-1.5 pr-4">{fmt(s.wcSubLimit)}</td>
                      <td className="py-1.5">{fmtDate(s.effectiveDate)} → {fmtDate(s.expiryDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
