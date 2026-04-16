import type { ICProject } from "@/data/types";

/** Approval types that surface the Project table calculator link + embed (with or without Plafond). */
export function shouldShowCalculatorGSheet(project: ICProject): boolean {
  const at = project.approvalType;
  const approvalOk = at.includes("PO/Invoice") || at.includes("Project");
  return approvalOk && Boolean(project.financialsLink?.trim());
}
