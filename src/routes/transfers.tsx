import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, PackageCheck, Truck, FileClock } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader, Section } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { GlassCard, Icon3D, Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { transfers } from "@/data/seed";
import type { Transfer } from "@/types";

export const Route = createFileRoute("/transfers")({
  component: TransfersPage,
  head: () => ({
    meta: [
      { title: "Stock Transfers — Ferrolink OSS" },
      { name: "description", content: "Move equipment between depots, field vans and RMA quarantine with full transfer history." },
      { property: "og:title", content: "Stock Transfers — Ferrolink OSS" },
      { property: "og:description", content: "Inter-warehouse equipment transfers and receipts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const tone: Record<Transfer["status"], string> = {
  draft: "pending",
  in_transit: "suspended",
  received: "active",
  cancelled: "offline",
};

function TransfersPage() {
  const inTransit = transfers.filter((t) => t.status === "in_transit");

  return (
    <>
      <PageHeader
        title="Transfers"
        subtitle="Equipment movements between depots, technician vans and quarantine"
        actions={
          <Button size="sm" className="text-xs">
            <Truck className="size-3.5" /> New transfer
          </Button>
        }
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat3D label="Open transfers" value={String(transfers.filter((t) => t.status !== "received" && t.status !== "cancelled").length)} icon={FileClock} grad="sunset" />
          <Stat3D label="In transit" value={String(inTransit.length)} icon={Truck} grad="ocean" />
          <Stat3D label="Received (30d)" value={String(transfers.filter((t) => t.status === "received").length)} icon={PackageCheck} grad="emerald" />
        </div>

        {inTransit.length > 0 && (
          <Section title="On the road" description="Shipments awaiting receipt at destination">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {inTransit.map((t) => (
                <GlassCard key={t.id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Icon3D icon={Truck} grad="ocean" />
                    <div className="min-w-0">
                      <p className="num text-sm font-semibold">{t.reference}</p>
                      <p className="text-[11px] text-muted-foreground">{t.items} items · {t.requestedBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="truncate rounded-md border border-border bg-surface-2 px-2 py-1">{t.from}</span>
                    <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate rounded-md border border-border bg-surface-2 px-2 py-1">{t.to}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </Section>
        )}

        <DataTable<Transfer>
          rows={transfers}
          searchKeys={(t) => `${t.reference} ${t.from} ${t.to} ${t.requestedBy}`}
          cardTitle={(t) => <span className="num">{t.reference}</span>}
          filters={[
            { key: "status", label: "Status", options: ["draft", "in_transit", "received", "cancelled"], match: (r, v) => r.status === v },
          ]}
          columns={[
            { key: "ref", header: "Reference", sortable: true, value: (t) => t.reference, render: (t) => <span className="num">{t.reference}</span> },
            { key: "from", header: "From", value: (t) => t.from },
            { key: "to", header: "To", value: (t) => t.to },
            { key: "items", header: "Items", align: "right", sortable: true, value: (t) => t.items, render: (t) => <span className="num">{t.items}</span> },
            { key: "created", header: "Created", value: (t) => t.created, render: (t) => <span className="num">{t.created}</span>, hideBelow: "md" },
            { key: "by", header: "Requested by", value: (t) => t.requestedBy, hideBelow: "lg" },
            { key: "status", header: "Status", render: (t) => <StatusBadge value={tone[t.status]} label={t.status.replace("_", " ")} /> },
          ]}
        />
      </div>
    </>
  );
}
