import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";

interface Props {
  project: ICProject;
}

export function KPDetails({ project }: Props) {
  // Format: "[Source]: [Referror] ([KP/Brand])"
  // Drop ":" if no specific referror; drop "(xxx)" if no KP/Brand
  const referralLine = (() => {
    const { referralSource, specificReferror, referrorBelongsToKP } = project;
    if (!specificReferror) return referralSource;
    const kpPart = referrorBelongsToKP ? ` (${referrorBelongsToKP})` : "";
    return `${referralSource}: ${specificReferror}${kpPart}`;
  })();

  return (
    <SectionCard title="Karmapreneur Details">
      <div className="mt-2 space-y-2 text-sm">
        <div>
          <span className="text-xs text-gray-500 block mb-0.5">Referral Source</span>
          <span className="text-gray-900">{referralLine}</span>
        </div>

        {project.otherReferees.length > 0 && (
          <div>
            <span className="text-xs text-gray-500 block mb-0.5">Other Referees</span>
            <span className="text-gray-900">{project.otherReferees.join(", ")}</span>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
