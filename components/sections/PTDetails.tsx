import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataRow } from "@/components/ui/DataRow";
import { Warning } from "@/components/ui/Warning";
import { ExternalLink } from "lucide-react";

interface Props {
  project: ICProject;
}

export function PTDetails({ project }: Props) {
  return (
    <SectionCard title="PT Details">
      <div className="mt-2 space-y-4">
        {project.ptDetails.map((pt) => (
          <div key={pt.id} className="border border-gray-100 rounded-lg px-4 py-3 bg-gray-50 space-y-2">
            <h4 className="font-semibold text-sm text-gray-900">{pt.name}</h4>

            {pt.warnings.map((w, i) => (
              <Warning key={i} message={w} level="warn" />
            ))}

            <DataRow label="Bank" value={pt.bank} />
            <DataRow label="Account Number" value={
              <span className="font-mono text-sm">{pt.accountNumber}</span>
            } />
            <DataRow
              label="Accountholder Name"
              value={
                <span className={pt.accountholderName !== pt.name ? "text-amber-600 font-medium" : undefined}>
                  {pt.accountholderName}
                  {pt.accountholderName !== pt.name && " ⚠️ Mismatch with PT Name"}
                </span>
              }
            />

            {pt.slikExecSummary ? (
              <div className="bg-pink-50 border border-pink-200 rounded p-2 mt-1">
                <div className="text-xs font-medium text-pink-700 mb-0.5">SLIK Summary</div>
                <p className="text-sm text-gray-800">{pt.slikExecSummary}</p>
                {pt.slikFileUrl && (
                  <a
                    href={pt.slikFileUrl}
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
                ⚠️ SLIK file not received
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
