import { createFileRoute } from "@tanstack/react-router";
import { Download, LineChart as LineChartIcon, PackageSearch, Users } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Section } from "@/components/common/page-header";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { arAging, customers, invoices, money, revenueSeries, tickets } from "@/data/seed";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
  head: () => ({
    meta: [
      { title: "Reports — Ferrolink OSS" },
      { name: "description", content: "Revenue, receivables and operations reporting with exportable data sets." },
      { property: "og:title", content: "Reports — Ferrolink OSS" },
      { property: "og:description", content: "Revenue, receivables and operations reporting." },
    ],
  }),
});

const CATALOG = [
  { name: "Monthly recurring revenue", desc: "MRR by plan and service area", cadence: "Monthly" },
  { name: "Aged receivables", desc: "Outstanding balances bucketed 0–90+ days", cadence: "Weekly" },
  { name: "Churn & retention", desc: "Cancellations, downgrades and win-backs", cadence: "Monthly" },
  { name: "Field productivity", desc: "Jobs completed per technician and first-time fix rate", cadence: "Weekly" },
  { name: "Network availability", desc: "Element uptime and outage minutes by site", cadence: "Daily" },
  { name: "Inventory movement", desc: "Consumption, transfers and RMA volume", cadence: "Monthly" },
];

function ReportsPage() {
  const outstanding = invoices.filter((i) => i.status !== "paid").reduce((a, i) => a + i.total, 0);

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Scheduled and ad-hoc analytics across billing, network and field operations"
        actions={<Button size="sm" className="text-xs"><Download className="size-3.5" /> Export CSV</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat3D label="Outstanding AR" value={money(outstanding)} icon={LineChartIcon} grad="rose" />
          <Stat3D label="Accounts" value={String(customers.length)} icon={Users} grad="teal" />
          <Stat3D label="Tickets (30d)" value={String(tickets.length)} icon={PackageSearch} grad="violet" />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Section title="Billed vs collected">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSeries}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} width={40} />
                  <Tooltip />
                  <Area type="monotone" dataKey="billed" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.18} />
                  <Area type="monotone" dataKey="collected" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.18} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Section>
          <Section title="Receivables aging">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={arAging}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="bucket" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} width={40} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="var(--chart-3)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        <Section title="Report catalog">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {CATALOG.map((r) => (
              <div key={r.name} className="rounded-md border border-border p-3">
                <p className="text-sm font-medium">{r.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{r.cadence}</span>
                  <Button variant="outline" size="sm" className="h-6 text-[11px]">Run</Button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
