import { createFileRoute } from "@tanstack/react-router";
import { FileSignature, FileText, ShieldCheck } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { customers, money, plans } from "@/data/seed";

export const Route = createFileRoute("/contracts")({
  component: ContractsPage,
  head: () => ({
    meta: [
      { title: "Contracts — Ferrolink OSS" },
      { name: "description", content: "Service agreements, terms, renewal dates and early-termination exposure." },
      { property: "og:title", content: "Contracts — Ferrolink OSS" },
      { property: "og:description", content: "Service agreements, renewals and termination exposure." },
    ],
  }),
});

interface Contract {
  id: string;
  reference: string;
  customerName: string;
  plan: string;
  term: string;
  signed: string;
  renews: string;
  status: "active" | "pending" | "expired" | "cancelled";
  etf: number;
}

const contracts: Contract[] = customers.slice(0, 22).map((c, i) => {
  const plan = plans.find((p) => p.id === c.planId) ?? plans[0]!;
  return {
    id: `CT-${300 + i}`,
    reference: `AGR-${77120 + i * 4}`,
    customerName: c.name,
    plan: plan.name,
    term: plan.contractTerm,
    signed: c.since,
    renews: `2027-0${(i % 9) + 1}-1${i % 9}`,
    status: i % 9 === 0 ? "pending" : i % 11 === 0 ? "expired" : i % 13 === 0 ? "cancelled" : "active",
    etf: plan.contractTerm === "Month to month" ? 0 : Number((plan.price * (3 + (i % 4))).toFixed(2)),
  };
});

function ContractsPage() {
  return (
    <>
      <PageHeader
        title="Contracts"
        subtitle="Signed service agreements and renewal exposure"
        actions={<Button size="sm" className="text-xs"><FileSignature className="size-3.5" /> New agreement</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat3D label="Active agreements" value={String(contracts.filter((c) => c.status === "active").length)} icon={ShieldCheck} grad="emerald" />
          <Stat3D label="Awaiting signature" value={String(contracts.filter((c) => c.status === "pending").length)} icon={FileText} grad="amber" />
          <Stat3D label="ETF exposure" value={money(contracts.reduce((a, c) => a + c.etf, 0))} icon={FileSignature} grad="fuchsia" />
        </div>
        <DataTable<Contract>
          rows={contracts}
          searchKeys={(c) => `${c.reference} ${c.customerName} ${c.plan}`}
          cardTitle={(c) => <span className="flex items-center justify-between gap-2">{c.reference}<StatusBadge value={c.status} dot={false} /></span>}
          filters={[{ key: "status", label: "Status", options: ["active", "pending", "expired", "cancelled"], match: (r, v) => r.status === v }]}
          columns={[
            { key: "reference", header: "Agreement", sortable: true, value: (c) => c.reference, render: (c) => <span className="num">{c.reference}</span> },
            { key: "customer", header: "Account", sortable: true, value: (c) => c.customerName },
            { key: "plan", header: "Plan", value: (c) => c.plan, hideBelow: "md" },
            { key: "term", header: "Term", value: (c) => c.term, hideBelow: "lg" },
            { key: "renews", header: "Renews", sortable: true, value: (c) => c.renews, hideBelow: "md" },
            { key: "etf", header: "ETF", align: "right", sortable: true, value: (c) => c.etf, render: (c) => <span className="num">{money(c.etf)}</span> },
            { key: "status", header: "Status", value: (c) => c.status, render: (c) => <StatusBadge value={c.status} /> },
          ]}
        />
      </div>
    </>
  );
}
