import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, MapPin, Truck, Wrench } from "lucide-react";
import { PageHeader, Section } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stat3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { jobs } from "@/data/seed";

export const Route = createFileRoute("/dispatch")({
  component: DispatchPage,
  head: () => ({
    meta: [
      { title: "Dispatch Board — Ferrolink OSS" },
      { name: "description", content: "Technician schedule board with time windows, routes and unassigned work orders." },
      { property: "og:title", content: "Dispatch Board — Ferrolink OSS" },
      { property: "og:description", content: "Technician schedule board and unassigned work orders." },
    ],
  }),
});

const WINDOWS = ["08:00–10:00", "10:00–12:00", "13:00–15:00", "15:00–17:00"];

function DispatchPage() {
  const techs = Array.from(new Set(jobs.map((j) => j.technician))).filter((t) => t !== "Unassigned");
  const unassigned = jobs.filter((j) => j.technician === "Unassigned");

  return (
    <>
      <PageHeader
        title="Dispatch Board"
        subtitle="Assign field work by technician and time window"
        actions={<Button size="sm" className="text-xs"><Wrench className="size-3.5" /> Create job</Button>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat3D label="Scheduled today" value={String(jobs.filter((j) => j.status === "scheduled").length)} icon={CalendarClock} grad="teal" />
          <Stat3D label="Crews on the road" value={String(jobs.filter((j) => j.status === "en_route" || j.status === "in_progress").length)} icon={Truck} grad="violet" />
          <Stat3D label="Unassigned" value={String(unassigned.length)} icon={MapPin} grad="rose" />
        </div>

        <Section title="Schedule grid" description="Technician rows against installation windows">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-1 text-xs">
              <thead>
                <tr>
                  <th className="w-32 text-left text-muted-foreground">Technician</th>
                  {WINDOWS.map((w) => (
                    <th key={w} className="num text-left font-medium text-muted-foreground">{w}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {techs.map((tech) => (
                  <tr key={tech}>
                    <td className="truncate pr-2 font-medium">{tech}</td>
                    {WINDOWS.map((w) => {
                      const slot = jobs.filter((j) => j.technician === tech && j.window === w);
                      return (
                        <td key={w} className="align-top">
                          <div className="min-h-14 rounded-md border border-dashed border-border p-1.5">
                            {slot.map((j) => (
                              <div key={j.id} className="mb-1 rounded-md border border-border bg-surface p-1.5">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="num">{j.number}</span>
                                  <StatusBadge value={j.status} dot={false} />
                                </div>
                                <p className="truncate text-muted-foreground">{j.type} · {j.customerName}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Unassigned queue" description="Drag-free triage list awaiting a crew">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {unassigned.map((j) => (
              <div key={j.id} className="rounded-md border border-border p-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="num font-medium">{j.number}</span>
                  <StatusBadge value={j.priority} dot={false} />
                </div>
                <p className="mt-1 truncate">{j.type} · {j.customerName}</p>
                <p className="truncate text-muted-foreground">{j.address}</p>
                <Button variant="outline" size="sm" className="mt-2 h-6 w-full text-[11px]">Assign crew</Button>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
