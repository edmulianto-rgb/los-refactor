import { AlertTriangle, Info, AlertCircle } from "lucide-react";

type WarningLevel = "error" | "warn" | "info";

const styles: Record<WarningLevel, string> = {
  error: "bg-red-50 border-red-200 text-red-800",
  warn: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-blue-50 border-blue-200 text-blue-700",
};

const icons = {
  error: AlertCircle,
  warn: AlertTriangle,
  info: Info,
};

interface WarningProps {
  message: string;
  level?: WarningLevel;
  className?: string;
}

export function Warning({ message, level = "warn", className = "" }: WarningProps) {
  const Icon = icons[level];
  return (
    <div
      className={`flex items-start gap-2 px-3 py-2 rounded border text-sm ${styles[level]} ${className}`}
    >
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
