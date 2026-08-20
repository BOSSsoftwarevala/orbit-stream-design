import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, PiggyBank, TriangleAlert } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { money, paymentPlans } from "@/data/seed";
import type { PaymentPlan } from "@/types";

export const Route = createFileRoute("/payment-plans")({
  component: PaymentPlansPage,
  head: () => ({
    meta: [
      { title: "Payment Plans — Ferrolink OSS" },
      { name: "description", content: "Instalment arrangements that keep at-risk subscribers connected while they catch up." },
      { property: "og:title", content: "Payment Plans — Ferrolink OSS" },
      { property: "og:description", content: "Instalment arrangements for past-due subscriber balances." },
    ],
  }),
});

function PaymentPlansPage() {
  const outstanding = paymentPlans.reduce((a, p) => a + p.remaining, 0);
  return (
    <>
      <PageHeader
        title="Payment Plans"
        subtitle="Arrangements that suppress auto-suspension while instalments stay on track"
        actions={<Button size="sm" className="text-xs"><PiggyBank className="size-3.5" /> New plan</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat3D label="Active plans" value={String(paymentPlans.length)} icon={PiggyBank} grad="teal" />
          <Stat3D label="Outstanding" value={money(outstanding)} icon={CalendarClock} grad="amber" />
          <Stat3D label="At risk" value={String(paymentPlans.filter((p) => p.status === "at_risk").length)} icon={TriangleAlert} grad="rose" />
        </div>
        <DataTable<PaymentPlan>
          rows={paymentPlans}
          searchKeys={(p) => `${p.customerName} ${p.id}`}
          cardTitle={(p) => <span className="flex items-center justify-between gap-2">{p.customerName}<StatusBadge value={p.status} dot={false} /></span>}
          filters={[{ key: "status", label: "Status", options: ["on_track", "at_risk", "completed"], match: (r, v) => r.status === v }]}
          columns={[
            { key: "id", header: "Plan", value: (p) => p.id, render: (p) => <span className="num">{p.id}</span> },
            { key: "customer", header: "Account", sortable: true, value: (p) => p.customerName },
            {
              key: "progress", header: "Instalments", value: (p) => p.paid,
              render: (p) => (
                <div className="flex w-32 items-center gap-2">
                  <Progress value={(p.paid / p.installments) * 100} className="h-1.5" />
                  <span className="num text-[11px] text-muted-foreground">{p.paid}/{p.installments}</span>
                </div>
              ),
              hideBelow: "md",
            },
            { key: "next", header: "Next due", sortable: true, value: (p) => p.nextDue, hideBelow: "md" },
            { key: "remaining", header: "Remaining", align: "right", sortable: true, value: (p) => p.remaining, render: (p) => <span className="num font-medium">{money(p.remaining)}</span> },
            { key: "status", header: "Status", value: (p) => p.status, render: (p) => <StatusBadge value={p.status} /> },
          ]}
        />
      </div>
    </>
  );
}
