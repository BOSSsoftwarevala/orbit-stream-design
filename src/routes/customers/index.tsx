import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { customers, money, plans } from "@/data/seed";
import type { Customer } from "@/types";

export const Route = createFileRoute("/customers/")({
  component: CustomersPage,
  head: () => ({
    meta: [
      { title: "Customer Accounts — Ferrolink OSS" },
      {
        name: "description",
        content: "Search, filter and manage every subscriber account, balance and lifecycle state.",
      },
      { property: "og:title", content: "Customer Accounts — Ferrolink OSS" },
      { property: "og:description", content: "Subscriber accounts, balances and lifecycle states." },
    ],
  }),
});

function CustomersPage() {
  const navigate = useNavigate();
  const planName = (id: string) => plans.find((p) => p.id === id)?.name ?? id;

  return (
    <>
      <PageHeader
        title="Customer Accounts"
        subtitle={`${customers.length} accounts across 6 service areas`}
        actions={
          <Button size="sm" className="text-xs">
            <UserPlus className="size-3.5" /> New account
          </Button>
        }
      />
      <div className="p-4 md:p-6">
        <DataTable<Customer>
          rows={customers}
          searchKeys={(c) => `${c.name} ${c.accountNumber} ${c.email} ${c.city} ${c.phone}`}
          onRowClick={(c) => navigate({ to: "/customers/$id", params: { id: c.id } })}
          cardTitle={(c) => (
            <span className="flex items-center justify-between gap-2">
              {c.name} <StatusBadge value={c.status} dot={false} />
            </span>
          )}
          bulkActions={
            <>
              <Button variant="outline" size="sm" className="h-6 text-[11px]">Send statement</Button>
              <Button variant="outline" size="sm" className="h-6 text-[11px]">Apply credit</Button>
              <Button variant="outline" size="sm" className="h-6 text-[11px]">Suspend</Button>
            </>
          }
          filters={[
            {
              key: "status",
              label: "Status",
              options: ["active", "suspended", "pending_install", "lead", "cancelled"],
              match: (c, v) => c.status === v,
            },
            {
              key: "city",
              label: "Service area",
              options: [...new Set(customers.map((c) => c.city))],
              match: (c, v) => c.city === v,
            },
            {
              key: "plan",
              label: "Plan",
              options: plans.map((p) => p.name),
              match: (c, v) => planName(c.planId) === v,
            },
          ]}
          columns={[
            { key: "account", header: "Account", value: (c) => c.accountNumber, render: (c) => <span className="num text-xs text-muted-foreground">{c.accountNumber}</span> },
            { key: "name", header: "Customer", value: (c) => c.name, render: (c) => (
              <div className="min-w-0">
                <p className="truncate font-medium">{c.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{c.company ?? c.email}</p>
              </div>
            ) },
            { key: "status", header: "Status", render: (c) => <StatusBadge value={c.status} />, value: (c) => c.status },
            { key: "plan", header: "Plan", value: (c) => planName(c.planId), hideBelow: "lg" },
            { key: "city", header: "Area", value: (c) => c.city, hideBelow: "lg" },
            { key: "mrr", header: "MRR", align: "right", value: (c) => c.mrr, render: (c) => <span className="num">{money(c.mrr)}</span> },
            { key: "balance", header: "Balance", align: "right", value: (c) => c.balance, render: (c) => (
              <span className={c.balance > 0 ? "num text-overdue" : "num text-muted-foreground"}>{money(c.balance)}</span>
            ) },
          ]}
        />
      </div>
    </>
  );
}
