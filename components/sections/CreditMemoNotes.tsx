import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { ExternalLink } from "lucide-react";

interface Props {
  project: ICProject;
}

function MemoBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{title}</div>
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
        {content}
      </div>
    </div>
  );
}

export function CreditMemoNotes({ project }: Props) {
  return (
    <SectionCard title="Credit Memo & Notes">
      <div className="mt-2 space-y-2">
        <MemoBlock title="KP Credit Memo" content={project.kpCreditMemo} />
        <MemoBlock title="Project Credit Memo" content={project.projectCreditMemo} />

        {project.financialsLink && (
          <div className="mb-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Financials</div>
            <a
              href={project.financialsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
            >
              Open financial documents <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {project.projectNotes.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes Feed</div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {project.projectNotes.map((note, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-lg px-3 py-2.5">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                    <span className="text-xs font-medium text-gray-700">{note.author}</span>
                    <span className="text-xs text-gray-400">{new Date(note.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
