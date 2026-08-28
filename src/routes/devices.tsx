import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Router as RouterIcon, ServerCog, Wifi } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { devices } from "@/data/seed";
import type { Device } from "@/types";

export const Route = createFileRoute("/devices")({
  component: DevicesPage,
  head: () => ({
    meta: [
      { title: "Devices — Ferrolink OSS" },
      { name: "description", content: "Inventory of BNGs, OLTs, switches and access points with management addresses." },
      { property: "og:title", content: "Devices — Ferrolink OSS" },
      { property: "og:description", content: "Managed network element inventory." },
    ],
  }),
});

function DevicesPage() {
  return (
    <>
      <PageHeader
        title="Devices"
        subtitle="Managed network elements and their operational posture"
        actions={<Button size="sm" className="text-xs"><ServerCog className="size-3.5" /> Register device</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat3D label="Total elements" value={String(devices.length)} icon={ServerCog} grad="indigo" />
          <Stat3D label="BNG / edge" value={String(devices.filter((d) => d.type === "BNG" || d.type === "Edge Router").length)} icon={RouterIcon} grad="ocean" />
          <Stat3D label="OLTs" value={String(devices.filter((d) => d.type === "OLT").length)} icon={Cpu} grad="cyan" />
          <Stat3D label="Wireless APs" value={String(devices.filter((d) => d.type === "Access Point").length)} icon={Wifi} grad="fuchsia" />
        </div>
        <DataTable<Device>
          rows={devices}
          searchKeys={(d) => `${d.hostname} ${d.vendor} ${d.model} ${d.site} ${d.mgmtIp}`}
          cardTitle={(d) => <span className="flex items-center justify-between gap-2">{d.hostname}<StatusBadge value={d.status} dot={false} /></span>}
          filters={[
            { key: "type", label: "Type", options: ["BNG", "OLT", "Edge Router", "Switch", "Access Point"], match: (r, v) => r.type === v },
            { key: "vendor", label: "Vendor", options: ["Northwind", "Lumitek", "AirSpan", "Corevolt"], match: (r, v) => r.vendor === v },
          ]}
          columns={[
            { key: "hostname", header: "Hostname", sortable: true, value: (d) => d.hostname, render: (d) => <span className="num">{d.hostname}</span> },
            { key: "type", header: "Type", value: (d) => d.type },
            { key: "model", header: "Model", value: (d) => `${d.vendor} ${d.model}`, hideBelow: "md" },
            { key: "site", header: "Site", value: (d) => d.site, hideBelow: "md" },
            { key: "ip", header: "Mgmt IP", value: (d) => d.mgmtIp, render: (d) => <span className="num">{d.mgmtIp}</span>, hideBelow: "lg" },
            { key: "cpu", header: "CPU", align: "right", sortable: true, value: (d) => d.cpu, render: (d) => <span className="num">{d.cpu}%</span> },
            { key: "status", header: "Status", value: (d) => d.status, render: (d) => <StatusBadge value={d.status} /> },
          ]}
        />
      </div>
    </>
  );
}
