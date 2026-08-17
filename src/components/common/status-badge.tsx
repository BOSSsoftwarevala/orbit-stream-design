import { cn } from "@/lib/utils";

type Tone = "active" | "suspended" | "overdue" | "offline" | "pending" | "neutral" | "info";

const toneMap: Record<string, Tone> = {
  active: "active",
  online: "active",
  paid: "active",
  settled: "active",
  completed: "active",
  won: "active",
  resolved: "active",
  received: "active",
  on_track: "active",
  deployed: "active",
  in_stock: "active",

  suspended: "suspended",
  degraded: "suspended",
  at_risk: "suspended",
  escalated: "suspended",
  high: "suspended",
  los: "suspended",
  maintenance: "suspended",
  failed: "overdue",
  overdue: "overdue",
  urgent: "overdue",
  lost: "overdue",
  dying_gasp: "overdue",
  rma: "overdue",
  cancelled: "offline",
  closed: "offline",
  void: "offline",
  offline: "offline",
  retired: "offline",
  draft: "neutral",

  pending: "pending",
  pending_install: "pending",
  scheduled: "pending",
  in_transit: "pending",
  en_route: "pending",
  in_progress: "pending",
  open: "info",
  new: "info",
  lead: "info",
  qualified: "info",
  survey: "info",
  quoted: "info",
  unassigned: "info",
  assigned: "info",
  refunded: "neutral",
  normal: "neutral",
  low: "neutral",
};

const toneClass: Record<Tone, string> = {
  active: "border-active/30 bg-active/12 text-active",
  suspended: "border-suspended/35 bg-suspended/14 text-suspended",
  overdue: "border-overdue/30 bg-overdue/12 text-overdue",
  offline: "border-offline/30 bg-offline/12 text-offline",
  pending: "border-pending/30 bg-pending/12 text-pending",
  info: "border-primary/30 bg-primary/12 text-primary",
  neutral: "border-border bg-muted text-muted-foreground",
};

export function StatusBadge({
  value,
  className,
  dot = true,
}: {
  value: string;
  className?: string;
  dot?: boolean;
}) {
  const key = value?.toLowerCase().replace(/[\s-]/g, "_") ?? "";
  const tone = toneMap[key] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize leading-4",
        toneClass[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {value.replace(/_/g, " ")}
    </span>
  );
}
