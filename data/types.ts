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
  | "Fixed Return";

export type ProjectStatus =
  | "Proposed"
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

export interface PastProject {
  id: string;
  projectName: string;
  status: ProjectStatus;
  returnType: ReturnType;
  amount: number;
  outstandingAmount: number;
  projectedTermMonths: number;
  otfIRR: number | null; // percentage, e.g. 18.5
  projectedIRR: number;
  otfMOIC: null; // not available
  projectedMOIC: string; // e.g. "1.3x"
  projectedBEPMonths: number;
  currentDPD: number;
  maxDPD: number;
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
  vote: ICVote;
  votedAt: string | null;
}

// ─── Root project type ────────────────────────────────────────────────────────

export interface ICProject {
  id: string;
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
  otherReferees: string[];

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
