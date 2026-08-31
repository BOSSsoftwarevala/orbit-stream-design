import { createFileRoute } from "@tanstack/react-router";
import { HardDrive, PackageCheck, RotateCcw, ScanLine } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { serials } from "@/data/seed";
import type { SerialUnit } from "@/types";

export const Route = createFileRoute("/serials")({
  component: SerialsPage,
  head: () => ({
    meta: [
      { title: "Serialized Units — Ferrolink OSS" },
      { name: "description", content: "Track every serialized ONU, router and CPE from depot stock through deployment and RMA." },
      { property: "og:title", content: "Serialized Units — Ferrolink OSS" },
      { property: "og:description", content: "Serial-level equipment tracking and assignment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const tone: Record<SerialUnit["state"], string> = {
  in_stock: "active",
  assigned: "pending",
  deployed: "active",
  rma: "overdue",
  retired: "offline",
};

function SerialsPage() {
  const deployed = serials.filter((s) => s.state === "deployed").length;
  const rma = serials.filter((s) => s.state === "rma").length;

  return (
    <>
      <PageHeader
        title="Serialized units"
        subtitle="Serial-level custody for ONUs, routers and CPE across depots, technicians and subscribers"
        actions={
          <Button size="sm" className="text-xs">
            <ScanLine className="size-3.5" /> Scan serial
          </Button>
        }
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <Stat3D label="Tracked units" value={String(serials.length)} icon={HardDrive} grad="indigo" />
          <Stat3D label="In stock" value={String(serials.filter((s) => s.state === "in_stock").length)} icon={PackageCheck} grad="emerald" />
          <Stat3D label="Deployed" value={String(deployed)} icon={ScanLine} grad="cyan" />
          <Stat3D label="In RMA" value={String(rma)} icon={RotateCcw} grad="rose" />
        </div>
        <DataTable<SerialUnit>
          rows={serials}
          searchKeys={(s) => `${s.serial} ${s.sku} ${s.model} ${s.location} ${s.assignedTo ?? ""}`}
          cardTitle={(s) => <span className="num">{s.serial}</span>}
          filters={[
            {
              key: "state",
              label: "State",
              options: ["in_stock", "assigned", "deployed", "rma", "retired"],
              match: (r, v) => r.state === v,
            },
            {
              key: "loc",
              label: "Location",
              options: ["Central Depot", "Northgate Hub", "Field Van 12", "RMA Quarantine"],
              match: (r, v) => r.location === v,
            },
          ]}
          columns={[
            { key: "serial", header: "Serial", sortable: true, value: (s) => s.serial, render: (s) => <span className="num">{s.serial}</span> },
            { key: "sku", header: "SKU", value: (s) => s.sku, render: (s) => <span className="num">{s.sku}</span>, hideBelow: "md" },
            { key: "model", header: "Model", value: (s) => s.model },
            { key: "location", header: "Location", value: (s) => s.location, hideBelow: "lg" },
            { key: "assigned", header: "Assigned to", value: (s) => s.assignedTo ?? "—", hideBelow: "lg" },
            { key: "state", header: "State", render: (s) => <StatusBadge value={tone[s.state]} label={s.state.replace("_", " ")} /> },
          ]}
        />
      </div>
    </>
  );
}
