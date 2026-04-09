import { ICProject } from "@/data/types";
import { Tag, approvalTypeVariant } from "@/components/ui/Tag";

interface Props {
  project: ICProject;
}

export function ProjectHeader({ project }: Props) {
  const brandDisplay = project.brandIsNew
    ? `(New) ${project.brandName}`
    : project.brandName;

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-6 py-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm text-gray-500 mb-1">{brandDisplay}</div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {project.projectName}
          </h1>
        </div>
        <Tag
          label={project.approvalType}
          variant={approvalTypeVariant(project.approvalType)}
          className="text-sm px-3 py-1 shrink-0"
        />
      </div>
    </div>
  );
}
