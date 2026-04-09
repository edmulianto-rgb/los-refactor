import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataRow } from "@/components/ui/DataRow";

interface Props {
  project: ICProject;
}

export function KPDetails({ project }: Props) {
  return (
    <SectionCard title="Karmapreneur Details">
      <div className="mt-2 space-y-0">
        <DataRow label="Referral Source" value={project.referralSource} />
        {project.specificReferror && (
          <DataRow label="Specific Referror" value={project.specificReferror} />
        )}
        {project.referrorBelongsToKP && (
          <DataRow label="Referror's KP / Brand" value={project.referrorBelongsToKP} />
        )}
        {project.otherReferees.length > 0 && (
          <DataRow label="Other Referees" value={project.otherReferees.join(", ")} />
        )}
      </div>
    </SectionCard>
  );
}
