import { createFileRoute } from "@tanstack/react-router";
import { Boxes, PackageSearch, TriangleAlert } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { money, stock } from "@/data/seed";
import type { StockItem } from "@/types";

export const Route = createFileRoute("/stock")({
  component: StockPage,
  head: () => ({
    meta: [
      { title: "Stock — Ferrolink OSS" },
      { name: "description", content: "On-hand CPE, optics and cable inventory with reorder points across every warehouse." },
      { property: "og:title", content: "Stock — Ferrolink OSS" },
      { property: "og:description", content: "On-hand inventory levels and reorder alerts." },
    ],
  }),
});

function StockPage() {
  const value = stock.reduce((a, s) => a + s.onHand * s.unitCost, 0);
  const low = stock.filter((s) => s.onHand <= s.reorderPoint);

  return (
    <>
      <PageHeader
        title="Stock"
        subtitle="Consumables and CPE availability across depots and field vans"
        actions={<Button size="sm" className="text-xs"><PackageSearch className="size-3.5" /> Raise purchase order</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat3D label="Inventory value" value={money(value)} icon={Boxes} grad="emerald" />
          <Stat3D label="SKUs tracked" value={String(stock.length)} icon={PackageSearch} grad="teal" />
          <Stat3D label="Below reorder point" value={String(low.length)} icon={TriangleAlert} grad="rose" />
        </div>
        <DataTable<StockItem>
          rows={stock}
          searchKeys={(s) => `${s.sku} ${s.name} ${s.warehouse} ${s.category}`}
          cardTitle={(s) => <span>{s.name}</span>}
          filters={[
            { key: "wh", label: "Warehouse", options: ["Central Depot", "Northgate Hub", "Field Van 12", "RMA Quarantine"], match: (r, v) => r.warehouse === v },
            { key: "cat", label: "Category", options: ["ONU", "Router", "CPE", "Cable", "Optic", "Tool"], match: (r, v) => r.category === v },
          ]}
          columns={[
            { key: "sku", header: "SKU", sortable: true, value: (s) => s.sku, render: (s) => <span className="num">{s.sku}</span> },
            { key: "name", header: "Item", value: (s) => s.name },
            { key: "warehouse", header: "Warehouse", value: (s) => s.warehouse, hideBelow: "md" },
            { key: "onHand", header: "On hand", align: "right", sortable: true, value: (s) => s.onHand, render: (s) => <span className="num">{s.onHand}</span> },
            { key: "reserved", header: "Reserved", align: "right", sortable: true, value: (s) => s.reserved, render: (s) => <span className="num">{s.reserved}</span>, hideBelow: "lg" },
            { key: "cost", header: "Unit cost", align: "right", sortable: true, value: (s) => s.unitCost, render: (s) => <span className="num">{money(s.unitCost)}</span>, hideBelow: "md" },
            { key: "state", header: "Level", render: (s) => <StatusBadge value={s.onHand <= s.reorderPoint ? "overdue" : "active"} /> },
          ]}
        />
      </div>
    </>
  );
}
