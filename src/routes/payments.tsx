import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Landmark, RefreshCcw, Wallet } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { money, payments } from "@/data/seed";
import type { Payment } from "@/types";

export const Route = createFileRoute("/payments")({
  component: PaymentsPage,
  head: () => ({
    meta: [
      { title: "Payments — Ferrolink OSS" },
      { name: "description", content: "Settled, pending, failed and refunded subscriber payments across every channel." },
      { property: "og:title", content: "Payments — Ferrolink OSS" },
      { property: "og:description", content: "Payment ledger across card, ACH, cash and bank transfer." },
    ],
  }),
});

function PaymentsPage() {
  const total = payments.reduce((a, p) => a + p.amount, 0);
  const failed = payments.filter((p) => p.status === "failed");

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Receipts posted across all collection channels"
        actions={<Button size="sm" className="text-xs"><Wallet className="size-3.5" /> Post payment</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat3D label="Posted (30d)" value={money(total)} icon={Wallet} grad="emerald" hint={`${payments.length} receipts`} />
          <Stat3D label="Card volume" value={money(payments.filter((p) => p.method === "Card").reduce((a, p) => a + p.amount, 0))} icon={CreditCard} grad="teal" />
          <Stat3D label="ACH / transfer" value={money(payments.filter((p) => p.method !== "Card").reduce((a, p) => a + p.amount, 0))} icon={Landmark} grad="violet" />
          <Stat3D label="Failed" value={String(failed.length)} icon={RefreshCcw} grad="rose" hint="Retry queue" />
        </div>

        <DataTable<Payment>
          rows={payments}
          searchKeys={(p) => `${p.reference} ${p.customerName} ${p.method}`}
          cardTitle={(p) => (
            <span className="flex items-center justify-between gap-2">{p.reference}<StatusBadge value={p.status} dot={false} /></span>
          )}
          bulkActions={<Button variant="outline" size="sm" className="h-6 text-[11px]">Retry failed</Button>}
          filters={[
            { key: "status", label: "Status", options: ["settled", "pending", "failed", "refunded"], match: (r, v) => r.status === v },
            { key: "method", label: "Method", options: ["Card", "ACH", "Cash", "Bank Transfer", "Wallet"], match: (r, v) => r.method === v },
          ]}
          columns={[
            { key: "reference", header: "Reference", sortable: true, value: (p) => p.reference, render: (p) => <span className="num">{p.reference}</span> },
            { key: "customer", header: "Account", sortable: true, value: (p) => p.customerName },
            { key: "date", header: "Date", sortable: true, value: (p) => p.date, hideBelow: "md" },
            { key: "method", header: "Method", value: (p) => p.method, hideBelow: "md" },
            { key: "amount", header: "Amount", align: "right", sortable: true, value: (p) => p.amount, render: (p) => <span className="num font-medium">{money(p.amount)}</span> },
            { key: "status", header: "Status", value: (p) => p.status, render: (p) => <StatusBadge value={p.status} /> },
          ]}
        />
      </div>
    </>
  );
}
