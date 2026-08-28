import { createFileRoute } from "@tanstack/react-router";
import { Network, Plus, Shuffle } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader, Section } from "@/components/common/page-header";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { subnets } from "@/data/seed";
import type { Subnet } from "@/types";

export const Route = createFileRoute("/ipam")({
  component: IpamPage,
  head: () => ({
    meta: [
      { title: "IP Management — Ferrolink OSS" },
      { name: "description", content: "Subnets, VLANs, CGNAT blocks and static allocations with live utilisation." },
      { property: "og:title", content: "IP Management — Ferrolink OSS" },
      { property: "og:description", content: "Subnet, VLAN and CGNAT allocation tracking." },
    ],
  }),
});

function IpamPage() {
  const used = subnets.reduce((a, s) => a + s.used, 0);
  const size = subnets.reduce((a, s) => a + s.size, 0);

  return (
    <>
      <PageHeader
        title="IP Management"
        subtitle="Address space across PPPoE pools, static blocks and management networks"
        actions={<Button size="sm" className="text-xs"><Plus className="size-3.5" /> Add subnet</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat3D label="Subnets" value={String(subnets.length)} icon={Network} grad="indigo" />
          <Stat3D label="Addresses in use" value={used.toLocaleString()} icon={Shuffle} grad="cyan" />
          <Stat3D label="Overall utilisation" value={`${Math.round((used / size) * 100)}%`} icon={Network} grad="lime" />
        </div>

        <Section title="Utilisation by block">
          <div className="space-y-3">
            {subnets.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="num w-44 truncate text-xs">{s.cidr}</span>
                <Progress value={(s.used / s.size) * 100} className="h-1.5 flex-1" />
                <span className="num w-28 text-right text-[11px] text-muted-foreground">
                  {s.used.toLocaleString()}/{s.size.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <DataTable<Subnet>
          rows={subnets}
          searchKeys={(s) => `${s.cidr} ${s.purpose} ${s.site}`}
          cardTitle={(s) => <span className="num">{s.cidr}</span>}
          filters={[{ key: "site", label: "Site", options: ["Central POP", "All sites", "Ridgemont Tower"], match: (r, v) => r.site === v }]}
          columns={[
            { key: "cidr", header: "CIDR", sortable: true, value: (s) => s.cidr, render: (s) => <span className="num">{s.cidr}</span> },
            { key: "purpose", header: "Purpose", value: (s) => s.purpose },
            { key: "vlan", header: "VLAN", align: "right", sortable: true, value: (s) => s.vlan, render: (s) => <span className="num">{s.vlan}</span>, hideBelow: "md" },
            { key: "gateway", header: "Gateway", value: (s) => s.gateway, render: (s) => <span className="num">{s.gateway}</span>, hideBelow: "lg" },
            { key: "site", header: "Site", value: (s) => s.site, hideBelow: "md" },
            { key: "used", header: "Used", align: "right", sortable: true, value: (s) => s.used, render: (s) => <span className="num">{Math.round((s.used / s.size) * 100)}%</span> },
          ]}
        />
      </div>
    </>
  );
}
