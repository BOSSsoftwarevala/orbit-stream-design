import { createFileRoute } from "@tanstack/react-router";
import { Radio, Signal, TriangleAlert, Zap } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader, Section } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { onus, subnets } from "@/data/seed";
import type { Onu } from "@/types";

export const Route = createFileRoute("/provisioning")({
  component: ProvisioningPage,
  head: () => ({
    meta: [
      { title: "Provisioning — Ferrolink OSS" },
      { name: "description", content: "Activate ONUs, assign PPPoE pools and push service profiles to the access network." },
      { property: "og:title", content: "Provisioning — Ferrolink OSS" },
      { property: "og:description", content: "ONU activation queue and address pool assignment." },
    ],
  }),
});

function ProvisioningPage() {
  const pending = onus.filter((o) => o.status !== "online");

  return (
    <>
      <PageHeader
        title="Provisioning"
        subtitle="Service activation queue across PON and fixed wireless"
        actions={<Button size="sm" className="text-xs"><Zap className="size-3.5" /> Provision service</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat3D label="ONUs registered" value={String(onus.length)} icon={Radio} grad="teal" />
          <Stat3D label="Awaiting signal" value={String(pending.length)} icon={TriangleAlert} grad="amber" />
          <Stat3D label="Avg Rx power" value={`${(onus.reduce((a, o) => a + o.rxPower, 0) / onus.length).toFixed(1)} dBm`} icon={Signal} grad="violet" />
          <Stat3D label="Pools in use" value={String(subnets.length)} icon={Zap} grad="emerald" />
        </div>

        <Section title="Address pools" description="Utilisation of PPPoE and static allocations">
          <div className="grid gap-2 sm:grid-cols-2">
            {subnets.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-xs">
                <div>
                  <p className="num font-medium">{s.cidr}</p>
                  <p className="text-muted-foreground">{s.purpose} · VLAN {s.vlan}</p>
                </div>
                <span className="num text-muted-foreground">{Math.round((s.used / s.size) * 100)}%</span>
              </div>
            ))}
          </div>
        </Section>

        <DataTable<Onu>
          rows={onus}
          searchKeys={(o) => `${o.serial} ${o.customerName} ${o.olt} ${o.model}`}
          cardTitle={(o) => <span className="flex items-center justify-between gap-2">{o.serial}<StatusBadge value={o.status} dot={false} /></span>}
          filters={[{ key: "status", label: "Status", options: ["online", "los", "dying_gasp", "offline"], match: (r, v) => r.status === v }]}
          columns={[
            { key: "serial", header: "Serial", sortable: true, value: (o) => o.serial, render: (o) => <span className="num">{o.serial}</span> },
            { key: "customer", header: "Subscriber", sortable: true, value: (o) => o.customerName },
            { key: "olt", header: "OLT", value: (o) => o.olt, hideBelow: "md" },
            { key: "pon", header: "PON port", value: (o) => o.ponPort, render: (o) => <span className="num">{o.ponPort}</span>, hideBelow: "lg" },
            { key: "rx", header: "Rx power", align: "right", sortable: true, value: (o) => o.rxPower, render: (o) => <span className="num">{o.rxPower} dBm</span> },
            { key: "status", header: "Status", value: (o) => o.status, render: (o) => <StatusBadge value={o.status} /> },
          ]}
        />
      </div>
    </>
  );
}
