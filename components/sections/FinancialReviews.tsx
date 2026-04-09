import { ICProject } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { fmtDate } from "@/components/ui/DataRow";

interface Props {
  project: ICProject;
}

const recoBadge: Record<string, string> = {
  Keep: "bg-gray-100 text-gray-700",
  Increase: "bg-emerald-100 text-emerald-700",
  Decrease: "bg-red-100 text-red-700",
};

function monthsAgo(isoDate: string): number {
  return (Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
}

export function FinancialReviews({ project }: Props) {
  const reviews = project.financialReviews.slice(0, 2);

  return (
    <SectionCard title="Financial Reviews">
      <div className="mt-2 overflow-x-auto -mx-1">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400 italic px-1">No financial reviews on record.</p>
        ) : (
          <table className="w-full text-xs min-w-[560px]">
            <thead>
              <tr className="border-b text-gray-400 text-left">
                <th className="pb-2 pr-3 font-medium w-20"></th>
                <th className="pb-2 pr-3 font-medium">Submitted</th>
                <th className="pb-2 pr-3 font-medium">Financial Reports Reviewed</th>
                <th className="pb-2 pr-3 font-medium">Reports' Period Ending Date</th>
                <th className="pb-2 pr-3 font-medium">Limit Recommendation</th>
                <th className="pb-2 pr-3 font-medium">Notes</th>
                <th className="pb-2 font-medium">Warnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviews.map((review, i) => {
                const months = monthsAgo(review.submissionDate);
                const isStale = months > 2;
                return (
                  <tr key={i} className="align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-600">Review {i + 1}</td>
                    <td className="py-3 pr-3 text-gray-700 whitespace-nowrap">
                      {fmtDate(review.submissionDate)}
                    </td>
                    <td className="py-3 pr-3 text-gray-700">{review.financialReportsReviewed}</td>
                    <td className="py-3 pr-3 text-gray-700 whitespace-nowrap">
                      {fmtDate(review.periodEndingDate)}
                    </td>
                    <td className="py-3 pr-3">
                      <span className={`px-2 py-0.5 rounded font-medium text-xs ${recoBadge[review.limitRecommendation]}`}>
                        {review.limitRecommendation}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-gray-700 max-w-[220px]">
                      <div className="whitespace-pre-wrap leading-relaxed">{review.reviewNotes}</div>
                    </td>
                    <td className="py-3">
                      {isStale && (
                        <span className="text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 whitespace-nowrap">
                          Warning: More than {Math.round(months)} months ago
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </SectionCard>
  );
}
