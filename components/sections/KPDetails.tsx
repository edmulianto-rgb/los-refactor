import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";

interface Props {
  project: ICProject;
}

const SECOND_PLUS_REFERRAL = "2nd+ project";

function formatReferralLine(
  referralSource: string,
  specificReferror: string | null,
  referrorBelongsToKP: string | null
): string {
  if (!specificReferror) return referralSource;
  const kpPart = referrorBelongsToKP ? ` (${referrorBelongsToKP})` : "";
  return `${referralSource}: ${specificReferror}${kpPart}`;
}

export function KPDetails({ project }: Props) {
  const referralLine = (() => {
    if (project.referralSource === SECOND_PLUS_REFERRAL && project.firstProjectReferralOverride) {
      const o = project.firstProjectReferralOverride;
      return formatReferralLine(o.referralSource, o.specificReferror, o.referrorBelongsToKP);
    }
    return formatReferralLine(project.referralSource, project.specificReferror, project.referrorBelongsToKP);
  })();

  return (
    <SectionCard title="Karmapreneur Details">
      <div className="mt-2 space-y-3 text-sm">
        <div>
          <span className="text-xs text-gray-500 block mb-0.5">Project #</span>
          <div className="text-gray-900 space-y-0.5">
            <div className="font-semibold">Project #{project.projectNumberForKP} for the KP</div>
            <div className="text-gray-600 text-xs leading-relaxed">
              {project.brandActiveProjects} active<br />
              {project.brandCompletedProjects} completed<br />
              {Math.max(0, project.brandBeforeICProjects - 1)} before IC<br />
              {project.brandPendingDisbursementProjects} pending disbursement
            </div>
          </div>
        </div>

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
