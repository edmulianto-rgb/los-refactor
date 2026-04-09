"use client";

import { useState } from "react";
import { ICProject, ICVote } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { CheckCircle, XCircle } from "lucide-react";

interface Props {
  project: ICProject;
}

const VOTE_OPTIONS: { value: Exclude<ICVote, null>; label: string; color: string; icon: React.ReactNode }[] = [
  {
    value: "Approve",
    label: "Approve",
    color: "bg-emerald-600 hover:bg-emerald-700 text-white",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  {
    value: "Reject",
    label: "Reject",
    color: "bg-red-600 hover:bg-red-700 text-white",
    icon: <XCircle className="w-4 h-4" />,
  },
];

function VoteBadge({ vote }: { vote: ICVote }) {
  if (vote === "Approve")
    return <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Approved</span>;
  if (vote === "Reject")
    return <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded">Rejected</span>;
  return <span className="text-xs text-gray-400 italic">Pending</span>;
}

export function ApprovalSection({ project }: Props) {
  const [votes, setVotes] = useState<Record<string, ICVote>>(
    Object.fromEntries(project.icVotes.map((v) => [v.memberId, v.vote]))
  );
  const [approvalNotes, setApprovalNotes] = useState(project.approvalNotes);
  const [submitted, setSubmitted] = useState(false);

  const myVoterId = "ic-1";
  const myVote = votes[myVoterId];

  // Other section items per CSV (Funding Source, Tax Withholdings)
  const isMembersProject = project.fundingSource.includes("Members");
  const taxNotWithheld = project.taxWithholdings === "No";
  const prevTaxNotWithheld = false; // would come from past projects in production

  return (
    <SectionCard title="Other">
      {/* Other section — per CSV order: Funding Source, Bank Details (conditional), Tax Withholdings */}
      <div className="mt-2 space-y-4">
        <div className="text-sm space-y-2">
          <div className="flex items-start gap-3">
            <span className="text-xs text-gray-500 w-36 shrink-0 pt-0.5">Funding Source</span>
            <span className="text-gray-900">
              {project.fundingSource}
              {isMembersProject && (
                <span className="ml-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
                  Warning: this is a Members project
                </span>
              )}
            </span>
          </div>

          {isMembersProject && (
            <div className="flex items-start gap-3">
              <span className="text-xs text-gray-500 w-36 shrink-0 pt-0.5">Bank Details for PT (Members)</span>
              <span className={project.bankDetailsReviewed ? "text-gray-700" : "text-amber-700"}>
                {project.bankDetailsReviewed
                  ? "Reviewed"
                  : "Bank Details Not Yet Reviewed by Finance/Analyst and going to Members"}
              </span>
            </div>
          )}

          <div className="flex items-start gap-3">
            <span className="text-xs text-gray-500 w-36 shrink-0 pt-0.5">Tax Withholdings</span>
            <div>
              <span className={taxNotWithheld ? "text-red-700 font-medium" : "text-gray-900"}>
                {project.taxWithholdings === "Yes"
                  ? "Karmapreneur will withhold"
                  : project.taxWithholdings === "No"
                  ? "Karmapreneur will NOT withhold"
                  : "TBD"}
              </span>
              {taxNotWithheld && (
                <div className="text-xs text-red-600 mt-0.5">Warning: Karmapreneur will NOT withhold taxes</div>
              )}
              {prevTaxNotWithheld && (
                <div className="text-xs text-red-600 mt-0.5">
                  Warning: Karmapreneur is NOT withholding taxes on a previous project
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approval section */}
      <div className="mt-6 border-t border-gray-100 pt-5 space-y-5">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Approval</h4>

        {project.specialNotesForIC && (
          <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            {project.specialNotesForIC}
          </div>
        )}

        {/* IC votes table */}
        <div className="space-y-1">
          {project.icVotes.map((v) => {
            const currentVote = votes[v.memberId];
            const isMe = v.memberId === myVoterId;
            return (
              <div
                key={v.memberId}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border ${isMe ? "border-blue-200 bg-blue-50" : "border-gray-100 bg-gray-50"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">{v.memberName}</span>
                  {isMe && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">You</span>
                  )}
                </div>
                <VoteBadge vote={currentVote} />
              </div>
            );
          })}
        </div>

        {/* Vote buttons — Approve / Reject only per CSV */}
        {!submitted && (
          <div>
            <div className="text-xs text-gray-500 mb-2">Your Vote</div>
            <div className="flex gap-2">
              {VOTE_OPTIONS.map(({ value, label, color, icon }) => (
                <button
                  key={value}
                  onClick={() => setVotes((prev) => ({ ...prev, [myVoterId]: value }))}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${color} ${myVote === value ? "ring-2 ring-offset-1 ring-gray-400 scale-[1.02]" : "opacity-80"}`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Approval Notes */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Approval Notes</div>
          {submitted ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap min-h-[60px]">
              {approvalNotes || <span className="text-gray-400 italic">No notes entered.</span>}
            </div>
          ) : (
            <textarea
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              rows={4}
              placeholder="Enter approval notes here..."
              className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
          )}
        </div>

        {/* Conditions Subsequent */}
        {project.conditionsSubsequent.length > 0 && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Conditions Subsequent</div>
            <ul className="list-disc pl-5 space-y-1">
              {project.conditionsSubsequent.map((c, i) => (
                <li key={i} className="text-sm text-gray-700">{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit */}
        {!submitted ? (
          <div>
            <button
              onClick={() => setSubmitted(true)}
              disabled={!myVote}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Submit Vote & Notes
            </button>
            {!myVote && <p className="text-xs text-gray-400 mt-1">Select a vote before submitting.</p>}
            <p className="text-xs text-gray-400 mt-1">
              ℹ️ In production, submitting will trigger Coda automation (status update + Slack notification).
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="text-sm font-semibold text-emerald-800">Vote recorded (prototype only)</div>
              <div className="text-xs text-emerald-600">
                In production this would update Coda and send Slack notifications.
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
