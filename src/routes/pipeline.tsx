import { createFileRoute } from "@tanstack/react-router";
import { GitBranch } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { GlassCard, Icon3D, type Grad } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { leads, money } from "@/data/seed";
import type { Lead } from "@/types";

export const Route = createFileRoute("/pipeline")({
  component: PipelinePage,
  head: () => ({
    meta: [
      { title: "Sales Pipeline — Ferrolink OSS" },
      { name: "description", content: "Kanban view of prospects moving from qualification through survey to activation." },
      { property: "og:title", content: "Sales Pipeline — Ferrolink OSS" },
      { property: "og:description", content: "Kanban pipeline from qualification to activation." },
    ],
  }),
});

const STAGES: { id: Lead["stage"]; label: string; grad: Grad }[] = [
  { id: "new", label: "New", grad: "cyan" },
  { id: "qualified", label: "Qualified", grad: "indigo" },
  { id: "survey", label: "Site survey", grad: "violet" },
  { id: "quoted", label: "Quoted", grad: "sunset" },
  { id: "won", label: "Won", grad: "emerald" },
  { id: "lost", label: "Lost", grad: "rose" },
];

function PipelinePage() {
  return (
    <>
      <PageHeader
        title="Sales Pipeline"
        subtitle="Stage-by-stage view of every open opportunity"
        actions={<Button size="sm" className="text-xs"><GitBranch className="size-3.5" /> New opportunity</Button>}
      />
      <div className="p-4 md:p-6">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {STAGES.map((s) => {
            const items = leads.filter((l) => l.stage === s.id);
            const total = items.reduce((a, l) => a + l.value, 0);
            return (
              <div key={s.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon3D icon={GitBranch} grad={s.grad} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{s.label}</p>
                    <p className="num text-[11px] text-muted-foreground">{items.length} · {money(total)}</p>
                  </div>
                </div>
                <div className="space-y-2 rounded-lg border border-dashed border-border p-2">
                  {items.length === 0 && <p className="p-2 text-[11px] text-muted-foreground">Nothing here yet.</p>}
                  {items.map((l) => (
                    <GlassCard key={l.id} className="space-y-1 p-3">
                      <p className="truncate text-xs font-medium">{l.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{l.address}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="num text-xs font-semibold">{money(l.value)}</span>
                        <StatusBadge value={l.stage} dot={false} />
                      </div>
                      <p className="text-[10px] text-muted-foreground">Owner: {l.owner} · {l.updated}</p>
                    </GlassCard>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
