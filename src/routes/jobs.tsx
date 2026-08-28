import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Truck, TriangleAlert, Wrench } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { jobs } from "@/data/seed";
import type { JobOrder } from "@/types";

export const Route = createFileRoute("/jobs")({
  component: JobsPage,
  head: () => ({
    meta: [
      { title: "Job Orders — Ferrolink OSS" },
      { name: "description", content: "Installations, repairs, upgrades, relocations and disconnections with equipment usage." },
      { property: "og:title", content: "Job Orders — Ferrolink OSS" },
      { property: "og:description", content: "Field work orders with technicians and equipment usage." },
    ],
  }),
});

function JobsPage() {
  return (
    <>
      <PageHeader
        title="Job Orders"
        subtitle="Every field task from truck roll to sign-off"
        actions={<Button size="sm" className="text-xs"><Wrench className="size-3.5" /> New job order</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat3D label="Open work" value={String(jobs.filter((j) => !["completed", "failed"].includes(j.status)).length)} icon={Wrench} grad="sunset" />
          <Stat3D label="In progress" value={String(jobs.filter((j) => j.status === "in_progress" || j.status === "en_route").length)} icon={Truck} grad="cyan" />
          <Stat3D label="Completed" value={String(jobs.filter((j) => j.status === "completed").length)} icon={CheckCircle2} grad="emerald" />
          <Stat3D label="Failed visits" value={String(jobs.filter((j) => j.status === "failed").length)} icon={TriangleAlert} grad="rose" />
        </div>
        <DataTable<JobOrder>
          rows={jobs}
          searchKeys={(j) => `${j.number} ${j.customerName} ${j.technician} ${j.address} ${j.type}`}
          cardTitle={(j) => <span className="flex items-center justify-between gap-2">{j.number}<StatusBadge value={j.status} dot={false} /></span>}
          bulkActions={<Button variant="outline" size="sm" className="h-6 text-[11px]">Reassign</Button>}
          filters={[
            { key: "status", label: "Status", options: ["unassigned", "scheduled", "en_route", "in_progress", "completed", "failed"], match: (r, v) => r.status === v },
            { key: "type", label: "Type", options: ["Installation", "Repair", "Upgrade", "Relocation", "Disconnection"], match: (r, v) => r.type === v },
          ]}
          columns={[
            { key: "number", header: "Order", sortable: true, value: (j) => j.number, render: (j) => <span className="num">{j.number}</span> },
            { key: "type", header: "Type", value: (j) => j.type },
            { key: "customer", header: "Account", sortable: true, value: (j) => j.customerName, hideBelow: "md" },
            { key: "address", header: "Address", value: (j) => j.address, hideBelow: "lg" },
            { key: "tech", header: "Technician", value: (j) => j.technician, hideBelow: "md" },
            { key: "scheduled", header: "Scheduled", sortable: true, value: (j) => `${j.scheduled} ${j.window}`, render: (j) => <span className="num text-xs">{j.scheduled} · {j.window}</span>, hideBelow: "lg" },
            { key: "equipment", header: "Equipment", value: (j) => j.equipment.length, render: (j) => <span className="num text-xs text-muted-foreground">{j.equipment.reduce((a, e) => a + e.qty, 0)} items</span>, hideBelow: "lg" },
            { key: "status", header: "Status", value: (j) => j.status, render: (j) => <StatusBadge value={j.status} /> },
          ]}
        />
      </div>
    </>
  );
}
