import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Grad = "teal" | "violet" | "amber" | "emerald" | "rose" | "slate";

export const gradVar: Record<Grad, string> = {
  teal: "var(--grad-teal)",
  violet: "var(--grad-violet)",
  amber: "var(--grad-amber)",
  emerald: "var(--grad-emerald)",
  rose: "var(--grad-rose)",
  slate: "var(--grad-slate)",
};

/** Dimensional gradient icon tile — the app's "3D illustration" primitive. */
export function Icon3D({
  icon: Icon,
  grad = "teal",
  size = "md",
  className,
}: {
  icon: LucideIcon;
  grad?: Grad;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const dims = {
    sm: "size-7 rounded-lg [&_svg]:size-3.5",
    md: "size-10 rounded-xl [&_svg]:size-5",
    lg: "size-14 rounded-2xl [&_svg]:size-7",
    xl: "size-20 rounded-[1.4rem] [&_svg]:size-10",
  }[size];
  return (
    <span
      className={cn(
        "btn-3d relative inline-flex shrink-0 items-center justify-center text-white",
        dims,
        className,
      )}
      style={{ backgroundImage: gradVar[grad] }}
    >
      <Icon strokeWidth={2.1} className="relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]" />
    </span>
  );
}

export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={cn("glass-panel p-4", hover && "elevate", className)}>{children}</div>
  );
}

/** Glossy gradient action button. */
export function Button3D({
  children,
  grad = "teal",
  className,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  grad?: Grad;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "btn-3d sheen inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold",
        className,
      )}
      style={{ backgroundImage: gradVar[grad] }}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

/** Premium stat tile with 3D icon, used across module dashboards. */
export function Stat3D({
  label,
  value,
  hint,
  icon,
  grad = "teal",
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  grad?: Grad;
  className?: string;
}) {
  return (
    <GlassCard className={cn("flex items-center gap-3", className)}>
      <Icon3D icon={icon} grad={grad} />
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="num text-lg font-semibold leading-6">{value}</p>
        {hint && <p className="truncate text-[11px] text-muted-foreground">{hint}</p>}
      </div>
    </GlassCard>
  );
}
