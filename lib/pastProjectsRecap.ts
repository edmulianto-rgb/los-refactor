import { PastProject } from "@/data/types";

/**
 * Rows shown in "Proposed and Past Projects Recap Table".
 * Includes the current submission’s **Proposed** row (`isCurrentSubmission`) together with all other rows.
 */
export function getPastProjectsRecapRows(rows: PastProject[]): PastProject[] {
  return rows;
}
