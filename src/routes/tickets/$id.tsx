import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Paperclip, Send, UserRound } from "lucide-react";
import { PageHeader, Section } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { GlassCard, Icon3D } from "@/components/common/ui3d";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { tickets } from "@/data/seed";

export const Route = createFileRoute("/tickets/$id")({
  component: TicketDetail,
  head: () => ({
    meta: [
      { title: "Ticket Detail — Ferrolink OSS" },
      { name: "description", content: "Conversation thread, diagnostics and SLA state for a single support ticket." },
      { property: "og:title", content: "Ticket Detail — Ferrolink OSS" },
      { property: "og:description", content: "Conversation thread and diagnostics for a support ticket." },
    ],
  }),
});

function TicketDetail() {
  const { id } = Route.useParams();
  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Ticket {id} not found.</p>
        <Link to="/tickets" className="text-sm underline">Back to queue</Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`${ticket.number} — ${ticket.subject}`}
        subtitle={`${ticket.category} · opened ${ticket.created} via ${ticket.channel}`}
        meta={
          <>
            <StatusBadge value={ticket.status} />
            <StatusBadge value={ticket.priority} />
            <span className="text-xs text-muted-foreground">Assignee: {ticket.assignee}</span>
          </>
        }
        actions={
          <>
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link to="/tickets"><ArrowLeft className="size-3.5" /> Queue</Link>
            </Button>
            <Button size="sm" className="text-xs">Resolve</Button>
          </>
        }
      />
      <div className="grid gap-4 p-4 md:p-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Section title="Conversation">
            <div className="space-y-3">
              {ticket.messages.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3 text-sm ${m.internal ? "border-dashed border-border bg-muted/40" : "border-border bg-surface"}`}
                >
                  <div className="mb-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{m.author} · {m.role}</span>
                    <span className="num">{m.time}{m.internal ? " · internal" : ""}</span>
                  </div>
                  <p className="leading-relaxed">{m.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <Textarea placeholder="Reply to the customer or leave an internal note…" rows={3} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="text-xs">Internal note</Button>
                <Button size="sm" className="text-xs"><Send className="size-3.5" /> Send reply</Button>
              </div>
            </div>
          </Section>
        </div>

        <div className="space-y-4">
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <Icon3D icon={UserRound} grad="teal" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{ticket.customerName}</p>
                <Link to="/customers/$id" params={{ id: ticket.customerId }} className="text-xs underline text-muted-foreground">
                  Open customer 360
                </Link>
              </div>
            </div>
          </GlassCard>
          <Section title="Attachments">
            {ticket.attachments.length === 0 ? (
              <p className="text-xs text-muted-foreground">No files attached.</p>
            ) : (
              <ul className="space-y-2">
                {ticket.attachments.map((a) => (
                  <li key={a.name} className="flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-2"><Paperclip className="size-3.5" />{a.name}</span>
                    <span className="num text-muted-foreground">{a.size}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>
    </>
  );
}
