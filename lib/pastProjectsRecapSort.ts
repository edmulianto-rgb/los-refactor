import { PastProject, ProjectStatus } from "@/data/types";

/** Proposed → in-queue → Active (“current”) → Completed → other. */
const STATUS_ORDER: Record<ProjectStatus, number> = {
  Proposed: 0,
  "IC Review": 1,
  "Pending IC submission": 2,
  Active: 3,
  Completed: 4,
  Rescheduled: 5,
  Rejected: 6,
};

function statusRank(s: ProjectStatus): number {
  return STATUS_ORDER[s] ?? 99;
}

function approvalTime(p: PastProject): number | null {
  if (!p.icApprovalDate) return null;
  const t = Date.parse(p.icApprovalDate);
  return Number.isNaN(t) ? null : t;
}

/** Newest IC approval first within the same status bucket. */
function compareByApprovalDesc(a: PastProject, b: PastProject): number {
  const ta = approvalTime(a);
  const tb = approvalTime(b);
  if (ta !== null && tb !== null) return tb - ta;
  if (ta !== null && tb === null) return -1;
  if (ta === null && tb !== null) return 1;
  return 0;
}

export function sortPastProjectsRecapRows(rows: PastProject[]): PastProject[] {
  return [...rows].sort((a, b) => {
    const ra = statusRank(a.status);
    const rb = statusRank(b.status);
    if (ra !== rb) return ra - rb;
    return compareByApprovalDesc(a, b);
  });
}
