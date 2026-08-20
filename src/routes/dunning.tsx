import { createFileRoute } from "@tanstack/react-router";
import { BellRing, PauseCircle, PlayCircle, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader, Section } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Button3D, GlassCard, Icon3D, Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { customers, money } from "@/data/seed";
import type { Customer } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/dunning")({
  component: DunningPage,
  head: () => ({
    meta: [
      { title: "Dunning & Auto-Suspension — Ferrolink OSS" },
      { name: "description", content: "Collections stages, grace windows, automatic suspension rules and service restoration." },
      { property: "og:title", content: "Dunning & Auto-Suspension — Ferrolink OSS" },
      { property: "og:description", content: "Collections automation and service restoration workflows." },
    ],
  }),
});

const stages = [
  { name: "Stage 1 — Reminder", day: 3, action: "Email + SMS reminder", grad: "teal" as const },
  { name: "Stage 2 — Warning", day: 10, action: "Portal banner + call task", grad: "amber" as const },
  { name: "Stage 3 — Throttle", day: 17, action: "Speed limited to 1 Mbps", grad: "violet" as const },
  { name: "Stage 4 — Suspend", day: 24, action: "PPPoE session terminated", grad: "rose" as const },
];

function DunningPage() {
  const [graceDays, setGraceDays] = useState([24]);
  const [target, setTarget] = useState<Customer | null>(null);
  const atRisk = customers.filter((c) => c.balance > 0);

  return (
    <>
      <PageHeader
        title="Dunning & Auto-Suspension"
        subtitle="Rule-driven collections ladder with one-click restoration"
        actions={<Button variant="outline" size="sm" className="text-xs"><BellRing className="size-3.5" /> Run dunning now</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat3D label="Accounts in dunning" value={String(atRisk.length)} icon={ShieldAlert} grad="amber" />
          <Stat3D label="Past-due balance" value={money(atRisk.reduce((a, c) => a + c.balance, 0))} icon={BellRing} grad="rose" />
          <Stat3D label="Suspended" value={String(customers.filter((c) => c.status === "suspended").length)} icon={PauseCircle} grad="slate" />
          <Stat3D label="Restored (7d)" value="18" icon={PlayCircle} grad="emerald" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Section title="Collections ladder" description="Days after invoice due date">
            <ol className="grid gap-3 sm:grid-cols-2">
              {stages.map((s) => (
                <li key={s.name}>
                  <GlassCard className="flex items-start gap-3">
                    <Icon3D icon={ShieldAlert} grad={s.grad} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.action}</p>
                      <p className="num mt-1 text-[11px] text-muted-foreground">Day +{s.day}</p>
                    </div>
                    <Switch defaultChecked className="ml-auto" />
                  </GlassCard>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Suspension policy">
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Grace period before suspension</span>
                  <span className="num font-medium">{graceDays[0]} days</span>
                </div>
                <Slider value={graceDays} onValueChange={setGraceDays} min={1} max={45} step={1} />
              </div>
              <label className="flex items-center justify-between text-xs">
                Exempt accounts with an active payment plan <Switch defaultChecked />
              </label>
              <label className="flex items-center justify-between text-xs">
                Exempt business SLA accounts <Switch defaultChecked />
              </label>
              <label className="flex items-center justify-between text-xs">
                Auto-restore on payment settlement <Switch defaultChecked />
              </label>
              <Button3D grad="teal" className="w-full" onClick={() => toast.success("Suspension policy saved")}>
                Save policy
              </Button3D>
            </div>
          </Section>
        </div>

        <DataTable<Customer>
          rows={atRisk}
          searchKeys={(c) => `${c.name} ${c.accountNumber}`}
          cardTitle={(c) => <span className="flex items-center justify-between gap-2">{c.name}<StatusBadge value={c.status} dot={false} /></span>}
          filters={[{ key: "status", label: "Status", options: ["active", "suspended"], match: (r, v) => r.status === v }]}
          columns={[
            { key: "account", header: "Account", sortable: true, value: (c) => c.accountNumber, render: (c) => <span className="num">{c.accountNumber}</span> },
            { key: "name", header: "Customer", sortable: true, value: (c) => c.name },
            { key: "balance", header: "Past due", align: "right", sortable: true, value: (c) => c.balance, render: (c) => <span className="num text-overdue">{money(c.balance)}</span> },
            { key: "status", header: "Service", value: (c) => c.status, render: (c) => <StatusBadge value={c.status} /> },
            {
              key: "act", header: "Action", align: "right",
              render: (c) => (
                <Button
                  variant="outline" size="sm" className="h-6 text-[11px]"
                  onClick={(e) => { e.stopPropagation(); setTarget(c); }}
                >
                  {c.status === "suspended" ? "Restore" : "Suspend"}
                </Button>
              ),
            },
          ]}
        />
      </div>

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{target?.status === "suspended" ? "Restore service" : "Suspend service"}</DialogTitle>
            <DialogDescription>
              {target?.name} · {target?.accountNumber} · past due {money(target?.balance ?? 0)}. This simulates a
              provisioning action against the subscriber session.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setTarget(null)}>Cancel</Button>
            <Button3D
              grad={target?.status === "suspended" ? "emerald" : "rose"}
              className="h-9 px-4 text-xs"
              onClick={() => { toast.success(`${target?.status === "suspended" ? "Restore" : "Suspend"} queued for ${target?.accountNumber}`); setTarget(null); }}
            >
              Confirm
            </Button3D>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
