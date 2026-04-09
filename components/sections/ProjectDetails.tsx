import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataRow, fmt, fmtPct } from "@/components/ui/DataRow";
import { Tag, assetClassVariant } from "@/components/ui/Tag";
import { Warning } from "@/components/ui/Warning";

interface Props {
  project: ICProject;
}

export function ProjectDetails({ project }: Props) {
  const badge = project.brandIsNew ? (
    <span className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">1st project for this KP</span>
  ) : (
    <span className="text-xs text-gray-500">Project #{project.projectNumberForKP} for this KP</span>
  );

  return (
    <SectionCard title="Project Details" badge={badge}>
      <div className="mt-2 space-y-0">
        {project.sectorWarning && (
          <Warning message={project.sectorWarning} level="warn" className="mb-3" />
        )}
        {project.amountWarning && (
          <Warning message={project.amountWarning} level="warn" className="mb-3" />
        )}

        <DataRow label="Asset Class" value={<Tag label={project.assetClass} variant={assetClassVariant(project.assetClass)} />} />
        <DataRow label="Main Sector" value={<Tag label={project.mainSector} variant="blue" />} />
        {project.subSector && (
          <DataRow label="Sub-Sector" value={<Tag label={project.subSector} />} />
        )}
        {project.syariah && (
          <DataRow label="Syariah" value={<Tag label="Syariah" variant="syariah" />} />
        )}
        <DataRow label="Financing Use" value={<Tag label={project.financingUse} variant="gray" />} />
        <DataRow
          label="Requested Amount"
          value={
            <span className="font-semibold text-gray-900">
              {fmt(project.requestedAmount, project.requestedAmountCurrency)}
            </span>
          }
        />

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Active", value: project.brandActiveProjects, color: "text-blue-700" },
            { label: "Completed", value: project.brandCompletedProjects, color: "text-emerald-700" },
            { label: "Before IC", value: project.brandBeforeICProjects, color: "text-amber-600" },
            { label: "Pending Disb.", value: project.brandPendingDisbursementProjects, color: "text-purple-700" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-50 rounded-lg px-3 py-2 text-center">
              <div className={`text-xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label} Projects</div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
