import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Target, TrendingUp, UserRound } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { leads, money } from "@/data/seed";
import type { Lead } from "@/types";

export const Route = createFileRoute("/leads")({
  component: LeadsPage,
  head: () => ({
    meta: [
      { title: "Leads — Ferrolink OSS" },
      { name: "description", content: "Inbound and outbound prospects with serviceability status and owner assignment." },
      { property: "og:title", content: "Leads — Ferrolink OSS" },
      { property: "og:description", content: "Prospect pipeline with owners and estimated value." },
    ],
  }),
});

function LeadsPage() {
  const won = leads.filter((l) => l.stage === "won");
  return (
    <>
      <PageHeader
        title="Leads"
        subtitle="Prospects captured from the web, referrals and door-to-door canvassing"
        actions={<Button size="sm" className="text-xs"><UserRound className="size-3.5" /> Add lead</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat3D label="Open leads" value={String(leads.filter((l) => !["won", "lost"].includes(l.stage)).length)} icon={Target} grad="fuchsia" />
          <Stat3D label="Pipeline value" value={money(leads.reduce((a, l) => a + l.value, 0))} icon={TrendingUp} grad="lime" />
          <Stat3D label="Won this month" value={String(won.length)} icon={Sparkles} grad="emerald" />
          <Stat3D label="Avg deal size" value={money(leads.reduce((a, l) => a + l.value, 0) / leads.length)} icon={UserRound} grad="indigo" />
        </div>
        <DataTable<Lead>
          rows={leads}
          searchKeys={(l) => `${l.name} ${l.contact} ${l.source} ${l.owner} ${l.address}`}
          cardTitle={(l) => <span className="flex items-center justify-between gap-2">{l.name}<StatusBadge value={l.stage} dot={false} /></span>}
          filters={[
            { key: "stage", label: "Stage", options: ["new", "qualified", "survey", "quoted", "won", "lost"], match: (r, v) => r.stage === v },
            { key: "source", label: "Source", options: ["Web form", "Referral", "Door knock", "Trade show", "Inbound call"], match: (r, v) => r.source === v },
          ]}
          columns={[
            { key: "name", header: "Lead", sortable: true, value: (l) => l.name },
            { key: "contact", header: "Contact", value: (l) => l.contact, hideBelow: "md" },
            { key: "address", header: "Address", value: (l) => l.address, hideBelow: "lg" },
            { key: "source", header: "Source", value: (l) => l.source, hideBelow: "md" },
            { key: "owner", header: "Owner", value: (l) => l.owner, hideBelow: "lg" },
            { key: "value", header: "Value", align: "right", sortable: true, value: (l) => l.value, render: (l) => <span className="num font-medium">{money(l.value)}</span> },
            { key: "stage", header: "Stage", value: (l) => l.stage, render: (l) => <StatusBadge value={l.stage} /> },
          ]}
        />
      </div>
    </>
  );
}
