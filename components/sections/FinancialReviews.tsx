import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataRow, fmtDate } from "@/components/ui/DataRow";
import { Warning } from "@/components/ui/Warning";
import { financialReviewWarnings } from "@/lib/warnings";

interface Props {
  project: ICProject;
}

const recoBadge: Record<string, string> = {
  Keep: "bg-gray-100 text-gray-700",
  Increase: "bg-emerald-100 text-emerald-700",
  Decrease: "bg-red-100 text-red-700",
};

export function FinancialReviews({ project }: Props) {
  const warnings = financialReviewWarnings(project.financialReviews);
  const reviews = project.financialReviews.slice(0, 2);

  return (
    <SectionCard title="Financial Reviews">
      <div className="mt-2 space-y-4">
        {warnings.map((w, i) => (
          <Warning key={i} message={w.message} level={w.level} />
        ))}

        {reviews.length === 0 && (
          <p className="text-sm text-gray-400 italic">No financial reviews on record.</p>
        )}

        {reviews.map((review, i) => (
          <div key={i} className="border border-gray-100 rounded-lg px-4 py-3 bg-gray-50">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="text-sm font-semibold text-gray-800">Review {i + 1}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${recoBadge[review.limitRecommendation]}`}>
                {review.limitRecommendation}
              </span>
            </div>
            <DataRow label="Submission Date" value={fmtDate(review.submissionDate)} />
            <DataRow label="Reports Reviewed" value={review.financialReportsReviewed} />
            <DataRow label="Period Ending" value={fmtDate(review.periodEndingDate)} />
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Review Notes</div>
              <div className="text-sm text-gray-700 bg-white border border-gray-100 rounded p-2 whitespace-pre-wrap leading-relaxed">
                {review.reviewNotes}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
