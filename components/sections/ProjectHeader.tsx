import { ICProject } from "@/data/types";
import { Tag, approvalTypeVariant, assetClassVariant } from "@/components/ui/Tag";

interface Props {
  project: ICProject;
}

export function ProjectHeader({ project }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-6 py-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-lg font-bold text-gray-900">{project.brandName}</span>
            {project.brandIsNew && (
              <Tag label="New KP" variant="amber" />
            )}
            <Tag label={project.assetClass} variant={assetClassVariant(project.assetClass)} />
            {project.syariah && <Tag label="Syariah" variant="syariah" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{project.projectName}</h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Tag label={project.approvalType} variant={approvalTypeVariant(project.approvalType)} className="text-sm px-3 py-1" />
          <span className="text-xs text-gray-400">
            Submitted {new Date(project.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>
    </div>
  );
}
