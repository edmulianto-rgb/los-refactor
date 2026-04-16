import { ICProject } from "@/data/types";
import { ExternalLink } from "lucide-react";
import { shouldShowCalculatorGSheet } from "@/lib/calculatorGSheetVisibility";
import { googleSheetsPreviewEmbedUrl } from "@/lib/googleSheetsEmbed";
import { CalculatorGSheetPreviewIframe } from "@/components/sections/CalculatorGSheetIframe.client";

export { shouldShowCalculatorGSheet } from "@/lib/calculatorGSheetVisibility";

interface Props {
  project: ICProject;
}

/** Calculator from Project `financialsLink`: link row + in-app preview when URL is a Google Sheet. */
export function CalculatorGSheetEmbedBlock({ project }: Props) {
  if (!shouldShowCalculatorGSheet(project)) return null;

  const link = project.financialsLink!.trim();
  const previewSrc = googleSheetsPreviewEmbedUrl(link);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Calculator (Project table)</div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            title={link}
            className="text-sm text-blue-600 hover:underline break-all"
          >
            {link}
          </a>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 transition-colors"
        >
          Open in new tab
          <ExternalLink className="w-4 h-4 text-gray-500" aria-hidden />
        </a>
      </div>
      {previewSrc ? <CalculatorGSheetPreviewIframe src={previewSrc} /> : null}
    </div>
  );
}
