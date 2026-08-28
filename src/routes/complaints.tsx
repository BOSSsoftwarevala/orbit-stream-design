import { createFileRoute } from "@tanstack/react-router";
import { Activity, Gavel, MessageSquareWarning } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { tickets } from "@/data/seed";

export const Route = createFileRoute("/complaints")({
  component: ComplaintsPage,
  head: () => ({
    meta: [
      { title: "Complaint Intake — Ferrolink OSS" },
      { name: "description", content: "Formal complaints, regulatory escalations and resolution commitments." },
      { property: "og:title", content: "Complaint Intake — Ferrolink OSS" },
      { property: "og:description", content: "Formal complaints and regulatory escalation tracking." },
    ],
  }),
});

interface Complaint {
  id: string;
  reference: string;
  customerName: string;
  nature: string;
  regulator: string;
  received: string;
  dueDays: number;
  status: "new" | "open" | "escalated" | "resolved";
  owner: string;
}

const NATURES = ["Service outage duration", "Billing dispute", "Installation delay", "Speed not as advertised", "Contract terms"];
const REGULATORS = ["Internal", "Internal", "Telecom Ombudsman", "Consumer Affairs"];

const complaints: Complaint[] = tickets.slice(0, 12).map((t, i) => ({
  id: `CP-${400 + i}`,
  reference: `CMP-${5120 + i}`,
  customerName: t.customerName,
  nature: NATURES[i % NATURES.length]!,
  regulator: REGULATORS[i % REGULATORS.length]!,
  received: t.created.slice(0, 10),
  dueDays: 10 - (i % 12),
  status: i % 7 === 0 ? "escalated" : i % 5 === 0 ? "resolved" : i % 3 === 0 ? "new" : "open",
  owner: t.assignee,
}));

function ComplaintsPage() {
  return (
    <>
      <PageHeader
        title="Complaint Intake"
        subtitle="Formal complaints tracked separately from the day-to-day ticket queue"
        actions={<Button size="sm" className="text-xs"><MessageSquareWarning className="size-3.5" /> Log complaint</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat3D label="Open complaints" value={String(complaints.filter((c) => c.status !== "resolved").length)} icon={MessageSquareWarning} grad="sunset" />
          <Stat3D label="Regulator involved" value={String(complaints.filter((c) => c.regulator !== "Internal").length)} icon={Gavel} grad="fuchsia" />
          <Stat3D label="Past commitment" value={String(complaints.filter((c) => c.dueDays < 0).length)} icon={Activity} grad="rose" />
        </div>
        <DataTable<Complaint>
          rows={complaints}
          searchKeys={(c) => `${c.reference} ${c.customerName} ${c.nature} ${c.owner}`}
          cardTitle={(c) => <span className="flex items-center justify-between gap-2">{c.reference}<StatusBadge value={c.status} dot={false} /></span>}
          filters={[
            { key: "status", label: "Status", options: ["new", "open", "escalated", "resolved"], match: (r, v) => r.status === v },
            { key: "reg", label: "Body", options: ["Internal", "Telecom Ombudsman", "Consumer Affairs"], match: (r, v) => r.regulator === v },
          ]}
          columns={[
            { key: "reference", header: "Case", sortable: true, value: (c) => c.reference, render: (c) => <span className="num">{c.reference}</span> },
            { key: "customer", header: "Complainant", sortable: true, value: (c) => c.customerName },
            { key: "nature", header: "Nature", value: (c) => c.nature, hideBelow: "md" },
            { key: "regulator", header: "Body", value: (c) => c.regulator, hideBelow: "lg" },
            { key: "owner", header: "Owner", value: (c) => c.owner, hideBelow: "lg" },
            {
              key: "due", header: "Commitment", align: "right", sortable: true, value: (c) => c.dueDays,
              render: (c) => <span className={`num text-xs ${c.dueDays < 0 ? "text-overdue" : "text-muted-foreground"}`}>{c.dueDays < 0 ? `${Math.abs(c.dueDays)}d over` : `${c.dueDays}d left`}</span>,
            },
            { key: "status", header: "Status", value: (c) => c.status, render: (c) => <StatusBadge value={c.status} /> },
          ]}
        />
      </div>
    </>
  );
}
