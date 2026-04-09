"use client";

import { useState } from "react";
import { ICProject, ICVote } from "@/data/types";
import { SectionCard } from "@/components/ui/SectionCard";
import { Warning } from "@/components/ui/Warning";
import { CheckCircle, XCircle, Minus } from "lucide-react";

interface Props {
  project: ICProject;
}

const VOTE_LABELS: { value: ICVote; label: string; color: string; icon: React.ReactNode }[] = [
  { value: "Approve", label: "Approve", color: "bg-emerald-600 hover:bg-emerald-700 text-white", icon: <CheckCircle className="w-4 h-4" /> },
  { value: "Reject", label: "Reject", color: "bg-red-600 hover:bg-red-700 text-white", icon: <XCircle className="w-4 h-4" /> },
  { value: "Abstain", label: "Abstain", color: "bg-gray-200 hover:bg-gray-300 text-gray-700", icon: <Minus className="w-4 h-4" /> },
];

export function ApprovalSection({ project }: Props) {
  const [votes, setVotes] = useState<Record<string, ICVote>>(
    Object.fromEntries(project.icVotes.map((v) => [v.memberId, v.vote]))
  );
  const [approvalNotes, setApprovalNotes] = useState(project.approvalNotes);
  const [submitted, setSubmitted] = useState(false);

  const myVoterId = "ic-1"; // simulated "current user"
  const myVote = votes[myVoterId];

  const approveCount = Object.values(votes).filter((v) => v === "Approve").length;
  const rejectCount = Object.values(votes).filter((v) => v === "Reject").length;
  const pendingCount = Object.values(votes).filter((v) => v === null).length;

  function handleVote(vote: ICVote) {
    setVotes((prev) => ({ ...prev, [myVoterId]: vote }));
  }

  return (
    <SectionCard title="Approval & Voting">
      <div className="mt-2 space-y-5">
        {project.specialNotesForIC && (
          <Warning message={project.specialNotesForIC} level="warn" />
        )}

        {/* Vote summary */}
        <div className="flex gap-4 flex-wrap">
          <VoteStat label="Approved" count={approveCount} color="text-emerald-600" />
          <VoteStat label="Rejected" count={rejectCount} color="text-red-600" />
          <VoteStat label="Pending" count={pendingCount} color="text-gray-500" />
        </div>

        {/* IC votes table */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">IC Member Votes</h4>
          <div className="space-y-1">
            {project.icVotes.map((v) => {
              const currentVote = votes[v.memberId];
              const isMe = v.memberId === myVoterId;
              return (
                <div key={v.memberId} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${isMe ? "border-blue-200 bg-blue-50" : "border-gray-100 bg-gray-50"}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{v.memberName}</span>
                    {isMe && <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">You</span>}
                  </div>
                  <VoteBadge vote={currentVote} />
                </div>
              );
            })}
          </div>
        </div>

        {/* My vote */}
        {!submitted && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Your Vote</h4>
            <div className="flex gap-2 flex-wrap">
              {VOTE_LABELS.map(({ value, label, color, icon }) => (
                <button
                  key={value}
                  onClick={() => handleVote(value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${color} ${myVote === value ? "ring-2 ring-offset-1 ring-gray-400 scale-[1.02]" : "opacity-80"}`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Approval notes */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">IC Review Notes</h4>
          {submitted ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
              {approvalNotes || <span className="text-gray-400 italic">No notes entered.</span>}
            </div>
          ) : (
            <textarea
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              rows={4}
              placeholder="Enter IC review notes, conditions, or comments here..."
              className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
          )}
        </div>

        {/* Conditions subsequent */}
        {project.conditionsSubsequent.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Conditions Subsequent</h4>
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
            {!myVote && (
              <p className="text-xs text-gray-400 mt-1">Select a vote before submitting.</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              ℹ️ In production, submitting will trigger Coda automation (status update + Slack notification).
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="text-sm font-semibold text-emerald-800">Vote recorded (prototype only)</div>
              <div className="text-xs text-emerald-600">In production this would update Coda and send Slack notifications.</div>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

function VoteStat({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="text-center bg-gray-50 border border-gray-100 rounded-lg px-5 py-2">
      <div className={`text-2xl font-bold ${color}`}>{count}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function VoteBadge({ vote }: { vote: ICVote }) {
  if (vote === "Approve") return <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Approved</span>;
  if (vote === "Reject") return <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded">Rejected</span>;
  if (vote === "Abstain") return <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Abstained</span>;
  return <span className="text-xs text-gray-400 italic">Pending</span>;
}
