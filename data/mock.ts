import { ICProject } from "./types";

// ─── Project A ────────────────────────────────────────────────────────────────
// Asset A (F&B), Revenue Share, NEW KP — plafond requested, first project
// Triggers: "New KP" tag, plafond warning (proposed > current = none)

const projectA: ICProject = {
  id: "proj-a",
  brandName: "Warung Sehat Nusantara",
  brandIsNew: true,
  projectName: "Warung Sehat Nusantara — Flagship Branch, Menteng",
  approvalType: "Project+Plafond",
  submittedAt: "2026-04-01T09:00:00Z",

  pic: {
    submitter: "Dito Prasetyo",
    primaryAnalyst: "Dito Prasetyo",
    secondaryAnalyst: null,
  },

  projectNumberForKP: 1,
  brandActiveProjects: 0,
  brandCompletedProjects: 0,
  brandBeforeICProjects: 0,
  brandPendingDisbursementProjects: 0,
  mainSector: "F&B",
  subSector: "Casual Dining",
  syariah: false,
  assetClass: "Asset A",
  requestedAmountCurrency: "IDR",
  requestedAmount: 1_500_000_000,
  amountWarning: null,
  financingUse: "Working Capital",
  sectorWarning: null,

  plafond: {
    proposed: {
      totalLimit: 3_000_000_000,
      poSubLimit: 0,
      wcSubLimit: 3_000_000_000,
    },
    current: null,
    outstandingTotal: 0,
    remainingTotal: 3_000_000_000,
    remainingPO: 0,
    remainingWC: 3_000_000_000,
    superseded: [],
  },

  financialReviews: [
    {
      submissionDate: "2026-02-10",
      financialReportsReviewed: "Audited 2024",
      periodEndingDate: "2024-12-31",
      limitRecommendation: "Increase",
      reviewNotes:
        "Strong revenue growth of 35% YoY. Gross margin stable at 62%. Recommend increasing limit to IDR 3B to support expansion.",
    },
  ],

  referralSource: "KarmaClub Member",
  specificReferror: "Budi Santoso",
  referrorBelongsToKP: "Santoso Group",
  otherReferees: ["Santoso Group"],

  kpContacts: [
    {
      id: "kpc-a1",
      name: "Rina Wijaya",
      role: "Director / Owner",
      notesOnPerson: "Founder and managing director. 12 years in F&B industry. Previously ran Bumbu Nusantara chain (divested 2021).",
      referredProjects: [],
      associatedKPs: [],
      isKeyPerson: true,
      slikFileUrl: "https://drive.google.com/file/slik-rina-wijaya",
      slikExecSummary:
        "No adverse credit history. No outstanding consumer loans. Clean SLIK as of March 2026.",
      uboExposure: 0,
    },
    {
      id: "kpc-a2",
      name: "Andi Wijaya",
      role: "Spouse / Co-owner",
      notesOnPerson: "Co-owner, not operationally active. Holds 40% shareholding.",
      referredProjects: [],
      associatedKPs: [],
      isKeyPerson: false,
      slikFileUrl: "https://drive.google.com/file/slik-andi-wijaya",
      slikExecSummary: "No adverse credit history.",
      uboExposure: 0,
    },
  ],

  pastProjects: [
    {
      id: "pp-a1",
      projectName: "Warung Sehat Nusantara — Flagship Branch, Menteng [PROPOSED]",
      status: "Proposed",
      returnType: "Revenue Share (Time-Capped)",
      amount: 1_500_000_000,
      outstandingAmount: 0,
      projectedTermMonths: 24,
      otfIRR: null,
      projectedIRR: 18.5,
      otfMOIC: null,
      projectedMOIC: "1.37x",
      projectedBEPMonths: 14,
      currentDPD: 0,
      maxDPD: 0,
    },
  ],

  returnType: "Revenue Share (Time-Capped)",
  disbursements: [
    { tranche: 1, plannedAmount: 750_000_000, plannedDate: "2026-05-01" },
    { tranche: 2, plannedAmount: 750_000_000, plannedDate: "2026-07-01" },
  ],
  branches: [
    {
      id: "br-a1",
      name: "Menteng Flagship",
      area: "Jakarta Pusat",
      gmapsLink: "https://maps.google.com/?q=Menteng+Jakarta",
      notes: "1-storey shophouse. 120 sqm. 60 covers. Target opening May 2026.",
      type: "Opening Branch",
    },
  ],
  revenueShareTerms: {
    sourceOfRevenueAccrued: "Gross Revenue",
    frequency: "Monthly",
    dueDate: "10th of each month",
    capType: "Time Cap",
    capMultiple: null,
    capTimePeriodMonths: 24,
    revShareStartType: "Anchored to Branch Opening",
    revShareStartDate: null,
    preBEPRevSharePct: 8,
    postBEPRevSharePct: 5,
    carryType: "Fixed Platform Fee",
    carryPct: 1.5,
    minReturn: 15,
    minReturnMultiple: null,
    minReturnPayableMonths: 18,
    revProjectionArray: [
      { month: 1, revenue: 90_000_000 },
      { month: 2, revenue: 105_000_000 },
      { month: 3, revenue: 120_000_000 },
      { month: 6, revenue: 145_000_000 },
      { month: 12, revenue: 160_000_000 },
      { month: 18, revenue: 170_000_000 },
      { month: 24, revenue: 175_000_000 },
    ],
  },
  fixedReturnTerms: null,
  lateFee: {
    basis: "Overdue Amount",
    gracePeriodDays: 5,
    dailyPctInvestors: 0.1,
    dailyPctASN: 0.05,
  },
  termSheetLink: "https://drive.google.com/file/term-sheet-wsn",

  kpCreditMemo:
    "**KP Credit Memo — Warung Sehat Nusantara**\n\nNew KP. No prior financing history with KarmaClub. Referred by existing member Budi Santoso (Santoso Group). Background check clean. SLIK clean for all key persons. Business has been operating for 3 years with stable revenue trajectory.",
  projectCreditMemo:
    "**Project Credit Memo — Menteng Flagship**\n\nFirst project for this KP. Revenue Share time-capped at 24 months. Single flagship branch opening. Location in Menteng — strong foot traffic area. Lease agreement signed. Pre-opening costs within budget.",
  financialsLink: null,
  projectNotes: [
    {
      author: "Dito Prasetyo",
      date: "2026-04-01",
      content: "Submitted for IC review. All documents complete. Financials reviewed by Finance team on Feb 10.",
    },
  ],

  ptDetails: [
    {
      id: "pt-a1",
      name: "PT Sehat Nusantara Abadi",
      bank: "BCA",
      accountNumber: "1234567890",
      accountholderName: "PT Sehat Nusantara Abadi",
      slikFileUrl: "https://drive.google.com/file/slik-pt-sna",
      slikExecSummary: "No adverse credit history. No outstanding corporate loans. Clean SLIK as of March 2026.",
      warnings: [],
    },
  ],

  fundingSource: "KF & KCF",
  bankDetailsReviewed: false,
  taxWithholdings: "Yes",
  icVotes: [
    { memberId: "ic-1", memberName: "Edwin M.", vote: null, votedAt: null },
    { memberId: "ic-2", memberName: "Santi R.", vote: null, votedAt: null },
    { memberId: "ic-3", memberName: "Hendra K.", vote: null, votedAt: null },
  ],
  approvalNotes: "",
  specialNotesForIC:
    "New KP with no prior KarmaClub history. Referral from trusted member. Strong unit economics projected. Please review SLIK summaries carefully.",
  conditionsSubsequent: [
    "Submit executed lease agreement before first disbursement",
    "Submit updated financial statements (Q1 2026) before second disbursement",
  ],
};

// ─── Project C ────────────────────────────────────────────────────────────────
// Asset C (Retail), Fixed Return, KP with 3 prior projects (1 with DPD history)
// Triggers: DPD warning on past project, stale financial review

const projectC: ICProject = {
  id: "proj-c",
  brandName: "Kopi Kencana",
  brandIsNew: false,
  projectName: "Kopi Kencana — Bandung Expansion (3 New Outlets)",
  approvalType: "Project",
  submittedAt: "2026-03-28T10:30:00Z",

  pic: {
    submitter: "Laras Putri",
    primaryAnalyst: "Laras Putri",
    secondaryAnalyst: "Wahyu Nugroho",
  },

  projectNumberForKP: 4,
  brandActiveProjects: 1,
  brandCompletedProjects: 2,
  brandBeforeICProjects: 0,
  brandPendingDisbursementProjects: 0,
  mainSector: "F&B",
  subSector: "Coffee Shop",
  syariah: false,
  assetClass: "Asset C",
  requestedAmountCurrency: "IDR",
  requestedAmount: 2_400_000_000,
  amountWarning: null,
  financingUse: "Working Capital",
  sectorWarning: null,

  plafond: {
    proposed: null,
    current: {
      totalLimit: 5_000_000_000,
      poSubLimit: 0,
      wcSubLimit: 5_000_000_000,
      effectiveDate: "2025-01-15",
      expiryDate: "2027-01-15",
      limitStatus: "Active",
    },
    outstandingTotal: 1_800_000_000,
    remainingTotal: 3_200_000_000,
    remainingPO: 0,
    remainingWC: 3_200_000_000,
    superseded: [
      {
        totalLimit: 3_000_000_000,
        poSubLimit: 0,
        wcSubLimit: 3_000_000_000,
        effectiveDate: "2023-06-01",
        expiryDate: "2025-01-14",
      },
    ],
  },

  financialReviews: [
    {
      submissionDate: "2026-01-05",
      financialReportsReviewed: "Management Accounts Q3 2025",
      periodEndingDate: "2025-09-30",
      limitRecommendation: "Keep",
      reviewNotes:
        "Revenue growth 22% YoY. Gross margin slightly compressed at 58% (vs 62% prior year) due to higher COGS. Operating cash flow positive. Recommend keeping limit at IDR 5B pending full-year 2025 audited results.",
    },
    {
      submissionDate: "2024-12-20",
      financialReportsReviewed: "Audited 2023",
      periodEndingDate: "2023-12-31",
      limitRecommendation: "Increase",
      reviewNotes:
        "Strong performance in 2023. Requested limit increase from IDR 3B to IDR 5B to support multi-outlet expansion.",
    },
  ],

  referralSource: "2nd+ project",
  specificReferror: null,
  referrorBelongsToKP: null,
  otherReferees: [],

  kpContacts: [
    {
      id: "kpc-c1",
      name: "Aditya Permana",
      role: "Director / Owner",
      notesOnPerson: "Founder. 8 years in F&B. Managed 3 prior KarmaClub projects successfully.",
      referredProjects: [],
      associatedKPs: [],
      isKeyPerson: true,
      slikFileUrl: "https://drive.google.com/file/slik-aditya",
      slikExecSummary:
        "Existing consumer loan at BRI (performing). No adverse history. SLIK as of Feb 2026.",
      uboExposure: 1_800_000_000,
    },
    {
      id: "kpc-c2",
      name: "Dewi Permana",
      role: "Spouse",
      notesOnPerson: "Spouse. Not operationally involved.",
      referredProjects: [],
      associatedKPs: [],
      isKeyPerson: false,
      slikFileUrl: "https://drive.google.com/file/slik-dewi",
      slikExecSummary: "No outstanding loans. Clean SLIK.",
      uboExposure: 0,
    },
  ],

  pastProjects: [
    {
      id: "pp-c1",
      projectName: "Kopi Kencana — Jakarta Flagship",
      status: "Completed",
      returnType: "Revenue Share (Time-Capped)",
      amount: 800_000_000,
      outstandingAmount: 0,
      projectedTermMonths: 18,
      otfIRR: 19.2,
      projectedIRR: 17.0,
      otfMOIC: null,
      projectedMOIC: "1.26x",
      projectedBEPMonths: 11,
      currentDPD: 0,
      maxDPD: 0,
    },
    {
      id: "pp-c2",
      projectName: "Kopi Kencana — Depok Branch",
      status: "Completed",
      returnType: "Revenue Share (Time-Capped)",
      amount: 600_000_000,
      outstandingAmount: 0,
      projectedTermMonths: 18,
      otfIRR: 14.8,
      projectedIRR: 17.0,
      otfMOIC: null,
      projectedMOIC: "1.26x",
      projectedBEPMonths: 12,
      currentDPD: 0,
      maxDPD: 45,
    },
    {
      id: "pp-c3",
      projectName: "Kopi Kencana — Surabaya Expansion",
      status: "Active",
      returnType: "Fixed Return",
      amount: 1_800_000_000,
      outstandingAmount: 1_800_000_000,
      projectedTermMonths: 24,
      otfIRR: 16.1,
      projectedIRR: 16.5,
      otfMOIC: null,
      projectedMOIC: "1.33x",
      projectedBEPMonths: 15,
      currentDPD: 0,
      maxDPD: 0,
    },
    {
      id: "pp-c4",
      projectName: "Kopi Kencana — Bandung Expansion (3 New Outlets) [PROPOSED]",
      status: "Proposed",
      returnType: "Fixed Return",
      amount: 2_400_000_000,
      outstandingAmount: 0,
      projectedTermMonths: 24,
      otfIRR: null,
      projectedIRR: 16.5,
      otfMOIC: null,
      projectedMOIC: "1.33x",
      projectedBEPMonths: 16,
      currentDPD: 0,
      maxDPD: 0,
    },
  ],

  returnType: "Fixed Return",
  disbursements: [
    { tranche: 1, plannedAmount: 800_000_000, plannedDate: "2026-05-15" },
    { tranche: 2, plannedAmount: 800_000_000, plannedDate: "2026-07-15" },
    { tranche: 3, plannedAmount: 800_000_000, plannedDate: "2026-09-15" },
  ],
  branches: [
    {
      id: "br-c1",
      name: "Dago Branch",
      area: "Bandung Utara",
      gmapsLink: "https://maps.google.com/?q=Dago+Bandung",
      notes: "Prime location near university district. 80 sqm. 50 covers.",
      type: "Opening Branch",
    },
    {
      id: "br-c2",
      name: "Buah Batu Branch",
      area: "Bandung Selatan",
      gmapsLink: "https://maps.google.com/?q=Buah+Batu+Bandung",
      notes: "Residential area. High delivery demand. 60 sqm.",
      type: "Opening Branch",
    },
    {
      id: "br-c3",
      name: "Cihampelas Branch",
      area: "Bandung Tengah",
      gmapsLink: "https://maps.google.com/?q=Cihampelas+Bandung",
      notes: "Tourist belt. 70 sqm. Weekend traffic high.",
      type: "Opening Branch",
    },
  ],
  revenueShareTerms: null,
  fixedReturnTerms: {
    repaymentSchedule: [
      { month: 6, amount: 600_000_000 },
      { month: 12, amount: 600_000_000 },
      { month: 18, amount: 600_000_000 },
      { month: 24, amount: 792_000_000 },
    ],
    totalRepayment: 2_592_000_000,
    totalPrincipal: 2_400_000_000,
    totalInterest: 192_000_000,
    carry: 48_000_000,
  },
  lateFee: {
    basis: "Overdue Amount",
    gracePeriodDays: 5,
    dailyPctInvestors: 0.1,
    dailyPctASN: 0.05,
  },
  termSheetLink: "https://drive.google.com/file/term-sheet-kopi-kencana",

  kpCreditMemo:
    "**KP Credit Memo — Kopi Kencana**\n\nExisting KP with 3 prior projects (2 completed, 1 active). Jakarta flagship completed ahead of term with strong OTF IRR of 19.2%. Depok branch had a minor DPD episode (max 45 days, resolved). Surabaya project tracking well at month 14. Overall credit history positive.",
  projectCreditMemo:
    "**Project Credit Memo — Bandung Expansion**\n\n4th project. Multi-outlet expansion to Bandung. Fixed Return structure. 3 tranches aligned to opening timeline. All location leases signed. SLIK checks for all key persons completed.",
  financialsLink: "https://drive.google.com/folder/kopi-kencana-financials",
  projectNotes: [
    {
      author: "Laras Putri",
      date: "2026-03-28",
      content: "Submitted for IC. Note: Depok branch had DPD up to 45 days in month 16 — was resolved by month 18 ahead of maturity. KP has been proactive in communications.",
    },
    {
      author: "Wahyu Nugroho",
      date: "2026-03-25",
      content: "Site visits to all 3 Bandung locations completed. Leases reviewed. All in order.",
    },
  ],

  ptDetails: [
    {
      id: "pt-c1",
      name: "PT Kencana Kopi Nusantara",
      bank: "Mandiri",
      accountNumber: "9876543210",
      accountholderName: "PT Kencana Kopi Nusantara",
      slikFileUrl: "https://drive.google.com/file/slik-pt-kkn",
      slikExecSummary: "No adverse history. Existing loan at Mandiri (performing). Clean SLIK.",
      warnings: [],
    },
  ],

  fundingSource: "KF & KCF",
  bankDetailsReviewed: false,
  taxWithholdings: "Yes",
  icVotes: [
    { memberId: "ic-1", memberName: "Edwin M.", vote: null, votedAt: null },
    { memberId: "ic-2", memberName: "Santi R.", vote: null, votedAt: null },
    { memberId: "ic-3", memberName: "Hendra K.", vote: null, votedAt: null },
  ],
  approvalNotes: "",
  specialNotesForIC: null,
  conditionsSubsequent: [
    "Submit executed leases for all 3 branches before disbursement tranche 1",
    "Submit Q1 2026 management accounts before disbursement tranche 2",
  ],
};

// ─── Project D ────────────────────────────────────────────────────────────────
// Asset D (Manufacturing), Revenue Share, multi-tranche, limit nearly exhausted
// Triggers: negative remaining limit warning (proposed exceeds headroom), SLIK missing

const projectD: ICProject = {
  id: "proj-d",
  brandName: "Batik Pesona Nusantara",
  brandIsNew: false,
  projectName: "Batik Pesona Nusantara — Production Capacity Expansion",
  approvalType: "Project+Plafond",
  submittedAt: "2026-04-03T14:00:00Z",

  pic: {
    submitter: "Raka Firmansyah",
    primaryAnalyst: "Raka Firmansyah",
    secondaryAnalyst: "Laras Putri",
  },

  projectNumberForKP: 3,
  brandActiveProjects: 1,
  brandCompletedProjects: 1,
  brandBeforeICProjects: 0,
  brandPendingDisbursementProjects: 0,
  mainSector: "Manufacturing",
  subSector: "Textile",
  syariah: true,
  assetClass: "Asset D",
  requestedAmountCurrency: "IDR",
  requestedAmount: 4_500_000_000,
  amountWarning: "Requested amount exceeds current remaining limit by IDR 500,000,000. Plafond increase required.",
  financingUse: "Capital Expenditure",
  sectorWarning: null,

  plafond: {
    proposed: {
      totalLimit: 7_000_000_000,
      poSubLimit: 2_000_000_000,
      wcSubLimit: 5_000_000_000,
    },
    current: {
      totalLimit: 5_000_000_000,
      poSubLimit: 1_500_000_000,
      wcSubLimit: 3_500_000_000,
      effectiveDate: "2024-09-01",
      expiryDate: "2026-09-01",
      limitStatus: "Active",
    },
    outstandingTotal: 4_600_000_000,
    remainingTotal: -100_000_000, // ← negative! triggers warning
    remainingPO: 1_500_000_000,
    remainingWC: -1_600_000_000, // ← negative!
    superseded: [
      {
        totalLimit: 3_000_000_000,
        poSubLimit: 1_000_000_000,
        wcSubLimit: 2_000_000_000,
        effectiveDate: "2023-03-01",
        expiryDate: "2024-08-31",
      },
    ],
  },

  financialReviews: [
    {
      submissionDate: "2025-09-15",
      financialReportsReviewed: "Audited 2024",
      periodEndingDate: "2024-12-31",
      limitRecommendation: "Increase",
      reviewNotes:
        "Revenue grew 40% to IDR 28B. EBITDA margin 18%. Strong export orders for 2026 already contracted. Recommend limit increase to IDR 7B to support production capacity.",
    },
    {
      submissionDate: "2024-08-20",
      financialReportsReviewed: "Audited 2023",
      periodEndingDate: "2023-12-31",
      limitRecommendation: "Increase",
      reviewNotes:
        "Good performance. Revenue IDR 20B. Requested and approved limit increase to IDR 5B.",
    },
  ],

  referralSource: "Karmapreneur",
  specificReferror: "Yosua Halim",
  referrorBelongsToKP: "Halim Batik Group",
  otherReferees: ["Batik Indah Solo", "Halim Batik Group"],

  kpContacts: [
    {
      id: "kpc-d1",
      name: "Siti Rahayu",
      role: "Director / Owner",
      notesOnPerson: "Founder. 20 years in batik manufacturing. Export relationships in Japan and Australia.",
      referredProjects: [],
      associatedKPs: [],
      isKeyPerson: true,
      slikFileUrl: "https://drive.google.com/file/slik-siti",
      slikExecSummary:
        "No adverse credit history. Property mortgage at BNI (performing). SLIK as of March 2026.",
      uboExposure: 4_600_000_000,
    },
    {
      id: "kpc-d2",
      name: "Agus Rahayu",
      role: "Operations Manager",
      notesOnPerson: "Son of founder. Handles day-to-day operations and export logistics.",
      referredProjects: [],
      associatedKPs: [],
      isKeyPerson: true,
      slikFileUrl: null, // ← SLIK MISSING — triggers warning
      slikExecSummary: null,
      uboExposure: 0,
    },
  ],

  pastProjects: [
    {
      id: "pp-d1",
      projectName: "Batik Pesona — Initial Working Capital",
      status: "Completed",
      returnType: "Revenue Share (Return-Capped)",
      amount: 2_000_000_000,
      outstandingAmount: 0,
      projectedTermMonths: 20,
      otfIRR: 21.3,
      projectedIRR: 19.0,
      otfMOIC: null,
      projectedMOIC: "1.32x",
      projectedBEPMonths: 14,
      currentDPD: 0,
      maxDPD: 0,
    },
    {
      id: "pp-d2",
      projectName: "Batik Pesona — Export Order Financing",
      status: "Active",
      returnType: "Revenue Share (Return-Capped)",
      amount: 4_600_000_000,
      outstandingAmount: 4_600_000_000,
      projectedTermMonths: 24,
      otfIRR: 19.5,
      projectedIRR: 19.0,
      otfMOIC: null,
      projectedMOIC: "1.38x",
      projectedBEPMonths: 16,
      currentDPD: 0,
      maxDPD: 0,
    },
    {
      id: "pp-d3",
      projectName: "Batik Pesona — Production Capacity Expansion [PROPOSED]",
      status: "Proposed",
      returnType: "Revenue Share (Return-Capped)",
      amount: 4_500_000_000,
      outstandingAmount: 0,
      projectedTermMonths: 30,
      otfIRR: null,
      projectedIRR: 19.5,
      otfMOIC: null,
      projectedMOIC: "1.49x",
      projectedBEPMonths: 18,
      currentDPD: 0,
      maxDPD: 0,
    },
  ],

  returnType: "Revenue Share (Return-Capped)",
  disbursements: [
    { tranche: 1, plannedAmount: 1_500_000_000, plannedDate: "2026-05-01" },
    { tranche: 2, plannedAmount: 1_500_000_000, plannedDate: "2026-07-01" },
    { tranche: 3, plannedAmount: 1_500_000_000, plannedDate: "2026-09-01" },
  ],
  branches: [],
  revenueShareTerms: {
    sourceOfRevenueAccrued: "Export Revenue",
    frequency: "Monthly",
    dueDate: "15th of each month",
    capType: "Return Cap",
    capMultiple: 1.49,
    capTimePeriodMonths: null,
    revShareStartType: "Fixed",
    revShareStartDate: "2026-05-01",
    preBEPRevSharePct: 10,
    postBEPRevSharePct: 6,
    carryType: "Fixed Platform Fee",
    carryPct: 2.0,
    minReturn: 18,
    minReturnMultiple: 1.18,
    minReturnPayableMonths: 24,
    revProjectionArray: [
      { month: 1, revenue: 700_000_000 },
      { month: 3, revenue: 1_200_000_000 },
      { month: 6, revenue: 1_800_000_000 },
      { month: 12, revenue: 2_200_000_000 },
      { month: 18, revenue: 2_500_000_000 },
      { month: 24, revenue: 2_600_000_000 },
      { month: 30, revenue: 2_700_000_000 },
    ],
  },
  fixedReturnTerms: null,
  lateFee: {
    basis: "Overdue Amount",
    gracePeriodDays: 5,
    dailyPctInvestors: 0.1,
    dailyPctASN: 0.05,
  },
  termSheetLink: "https://drive.google.com/file/term-sheet-batik-pesona",

  kpCreditMemo:
    "**KP Credit Memo — Batik Pesona Nusantara**\n\nExisting KP. Project 1 completed ahead of term with excellent OTF IRR of 21.3%. Project 2 (active) tracking well at month 10. Strong export business with contracted orders. Management team experienced. Key risk: concentration in textile export; USD/IDR exposure.",
  projectCreditMemo:
    "**Project Credit Memo — Production Capacity Expansion**\n\n3rd project. Capacity expansion to capture contracted export orders. Revenue Share return-capped at 1.49x. Plafond increase requested to IDR 7B. Note: SLIK for Agus Rahayu (Operations Manager, Key Person) still pending — must be received before approval.",
  financialsLink: "https://drive.google.com/folder/batik-pesona-financials",
  projectNotes: [
    {
      author: "Raka Firmansyah",
      date: "2026-04-03",
      content: "Submitted for IC. Note: SLIK for Agus Rahayu still outstanding — follow-up sent. Expected by April 10.",
    },
    {
      author: "Laras Putri",
      date: "2026-04-02",
      content: "Financial model reviewed. Revenue projections conservative relative to contracted order book.",
    },
  ],

  ptDetails: [
    {
      id: "pt-d1",
      name: "PT Batik Pesona Nusantara",
      bank: "BNI",
      accountNumber: "1122334455",
      accountholderName: "PT Batik Pesona Nusantara",
      slikFileUrl: "https://drive.google.com/file/slik-pt-bpn",
      slikExecSummary:
        "Existing corporate loan at BNI (performing). SLIK clean as of March 2026.",
      warnings: [],
    },
  ],

  fundingSource: "KF & KCF",
  bankDetailsReviewed: false,
  taxWithholdings: "Yes",
  icVotes: [
    { memberId: "ic-1", memberName: "Edwin M.", vote: null, votedAt: null },
    { memberId: "ic-2", memberName: "Santi R.", vote: null, votedAt: null },
    { memberId: "ic-3", memberName: "Hendra K.", vote: null, votedAt: null },
  ],
  approvalNotes: "",
  specialNotesForIC:
    "⚠️ SLIK for Agus Rahayu (Key Person) is still pending. IC may wish to defer final approval until received. Plafond breach on current WC sub-limit — increase is required before disbursement.",
  conditionsSubsequent: [
    "Submit SLIK for Agus Rahayu before approval is finalised",
    "Limit increase to IDR 7B to be formalised before first disbursement",
    "Submit executed purchase orders for export contracts",
  ],
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const mockProjects: ICProject[] = [projectA, projectC, projectD];

export function getProjectById(id: string): ICProject | undefined {
  return mockProjects.find((p) => p.id === id);
}
