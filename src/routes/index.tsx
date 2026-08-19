import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  LifeBuoy,
  Radio,
  Users,
  Wrench,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, Section } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  activity,
  arAging,
  customers,
  devices,
  invoices,
  jobs,
  money,
  revenueSeries,
  stock,
  subscriptions,
  tickets,
  trafficSeries,
} from "@/data/seed";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Command Dashboard — Ferrolink OSS" },
      {
        name: "description",
        content:
          "Live operator overview: recurring revenue, subscriber states, receivables aging, network health, SLA risk and field work.",
      },
      { property: "og:title", content: "Command Dashboard — Ferrolink OSS" },
      {
        property: "og:description",
        content: "Revenue, subscribers, network health and field operations at a glance.",
      },
    ],
  }),
});

const axis = { stroke: "hsl(var(--muted-foreground))", fontSize: 11 } as const;

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="num text-muted-foreground">
          {p.name}: <span className="text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

function Dashboard() {
  const active = customers.filter((c) => c.status === "active").length;
  const suspended = customers.filter((c) => c.status === "suspended").length;
  const mrr = subscriptions.filter((s) => s.status === "active").reduce((a, s) => a + s.mrr, 0);
  const outstanding = invoices
    .filter((i) => i.status === "open" || i.status === "overdue")
    .reduce((a, i) => a + i.total, 0);
  const openTickets = tickets.filter((t) => !["resolved", "closed"].includes(t.status));
  const breached = openTickets.filter((t) => t.slaDueMinutes < 0).length;
  const todayJobs = jobs.filter((j) => j.status !== "completed");
  const lowStock = stock.filter((s) => s.onHand <= s.reorderPoint);
  const impaired = devices.filter((d) => d.status !== "online");

  return (
    <>
      <PageHeader
        title="Command Dashboard"
        subtitle="Region 4 · rolling 24 h operational picture"
        meta={
          <>
            <StatusBadge value="online" />
            <span className="text-xs text-muted-foreground">
              {devices.length} managed devices · {subscriptions.length} provisioned services
            </span>
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm" className="text-xs" asChild>
              <Link to="/reports">Open reports</Link>
            </Button>
            <Button size="sm" className="text-xs" asChild>
              <Link to="/provisioning">New provisioning run</Link>
            </Button>
          </>
        }
      />

      <div className="space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-6">
          <StatCard label="MRR" value={money(mrr)} delta={3.4} hint="vs last month" icon={CircleDollarSign} />
          <StatCard label="Active services" value={String(active)} delta={1.8} icon={Users} tone="active" />
          <StatCard label="Suspended" value={String(suspended)} delta={-6.2} hint="dunning stage 2+" icon={AlertTriangle} tone="suspended" />
          <StatCard label="Outstanding AR" value={money(outstanding)} hint="open + overdue" icon={CircleDollarSign} tone="overdue" />
          <StatCard label="Open tickets" value={String(openTickets.length)} hint={`${breached} SLA breached`} icon={LifeBuoy} tone="pending" />
          <StatCard label="Jobs in flight" value={String(todayJobs.length)} hint="installs, repairs, upgrades" icon={Wrench} />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Section
            title="Recurring revenue & collections"
            description="Thousands USD, last 7 periods"
            actions={<span className="text-[11px] text-muted-foreground">MRR vs collected</span>}
          >
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSeries}>
                  <defs>
                    <linearGradient id="gMrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} {...axis} />
                  <YAxis tickLine={false} axisLine={false} width={34} {...axis} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="mrr" name="MRR" stroke="var(--color-chart-1)" fill="url(#gMrr)" strokeWidth={2} />
                  <Area type="monotone" dataKey="collected" name="Collected" stroke="var(--color-chart-3)" fill="transparent" strokeWidth={2} strokeDasharray="4 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Receivables aging" description="Balance by bucket">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={arAging}>
                  <CartesianGrid strokeDasharray="2 4" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="bucket" tickLine={false} axisLine={false} {...axis} />
                  <YAxis tickLine={false} axisLine={false} width={44} {...axis} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="amount" name="Amount" fill="var(--color-chart-4)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Churn rate" description="% of base per month">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueSeries}>
                  <CartesianGrid strokeDasharray="2 4" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} {...axis} />
                  <YAxis tickLine={false} axisLine={false} width={30} {...axis} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="churn" name="Churn %" stroke="var(--color-chart-5)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Section
            title="Aggregate egress"
            description="Core BNG throughput, 24 h"
            actions={<StatusBadge value="online" />}
          >
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficSeries}>
                  <CartesianGrid strokeDasharray="2 4" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="hour" interval={5} tickLine={false} axisLine={false} {...axis} />
                  <YAxis tickLine={false} axisLine={false} width={30} {...axis} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="gbps" name="Gbps" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.18} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section
            title="Network health"
            description={`${impaired.length} devices need attention`}
            actions={
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link to="/network">Status board</Link>
              </Button>
            }
          >
            <ul className="space-y-2">
              {devices.slice(0, 6).map((d) => (
                <li key={d.id} className="flex items-center gap-3 text-xs">
                  <Radio className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="w-32 shrink-0 truncate font-medium">{d.hostname}</span>
                  <Progress value={d.cpu} className="h-1.5 flex-1" />
                  <span className="num w-9 text-right text-muted-foreground">{d.cpu}%</span>
                  <StatusBadge value={d.status} dot={false} />
                </li>
              ))}
            </ul>
          </Section>

          <Section
            title="SLA risk"
            description="Open tickets by remaining time"
            actions={
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link to="/tickets">Queue</Link>
              </Button>
            }
          >
            <ul className="space-y-2">
              {openTickets.slice(0, 6).map((t) => (
                <li key={t.id} className="flex items-center gap-2 text-xs">
                  <span className="num w-14 shrink-0 text-muted-foreground">{t.number}</span>
                  <Link to="/tickets/$id" params={{ id: t.id }} className="min-w-0 flex-1 truncate hover:text-primary">
                    {t.subject}
                  </Link>
                  <StatusBadge value={t.priority} dot={false} />
                  <span className={t.slaDueMinutes < 0 ? "num w-16 text-right text-overdue" : "num w-16 text-right text-muted-foreground"}>
                    {t.slaDueMinutes < 0 ? `-${Math.abs(t.slaDueMinutes)}m` : `${t.slaDueMinutes}m`}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Section
            title="Today's field work"
            actions={
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link to="/dispatch">Dispatch</Link>
              </Button>
            }
          >
            <ul className="divide-y divide-border text-xs">
              {todayJobs.slice(0, 6).map((j) => (
                <li key={j.id} className="flex items-center gap-2 py-2 first:pt-0">
                  <Wrench className="size-3.5 text-muted-foreground" />
                  <span className="num w-16 shrink-0">{j.number}</span>
                  <span className="min-w-0 flex-1 truncate">
                    {j.type} · {j.customerName}
                  </span>
                  <span className="hidden text-muted-foreground sm:inline">{j.window}</span>
                  <StatusBadge value={j.status} dot={false} />
                </li>
              ))}
            </ul>
          </Section>

          <Section
            title="Inventory alerts"
            actions={
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link to="/stock">Stock</Link>
              </Button>
            }
          >
            {lowStock.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">All SKUs above reorder point.</p>
            ) : (
              <ul className="space-y-2.5 text-xs">
                {lowStock.map((s) => (
                  <li key={s.id}>
                    <div className="flex items-center gap-2">
                      <Boxes className="size-3.5 text-muted-foreground" />
                      <span className="min-w-0 flex-1 truncate font-medium">{s.name}</span>
                      <span className="num text-overdue">
                        {s.onHand}/{s.reorderPoint}
                      </span>
                    </div>
                    <Progress value={(s.onHand / s.reorderPoint) * 100} className="mt-1.5 h-1" />
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Recent activity">
            <ol className="relative space-y-3 border-l border-border pl-4 text-xs">
              {activity.map((a) => (
                <li key={a.id} className="relative">
                  <span className="absolute -left-[21px] top-1 size-2 rounded-full border border-background bg-primary" />
                  <p className="font-medium">{a.action}</p>
                  <p className="text-muted-foreground">
                    {a.target} · {a.actor} · {a.time}
                  </p>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Activity className="size-3" /> Phase 1 interface running on local seed data — no live network or billing
          systems are attached.
        </p>
      </div>
    </>
  );
}
