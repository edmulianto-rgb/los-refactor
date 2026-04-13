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
          {project.codaRowId && (
            <p className="text-xs text-gray-400 mt-1.5 font-mono">Coda row: {project.codaRowId}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <Tag
            label={project.approvalType}
            variant={approvalTypeVariant(project.approvalType)}
            className="text-sm px-3 py-1"
          />
          <div
            className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
              project.syariah
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-gray-200 bg-gray-50 text-gray-600"
            }`}
          >
            Syariah · {project.syariah ? "Yes" : "No"}
          </div>
        </div>
      </div>
    </div>
  );
}
