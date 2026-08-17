import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "active" | "suspended" | "overdue" | "pending";
}) {
  const toneRing: Record<string, string> = {
    default: "text-primary bg-primary/10",
    active: "text-active bg-active/10",
    suspended: "text-suspended bg-suspended/10",
    overdue: "text-overdue bg-overdue/10",
    pending: "text-pending bg-pending/10",
  };
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {Icon && (
          <span className={cn("flex size-6 items-center justify-center rounded", toneRing[tone])}>
            <Icon className="size-3.5" />
          </span>
        )}
      </div>
      <div className="num mt-2 text-xl font-semibold">{value}</div>
      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              delta >= 0 ? "text-active" : "text-overdue",
            )}
          >
            {delta >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="truncate">{hint}</span>}
      </div>
    </div>
  );
}
