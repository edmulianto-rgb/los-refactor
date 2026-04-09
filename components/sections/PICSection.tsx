import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataRow } from "@/components/ui/DataRow";

interface Props {
  project: ICProject;
}

export function PICSection({ project }: Props) {
  const { pic } = project;
  return (
    <SectionCard title="PIC">
      <div className="mt-2 space-y-0">
        <DataRow label="Submitter" value={pic.submitter} />
        <DataRow label="Primary Analyst" value={pic.primaryAnalyst} />
        <DataRow label="Secondary Analyst" value={pic.secondaryAnalyst ?? "—"} />
      </div>
    </SectionCard>
  );
}
