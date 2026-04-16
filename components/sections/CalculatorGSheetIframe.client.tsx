"use client";

interface Props {
  src: string;
}

export function CalculatorGSheetPreviewIframe({ src }: Props) {
  return (
    <div className="rounded-md border border-gray-200 overflow-hidden bg-gray-50">
      <iframe
        title="Calculator preview"
        src={src}
        className="w-full min-h-[420px] h-[min(70vh,720px)] border-0 block"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
