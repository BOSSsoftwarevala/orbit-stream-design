import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpRight, CircleDollarSign } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { ledger, money } from "@/data/seed";
import type { LedgerEntry } from "@/types";

export const Route = createFileRoute("/ledger")({
  component: LedgerPage,
  head: () => ({
    meta: [
      { title: "Credits & Debits — Ferrolink OSS" },
      { name: "description", content: "Account adjustments: service credits, late fees, goodwill and equipment charges." },
      { property: "og:title", content: "Credits & Debits — Ferrolink OSS" },
      { property: "og:description", content: "Adjustment ledger for subscriber accounts." },
    ],
  }),
});

function LedgerPage() {
  const credits = ledger.filter((l) => l.type === "credit").reduce((a, l) => a + l.amount, 0);
  const debits = ledger.filter((l) => l.type === "debit").reduce((a, l) => a + l.amount, 0);

  return (
    <>
      <PageHeader
        title="Credits & Debits"
        subtitle="Manual and automated adjustments applied to subscriber balances"
        actions={
          <>
            <Button variant="outline" size="sm" className="text-xs"><ArrowDownLeft className="size-3.5" /> Issue credit</Button>
            <Button size="sm" className="text-xs"><ArrowUpRight className="size-3.5" /> Add debit</Button>
          </>
        }
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat3D label="Credits issued" value={money(credits)} icon={ArrowDownLeft} grad="emerald" />
          <Stat3D label="Debits applied" value={money(debits)} icon={ArrowUpRight} grad="rose" />
          <Stat3D label="Net adjustment" value={money(debits - credits)} icon={CircleDollarSign} grad="violet" />
        </div>
        <DataTable<LedgerEntry>
          rows={ledger}
          searchKeys={(l) => `${l.customerName} ${l.reason} ${l.appliedBy}`}
          cardTitle={(l) => <span>{l.customerName}</span>}
          filters={[
            { key: "type", label: "Type", options: ["credit", "debit"], match: (r, v) => r.type === v },
          ]}
          columns={[
            { key: "date", header: "Date", sortable: true, value: (l) => l.date },
            { key: "customer", header: "Account", sortable: true, value: (l) => l.customerName },
            { key: "reason", header: "Reason", value: (l) => l.reason, hideBelow: "md" },
            { key: "by", header: "Applied by", value: (l) => l.appliedBy, hideBelow: "lg" },
            {
              key: "amount", header: "Amount", align: "right", sortable: true, value: (l) => l.amount,
              render: (l) => (
                <span className={l.type === "credit" ? "num text-active" : "num text-overdue"}>
                  {l.type === "credit" ? "-" : "+"}{money(l.amount)}
                </span>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
