// ─── Core shared types ───────────────────────────────────────────────────────

export type ApprovalType =
  | "Project"
  | "Plafond"
  | "Project+Plafond"
  | "PO/Invoice+Plafond"
  | "PO/Invoice";

export type ReturnType =
  | "Revenue Share (Time-Capped)"
  | "Revenue Share (Return-Capped)"
  | "Fixed Return"
  | "Daily Interest";

export type ProjectStatus =
  | "Proposed"
  | "IC Review"
  | "Pending IC submission"
  | "Active"
  | "Completed"
  | "Rescheduled"
  | "Rejected";

export type ICVote = "Approve" | "Reject" | "Abstain" | null;

// ─── Sub-entities ─────────────────────────────────────────────────────────────

export interface PICInfo {
  submitter: string;
  primaryAnalyst: string;
  secondaryAnalyst: string | null;
}

export interface PlafondInfo {
  // Proposed (only if approval type includes Plafond)
  proposed: {
    totalLimit: number;
    poSubLimit: number;
    wcSubLimit: number;
  } | null;
  // Current
  current: {
    totalLimit: number;
    poSubLimit: number;
    wcSubLimit: number;
    effectiveDate: string; // ISO date
    expiryDate: string; // ISO date
    limitStatus: "Active" | "Expired" | "None";
  } | null;
  // Outstanding & remaining (from Brand / Reporting Layer)
  outstandingTotal: number;
  remainingTotal: number;
  remainingPO: number;
  remainingWC: number;
  // Superseded (new app feature)
  superseded: Array<{
    totalLimit: number;
    poSubLimit: number;
    wcSubLimit: number;
    effectiveDate: string;
    expiryDate: string;
  }>;
}

export interface FinancialReview {
  submissionDate: string; // ISO date
  financialReportsReviewed: string;
  periodEndingDate: string; // ISO date
  limitRecommendation: "Keep" | "Increase" | "Decrease";
  reviewNotes: string; // markdown / plain text proxy for canvas
}

export interface KPContact {
  id: string;
  name: string;
  role: string;
  notesOnPerson: string;
  referredProjects: string[];
  associatedKPs: string[];
  isKeyPerson: boolean;
  slikFileUrl: string | null;
  slikExecSummary: string | null;
  uboExposure: number; // IDR
}

export interface OverdueEvent {
  dueDate: string; // ISO date
  daysOverdue: number;
  status: "Paid" | "Unpaid";
}

export interface PastProject {
  id: string;
  projectName: string;
  status: ProjectStatus;
  /**
   * IC approval date for this project (ISO). Used to sort recap rows newest-first within the same status.
   */
  icApprovalDate: string | null;
  /** When true, this row is the Proposed project for the IC page being viewed (always shown in the recap table). */
  isCurrentSubmission?: boolean;
  returnType: ReturnType;
  amount: number;
  outstandingAmount: number;
  projectedTermMonths: number;
  otfTermMonths: number | null; // actual term if completed
  otfIRR: number | null; // percentage, e.g. 18.5
  projectedIRR: number;
  otfMOIC: null; // not available
  projectedMOIC: string; // e.g. "1.3x"
  projectedBEPMonths: number;
  currentDPD: number;
  maxDPD: number;
  overdueHistory?: OverdueEvent[];
}

export interface DisbursementRow {
  tranche: number;
  plannedAmount: number;
  plannedDate: string; // ISO date
}

export interface BranchInfo {
  id: string;
  name: string;
  area: string;
  gmapsLink: string | null;
  notes: string;
  type: "Opening Branch" | "Accruing Branch";
}

export interface RevenueShareTerms {
  sourceOfRevenueAccrued: string;
  frequency: string;
  dueDate: string;
  capType: "Return Cap" | "Time Cap";
  capMultiple: number | null; // x times
  capTimePeriodMonths: number | null;
  revShareStartType: "Anchored to Branch Opening" | "Fixed";
  revShareStartDate: string | null;
  preBEPRevSharePct: number;
  postBEPRevSharePct: number;
  carryType: string;
  carryPct: number;
  minReturn: number | null; // pct
  minReturnMultiple: number | null;
  minReturnPayableMonths: number | null;
  revProjectionArray: Array<{ month: number; revenue: number }>;
}

export interface FixedReturnTerms {
  repaymentSchedule: Array<{ month: number; amount: number }>;
  totalRepayment: number;
  totalPrincipal: number;
  totalInterest: number;
  carry: number;
}

/** PO / invoice-style daily interest (Coda: Daily Interest return type) */
export interface DailyInterestTerms {
  interestRate30DayPct: number;
  serviceFee30DayPct: number;
  tenorDays: number;
  minInterestPeriodDays: number;
  serviceFeeDailyBasis: string;
}

export interface PTInfo {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  accountholderName: string;
  slikFileUrl: string | null;
  slikExecSummary: string | null;
  warnings: string[];
}

export interface ICVoteRecord {
  memberId: string;
  memberName: string;
  isPrincipal: boolean;
  vote: ICVote;
  votedAt: string | null;
}

// ─── Root project type ────────────────────────────────────────────────────────

export interface ICProject {
  id: string;
  /** Source Coda Project row id when seeded from production */
  codaRowId?: string;
  // Header
  brandName: string;
  brandIsNew: boolean;
  projectName: string;
  approvalType: ApprovalType;
  submittedAt: string; // ISO date

  // PIC
  pic: PICInfo;

  // Project details
  projectNumberForKP: number; // "Project # for KP"
  brandActiveProjects: number;
  brandCompletedProjects: number;
  brandBeforeICProjects: number;
  brandPendingDisbursementProjects: number;
  mainSector: string;
  subSector: string | null;
  syariah: boolean;
  assetClass: string;
  requestedAmountCurrency: "IDR" | "USD";
  requestedAmount: number;
  /**
   * When set, this is the PO / tranche project target (e.g. Coda IDR/USD Project Target Amount).
   * For PO/Invoice + Plafond, `requestedAmount` may instead represent the net plafond increase while this holds the tranche size.
   */
  trancheTargetAmount?: number;
  /** When set (e.g. PO/Invoice + Plafond), IC vote-count rules use this IDR amount instead of `requestedAmount`. */
  icVoteBasisAmount?: number;
  amountWarning: string | null;
  financingUse: string;
  sectorWarning: string | null;

  // Plafond
  plafond: PlafondInfo;

  // Financial reviews (last 2)
  financialReviews: FinancialReview[];

  // KP details
  referralSource: string;
  specificReferror: string | null;
  referrorBelongsToKP: string | null;
  /**
   * When `referralSource` is the sentinel "2nd+ project", show this snapshot (first project’s referral) instead.
   */
  firstProjectReferralOverride?: {
    referralSource: string;
    specificReferror: string | null;
    referrorBelongsToKP: string | null;
  } | null;
  otherReferees: string[];

  /** Underwriting model: projected break-even in months (Coda Project). Shown with revenue share terms. */
  submissionProjectedBEPMonths?: number | null;

  // KP contacts
  kpContacts: KPContact[];

  // Past & proposed projects
  pastProjects: PastProject[];

  // Project terms
  returnType: ReturnType;
  disbursements: DisbursementRow[];
  branches: BranchInfo[];
  revenueShareTerms: RevenueShareTerms | null;
  fixedReturnTerms: FixedReturnTerms | null;
  dailyInterestTerms?: DailyInterestTerms | null;
  lateFee: {
    basis: string;
    gracePeriodDays: number;
    dailyPctInvestors: number;
    dailyPctASN: number;
  };
  termSheetLink: string | null;

  // Credit memo & notes
  kpCreditMemo: string;
  projectCreditMemo: string;
  financialsLink: string | null;
  projectNotes: Array<{ author: string; date: string; content: string }>;

  // PT
  ptDetails: PTInfo[];

  // Approval
  fundingSource: string;
  bankDetailsReviewed: boolean;
  taxWithholdings: "Yes" | "No" | "TBD";
  icVotes: ICVoteRecord[];
  approvalNotes: string;
  specialNotesForIC: string | null;
  conditionsSubsequent: string[];
}
