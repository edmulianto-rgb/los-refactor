import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataRow, fmt } from "@/components/ui/DataRow";
import { Tag, assetClassVariant } from "@/components/ui/Tag";
import { Warning } from "@/components/ui/Warning";

interface Props {
  project: ICProject;
}

export function ProjectDetails({ project }: Props) {
  // Sector display: "Main: Sub" or just "Main" if no sub-sector
  const sectorLabel = project.subSector
    ? `${project.mainSector}: ${project.subSector}`
    : project.mainSector;

  // Amount warning logic per CSV:
  // Project type = "Project" → warn if > current plafond
  // Project type includes Plafond → warn if > proposed plafond
  const computedAmountWarning = (() => {
    if (project.amountWarning) return project.amountWarning;
    const isPlafondRequest = project.approvalType.includes("Plafond");
    if (!isPlafondRequest && project.plafond.current) {
      if (project.requestedAmount > project.plafond.current.totalLimit) {
        return "Warning: Project Target Amount exceeds Current Plafond";
      }
    }
    if (isPlafondRequest && project.plafond.proposed) {
      if (project.requestedAmount > project.plafond.proposed.totalLimit) {
        return "Warning: Project Target Amount exceeds Proposed Plafond";
      }
    }
    return null;
  })();

  return (
    <SectionCard title="Project Details">
      <div className="mt-2 space-y-0">
        {project.sectorWarning && (
          <Warning message={project.sectorWarning} level="warn" className="mb-3" />
        )}
        {computedAmountWarning && (
          <Warning message={computedAmountWarning} level="warn" className="mb-3" />
        )}

        {/* Project # + brand counts — text block per CSV */}
        <DataRow
          label="Project #"
          value={
            <div className="text-sm text-gray-800 space-y-0.5">
              <div className="font-semibold">Project #{project.projectNumberForKP} for the KP</div>
              <div className="text-gray-600 text-xs leading-relaxed">
                {project.brandActiveProjects} active<br />
                {project.brandCompletedProjects} completed<br />
                {/* Deduct current project from before-IC count */}
                {Math.max(0, project.brandBeforeICProjects - 1)} before IC<br />
                {project.brandPendingDisbursementProjects} pending disbursement
              </div>
            </div>
          }
        />

        <DataRow
          label="Sector"
          value={<Tag label={sectorLabel} variant="blue" />}
        />
        {project.syariah && (
          <DataRow label="Syariah" value={<Tag label="Syariah" variant="syariah" />} />
        )}
        <DataRow
          label="Asset Class"
          value={
            <Tag
              label={`Asset Class ${project.assetClass.replace("Asset ", "")}`}
              variant={assetClassVariant(project.assetClass)}
            />
          }
        />
        <DataRow
          label="Financing Use"
          value={<Tag label={project.financingUse} variant="gray" />}
        />
        <DataRow
          label="Requested Amount"
          value={
            <span className="font-semibold text-gray-900">
              {fmt(project.requestedAmount, project.requestedAmountCurrency)}
            </span>
          }
        />
      </div>
    </SectionCard>
  );
}
