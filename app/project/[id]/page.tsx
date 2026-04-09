import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@/data/mock";
import { computeWarnings } from "@/lib/warnings";
import { Warning } from "@/components/ui/Warning";
import { ProjectHeader } from "@/components/sections/ProjectHeader";
import { PICSection } from "@/components/sections/PICSection";
import { ProjectDetails } from "@/components/sections/ProjectDetails";
import { PlafondSection } from "@/components/sections/PlafondSection";
import { FinancialReviews } from "@/components/sections/FinancialReviews";
import { KPDetails } from "@/components/sections/KPDetails";
import { KPContacts } from "@/components/sections/KPContacts";
import { PastProjectsRecap } from "@/components/sections/PastProjectsRecap";
import { ProjectTerms } from "@/components/sections/ProjectTerms";
import { CreditMemoNotes } from "@/components/sections/CreditMemoNotes";
import { PTDetails } from "@/components/sections/PTDetails";
import { ApprovalSection } from "@/components/sections/ApprovalSection";
import { ChevronLeft } from "lucide-react";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: Params) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) notFound();

  const warnings = computeWarnings(project);
  const errors = warnings.filter((w) => w.level === "error");
  const warnItems = warnings.filter((w) => w.level === "warn");

  const showPlafond = project.approvalType.includes("Plafond") || project.plafond.current !== null;

  return (
    <div>
      {/* Back nav */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        All pending reviews
      </Link>

      {/* Global warnings banner */}
      {errors.length > 0 && (
        <div className="mb-4 space-y-2">
          {errors.map((e, i) => (
            <Warning key={i} message={`[${e.section}] ${e.message}`} level="error" />
          ))}
        </div>
      )}
      {warnItems.length > 0 && (
        <div className="mb-4 space-y-2">
          {warnItems.map((w, i) => (
            <Warning key={i} message={`[${w.section}] ${w.message}`} level="warn" />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <ProjectHeader project={project} />
      </div>

      {/* Two-column layout for smaller sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <PICSection project={project} />
        <KPDetails project={project} />
      </div>

      {/* Project Details */}
      <div className="mb-4">
        <ProjectDetails project={project} />
      </div>

      {/* Plafond */}
      {showPlafond && (
        <div className="mb-4">
          <PlafondSection project={project} />
        </div>
      )}

      {/* Financial Reviews */}
      <div className="mb-4">
        <FinancialReviews project={project} />
      </div>

      {/* KP Contacts */}
      <div className="mb-4">
        <KPContacts project={project} />
      </div>

      {/* Past Projects */}
      <div className="mb-4">
        <PastProjectsRecap project={project} />
      </div>

      {/* Project Terms */}
      <div className="mb-4">
        <ProjectTerms project={project} />
      </div>

      {/* Credit Memo & Notes */}
      <div className="mb-4">
        <CreditMemoNotes project={project} />
      </div>

      {/* PT Details */}
      <div className="mb-4">
        <PTDetails project={project} />
      </div>

      {/* Approval — always last, sticky feel */}
      <div className="mb-8">
        <ApprovalSection project={project} />
      </div>

      <div className="text-xs text-center text-gray-400 pb-8">
        IC Review App — Prototype · Mocked data · Phase 1 concept
      </div>
    </div>
  );
}
