import { createFileRoute } from "@tanstack/react-router";
import { PauseCircle, PlayCircle, Repeat, Signal } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { money, subscriptions } from "@/data/seed";
import type { Subscription } from "@/types";

export const Route = createFileRoute("/subscriptions")({
  component: SubscriptionsPage,
  head: () => ({
    meta: [
      { title: "Subscriptions — Ferrolink OSS" },
      { name: "description", content: "Active, suspended and pending services with PPPoE, VLAN and BNG assignments." },
      { property: "og:title", content: "Subscriptions — Ferrolink OSS" },
      { property: "og:description", content: "Service subscriptions with PPPoE and BNG assignments." },
    ],
  }),
});

function SubscriptionsPage() {
  const active = subscriptions.filter((s) => s.status === "active");
  return (
    <>
      <PageHeader
        title="Subscriptions"
        subtitle="Every provisioned service and its session identity"
        actions={<Button size="sm" className="text-xs"><Repeat className="size-3.5" /> New subscription</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat3D label="Active services" value={String(active.length)} icon={PlayCircle} grad="emerald" />
          <Stat3D label="Suspended" value={String(subscriptions.filter((s) => s.status === "suspended").length)} icon={PauseCircle} grad="rose" />
          <Stat3D label="Pending install" value={String(subscriptions.filter((s) => s.status === "pending").length)} icon={Signal} grad="amber" />
          <Stat3D label="Recurring value" value={money(active.reduce((a, s) => a + s.mrr, 0))} icon={Repeat} grad="ocean" />
        </div>
        <DataTable<Subscription>
          rows={subscriptions}
          searchKeys={(s) => `${s.id} ${s.customerName} ${s.pppoeUser} ${s.ipAddress} ${s.planName}`}
          cardTitle={(s) => <span className="flex items-center justify-between gap-2">{s.customerName}<StatusBadge value={s.status} dot={false} /></span>}
          bulkActions={<Button variant="outline" size="sm" className="h-6 text-[11px]">Suspend selected</Button>}
          filters={[
            { key: "status", label: "Status", options: ["active", "suspended", "pending", "cancelled"], match: (r, v) => r.status === v },
            { key: "nas", label: "BNG", options: ["bng-core-01", "bng-core-02", "bng-edge-north"], match: (r, v) => r.nasDevice === v },
          ]}
          columns={[
            { key: "customer", header: "Subscriber", sortable: true, value: (s) => s.customerName },
            { key: "plan", header: "Plan", value: (s) => s.planName, hideBelow: "md" },
            { key: "pppoe", header: "PPPoE user", value: (s) => s.pppoeUser, render: (s) => <span className="num text-xs">{s.pppoeUser}</span>, hideBelow: "lg" },
            { key: "ip", header: "IP", value: (s) => s.ipAddress, render: (s) => <span className="num text-xs">{s.ipAddress}</span>, hideBelow: "lg" },
            { key: "vlan", header: "VLAN", align: "right", sortable: true, value: (s) => s.vlan, render: (s) => <span className="num">{s.vlan}</span>, hideBelow: "md" },
            { key: "mrr", header: "MRR", align: "right", sortable: true, value: (s) => s.mrr, render: (s) => <span className="num font-medium">{money(s.mrr)}</span> },
            { key: "status", header: "Status", value: (s) => s.status, render: (s) => <StatusBadge value={s.status} /> },
          ]}
        />
      </div>
    </>
  );
}
