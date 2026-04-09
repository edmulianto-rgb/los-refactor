import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";

interface Props {
  project: ICProject;
}

export function PICSection({ project }: Props) {
  const { pic } = project;
  return (
    <SectionCard title="PIC">
      <div className="mt-2 text-sm text-gray-800 space-y-1">
        <div>
          <span className="text-gray-500">Submitter:</span>{" "}
          <span className="font-medium">{pic.submitter}</span>
        </div>
        <div>
          <span className="text-gray-500">Primary Analyst:</span>{" "}
          <span className="font-medium">{pic.primaryAnalyst}</span>
        </div>
        <div>
          <span className="text-gray-500">Secondary Analyst:</span>{" "}
          <span className="font-medium">{pic.secondaryAnalyst ?? "—"}</span>
        </div>
      </div>
    </SectionCard>
  );
}
