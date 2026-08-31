import { createFileRoute } from "@tanstack/react-router";
import { Building2, Boxes, MapPin, PackageSearch, UserRound } from "lucide-react";
import { PageHeader, Section } from "@/components/common/page-header";
import { GlassCard, Icon3D, Stat3D, type Grad } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { money, stock, warehouses } from "@/data/seed";

export const Route = createFileRoute("/warehouses")({
  component: WarehousesPage,
  head: () => ({
    meta: [
      { title: "Warehouses — Ferrolink OSS" },
      { name: "description", content: "Depots, field vans and RMA quarantine locations with stock coverage and custodians." },
      { property: "og:title", content: "Warehouses — Ferrolink OSS" },
      { property: "og:description", content: "Depot and field-van inventory locations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const grads: Grad[] = ["ocean", "emerald", "sunset", "indigo"];

function WarehousesPage() {
  const totalUnits = warehouses.reduce((a, w) => a + w.units, 0);
  const totalValue = stock.reduce((a, s) => a + s.onHand * s.unitCost, 0);
  const maxUnits = Math.max(...warehouses.map((w) => w.units));

  return (
    <>
      <PageHeader
        title="Warehouses"
        subtitle="Depots, mobile vans and quarantine locations holding network equipment"
        actions={
          <Button size="sm" className="text-xs">
            <Building2 className="size-3.5" /> New location
          </Button>
        }
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat3D label="Locations" value={String(warehouses.length)} icon={Building2} grad="ocean" />
          <Stat3D label="Units held" value={totalUnits.toLocaleString()} icon={Boxes} grad="emerald" />
          <Stat3D label="Inventory value" value={money(totalValue)} icon={PackageSearch} grad="fuchsia" />
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {warehouses.map((w, i) => {
            const items = stock.filter((s) => s.warehouse === w.name);
            const low = items.filter((s) => s.onHand <= s.reorderPoint).length;
            return (
              <GlassCard key={w.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <Icon3D icon={Building2} grad={grads[i % grads.length]!} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{w.name}</p>
                    <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                      <MapPin className="size-3" /> {w.location}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                  <div>
                    <p className="num text-base font-semibold text-foreground">{w.units.toLocaleString()}</p>
                    <p>Units</p>
                  </div>
                  <div>
                    <p className="num text-base font-semibold text-foreground">{w.skus}</p>
                    <p>SKUs</p>
                  </div>
                </div>
                <Progress value={(w.units / maxUnits) * 100} className="h-1.5" />
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <UserRound className="size-3" /> {w.manager}
                  </span>
                  <span className={low ? "font-medium text-overdue" : "text-muted-foreground"}>
                    {low ? `${low} low` : "Stock healthy"}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <Section title="Stock coverage by location" description="On-hand units grouped per depot">
          <div className="space-y-3">
            {warehouses.map((w) => {
              const items = stock.filter((s) => s.warehouse === w.name);
              const units = items.reduce((a, s) => a + s.onHand, 0);
              return (
                <div key={w.id} className="rounded-lg border border-border p-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium">{w.name}</span>
                    <span className="num text-muted-foreground">{units.toLocaleString()} units · {items.length} SKUs</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {items.length === 0 && <span className="text-[11px] text-muted-foreground">No tracked SKUs</span>}
                    {items.map((s) => (
                      <span
                        key={s.id}
                        className="rounded-md border border-border bg-surface-2 px-2 py-1 text-[11px]"
                      >
                        <span className="num">{s.sku}</span> · {s.onHand}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      </div>
    </>
  );
}
