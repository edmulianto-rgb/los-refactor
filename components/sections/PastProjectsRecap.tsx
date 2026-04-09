import { ICProject, PastProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { Warning } from "@/components/ui/Warning";
import { Tag, statusVariant, irrColor } from "@/components/ui/Tag";
import { fmt, fmtPct } from "@/components/ui/DataRow";
import { dpdWarnings } from "@/lib/warnings";

interface Props {
  project: ICProject;
}

export function PastProjectsRecap({ project }: Props) {
  const warnings = dpdWarnings(project);
  const projects = project.pastProjects;

  const totalOutstandingIncl = projects.reduce((s, p) => s + p.outstandingAmount + (p.status === "Proposed" ? p.amount : 0), 0);
  const totalOutstandingExcl = projects.filter((p) => p.status !== "Proposed").reduce((s, p) => s + p.outstandingAmount, 0);
  const avgTerm = projects.length > 0 ? projects.reduce((s, p) => s + p.projectedTermMonths, 0) / projects.length : 0;
  const completedWithIRR = projects.filter((p) => p.otfIRR !== null);
  const avgIRR = completedWithIRR.length > 0 ? completedWithIRR.reduce((s, p) => s + (p.otfIRR ?? 0), 0) / completedWithIRR.length : null;

  return (
    <SectionCard title="Past & Proposed Projects">
      <div className="mt-2 space-y-3">
        {warnings.map((w, i) => (
          <Warning key={i} message={w.message} level={w.level} />
        ))}

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr className="border-b text-gray-400 text-left">
                <th className="pb-2 pr-3 font-medium">Project</th>
                <th className="pb-2 pr-3 font-medium">Status</th>
                <th className="pb-2 pr-3 font-medium">Type</th>
                <th className="pb-2 pr-3 font-medium text-right">Amount</th>
                <th className="pb-2 pr-3 font-medium text-right">Outstanding</th>
                <th className="pb-2 pr-3 font-medium text-right">Term</th>
                <th className="pb-2 pr-3 font-medium text-right">Proj. IRR</th>
                <th className="pb-2 pr-3 font-medium text-right">OTF IRR</th>
                <th className="pb-2 pr-3 font-medium text-right">Proj. MOIC</th>
                <th className="pb-2 pr-3 font-medium text-right">OTF MOIC</th>
                <th className="pb-2 pr-3 font-medium text-right">Curr. DPD</th>
                <th className="pb-2 font-medium text-right">Max DPD</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <ProjectRow key={p.id} p={p} />
              ))}
            </tbody>
            <tfoot className="border-t-2 border-gray-200 bg-gray-50">
              <tr>
                <td className="pt-2 pr-3 text-gray-500 font-medium" colSpan={3}>Totals / Averages</td>
                <td className="pt-2 pr-3 text-right font-medium text-gray-700">
                  {fmt(projects.reduce((s, p) => s + p.amount, 0))}
                </td>
                <td className="pt-2 pr-3 text-right">
                  <div className="font-medium text-gray-700">{fmt(totalOutstandingExcl)}</div>
                  <div className="text-gray-400 text-[10px]">excl. proposed</div>
                </td>
                <td className="pt-2 pr-3 text-right text-gray-500">{avgTerm.toFixed(0)} mo avg</td>
                <td className="pt-2 pr-3 text-right text-gray-500">—</td>
                <td className="pt-2 pr-3 text-right">
                  {avgIRR !== null ? (
                    <span className="font-semibold text-gray-700">{fmtPct(avgIRR)}</span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="pt-2 pr-3 text-right text-gray-300" colSpan={4}>—</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="text-xs text-gray-400 italic">
          ⚠️ OTF MOIC and PvA are not currently available from the LMS Reporting Layer.
        </p>
      </div>
    </SectionCard>
  );
}

function ProjectRow({ p }: { p: PastProject }) {
  const isProposed = p.status === "Proposed";
  return (
    <tr className={`border-b border-gray-50 ${isProposed ? "bg-blue-50/50" : ""}`}>
      <td className="py-1.5 pr-3 text-gray-800 font-medium max-w-[200px] truncate" title={p.projectName}>
        {p.projectName}
      </td>
      <td className="py-1.5 pr-3">
        <Tag label={p.status} variant={statusVariant(p.status)} />
      </td>
      <td className="py-1.5 pr-3 text-gray-600 whitespace-nowrap">
        {p.returnType === "Revenue Share (Time-Capped)" ? "Rev. Share (TC)" :
          p.returnType === "Revenue Share (Return-Capped)" ? "Rev. Share (RC)" : "Fixed Return"}
      </td>
      <td className="py-1.5 pr-3 text-right text-gray-700">{fmt(p.amount)}</td>
      <td className="py-1.5 pr-3 text-right text-gray-700">
        {p.outstandingAmount > 0 ? fmt(p.outstandingAmount) : <span className="text-gray-300">—</span>}
      </td>
      <td className="py-1.5 pr-3 text-right text-gray-600">{p.projectedTermMonths} mo</td>
      <td className="py-1.5 pr-3 text-right text-gray-600">{fmtPct(p.projectedIRR)}</td>
      <td className={`py-1.5 pr-3 text-right ${irrColor(p.otfIRR, p.projectedIRR)}`}>
        {p.otfIRR !== null ? fmtPct(p.otfIRR) : <span className="text-gray-300">—</span>}
      </td>
      <td className="py-1.5 pr-3 text-right text-gray-600">{p.projectedMOIC}</td>
      <td className="py-1.5 pr-3 text-right text-gray-300 text-[11px]">N/A</td>
      <td className={`py-1.5 pr-3 text-right font-medium ${p.currentDPD > 30 ? "text-red-600" : p.currentDPD > 0 ? "text-amber-600" : "text-gray-400"}`}>
        {p.currentDPD > 0 ? `${p.currentDPD}d` : "—"}
      </td>
      <td className={`py-1.5 text-right font-medium ${p.maxDPD > 30 ? "text-red-600" : p.maxDPD > 0 ? "text-amber-600" : "text-gray-400"}`}>
        {p.maxDPD > 0 ? `${p.maxDPD}d` : "—"}
      </td>
    </tr>
  );
}
