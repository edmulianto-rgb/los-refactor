import Link from "next/link";
import { mockProjects } from "@/data/mock";
import { computeWarnings } from "@/lib/warnings";
import { Tag, approvalTypeVariant, assetClassVariant } from "@/components/ui/Tag";

function fmt(n: number): string {
  return `IDR ${new Intl.NumberFormat("id-ID").format(n)}`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function HomePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending IC Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">{mockProjects.length} project{mockProjects.length !== 1 ? "s" : ""} awaiting your review</p>
      </div>

      <div className="space-y-3">
        {mockProjects.map((project) => {
          const warnings = computeWarnings(project);
          const errorCount = warnings.filter((w) => w.level === "error").length;
          const warnCount = warnings.filter((w) => w.level === "warn").length;
          const hasIssues = errorCount > 0 || warnCount > 0;

          return (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="block bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs text-gray-500">{project.brandName}</span>
                    {project.brandIsNew && (
                      <span className="text-xs bg-amber-100 text-amber-700 font-medium px-1.5 py-0.5 rounded">New KP</span>
                    )}
                    <Tag label={project.assetClass} variant={assetClassVariant(project.assetClass)} />
                    {project.syariah && <Tag label="Syariah" variant="syariah" />}
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                    {project.projectName}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-gray-500">
                    <span>{project.pic.primaryAnalyst}</span>
                    <span>·</span>
                    <span>Submitted {fmtDate(project.submittedAt)}</span>
                    <span>·</span>
                    <span className="font-medium text-gray-700">
                      {project.requestedAmountCurrency === "IDR" ? fmt(project.requestedAmount) : `USD ${project.requestedAmount.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Tag label={project.approvalType} variant={approvalTypeVariant(project.approvalType)} />
                  {hasIssues && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {errorCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-700 font-medium px-2 py-0.5 rounded">
                          {errorCount} error{errorCount > 1 ? "s" : ""}
                        </span>
                      )}
                      {warnCount > 0 && (
                        <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded">
                          {warnCount} warning{warnCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  )}
                  <span className="text-xs text-gray-400">
                    {project.icVotes.filter((v) => v.vote !== null).length}/{project.icVotes.length} voted
                  </span>
                </div>
              </div>

              {/* Warning summary inline */}
              {hasIssues && (
                <div className="mt-3 border-t border-gray-50 pt-3 space-y-1">
                  {warnings.slice(0, 2).map((w, i) => (
                    <div key={i} className={`text-xs flex items-start gap-1.5 ${w.level === "error" ? "text-red-600" : "text-amber-600"}`}>
                      <span className="shrink-0">{w.level === "error" ? "✖" : "▲"}</span>
                      <span className="line-clamp-1">{w.message}</span>
                    </div>
                  ))}
                  {warnings.length > 2 && (
                    <div className="text-xs text-gray-400">+ {warnings.length - 2} more issue{warnings.length - 2 > 1 ? "s" : ""}</div>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
        <strong>Prototype note:</strong> This uses mocked data modelled on the verified IC Review data contract. Voting and approval actions are UI-only and do not connect to Coda in this prototype.
      </div>
    </div>
  );
}
