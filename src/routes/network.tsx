import { createFileRoute } from "@tanstack/react-router";
import { Activity, Globe2, Radio, TriangleAlert } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader, Section } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Progress } from "@/components/ui/progress";
import { devices, trafficSeries } from "@/data/seed";
import type { Device } from "@/types";

export const Route = createFileRoute("/network")({
  component: NetworkPage,
  head: () => ({
    meta: [
      { title: "Network Status — Ferrolink OSS" },
      { name: "description", content: "Live health of BNGs, OLTs, edge routers and access points across every site." },
      { property: "og:title", content: "Network Status — Ferrolink OSS" },
      { property: "og:description", content: "Live device health and aggregate egress across the access network." },
    ],
  }),
});

function NetworkPage() {
  const online = devices.filter((d) => d.status === "online").length;
  const clients = devices.reduce((a, d) => a + d.clients, 0);
  const peak = Math.max(...trafficSeries.map((t) => t.gbps ?? 0));

  return (
    <>
      <PageHeader title="Network Status" subtitle="Access and core elements reporting into the NOC" />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat3D label="Elements online" value={`${online}/${devices.length}`} icon={Globe2} grad="emerald" />
          <Stat3D label="Attached clients" value={clients.toLocaleString()} icon={Radio} grad="teal" />
          <Stat3D label="Degraded / offline" value={String(devices.filter((d) => d.status !== "online" && d.status !== "maintenance").length)} icon={TriangleAlert} grad="rose" />
          <Stat3D label="Peak egress" value={`${peak.toFixed(1)} Gbps`} icon={Activity} grad="violet" />
        </div>

        <Section title="Site load" description="CPU utilisation by element">
          <div className="grid gap-3 sm:grid-cols-2">
            {devices.map((d) => (
              <div key={d.id} className="flex items-center gap-3">
                <span className="num w-40 truncate text-xs">{d.hostname}</span>
                <Progress value={d.cpu} className="h-1.5 flex-1" />
                <span className="num w-10 text-right text-xs text-muted-foreground">{d.cpu}%</span>
              </div>
            ))}
          </div>
        </Section>

        <DataTable<Device>
          rows={devices}
          searchKeys={(d) => `${d.hostname} ${d.site} ${d.vendor} ${d.mgmtIp}`}
          cardTitle={(d) => <span className="flex items-center justify-between gap-2">{d.hostname}<StatusBadge value={d.status} dot={false} /></span>}
          filters={[
            { key: "status", label: "Status", options: ["online", "degraded", "offline", "maintenance"], match: (r, v) => r.status === v },
            { key: "type", label: "Type", options: ["BNG", "OLT", "Edge Router", "Switch", "Access Point"], match: (r, v) => r.type === v },
          ]}
          columns={[
            { key: "hostname", header: "Hostname", sortable: true, value: (d) => d.hostname, render: (d) => <span className="num">{d.hostname}</span> },
            { key: "type", header: "Type", value: (d) => d.type },
            { key: "site", header: "Site", value: (d) => d.site, hideBelow: "md" },
            { key: "ip", header: "Mgmt IP", value: (d) => d.mgmtIp, render: (d) => <span className="num">{d.mgmtIp}</span>, hideBelow: "lg" },
            { key: "clients", header: "Clients", align: "right", sortable: true, value: (d) => d.clients, render: (d) => <span className="num">{d.clients.toLocaleString()}</span> },
            { key: "uptime", header: "Uptime", align: "right", sortable: true, value: (d) => d.uptimeDays, render: (d) => <span className="num">{d.uptimeDays}d</span>, hideBelow: "md" },
            { key: "status", header: "Status", value: (d) => d.status, render: (d) => <StatusBadge value={d.status} /> },
          ]}
        />
      </div>
    </>
  );
}
