interface DataRowProps {
  label: string;
  value: React.ReactNode;
  highlight?: "yellow" | "pink" | "red" | "green" | null;
  className?: string;
}

const highlights: Record<string, string> = {
  yellow: "bg-yellow-50",
  pink: "bg-pink-50",
  red: "bg-red-50",
  green: "bg-emerald-50",
};

export function DataRow({ label, value, highlight, className = "" }: DataRowProps) {
  const bg = highlight ? highlights[highlight] : "";
  return (
    <div className={`flex items-start gap-4 py-2 border-b border-gray-50 last:border-0 ${bg} ${className}`}>
      <span className="text-xs text-gray-500 w-44 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-900 flex-1">{value ?? <span className="text-gray-300">—</span>}</span>
    </div>
  );
}

export function fmt(n: number, ccy = "IDR"): string {
  if (ccy === "USD") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  }
  return `IDR ${new Intl.NumberFormat("id-ID").format(n)}`;
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
