import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Signal, TriangleAlert, Zap } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { PageHeader, Section } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Progress } from "@/components/ui/progress";
import { devices, onus } from "@/data/seed";
import type { Onu } from "@/types";

export const Route = createFileRoute("/onu")({
  component: OnuPage,
  head: () => ({
    meta: [
      { title: "OLT / ONU — Ferrolink OSS" },
      { name: "description", content: "PON tree health: optical levels, LOS alarms and dying-gasp events per ONU." },
      { property: "og:title", content: "OLT / ONU — Ferrolink OSS" },
      { property: "og:description", content: "PON tree health, optical levels and LOS alarms." },
    ],
  }),
});

function OnuPage() {
  const olts = devices.filter((d) => d.type === "OLT");
  const alarms = onus.filter((o) => o.status !== "online");

  return (
    <>
      <PageHeader title="OLT / ONU" subtitle="Optical line terminals and the customer premises units behind them" />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat3D label="OLTs" value={String(olts.length)} icon={Cpu} grad="cyan" />
          <Stat3D label="ONUs registered" value={String(onus.length)} icon={Zap} grad="ocean" />
          <Stat3D label="Optical alarms" value={String(alarms.length)} icon={TriangleAlert} grad="rose" />
          <Stat3D label="Weakest Rx" value={`${Math.min(...onus.map((o) => o.rxPower))} dBm`} icon={Signal} grad="sunset" />
        </div>

        <Section title="OLT capacity" description="Attached subscribers per terminal">
          <div className="grid gap-3 sm:grid-cols-2">
            {olts.map((o) => (
              <div key={o.id} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="num font-medium">{o.hostname}</span>
                  <StatusBadge value={o.status} />
                </div>
                <Progress value={Math.min(100, (o.clients / 1200) * 100)} className="mt-2 h-1.5" />
                <p className="num mt-1 text-[11px] text-muted-foreground">{o.clients} of 1,200 ports · {o.site}</p>
              </div>
            ))}
          </div>
        </Section>

        <DataTable<Onu>
          rows={onus}
          searchKeys={(o) => `${o.serial} ${o.customerName} ${o.olt} ${o.ponPort}`}
          cardTitle={(o) => <span className="flex items-center justify-between gap-2">{o.serial}<StatusBadge value={o.status} dot={false} /></span>}
          filters={[
            { key: "status", label: "Status", options: ["online", "los", "dying_gasp", "offline"], match: (r, v) => r.status === v },
            { key: "olt", label: "OLT", options: ["olt-northgate-a", "olt-cedar-b"], match: (r, v) => r.olt === v },
          ]}
          columns={[
            { key: "serial", header: "Serial", sortable: true, value: (o) => o.serial, render: (o) => <span className="num">{o.serial}</span> },
            { key: "model", header: "Model", value: (o) => o.model, hideBelow: "md" },
            { key: "customer", header: "Subscriber", sortable: true, value: (o) => o.customerName },
            { key: "olt", header: "OLT", value: (o) => o.olt, hideBelow: "lg" },
            { key: "pon", header: "PON", value: (o) => o.ponPort, render: (o) => <span className="num">{o.ponPort}</span>, hideBelow: "md" },
            { key: "rx", header: "Rx", align: "right", sortable: true, value: (o) => o.rxPower, render: (o) => <span className={`num ${o.rxPower < -24 ? "text-overdue" : ""}`}>{o.rxPower}</span> },
            { key: "status", header: "Status", value: (o) => o.status, render: (o) => <StatusBadge value={o.status} /> },
          ]}
        />
      </div>
    </>
  );
}
