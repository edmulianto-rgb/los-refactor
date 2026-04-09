import { ICProject } from "./types";

// ─── Project A ────────────────────────────────────────────────────────────────
// Mie Gacoan-style F&B brand — Asset A, Revenue Share, first-time KP
// Referred by an existing KarmaClub member. Requesting plafond alongside first project.
// Triggers: "New KP" tag, no current plafond

const projectA: ICProject = {
  id: "proj-a",
  brandName: "Nasi Goreng Mafia",
  brandIsNew: true,
  projectName: "Nasi Goreng Mafia — Opening Branch #1, Kelapa Gading",
  approvalType: "Project+Plafond",
  submittedAt: "2026-04-03T09:15:00Z",

  pic: {
    submitter: "Rafi Ananda",
    primaryAnalyst: "Rafi Ananda",
    secondaryAnalyst: null,
  },

  projectNumberForKP: 1,
  brandActiveProjects: 0,
  brandCompletedProjects: 0,
  brandBeforeICProjects: 0,
  brandPendingDisbursementProjects: 0,
  mainSector: "F&B",
  subSector: "Quick Service Restaurant",
  syariah: false,
  assetClass: "Asset A",
  requestedAmountCurrency: "IDR",
  requestedAmount: 1_200_000_000,
  amountWarning: null,
  financingUse: "Working Capital",
  sectorWarning: null,

  plafond: {
    proposed: {
      totalLimit: 2_500_000_000,
      poSubLimit: 0,
      wcSubLimit: 2_500_000_000,
    },
    current: null,
    outstandingTotal: 0,
    remainingTotal: 2_500_000_000,
    remainingPO: 0,
    remainingWC: 2_500_000_000,
    superseded: [],
  },

  financialReviews: [
    {
      submissionDate: "2026-03-05",
      financialReportsReviewed: "Management Accounts Jan–Dec 2025",
      periodEndingDate: "2025-12-31",
      limitRecommendation: "Increase",
      reviewNotes:
        "Brand operates a ghost kitchen out of Kelapa Gading since mid-2024 — revenue has grown consistently month-over-month, averaging IDR 280jt/month in Q4 2025 with ~62% gross margin. Owner plans to convert to dine-in in the same location. Full year 2025 P&L and bank statements reviewed. No outstanding debt. Recommend approving plafond of IDR 2.5B to support first branch + optionality for a second.",
    },
  ],

  referralSource: "KarmaClub Member",
  specificReferror: "Hendra Gunawan",
  referrorBelongsToKP: "Kopi Tuku (KarmaClub KP)",
  otherReferees: ["Kopi Tuku"],

  kpContacts: [
    {
      id: "kpc-a1",
      name: "Bagas Wibowo",
      role: "Founder / Director",
      notesOnPerson:
        "Founder, 34 years old. Previously ops manager at Mie Gacoan for 4 years before leaving to start this brand in 2024. Hands-on — manages kitchen and supplier relationships directly. Wife is silent co-owner.",
      referredProjects: [],
      associatedKPs: [],
      isKeyPerson: true,
      slikFileUrl: "https://drive.google.com/file/slik-bagas-wibowo",
      slikExecSummary:
        "KTP Jakarta Utara. No consumer loans in system. KPR application at BTN 2021 was rejected — no adverse flag, just insufficient income at the time. SLIK bersih per Maret 2026.",
      uboExposure: 0,
    },
    {
      id: "kpc-a2",
      name: "Dewi Wibowo",
      role: "Co-owner (spouse)",
      notesOnPerson: "Silent co-owner. Holds 30% share. Not operationally involved.",
      referredProjects: [],
      associatedKPs: [],
      isKeyPerson: false,
      slikFileUrl: "https://drive.google.com/file/slik-dewi-wibowo",
      slikExecSummary: "KTP Tangerang Selatan. Kredit motor lunas 2023. Tidak ada catatan negatif.",
      uboExposure: 0,
    },
  ],

  pastProjects: [
    {
      id: "pp-a1",
      projectName: "Nasi Goreng Mafia — Opening Branch #1, Kelapa Gading [PROPOSED]",
      status: "Proposed",
      returnType: "Revenue Share (Time-Capped)",
      amount: 1_200_000_000,
      outstandingAmount: 0,
      projectedTermMonths: 22,
      otfIRR: null,
      projectedIRR: 18.2,
      otfMOIC: null,
      projectedMOIC: "1.33x",
      projectedBEPMonths: 13,
      currentDPD: 0,
      maxDPD: 0,
    },
  ],

  returnType: "Revenue Share (Time-Capped)",
  disbursements: [
    { tranche: 1, plannedAmount: 700_000_000, plannedDate: "2026-05-15" },
    { tranche: 2, plannedAmount: 500_000_000, plannedDate: "2026-07-15" },
  ],
  branches: [
    {
      id: "br-a1",
      name: "Kelapa Gading — La Piazza Ground Floor",
      area: "Jakarta Utara",
      gmapsLink: "https://maps.google.com/?q=La+Piazza+Kelapa+Gading",
      notes:
        "Konversi ghost kitchen ke dine-in. Space 90m², 55 covers. LOI sudah ditandatangani, lease dimulai 1 Juni 2026. Food court wing — traffic makan siang dan makan malam kuat.",
      type: "Opening Branch",
    },
  ],
  revenueShareTerms: {
    sourceOfRevenueAccrued: "Gross Revenue",
    frequency: "Monthly",
    dueDate: "Tanggal 10 setiap bulan",
    capType: "Time Cap",
    capMultiple: null,
    capTimePeriodMonths: 22,
    revShareStartType: "Anchored to Branch Opening",
    revShareStartDate: null,
    preBEPRevSharePct: 7,
    postBEPRevSharePct: 4.5,
    carryType: "Fixed Platform Fee",
    carryPct: 1.5,
    minReturn: 15,
    minReturnMultiple: null,
    minReturnPayableMonths: 18,
    revProjectionArray: [
      { month: 1, revenue: 180_000_000 },
      { month: 2, revenue: 220_000_000 },
      { month: 3, revenue: 260_000_000 },
      { month: 6, revenue: 295_000_000 },
      { month: 12, revenue: 315_000_000 },
      { month: 18, revenue: 325_000_000 },
      { month: 22, revenue: 330_000_000 },
    ],
  },
  fixedReturnTerms: null,
  lateFee: {
    basis: "Overdue Amount",
    gracePeriodDays: 5,
    dailyPctInvestors: 0.1,
    dailyPctASN: 0.05,
  },
  termSheetLink: "https://drive.google.com/file/termsheet-ngm-branch1",

  kpCreditMemo:
    "**KP Credit Memo — Nasi Goreng Mafia**\n\nNew KP. Brand berdiri Juni 2024 dari ghost kitchen di Kelapa Gading. Revenue tumbuh konsisten — Q4 2025 rata-rata IDR 280jt/bulan gross revenue, GM ~62%. Tidak ada hutang. Referral dari Hendra Gunawan (Kopi Tuku, KP existing dengan track record baik).\n\nOwner Bagas Wibowo memiliki background operasional F&B yang kuat (4 tahun di Mie Gacoan). SLIK bersih. Risiko utama: brand baru, belum ada track record dine-in, ketergantungan tinggi pada founder.",
  projectCreditMemo:
    "**Project Credit Memo — Branch #1 Kelapa Gading**\n\nProyek pertama untuk KP ini. Revenue Share time-capped 22 bulan. Satu branch dine-in di La Piazza Kelapa Gading — konversi dari lokasi ghost kitchen yang existing. LOI sudah signed. Proyeksi revenue konservatif vs track record ghost kitchen karena ada biaya ops tambahan untuk dine-in (staff, utilities). BEP bulan ke-13.",
  financialsLink: "https://drive.google.com/folder/ngm-financials-2025",
  projectNotes: [
    {
      author: "Rafi Ananda",
      date: "2026-04-03",
      content:
        "Submitted. Semua dokumen lengkap. Financial review selesai 5 Maret. LOI sudah ada, lease agreement final sedang di-review lawyer. Ditargetkan signed sebelum Mei.",
    },
    {
      author: "Rafi Ananda",
      date: "2026-03-28",
      content:
        "Site visit ke ghost kitchen — operasi rapi, stok terkelola baik. Sudah coba makanannya, konsisten. Founder sangat hands-on.",
    },
  ],

  ptDetails: [
    {
      id: "pt-a1",
      name: "PT Mafia Kuliner Nusantara",
      bank: "BCA",
      accountNumber: "8820174531",
      accountholderName: "PT Mafia Kuliner Nusantara",
      slikFileUrl: "https://drive.google.com/file/slik-pt-mkn",
      slikExecSummary:
        "PT baru berdiri Oktober 2024. Rekening BCA dibuka November 2024. Tidak ada pinjaman korporat. SLIK bersih.",
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
    "New KP, first project. Ghost kitchen sudah profit — ini adalah ekspansi ke dine-in. Perhatikan bahwa lease agreement belum final signed — CS: submit lease agreement sebelum disbursement tranche pertama.",
  conditionsSubsequent: [
    "Submit executed lease agreement sebelum disbursement tranche 1",
    "Submit updated management accounts Q1 2026 sebelum disbursement tranche 2",
    "Confirm kitchen equipment supplier invoice sebelum disbursement tranche 2",
  ],
};

// ─── Project C ────────────────────────────────────────────────────────────────
// Laundry franchise (B2C + B2B) — Asset C, Fixed Return
// KP has 2 completed projects (1 with DPD history), now requesting 4th outlet
// Triggers: stale financial review, DPD warning on past project

const projectC: ICProject = {
  id: "proj-c",
  brandName: "Laundrynow",
  brandIsNew: false,
  projectName: "Laundrynow — Outlet #4, BSD City (Sektor 7)",
  approvalType: "Project",
  submittedAt: "2026-03-31T11:00:00Z",

  pic: {
    submitter: "Laras Setiawati",
    primaryAnalyst: "Laras Setiawati",
    secondaryAnalyst: "Wahyu Nugroho",
  },

  projectNumberForKP: 4,
  brandActiveProjects: 1,
  brandCompletedProjects: 2,
  brandBeforeICProjects: 0,
  brandPendingDisbursementProjects: 0,
  mainSector: "Services",
  subSector: "Laundry",
  syariah: false,
  assetClass: "Asset C",
  requestedAmountCurrency: "IDR",
  requestedAmount: 950_000_000,
  amountWarning: null,
  financingUse: "Working Capital",
  sectorWarning: null,

  plafond: {
    proposed: null,
    current: {
      totalLimit: 3_000_000_000,
      poSubLimit: 0,
      wcSubLimit: 3_000_000_000,
      effectiveDate: "2025-03-01",
      expiryDate: "2027-03-01",
      limitStatus: "Active",
    },
    outstandingTotal: 1_100_000_000,
    remainingTotal: 1_900_000_000,
    remainingPO: 0,
    remainingWC: 1_900_000_000,
    superseded: [
      {
        totalLimit: 1_800_000_000,
        poSubLimit: 0,
        wcSubLimit: 1_800_000_000,
        effectiveDate: "2023-07-01",
        expiryDate: "2025-02-28",
      },
    ],
  },

  financialReviews: [
    {
      submissionDate: "2026-01-12",
      financialReportsReviewed: "Management Accounts Jan–Sep 2025",
      periodEndingDate: "2025-09-30",
      limitRecommendation: "Keep",
      reviewNotes:
        "Revenue 9 bulan 2025: IDR 3.8B (3 outlet). GM stabil 54%. Outlet #3 (Bintaro) baru buka Agustus 2025, masih ramp-up. Cash flow positif dari outlet #1 (Tangerang Kota) dan #2 (Alam Sutera). Tidak ada perubahan hutang material. Limit dipertahankan IDR 3B — akan di-review kembali setelah ada full-year 2025 dan outlet #3 mature.",
    },
    {
      submissionDate: "2025-02-20",
      financialReportsReviewed: "Audited 2023",
      periodEndingDate: "2023-12-31",
      limitRecommendation: "Increase",
      reviewNotes:
        "Revenue 2023: IDR 2.1B (2 outlet). Laporan audit bersih. Diminta kenaikan limit dari IDR 1.8B ke IDR 3B untuk mendukung rencana ekspansi outlet #3 dan #4.",
    },
  ],

  referralSource: "2nd+ project",
  specificReferror: null,
  referrorBelongsToKP: null,
  otherReferees: [],

  kpContacts: [
    {
      id: "kpc-c1",
      name: "Rizky Pratama",
      role: "Founder / Direktur Utama",
      notesOnPerson:
        "Founder, 38 tahun. Mantan karyawan Elnusa (oil & gas). Mulai Laundrynow 2020 dari 1 outlet di kontrakan, sekarang 3 outlet operasional. Sangat detail soal unit economics, paham P&L per outlet.",
      referredProjects: [],
      associatedKPs: [],
      isKeyPerson: true,
      slikFileUrl: "https://drive.google.com/file/slik-rizky-pratama",
      slikExecSummary:
        "KPR di BNI (aktif, performing). Kartu kredit BCA limit 50jt, utilisasi <30%. Tidak ada catatan negatif. SLIK per Februari 2026.",
      uboExposure: 1_100_000_000,
    },
    {
      id: "kpc-c2",
      name: "Nurul Pratama",
      role: "Direktur Keuangan (istri)",
      notesOnPerson:
        "Istri founder. Handles bookkeeping dan hubungan dengan perbankan. Background akuntansi (S1 Trisakti).",
      referredProjects: [],
      associatedKPs: [],
      isKeyPerson: false,
      slikFileUrl: "https://drive.google.com/file/slik-nurul-pratama",
      slikExecSummary: "KPR bersama suami di BNI. Tidak ada kredit lain. Bersih.",
      uboExposure: 0,
    },
  ],

  pastProjects: [
    {
      id: "pp-c1",
      projectName: "Laundrynow — Outlet #1, Tangerang Kota",
      status: "Completed",
      returnType: "Revenue Share (Time-Capped)",
      amount: 650_000_000,
      outstandingAmount: 0,
      projectedTermMonths: 20,
      otfIRR: 20.1,
      projectedIRR: 17.5,
      otfMOIC: null,
      projectedMOIC: "1.29x",
      projectedBEPMonths: 12,
      currentDPD: 0,
      maxDPD: 0,
    },
    {
      id: "pp-c2",
      projectName: "Laundrynow — Outlet #2, Alam Sutera",
      status: "Completed",
      returnType: "Revenue Share (Time-Capped)",
      amount: 750_000_000,
      outstandingAmount: 0,
      projectedTermMonths: 20,
      otfIRR: 15.3,
      projectedIRR: 17.5,
      otfMOIC: null,
      projectedMOIC: "1.29x",
      projectedBEPMonths: 13,
      currentDPD: 0,
      maxDPD: 52, // ← triggers DPD warning
    },
    {
      id: "pp-c3",
      projectName: "Laundrynow — Outlet #3, Bintaro Sektor 9",
      status: "Active",
      returnType: "Fixed Return",
      amount: 1_100_000_000,
      outstandingAmount: 1_100_000_000,
      projectedTermMonths: 24,
      otfIRR: 16.8,
      projectedIRR: 16.5,
      otfMOIC: null,
      projectedMOIC: "1.33x",
      projectedBEPMonths: 14,
      currentDPD: 0,
      maxDPD: 0,
    },
    {
      id: "pp-c4",
      projectName: "Laundrynow — Outlet #4, BSD City Sektor 7 [PROPOSED]",
      status: "Proposed",
      returnType: "Fixed Return",
      amount: 950_000_000,
      outstandingAmount: 0,
      projectedTermMonths: 24,
      otfIRR: null,
      projectedIRR: 16.5,
      otfMOIC: null,
      projectedMOIC: "1.33x",
      projectedBEPMonths: 14,
      currentDPD: 0,
      maxDPD: 0,
    },
  ],

  returnType: "Fixed Return",
  disbursements: [
    { tranche: 1, plannedAmount: 550_000_000, plannedDate: "2026-05-01" },
    { tranche: 2, plannedAmount: 400_000_000, plannedDate: "2026-07-01" },
  ],
  branches: [
    {
      id: "br-c1",
      name: "BSD City — Sektor 7",
      area: "Tangerang Selatan",
      gmapsLink: "https://maps.google.com/?q=BSD+City+Sektor+7+Tangerang+Selatan",
      notes:
        "Ruko 2 lantai — lantai 1 untuk outlet laundry express, lantai 2 untuk pickup/delivery sorting. 120m² total. BSD merupakan high-income suburban market — mix B2C walk-in dan B2B (kos-kosan, hotel bintang 3). Lease 3 tahun, opsi perpanjang. Rent IDR 120jt/tahun.",
      type: "Opening Branch",
    },
  ],
  revenueShareTerms: null,
  fixedReturnTerms: {
    repaymentSchedule: [
      { month: 6, amount: 237_500_000 },
      { month: 12, amount: 237_500_000 },
      { month: 18, amount: 237_500_000 },
      { month: 24, amount: 315_875_000 },
    ],
    totalRepayment: 1_028_375_000,
    totalPrincipal: 950_000_000,
    totalInterest: 78_375_000,
    carry: 19_000_000,
  },
  lateFee: {
    basis: "Overdue Amount",
    gracePeriodDays: 5,
    dailyPctInvestors: 0.1,
    dailyPctASN: 0.05,
  },
  termSheetLink: "https://drive.google.com/file/termsheet-laundrynow-outlet4",

  kpCreditMemo:
    "**KP Credit Memo — Laundrynow**\n\nKP existing dengan 3 proyek sebelumnya. Outlet #1 (Tangerang Kota) selesai ahead of schedule dengan OTF IRR 20.1%. Outlet #2 (Alam Sutera) selesai dengan OTF IRR lebih rendah dari proyeksi (15.3%) — ada DPD s/d 52 hari di bulan ke-15, diselesaikan di bulan ke-18 sebelum jatuh tempo. KP kooperatif dalam komunikasi waktu itu. Outlet #3 (Bintaro) active, baru 8 bulan berjalan, on track.\n\nFounder Rizky Pratama sangat paham unit economics, disiplin dalam pelaporan. Risiko utama: ekspansi terlalu cepat (4 outlet dalam 5 tahun) — perlu dipastikan kapasitas operasional.",
  projectCreditMemo:
    "**Project Credit Memo — Outlet #4 BSD City**\n\nProyek ke-4. Fixed Return, 2 tranche. Lokasi BSD — pasar mature dengan demand laundry tinggi dari kalangan suburban. Analisis kompetitor: ada 2 laundry kiloan di radius 500m, tapi belum ada yang melayani segmen premium/express. Proyeksi revenue IDR 120-140jt/bulan dari bulan ke-6. BEP bulan ke-14.",
  financialsLink: "https://drive.google.com/folder/laundrynow-financials",
  projectNotes: [
    {
      author: "Laras Setiawati",
      date: "2026-03-31",
      content:
        "Submitted. Note: financial review terakhir per September 2025 — sudah >3 bulan. Full year 2025 belum ada karena masih dalam proses pembukuan (KP pakai jasa akuntan eksternal). Diharapkan siap Mei 2026.",
    },
    {
      author: "Wahyu Nugroho",
      date: "2026-03-29",
      content:
        "Site visit BSD Sektor 7 — lokasi bagus, sudah ada counter laundry kecil tapi tidak terkesan bersih. Ruko yang ditarget Rizky lebih premium. B2B prospect: sudah ada MoU informal dengan 2 kos-kosan besar di sekitar lokasi.",
    },
    {
      author: "Laras Setiawati",
      date: "2026-03-20",
      content:
        "Follow-up re: DPD outlet #2 — KP confirm bahwa masalah pada bulan ke-15 disebabkan oleh renovasi mendadak yang menekan cash flow. Tidak ada kejadian serupa di outlet #3. Diakseptasi sebagai one-off.",
    },
  ],

  ptDetails: [
    {
      id: "pt-c1",
      name: "PT Laundrynow Indonesia",
      bank: "BCA",
      accountNumber: "3312987654",
      accountholderName: "PT Laundrynow Indonesia",
      slikFileUrl: "https://drive.google.com/file/slik-pt-laundrynow",
      slikExecSummary:
        "Rekening BCA aktif sejak 2021. Tidak ada pinjaman korporat. Cashflow masuk-keluar konsisten dengan revenue yang dilaporkan. SLIK bersih.",
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
    "Submit executed lease agreement untuk BSD Sektor 7 sebelum disbursement tranche 1",
    "Submit full-year 2025 management accounts (atau audited financials) sebelum disbursement tranche 2",
  ],
};

// ─── Project D ────────────────────────────────────────────────────────────────
// Frozen food / FMCG manufacturer — Asset D, Revenue Share (Return-Capped)
// Requesting plafond increase + new project. Outstanding is nearly at limit.
// Triggers: negative remaining WC sub-limit, SLIK missing for key person (ops director)

const projectD: ICProject = {
  id: "proj-d",
  brandName: "Dapur Lezat Frozen",
  brandIsNew: false,
  projectName: "Dapur Lezat Frozen — Production Line Expansion & Modern Trade Entry",
  approvalType: "Project+Plafond",
  submittedAt: "2026-04-04T13:30:00Z",

  pic: {
    submitter: "Raka Firmansyah",
    primaryAnalyst: "Raka Firmansyah",
    secondaryAnalyst: "Laras Setiawati",
  },

  projectNumberForKP: 3,
  brandActiveProjects: 1,
  brandCompletedProjects: 1,
  brandBeforeICProjects: 0,
  brandPendingDisbursementProjects: 0,
  mainSector: "FMCG",
  subSector: "Frozen Food",
  syariah: true,
  assetClass: "Asset D",
  requestedAmountCurrency: "IDR",
  requestedAmount: 5_500_000_000,
  amountWarning:
    "Jumlah yang diminta melebihi sisa plafond WC saat ini sebesar IDR 1.3B. Kenaikan plafond diperlukan sebelum disbursement.",
  financingUse: "Capital Expenditure + Working Capital",
  sectorWarning: null,

  plafond: {
    proposed: {
      totalLimit: 9_000_000_000,
      poSubLimit: 3_000_000_000,
      wcSubLimit: 6_000_000_000,
    },
    current: {
      totalLimit: 7_000_000_000,
      poSubLimit: 2_500_000_000,
      wcSubLimit: 4_500_000_000,
      effectiveDate: "2024-08-01",
      expiryDate: "2026-08-01",
      limitStatus: "Active",
    },
    outstandingTotal: 5_850_000_000,
    remainingTotal: 1_150_000_000,
    remainingPO: 2_500_000_000,
    remainingWC: -1_350_000_000, // ← negative! triggers warning
    superseded: [
      {
        totalLimit: 4_000_000_000,
        poSubLimit: 1_500_000_000,
        wcSubLimit: 2_500_000_000,
        effectiveDate: "2023-02-01",
        expiryDate: "2024-07-31",
      },
    ],
  },

  financialReviews: [
    {
      submissionDate: "2025-10-08",
      financialReportsReviewed: "Audited 2024",
      periodEndingDate: "2024-12-31",
      limitRecommendation: "Increase",
      reviewNotes:
        "Revenue 2024: IDR 42B (+38% YoY). EBITDA margin 16%. Produk Dapur Lezat kini tersedia di >800 outlet Indomaret dan 200 outlet Alfamart — distribusi modern trade naik signifikan di H2 2024. KP sudah dalam pembicaraan dengan Hero Group dan Ranch Market untuk listing 2026. Hutang ke bank nihil. Rekening koran menunjukkan cashflow seasonal — puncak di bulan Ramadan dan Lebaran. Direkomendasikan kenaikan plafond ke IDR 9B untuk mendukung ekspansi produksi dan modal kerja musiman.",
    },
    {
      submissionDate: "2024-07-15",
      financialReportsReviewed: "Audited 2023",
      periodEndingDate: "2023-12-31",
      limitRecommendation: "Increase",
      reviewNotes:
        "Revenue 2023: IDR 30.4B. Pertumbuhan kuat. Direkomendasikan kenaikan plafond dari IDR 4B ke IDR 7B.",
    },
  ],

  referralSource: "Karmapreneur",
  specificReferror: "Yoseph Tanujaya",
  referrorBelongsToKP: "PT Sumber Makmur Food (KP existing)",
  otherReferees: ["PT Sumber Makmur Food"],

  kpContacts: [
    {
      id: "kpc-d1",
      name: "Hartono Widjaja",
      role: "Founder / Direktur Utama",
      notesOnPerson:
        "Founder, 52 tahun. Background 15 tahun di industri FMCG (Indofood, Wings Food) sebelum keluar dan bangun brand sendiri 2018. Sangat paham supply chain dan distribusi. Tinggal di Surabaya, pabrik di Sidoarjo.",
      referredProjects: [],
      associatedKPs: [],
      isKeyPerson: true,
      slikFileUrl: "https://drive.google.com/file/slik-hartono-widjaja",
      slikExecSummary:
        "KPR di BNI (aktif, lunas 2028). Kredit investasi korporat nihil. SLIK bersih per Maret 2026.",
      uboExposure: 5_850_000_000,
    },
    {
      id: "kpc-d2",
      name: "Dedi Kurniawan",
      role: "Direktur Operasional",
      notesOnPerson:
        "Bergabung 2021. Ex-Bogasari, head of production. Memegang 15% saham via ESOP. Penanggung jawab operasional pabrik sehari-hari.",
      referredProjects: [],
      associatedKPs: [],
      isKeyPerson: true,
      slikFileUrl: null, // ← SLIK MISSING — triggers warning
      slikExecSummary: null,
      uboExposure: 0,
    },
    {
      id: "kpc-d3",
      name: "Lina Widjaja",
      role: "Komisaris (istri founder)",
      notesOnPerson: "Komisaris, tidak operasional. Pemegang 25% saham.",
      referredProjects: [],
      associatedKPs: [],
      isKeyPerson: false,
      slikFileUrl: "https://drive.google.com/file/slik-lina-widjaja",
      slikExecSummary: "KPR bersama suami di BNI. Tidak ada kredit lain. Bersih.",
      uboExposure: 0,
    },
  ],

  pastProjects: [
    {
      id: "pp-d1",
      projectName: "Dapur Lezat — Initial Working Capital (Indomaret Onboarding)",
      status: "Completed",
      returnType: "Revenue Share (Return-Capped)",
      amount: 3_200_000_000,
      outstandingAmount: 0,
      projectedTermMonths: 24,
      otfIRR: 22.4,
      projectedIRR: 19.0,
      otfMOIC: null,
      projectedMOIC: "1.38x",
      projectedBEPMonths: 16,
      currentDPD: 0,
      maxDPD: 0,
    },
    {
      id: "pp-d2",
      projectName: "Dapur Lezat — Alfamart Expansion & Seasonal Stock Pre-Lebaran 2025",
      status: "Active",
      returnType: "Revenue Share (Return-Capped)",
      amount: 5_850_000_000,
      outstandingAmount: 5_850_000_000,
      projectedTermMonths: 28,
      otfIRR: 20.1,
      projectedIRR: 19.5,
      otfMOIC: null,
      projectedMOIC: "1.46x",
      projectedBEPMonths: 18,
      currentDPD: 0,
      maxDPD: 0,
    },
    {
      id: "pp-d3",
      projectName: "Dapur Lezat — Production Line Expansion & Modern Trade Entry [PROPOSED]",
      status: "Proposed",
      returnType: "Revenue Share (Return-Capped)",
      amount: 5_500_000_000,
      outstandingAmount: 0,
      projectedTermMonths: 30,
      otfIRR: null,
      projectedIRR: 20.0,
      otfMOIC: null,
      projectedMOIC: "1.50x",
      projectedBEPMonths: 18,
      currentDPD: 0,
      maxDPD: 0,
    },
  ],

  returnType: "Revenue Share (Return-Capped)",
  disbursements: [
    { tranche: 1, plannedAmount: 2_000_000_000, plannedDate: "2026-05-15" },
    { tranche: 2, plannedAmount: 2_000_000_000, plannedDate: "2026-07-15" },
    { tranche: 3, plannedAmount: 1_500_000_000, plannedDate: "2026-10-01" },
  ],
  branches: [],
  revenueShareTerms: {
    sourceOfRevenueAccrued: "Net Revenue from Modern Trade Channels",
    frequency: "Monthly",
    dueDate: "Tanggal 15 setiap bulan",
    capType: "Return Cap",
    capMultiple: 1.5,
    capTimePeriodMonths: null,
    revShareStartType: "Fixed",
    revShareStartDate: "2026-06-01",
    preBEPRevSharePct: 9,
    postBEPRevSharePct: 5.5,
    carryType: "Fixed Platform Fee",
    carryPct: 2.0,
    minReturn: 18,
    minReturnMultiple: 1.18,
    minReturnPayableMonths: 24,
    revProjectionArray: [
      { month: 1, revenue: 2_800_000_000 },
      { month: 3, revenue: 4_200_000_000 },
      { month: 6, revenue: 5_500_000_000 },
      { month: 12, revenue: 7_000_000_000 },
      { month: 18, revenue: 8_200_000_000 },
      { month: 24, revenue: 9_000_000_000 },
      { month: 30, revenue: 9_500_000_000 },
    ],
  },
  fixedReturnTerms: null,
  lateFee: {
    basis: "Overdue Amount",
    gracePeriodDays: 5,
    dailyPctInvestors: 0.1,
    dailyPctASN: 0.05,
  },
  termSheetLink: "https://drive.google.com/file/termsheet-dapur-lezat-proj3",

  kpCreditMemo:
    "**KP Credit Memo — Dapur Lezat Frozen**\n\nKP existing. Proyek #1 selesai dengan excellent OTF IRR 22.4% — ahead of schedule. Proyek #2 (active) berjalan baik di bulan ke-10, OTF IRR 20.1% on track. Distribusi modern trade (Indomaret + Alfamart) sudah established. Pembicaraan dengan Hero Group dan Ranch Market sedang berlangsung.\n\nRisiko utama: (1) konsentrasi di pasar frozen food yang kompetitif — diferensiasi produk perlu terus dijaga; (2) SLIK Dedi Kurniawan (Direktur Operasional, Key Person) belum diterima; (3) cashflow seasonal yang tinggi — monitor disbursement timing terhadap siklus Ramadan.",
  projectCreditMemo:
    "**Project Credit Memo — Production Line Expansion**\n\nProyek ke-3. Revenue Share return-capped 1.5x. Dana digunakan untuk: (1) mesin produksi line baru kapasitas 2x (IDR 3B) — untuk memenuhi order confirmed dari Hero & Ranch Market; (2) modal kerja musiman Lebaran 2027 (IDR 2.5B). Kenaikan plafond dari IDR 7B ke IDR 9B diperlukan karena outstanding proyek #2 masih IDR 5.85B.\n\n⚠️ SLIK Dedi Kurniawan belum diterima. Harus ada sebelum persetujuan final.",
  financialsLink: "https://drive.google.com/folder/dapur-lezat-financials",
  projectNotes: [
    {
      author: "Raka Firmansyah",
      date: "2026-04-04",
      content:
        "Submitted. ⚠️ SLIK Dedi Kurniawan belum ada — sudah follow-up ke KP, estimasi diterima 10 April. IC mungkin perlu defer final approval sampai SLIK diterima.",
    },
    {
      author: "Laras Setiawati",
      date: "2026-04-02",
      content:
        "Review model keuangan selesai. Revenue projections konservatif vs actual track record proyek #1 dan #2. Order confirmed dari Hero Group ada LOI-nya — sudah dicek, genuine.",
    },
    {
      author: "Raka Firmansyah",
      date: "2026-03-25",
      content:
        "Factory visit Sidoarjo — fasilitas bersih, proses produksi terstandarisasi, sudah punya ISO 22000. Kapasitas existing hampir penuh (85% utilisasi). Mesin baru memang diperlukan.",
    },
  ],

  ptDetails: [
    {
      id: "pt-d1",
      name: "PT Dapur Lezat Nusantara",
      bank: "Mandiri",
      accountNumber: "1400099887766",
      accountholderName: "PT Dapur Lezat Nusantara",
      slikFileUrl: "https://drive.google.com/file/slik-pt-dln",
      slikExecSummary:
        "Rekening Mandiri aktif sejak 2018. Tidak ada pinjaman korporat di perbankan. SLIK bersih per Maret 2026. Cashflow rekening konsisten dengan laporan keuangan.",
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
    "⚠️ SLIK Dedi Kurniawan (Key Person, Direktur Operasional) BELUM DITERIMA. IC disarankan untuk defer final approval sampai SLIK diterima dan direview.\n\nPlafond WC saat ini negatif — kenaikan ke IDR 9B harus diformalkan sebelum disbursement tranche pertama.\n\nProyek ini besar (IDR 5.5B) dan membutuhkan quorum IC penuh sesuai policy ≥ Rp 4B.",
  conditionsSubsequent: [
    "Submit SLIK Dedi Kurniawan sebelum persetujuan final IC",
    "Kenaikan plafond ke IDR 9B diformalkan dalam Financial Review sebelum disbursement tranche 1",
    "Submit LOI / PO confirmed dari Hero Group dan Ranch Market sebelum disbursement tranche 2",
    "Submit laporan keuangan Q1 2026 sebelum disbursement tranche 3",
  ],
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const mockProjects: ICProject[] = [projectA, projectC, projectD];

export function getProjectById(id: string): ICProject | undefined {
  return mockProjects.find((p) => p.id === id);
}
