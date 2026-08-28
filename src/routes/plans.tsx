import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowUpFromLine, FileText, Plus, Users } from "lucide-react";
import { PageHeader, Section } from "@/components/common/page-header";
import { GlassCard, Icon3D, Stat3D, type Grad } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { money, plans } from "@/data/seed";

export const Route = createFileRoute("/plans")({
  component: PlansPage,
  head: () => ({
    meta: [
      { title: "Service Plans — Ferrolink OSS" },
      { name: "description", content: "Residential and business tariffs with speed profiles, terms and subscriber counts." },
      { property: "og:title", content: "Service Plans — Ferrolink OSS" },
      { property: "og:description", content: "Speed profiles, contract terms and subscriber counts." },
    ],
  }),
});

const GRADS: Grad[] = ["cyan", "ocean", "indigo", "fuchsia", "lime", "sunset", "violet", "emerald"];

function PlansPage() {
  const subs = plans.reduce((a, p) => a + p.subscribers, 0);
  const mrr = plans.reduce((a, p) => a + p.subscribers * p.price, 0);

  return (
    <>
      <PageHeader
        title="Service Plans"
        subtitle="Tariff catalog used by billing, provisioning and sales"
        actions={<Button size="sm" className="text-xs"><Plus className="size-3.5" /> New plan</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat3D label="Plans published" value={String(plans.length)} icon={FileText} grad="indigo" />
          <Stat3D label="Subscribers on plan" value={subs.toLocaleString()} icon={Users} grad="lime" />
          <Stat3D label="Catalog MRR" value={money(mrr)} icon={ArrowUpFromLine} grad="emerald" />
        </div>

        <Section title="Catalog">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {plans.map((p, i) => (
              <GlassCard key={p.id} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.technology} · {p.contractTerm}</p>
                  </div>
                  <Icon3D icon={FileText} grad={GRADS[i % GRADS.length]!} size="sm" />
                </div>
                <p className="num text-2xl font-semibold">{money(p.price)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <span className="flex items-center gap-1.5"><ArrowDownToLine className="size-3.5 text-muted-foreground" /><span className="num">{p.down} Mbps</span></span>
                  <span className="flex items-center gap-1.5"><ArrowUpFromLine className="size-3.5 text-muted-foreground" /><span className="num">{p.up} Mbps</span></span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2 text-[11px] text-muted-foreground">
                  <span>{p.dataPolicy}</span>
                  <span className="num">{p.subscribers.toLocaleString()} subs</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-7 flex-1 text-[11px]">Edit</Button>
                  <Button size="sm" className="h-7 flex-1 text-[11px]">Assign</Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
