import { ICProject, PastProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { Tag, statusVariant } from "@/components/ui/Tag";
import { fmt, fmtDate, fmtPct } from "@/components/ui/DataRow";
import { getPastProjectsRecapRows } from "@/lib/pastProjectsRecap";
import { sortPastProjectsRecapRows } from "@/lib/pastProjectsRecapSort";

interface Props {
  project: ICProject;
}

// Absolute IRR colour thresholds per CSV spec
function irrClass(irr: number | null): string {
  if (irr === null) return "text-gray-400";
  if (irr < 15) return "text-red-600 font-semibold";
  if (irr < 20) return "text-amber-600 font-semibold";
  return "text-emerald-700 font-semibold";
}

// Financing type display label per CSV
function returnTypeLabel(rt: string): string {
  const map: Record<string, string> = {
    "Revenue Share (Time-Capped)": "Revenue Share (Time-Capped)",
    "Revenue Share (Return-Capped)": "Revenue Share (Return-Capped)",
    "Fixed Return": "Fixed Return",
    "Daily Interest": "Daily Interest",
  };
  return map[rt] ?? rt;
}

export function PastProjectsRecap({ project }: Props) {
  const allRows = project.pastProjects;
  const projects = sortPastProjectsRecapRows(getPastProjectsRecapRows(allRows));

  // Footer aggregations (visible rows only)
  const totalAmountInclProposed = projects.reduce((s, p) => s + p.amount, 0);
  const totalOutstandingExclProposed = projects
    .filter((p) => p.status !== "Proposed")
    .reduce((s, p) => s + p.outstandingAmount, 0);
  const totalOutstandingInclProposed =
    totalOutstandingExclProposed +
    projects.filter((p) => p.status === "Proposed").reduce((s, p) => s + p.amount, 0);

  const avgTerm =
    projects.length > 0
      ? projects.reduce((s, p) => s + p.projectedTermMonths, 0) / projects.length
      : 0;

  const completedWithIRR = projects.filter((p) => p.otfIRR !== null);
  const avgIRR =
    completedWithIRR.length > 0
      ? completedWithIRR.reduce((s, p) => s + (p.otfIRR ?? 0), 0) / completedWithIRR.length
      : null;

  // Status count
  const statusCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  projects.forEach((p) => {
    statusCounts[p.status] = (statusCounts[p.status] ?? 0) + 1;
    typeCounts[returnTypeLabel(p.returnType)] = (typeCounts[returnTypeLabel(p.returnType)] ?? 0) + 1;
  });

  return (
    <SectionCard title="Proposed and Past Projects Recap Table">
      <div className="mt-2 space-y-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          Includes the <strong>Proposed</strong> row for <em>this</em> submission alongside other projects for the KP.
          Rows are sorted by status (Proposed, in-queue statuses, Active, then Completed), then by{" "}
          <strong>IC approval date</strong> newest first.
        </p>
        {projects.length === 0 ? (
          <p className="text-sm text-gray-400 italic px-1">No projects in this recap yet.</p>
        ) : (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs min-w-[900px]">
            <thead>
              <tr className="border-b text-gray-400 text-left">
                <th className="pb-2 pr-2 font-medium w-6">#</th>
                <th className="pb-2 pr-3 font-medium">Project</th>
                <th className="pb-2 pr-3 font-medium">Status</th>
                <th className="pb-2 pr-3 font-medium">Financing Type</th>
                <th className="pb-2 pr-3 font-medium text-right">Amount</th>
                <th className="pb-2 pr-3 font-medium text-right">Outstanding</th>
                <th className="pb-2 pr-3 font-medium text-right">Term</th>
                <th className="pb-2 pr-3 font-medium text-right">PvA</th>
                <th className="pb-2 pr-3 font-medium text-right">IRR</th>
                <th className="pb-2 pr-3 font-medium text-right">MOIC</th>
                <th className="pb-2 font-medium text-right">DPD</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <ProjectRow key={p.id} p={p} index={i + 1} />
              ))}
            </tbody>
            <tfoot className="border-t-2 border-gray-200 bg-gray-50 text-xs">
              <tr>
                <td className="pt-2 pr-2"></td>
                <td className="pt-2 pr-3 text-gray-500 font-medium">
                  {Object.entries(statusCounts).map(([s, n]) => `${n} ${s}`).join(", ")}
                </td>
                <td className="pt-2 pr-3"></td>
                <td className="pt-2 pr-3 text-gray-500">
                  {Object.entries(typeCounts).map(([t, n]) => `${n}× ${t}`).join(", ")}
                </td>
                <td className="pt-2 pr-3 text-right font-medium text-gray-700">
                  {fmt(totalAmountInclProposed)}
                </td>
                <td className="pt-2 pr-3 text-right">
                  <div className="font-medium text-gray-700">{fmt(totalOutstandingExclProposed)}</div>
                  <div className="text-gray-400 text-[10px]">excl. proposed</div>
                  <div className="font-medium text-gray-600 mt-0.5">{fmt(totalOutstandingInclProposed)}</div>
                  <div className="text-gray-400 text-[10px]">incl. proposed</div>
                </td>
                <td className="pt-2 pr-3 text-right text-gray-500">{avgTerm.toFixed(0)} mo avg</td>
                <td className="pt-2 pr-3 text-right text-gray-400 text-[10px]">N/A from LMS</td>
                <td className="pt-2 pr-3 text-right">
                  {avgIRR !== null ? (
                    <span className={irrClass(avgIRR)}>{fmtPct(avgIRR)} avg</span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="pt-2 pr-3 text-right text-gray-400 text-[10px]">OTF MOIC<br />not from LMS</td>
                <td className="pt-2 text-right text-gray-300">—</td>
              </tr>
            </tfoot>
          </table>
        </div>
        )}

        <p className="text-xs text-gray-400 italic">
          ⚠️ OTF MOIC and PvA are not currently available from the LMS Reporting Layer.
        </p>
      </div>
    </SectionCard>
  );
}

function ProjectRow({ p, index }: { p: PastProject; index: number }) {
  const isProposed = p.status === "Proposed";

  // Financing type warnings per CSV
  const ftWarning =
    p.returnType === "Fixed Return" && p.projectedTermMonths > 60
      ? { text: "Warning: >60 months (long)", cls: "text-amber-600 bg-amber-50 border-amber-200" }
      : p.returnType === "Fixed Return" && p.projectedTermMonths > 36
      ? { text: "Warning: >36 months on Fixed Return", cls: "text-red-600 bg-red-50 border-red-200" }
      : null;

  // BEP warning per CSV
  const bepWarning = p.projectedBEPMonths > 30;

  return (
    <tr className={`border-b border-gray-50 align-top ${isProposed ? "bg-blue-50/40" : ""}`}>
      <td className="py-2 pr-2 text-gray-400">{index}</td>

      {/* Project name */}
      <td className="py-2 pr-3 text-gray-800 font-medium min-w-[160px]">
        {p.projectName}
      </td>

      {/* Status */}
      <td className="py-2 pr-3">
        <Tag label={p.status} variant={statusVariant(p.status)} />
      </td>

      {/* Financing Type */}
      <td className="py-2 pr-3 text-gray-600">
        <div>{returnTypeLabel(p.returnType)}</div>
        {ftWarning && (
          <div className={`mt-0.5 text-[10px] px-1 py-0.5 rounded border ${ftWarning.cls}`}>
            {ftWarning.text}
          </div>
        )}
      </td>

      {/* Amount */}
      <td className="py-2 pr-3 text-right text-gray-700">{fmt(p.amount)}</td>

      {/* Outstanding */}
      <td className="py-2 pr-3 text-right text-gray-700">
        {p.outstandingAmount > 0 ? fmt(p.outstandingAmount) : <span className="text-gray-300">—</span>}
      </td>

      {/* Term: OTF / Original */}
      <td className="py-2 pr-3 text-right text-gray-600">
        {p.otfTermMonths != null && (
          <div className="font-medium">{p.otfTermMonths} months OTF</div>
        )}
        <div className={p.otfTermMonths ? "text-gray-400" : ""}>
          {p.projectedTermMonths} months{p.otfTermMonths ? " original" : ""}
        </div>
      </td>

      {/* PvA — not available */}
      <td className="py-2 pr-3 text-right text-gray-300 text-[10px]">N/A</td>

      {/* IRR: OTF + Projected */}
      <td className="py-2 pr-3 text-right">
        {p.otfIRR !== null && (
          <div className={irrClass(p.otfIRR)}>{fmtPct(p.otfIRR)} OTF</div>
        )}
        <div className={`${irrClass(p.projectedIRR)} ${p.otfIRR ? "text-gray-400 font-normal" : ""}`}>
          {fmtPct(p.projectedIRR)} {p.otfIRR ? "original" : "projected"}
        </div>
      </td>

      {/* MOIC: OTF + Projected + BEP */}
      <td className="py-2 pr-3 text-right">
        <div className="text-gray-300 text-[10px]">OTF MOIC: N/A</div>
        <div className="text-gray-600">{p.projectedMOIC} projected</div>
        <div className={`text-[10px] mt-0.5 ${bepWarning ? "text-amber-600" : "text-gray-500"}`}>
          BEP month {p.projectedBEPMonths}
          {bepWarning && " ⚠️ >30 months"}
        </div>
      </td>

      {/* DPD */}
      <td className="py-2 text-right">
        {p.currentDPD > 0 ? (
          <div className="text-red-600 font-semibold">{p.currentDPD} days now</div>
        ) : null}
        {p.maxDPD > 0 ? (
          <div className={p.maxDPD > 30 ? "text-red-600 font-medium" : "text-amber-600"}>
            {p.maxDPD} days max
          </div>
        ) : p.currentDPD === 0 ? (
          <div className="text-gray-300">—</div>
        ) : null}
        {p.overdueHistory && p.overdueHistory.length > 0 && (
          <div className="mt-1 space-y-0.5 text-left">
            {p.overdueHistory.map((ev, i) => (
              <div key={i} className="text-[10px] text-gray-500">
                {fmtDate(ev.dueDate)} — {ev.daysOverdue}d overdue —{" "}
                <span className={ev.status === "Unpaid" ? "text-red-600 font-medium" : "text-gray-400"}>
                  {ev.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}
