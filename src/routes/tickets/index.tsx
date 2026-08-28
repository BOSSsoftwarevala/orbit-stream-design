import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LifeBuoy, TimerReset, TriangleAlert, Inbox } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { tickets } from "@/data/seed";
import type { Ticket } from "@/types";

export const Route = createFileRoute("/tickets/")({
  component: TicketsPage,
  head: () => ({
    meta: [
      { title: "Ticket Queue — Ferrolink OSS" },
      { name: "description", content: "Support queue with SLA countdowns, priorities and channel routing." },
      { property: "og:title", content: "Ticket Queue — Ferrolink OSS" },
      { property: "og:description", content: "Support queue with SLA countdowns and channel routing." },
    ],
  }),
});

export function sla(minutes: number) {
  if (minutes < 0) return { label: `${Math.abs(minutes)}m over`, tone: "text-overdue" };
  if (minutes < 60) return { label: `${minutes}m left`, tone: "text-suspended" };
  return { label: `${Math.round(minutes / 60)}h left`, tone: "text-muted-foreground" };
}

function TicketsPage() {
  const navigate = useNavigate();
  const open = tickets.filter((t) => !["resolved", "closed"].includes(t.status));
  const breached = tickets.filter((t) => t.slaDueMinutes < 0);

  return (
    <>
      <PageHeader
        title="Ticket Queue"
        subtitle="Every inbound support conversation, ranked by SLA exposure"
        actions={<Button size="sm" className="text-xs"><LifeBuoy className="size-3.5" /> New ticket</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat3D label="Open tickets" value={String(open.length)} icon={Inbox} grad="teal" />
          <Stat3D label="SLA breached" value={String(breached.length)} icon={TriangleAlert} grad="rose" />
          <Stat3D label="Escalated" value={String(tickets.filter((t) => t.status === "escalated").length)} icon={TimerReset} grad="amber" />
          <Stat3D label="Resolved" value={String(tickets.filter((t) => t.status === "resolved").length)} icon={LifeBuoy} grad="emerald" />
        </div>
        <DataTable<Ticket>
          rows={tickets}
          onRowClick={(t) => navigate({ to: "/tickets/$id", params: { id: t.id } })}
          searchKeys={(t) => `${t.number} ${t.subject} ${t.customerName} ${t.assignee}`}
          cardTitle={(t) => <span className="flex items-center justify-between gap-2">{t.number}<StatusBadge value={t.status} dot={false} /></span>}
          filters={[
            { key: "status", label: "Status", options: ["new", "open", "pending", "escalated", "resolved", "closed"], match: (r, v) => r.status === v },
            { key: "priority", label: "Priority", options: ["urgent", "high", "normal", "low"], match: (r, v) => r.priority === v },
            { key: "channel", label: "Channel", options: ["Phone", "Email", "Portal", "Chat", "Walk-in"], match: (r, v) => r.channel === v },
          ]}
          columns={[
            { key: "number", header: "Ticket", sortable: true, value: (t) => t.number, render: (t) => <span className="num">{t.number}</span> },
            { key: "subject", header: "Subject", value: (t) => t.subject },
            { key: "customer", header: "Account", sortable: true, value: (t) => t.customerName, hideBelow: "md" },
            { key: "assignee", header: "Assignee", value: (t) => t.assignee, hideBelow: "lg" },
            { key: "priority", header: "Priority", value: (t) => t.priority, render: (t) => <StatusBadge value={t.priority} /> },
            {
              key: "sla", header: "SLA", align: "right", sortable: true, value: (t) => t.slaDueMinutes,
              render: (t) => <span className={`num text-xs ${sla(t.slaDueMinutes).tone}`}>{sla(t.slaDueMinutes).label}</span>,
            },
            { key: "status", header: "Status", value: (t) => t.status, render: (t) => <StatusBadge value={t.status} /> },
          ]}
        />
      </div>
    </>
  );
}
