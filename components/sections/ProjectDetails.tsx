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

  const trancheOrProjectAmount = project.trancheTargetAmount ?? project.requestedAmount;

  // Amount warning logic per CSV:
  // Project type = "Project" → warn if > current plafond
  // Project type includes Plafond → warn if > proposed plafond
  const computedAmountWarning = (() => {
    if (project.amountWarning) return project.amountWarning;
    const isPlafondRequest = project.approvalType.includes("Plafond");
    if (!isPlafondRequest && project.plafond.current) {
      if (trancheOrProjectAmount > project.plafond.current.totalLimit) {
        return "Warning: Requested Project Amount exceeds Current Plafond";
      }
    }
    if (isPlafondRequest && project.plafond.proposed) {
      if (trancheOrProjectAmount > project.plafond.proposed.totalLimit) {
        return "Warning: Requested Project Amount exceeds Proposed Plafond";
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

        <DataRow
          label="Sector"
          value={<Tag label={sectorLabel} variant="blue" />}
        />
        <DataRow label="Financing Type" value={<span className="text-gray-800">{project.returnType}</span>} />
        <DataRow
          label="Syariah"
          value={
            project.syariah ? (
              <Tag label="Syariah" variant="syariah" />
            ) : (
              <span className="text-gray-600">No</span>
            )
          }
        />
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
          label="Requested Project Amount"
          value={
            <span className="font-semibold text-gray-900">
              {fmt(project.trancheTargetAmount ?? project.requestedAmount, project.requestedAmountCurrency)}
            </span>
          }
        />
      </div>
    </SectionCard>
  );
}
