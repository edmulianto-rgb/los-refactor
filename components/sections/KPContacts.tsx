import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { Warning } from "@/components/ui/Warning";
import { fmt } from "@/components/ui/DataRow";
import { slikWarnings } from "@/lib/warnings";
import { ExternalLink } from "lucide-react";

interface Props {
  project: ICProject;
}

export function KPContacts({ project }: Props) {
  const warnings = slikWarnings(project.kpContacts);

  return (
    <SectionCard title="Karmapreneur Contacts">
      <div className="mt-2 space-y-4">
        {warnings.map((w, i) => (
          <Warning key={i} message={w.message} level={w.level} />
        ))}

        {project.kpContacts.map((contact) => (
          <div key={contact.id} className="border border-gray-100 rounded-lg px-4 py-3 bg-gray-50 space-y-2">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <span className="font-semibold text-sm text-gray-900">{contact.name}</span>
                <span className="ml-2 text-xs text-gray-500">{contact.role}</span>
                {contact.isKeyPerson && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">Key Person</span>
                )}
              </div>
              {contact.uboExposure > 0 && (
                <div className="text-right">
                  <div className="text-xs text-gray-500">UBO Exposure</div>
                  <div className="text-sm font-semibold text-gray-800">{fmt(contact.uboExposure)}</div>
                </div>
              )}
            </div>

            {contact.notesOnPerson && (
              <p className="text-sm text-gray-700 leading-relaxed">{contact.notesOnPerson}</p>
            )}

            {contact.slikExecSummary ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <div className="text-xs text-yellow-700 font-medium mb-0.5">SLIK Summary</div>
                <p className="text-sm text-gray-800">{contact.slikExecSummary}</p>
                {contact.slikFileUrl && (
                  <a
                    href={contact.slikFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                  >
                    View SLIK File <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-700">
                ⚠️ SLIK not yet received
              </div>
            )}

            {contact.referredProjects.length > 0 && (
              <div className="text-xs text-gray-500">
                Referred projects: {contact.referredProjects.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
