import { createFileRoute } from "@tanstack/react-router";
import { Percent, Plus } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader, Section } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Icon3D } from "@/components/common/ui3d";
import { taxRules } from "@/data/seed";
import type { TaxRule } from "@/types";

export const Route = createFileRoute("/taxes")({
  component: TaxesPage,
  head: () => ({
    meta: [
      { title: "Tax Rules — Ferrolink OSS" },
      { name: "description", content: "Jurisdiction tax rules, regulatory fees and surcharges applied during invoicing." },
      { property: "og:title", content: "Tax Rules — Ferrolink OSS" },
      { property: "og:description", content: "Jurisdiction taxes and regulatory surcharges." },
    ],
  }),
});

function TaxesPage() {
  const effective = taxRules.filter((t) => t.active).reduce((a, t) => a + t.rate, 0);
  return (
    <>
      <PageHeader
        title="Tax Rules"
        subtitle="Applied automatically at invoice generation by jurisdiction"
        actions={<Button size="sm" className="text-xs"><Plus className="size-3.5" /> New rule</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <Section title="Blended effective rate">
          <div className="flex items-center gap-4">
            <Icon3D icon={Percent} grad="violet" size="lg" />
            <div>
              <p className="num text-3xl font-semibold">{effective.toFixed(2)}%</p>
              <p className="text-xs text-muted-foreground">Sum of active rules for a standard residential broadband invoice</p>
            </div>
          </div>
        </Section>
        <DataTable<TaxRule>
          rows={taxRules}
          searchKeys={(t) => `${t.name} ${t.jurisdiction} ${t.appliesTo}`}
          cardTitle={(t) => <span>{t.name}</span>}
          filters={[{ key: "j", label: "Jurisdiction", options: ["Federal", "State", "County", "Northgate"], match: (r, v) => r.jurisdiction === v }]}
          columns={[
            { key: "name", header: "Rule", sortable: true, value: (t) => t.name },
            { key: "jurisdiction", header: "Jurisdiction", value: (t) => t.jurisdiction },
            { key: "applies", header: "Applies to", value: (t) => t.appliesTo, hideBelow: "md" },
            { key: "rate", header: "Rate", align: "right", sortable: true, value: (t) => t.rate, render: (t) => <span className="num">{t.rate.toFixed(2)}%</span> },
            { key: "active", header: "Enabled", render: (t) => <div className="flex items-center gap-2"><Switch defaultChecked={t.active} /><StatusBadge value={t.active ? "active" : "retired"} dot={false} /></div> },
          ]}
        />
      </div>
    </>
  );
}
