import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileDown, FilePlus2, ReceiptText, Wallet, AlertTriangle, CircleDollarSign } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { invoices, money } from "@/data/seed";
import type { Invoice } from "@/types";

export const Route = createFileRoute("/invoices/")({
  component: InvoicesPage,
  head: () => ({
    meta: [
      { title: "Invoices — Ferrolink OSS" },
      { name: "description", content: "Recurring billing runs, invoice status, taxes and balances for every subscriber account." },
      { property: "og:title", content: "Invoices — Ferrolink OSS" },
      { property: "og:description", content: "Billing runs, invoice status, taxes and outstanding balances." },
    ],
  }),
});

function InvoicesPage() {
  const navigate = useNavigate();
  const sum = (f: (i: Invoice) => boolean) => invoices.filter(f).reduce((a, i) => a + i.total, 0);

  return (
    <>
      <PageHeader
        title="Invoices"
        subtitle="August cycle · billing run completed 2026-08-01 04:10"
        actions={
          <>
            <Button variant="outline" size="sm" className="text-xs"><FileDown className="size-3.5" /> Export</Button>
            <Button size="sm" className="text-xs"><FilePlus2 className="size-3.5" /> New invoice</Button>
          </>
        }
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat3D label="Billed this cycle" value={money(sum(() => true))} icon={ReceiptText} grad="teal" hint={`${invoices.length} invoices`} />
          <Stat3D label="Collected" value={money(sum((i) => i.status === "paid"))} icon={Wallet} grad="emerald" hint="Settled payments" />
          <Stat3D label="Open" value={money(sum((i) => i.status === "open"))} icon={CircleDollarSign} grad="amber" hint="Awaiting payment" />
          <Stat3D label="Overdue" value={money(sum((i) => i.status === "overdue"))} icon={AlertTriangle} grad="rose" hint="Dunning eligible" />
        </div>

        <DataTable<Invoice>
          rows={invoices}
          searchKeys={(i) => `${i.number} ${i.customerName}`}
          onRowClick={(i) => navigate({ to: "/invoices/$id", params: { id: i.id } })}
          cardTitle={(i) => (
            <span className="flex items-center justify-between gap-2">
              {i.number} <StatusBadge value={i.status} dot={false} />
            </span>
          )}
          bulkActions={
            <>
              <Button variant="outline" size="sm" className="h-6 text-[11px]">Email invoices</Button>
              <Button variant="outline" size="sm" className="h-6 text-[11px]">Mark paid</Button>
              <Button variant="outline" size="sm" className="h-6 text-[11px]">Void</Button>
            </>
          }
          filters={[
            {
              key: "status",
              label: "Status",
              options: ["paid", "open", "overdue", "draft", "void"],
              match: (r, v) => r.status === v,
            },
          ]}
          columns={[
            { key: "number", header: "Invoice", sortable: true, value: (i) => i.number, render: (i) => <span className="num font-medium">{i.number}</span> },
            { key: "customer", header: "Account", sortable: true, value: (i) => i.customerName },
            { key: "issued", header: "Issued", sortable: true, value: (i) => i.issued, hideBelow: "md" },
            { key: "due", header: "Due", sortable: true, value: (i) => i.due, hideBelow: "md" },
            { key: "tax", header: "Tax", align: "right", sortable: true, value: (i) => i.tax, render: (i) => <span className="num">{money(i.tax)}</span>, hideBelow: "lg" },
            { key: "total", header: "Total", align: "right", sortable: true, value: (i) => i.total, render: (i) => <span className="num font-medium">{money(i.total)}</span> },
            { key: "status", header: "Status", value: (i) => i.status, render: (i) => <StatusBadge value={i.status} /> },
          ]}
        />
      </div>
    </>
  );
}
