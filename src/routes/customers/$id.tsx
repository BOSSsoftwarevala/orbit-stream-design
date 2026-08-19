import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Paperclip,
  Phone,
  Power,
  RotateCcw,
} from "lucide-react";
import { PageHeader, Section } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  activity,
  customers,
  invoices,
  jobs,
  ledger,
  money,
  payments,
  plans,
  subscriptions,
  tickets,
} from "@/data/seed";

export const Route = createFileRoute("/customers/$id")({
  component: Customer360,
  loader: ({ params }) => {
    const customer = customers.find((c) => c.id === params.id);
    if (!customer) throw notFound();
    return { name: customer.name };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Customer"} — Customer 360 · Ferrolink OSS` },
      {
        name: "description",
        content: "Unified customer view: services, billing, invoices, tickets, jobs, documents and timeline.",
      },
      { property: "og:title", content: `${loaderData?.name ?? "Customer"} — Customer 360` },
      { property: "og:description", content: "Services, billing, support and field history for one account." },
    ],
  }),
});

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 py-1.5 text-xs last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function LifecycleFlow({ status }: { status: string }) {
  const steps = ["lead", "pending_install", "active", "suspended", "cancelled"];
  const idx = steps.indexOf(status);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-1.5">
          <span
            className={
              i === idx
                ? "rounded-full border border-primary/40 bg-primary/12 px-2 py-0.5 text-[11px] font-medium capitalize text-primary"
                : i < idx
                  ? "rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] capitalize text-muted-foreground"
                  : "rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] capitalize text-muted-foreground/60"
            }
          >
            {s.replace(/_/g, " ")}
          </span>
          {i < steps.length - 1 && <span className="text-muted-foreground/40">›</span>}
        </span>
      ))}
    </div>
  );
}

function Customer360() {
  const { id } = Route.useParams();
  const c = customers.find((x) => x.id === id)!;
  const plan = plans.find((p) => p.id === c.planId);
  const sub = subscriptions.find((s) => s.customerId === c.id);
  const custInvoices = invoices.filter((i) => i.customerId === c.id);
  const custPayments = payments.filter((p) => p.customerId === c.id);
  const custLedger = ledger.filter((l) => l.customerId === c.id);
  const custTickets = tickets.filter((t) => t.customerId === c.id);
  const custJobs = jobs.filter((j) => j.customerId === c.id);
  const [note, setNote] = useState("");

  return (
    <>
      <PageHeader
        title={c.name}
        subtitle={`${c.accountNumber} · customer since ${c.since}`}
        meta={
          <>
            <StatusBadge value={c.status} />
            {c.tags.map((t) => (
              <span key={t} className="rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                {t}
              </span>
            ))}
          </>
        }
        actions={
          <>
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <Link to="/customers">
                <ArrowLeft className="size-3.5" /> All customers
              </Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Power className="size-3.5" /> Suspend service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Suspend service for {c.name}?</DialogTitle>
                  <DialogDescription>
                    PPPoE sessions are dropped and the subscriber is moved into the walled garden. Billing continues
                    unless the account is also placed on hold.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button size="sm" variant="outline">Cancel</Button>
                  <Button size="sm" onClick={() => toast.success("Suspension queued (simulated)")}>
                    Confirm suspension
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button size="sm" className="text-xs" onClick={() => toast.success("Restore request queued (simulated)")}>
              <RotateCcw className="size-3.5" /> Restore
            </Button>
          </>
        }
      />

      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-4 lg:grid-cols-4">
          <Section title="Account">
            <Row label="Email" value={<span className="inline-flex items-center gap-1"><Mail className="size-3" />{c.email}</span>} />
            <Row label="Phone" value={<span className="inline-flex items-center gap-1"><Phone className="size-3" />{c.phone}</span>} />
            <Row label="Address" value={<span className="inline-flex items-center gap-1"><MapPin className="size-3" />{c.address}, {c.city}</span>} />
            <Row label="Balance" value={<span className={c.balance > 0 ? "num text-overdue" : "num"}>{money(c.balance)}</span>} />
          </Section>
          <Section title="Service">
            <Row label="Plan" value={plan?.name ?? "—"} />
            <Row label="Speed" value={plan ? `${plan.down} / ${plan.up} Mbps` : "—"} />
            <Row label="Technology" value={plan?.technology ?? "—"} />
            <Row label="Contract" value={plan?.contractTerm ?? "—"} />
          </Section>
          <Section title="Provisioning">
            <Row label="PPPoE user" value={<span className="num">{sub?.pppoeUser ?? "—"}</span>} />
            <Row label="IP address" value={<span className="num">{sub?.ipAddress ?? "—"}</span>} />
            <Row label="NAS / BNG" value={sub?.nasDevice ?? "—"} />
            <Row label="VLAN" value={<span className="num">{sub?.vlan ?? "—"}</span>} />
          </Section>
          <Section title="Lifecycle">
            <LifecycleFlow status={c.status} />
            <p className="mt-3 text-[11px] text-muted-foreground">
              Auto-suspension triggers at 21 days past due; restoration is automatic once the balance clears.
            </p>
          </Section>
        </div>

        <Tabs defaultValue="billing">
          <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-surface-2">
            <TabsTrigger value="billing" className="text-xs">Billing</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs">Payments & ledger</TabsTrigger>
            <TabsTrigger value="support" className="text-xs">Support</TabsTrigger>
            <TabsTrigger value="jobs" className="text-xs">Field work</TabsTrigger>
            <TabsTrigger value="docs" className="text-xs">Documents</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="billing" className="mt-3">
            <Section title="Invoices">
              {custInvoices.length === 0 ? (
                <EmptyState title="No invoices issued" description="This account has not been billed yet." />
              ) : (
                <ul className="divide-y divide-border text-xs">
                  {custInvoices.map((i) => (
                    <li key={i.id} className="flex items-center gap-3 py-2">
                      <span className="num w-24">{i.number}</span>
                      <span className="text-muted-foreground">issued {i.issued}</span>
                      <StatusBadge value={i.status} dot={false} />
                      <span className="num ml-auto">{money(i.total)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </TabsContent>

          <TabsContent value="payments" className="mt-3 grid gap-4 lg:grid-cols-2">
            <Section title="Payments">
              {custPayments.length === 0 ? (
                <EmptyState title="No payments recorded" />
              ) : (
                <ul className="divide-y divide-border text-xs">
                  {custPayments.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 py-2">
                      <span className="num w-20">{p.date}</span>
                      <span>{p.method}</span>
                      <StatusBadge value={p.status} dot={false} />
                      <span className="num ml-auto">{money(p.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
            <Section title="Credits & debits">
              {custLedger.length === 0 ? (
                <EmptyState title="No adjustments" />
              ) : (
                <ul className="divide-y divide-border text-xs">
                  {custLedger.map((l) => (
                    <li key={l.id} className="flex items-center gap-3 py-2">
                      <span className="num w-20">{l.date}</span>
                      <span className="min-w-0 flex-1 truncate">{l.reason}</span>
                      <span className={l.type === "credit" ? "num text-active" : "num text-overdue"}>
                        {l.type === "credit" ? "-" : "+"}
                        {money(l.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </TabsContent>

          <TabsContent value="support" className="mt-3">
            <Section title="Tickets">
              {custTickets.length === 0 ? (
                <EmptyState title="No support history" description="No tickets have been opened for this account." />
              ) : (
                <ul className="divide-y divide-border text-xs">
                  {custTickets.map((t) => (
                    <li key={t.id} className="flex items-center gap-3 py-2">
                      <span className="num w-16">{t.number}</span>
                      <Link to="/tickets/$id" params={{ id: t.id }} className="min-w-0 flex-1 truncate hover:text-primary">
                        {t.subject}
                      </Link>
                      <StatusBadge value={t.priority} dot={false} />
                      <StatusBadge value={t.status} dot={false} />
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </TabsContent>

          <TabsContent value="jobs" className="mt-3">
            <Section title="Job orders">
              {custJobs.length === 0 ? (
                <EmptyState title="No field work" description="No installations or repairs are on record." />
              ) : (
                <ul className="divide-y divide-border text-xs">
                  {custJobs.map((j) => (
                    <li key={j.id} className="flex items-center gap-3 py-2">
                      <span className="num w-20">{j.number}</span>
                      <span>{j.type}</span>
                      <span className="text-muted-foreground">{j.scheduled} · {j.window}</span>
                      <StatusBadge value={j.status} dot={false} className="ml-auto" />
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </TabsContent>

          <TabsContent value="docs" className="mt-3">
            <Section title="Documents & contracts">
              <ul className="divide-y divide-border text-xs">
                {[
                  { name: "Service agreement — 24 month term.pdf", size: "184 KB" },
                  { name: "Installation site survey.pdf", size: "912 KB" },
                  { name: "Signed equipment receipt.png", size: "410 KB" },
                ].map((d) => (
                  <li key={d.name} className="flex items-center gap-2 py-2">
                    <FileText className="size-3.5 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">{d.name}</span>
                    <span className="text-muted-foreground">{d.size}</span>
                    <Button variant="ghost" size="sm" className="h-6 text-[11px]">Open</Button>
                  </li>
                ))}
              </ul>
            </Section>
          </TabsContent>

          <TabsContent value="notes" className="mt-3">
            <Section title="Internal notes & communication">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add an internal note — visible to staff only…"
                className="text-xs"
              />
              <div className="mt-2 flex items-center gap-2">
                <Button
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setNote("");
                    toast.success("Note added to account timeline");
                  }}
                >
                  <MessageSquare className="size-3.5" /> Save note
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Paperclip className="size-3.5" /> Attach file
                </Button>
              </div>
              <ul className="mt-4 space-y-3 text-xs">
                <li className="rounded border border-border bg-surface-2 p-2.5">
                  <p className="font-medium">Called about evening slowdowns</p>
                  <p className="text-muted-foreground">S. Haddad · 2026-08-14 · outbound call, 6 min</p>
                </li>
                <li className="rounded border border-border bg-surface-2 p-2.5">
                  <p className="font-medium">Upgrade offer sent (Residential Gig)</p>
                  <p className="text-muted-foreground">R. Delgado · 2026-08-02 · email</p>
                </li>
              </ul>
            </Section>
          </TabsContent>

          <TabsContent value="timeline" className="mt-3">
            <Section title="Unified timeline">
              <ol className="relative space-y-4 border-l border-border pl-4 text-xs">
                {activity.map((a) => (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[21px] top-1 size-2 rounded-full border border-background bg-primary" />
                    <p className="font-medium">{a.action}</p>
                    <p className="text-muted-foreground">
                      {a.target} · {a.actor} · {a.time} · <span className="capitalize">{a.kind}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </Section>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
