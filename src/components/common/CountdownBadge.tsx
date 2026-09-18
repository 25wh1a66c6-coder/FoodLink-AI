import React from "react";
import { Clock, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { useCountdown, getPriorityBadgeColor } from "../../utils/formatters";
import type { DonationPriority } from "../../types";

interface CountdownBadgeProps {
  expiryIso: string;
  showPriorityLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const CountdownBadge: React.FC<CountdownBadgeProps> = ({
  expiryIso,
  showPriorityLabel = true,
  size = "md",
  className = "",
}) => {
  const { text, hours, isExpired, priority } = useCountdown(expiryIso);

  const getIcon = () => {
    if (isExpired) return <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />;
    if (priority === "HIGH") return <AlertCircle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />;
    if (priority === "MEDIUM") return <Clock className="w-3.5 h-3.5 text-amber-500" />;
    return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
  };

  const getPriorityLabel = (p: DonationPriority) => {
    switch (p) {
      case "HIGH":
        return "HIGH PRIORITY";
      case "MEDIUM":
        return "MEDIUM PRIORITY";
      case "LOW":
        return "LOW PRIORITY";
      case "EXPIRED":
        return "EXPIRED";
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${getPriorityBadgeColor(
        priority
      )} ${className}`}
      title={isExpired ? "Food past expiry window - marked unsafe" : `Remaining shelf life: ${text}`}
    >
      {getIcon()}
      <span className="tabular-nums font-mono">{text}</span>
      {showPriorityLabel && !isExpired && (
        <>
          <span className="opacity-40">•</span>
          <span className="tracking-wide font-sans">{getPriorityLabel(priority)}</span>
        </>
      )}
    </div>
  );
};
