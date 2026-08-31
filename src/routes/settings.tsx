import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Building2, CreditCard, Palette, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button3D, GlassCard, Icon3D, type Grad } from "@/components/common/ui3d";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings — Ferrolink OSS" },
      { name: "description", content: "Operator preferences: company profile, billing cycles, notifications, roles and appearance." },
      { property: "og:title", content: "Settings — Ferrolink OSS" },
      { property: "og:description", content: "Configure the Ferrolink operations console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const ROLES: { name: string; scope: string; grad: Grad }[] = [
  { name: "NOC Engineer", scope: "Network, provisioning, devices", grad: "cyan" },
  { name: "Billing Ops", scope: "Invoices, payments, dunning", grad: "emerald" },
  { name: "Support Agent", scope: "Tickets, complaints, SLA", grad: "violet" },
  { name: "Field Tech", scope: "Job orders, dispatch, stock", grad: "sunset" },
  { name: "Administrator", scope: "Full platform access", grad: "fuchsia" },
];

function SettingsPage() {
  const [grace, setGrace] = useState([5]);
  const [retry, setRetry] = useState([3]);

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Operator preferences, billing policy, notifications and role access"
        actions={<Button3D grad="teal" onClick={() => toast.success("Settings saved", { description: "Applied to this workspace." })}>Save changes</Button3D>}
      />
      <div className="space-y-4 p-4 md:p-6">
        <Tabs defaultValue="company">
          <TabsList className="flex-wrap">
            <TabsTrigger value="company" className="text-xs">Company</TabsTrigger>
            <TabsTrigger value="billing" className="text-xs">Billing</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs">Notifications</TabsTrigger>
            <TabsTrigger value="roles" className="text-xs">Roles</TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="mt-4">
            <GlassCard className="space-y-4" hover={false}>
              <div className="flex items-center gap-3">
                <Icon3D icon={Building2} grad="ocean" />
                <div>
                  <p className="text-sm font-semibold">Company profile</p>
                  <p className="text-[11px] text-muted-foreground">Appears on invoices and customer notices</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Operator name</Label>
                  <Input defaultValue="Ferrolink Networks" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Support email</Label>
                  <Input defaultValue="support@ferrolink.test" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Support line</Label>
                  <Input defaultValue="+1 (555) 018-4400" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Billing timezone</Label>
                  <Input defaultValue="UTC−05:00 Eastern" />
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="billing" className="mt-4">
            <GlassCard className="space-y-4" hover={false}>
              <div className="flex items-center gap-3">
                <Icon3D icon={CreditCard} grad="emerald" />
                <div>
                  <p className="text-sm font-semibold">Billing policy</p>
                  <p className="text-[11px] text-muted-foreground">Cycle, grace period and retry behaviour</p>
                </div>
              </div>
              <div className="space-y-2 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between text-xs">
                  <Label className="text-xs">Grace period before suspension</Label>
                  <span className="num text-muted-foreground">{grace[0]} days</span>
                </div>
                <Slider value={grace} onValueChange={setGrace} max={21} step={1} />
              </div>
              <div className="space-y-2 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between text-xs">
                  <Label className="text-xs">Failed payment retries</Label>
                  <span className="num text-muted-foreground">{retry[0]} attempts</span>
                </div>
                <Slider value={retry} onValueChange={setRetry} max={6} step={1} />
              </div>
              <ToggleRow label="Prorate mid-cycle plan changes" defaultChecked />
              <ToggleRow label="Auto-restore service on payment" defaultChecked />
              <ToggleRow label="Allow partial payments" />
            </GlassCard>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <GlassCard className="space-y-3" hover={false}>
              <div className="flex items-center gap-3">
                <Icon3D icon={Bell} grad="sunset" />
                <div>
                  <p className="text-sm font-semibold">Operator alerts</p>
                  <p className="text-[11px] text-muted-foreground">In-console notifications only in this phase</p>
                </div>
              </div>
              <ToggleRow label="Device offline / dying gasp" defaultChecked />
              <ToggleRow label="SLA breach imminent" defaultChecked />
              <ToggleRow label="Low stock below reorder point" defaultChecked />
              <ToggleRow label="Failed batch invoicing run" defaultChecked />
              <ToggleRow label="New lead assigned to me" />
            </GlassCard>
          </TabsContent>

          <TabsContent value="roles" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {ROLES.map((r) => (
                <GlassCard key={r.name} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Icon3D icon={r.name === "Administrator" ? ShieldCheck : Users} grad={r.grad} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{r.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{r.scope}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-xs">
                    <span>Approval rights</span>
                    <Switch defaultChecked={r.name === "Administrator" || r.name === "Billing Ops"} />
                  </div>
                </GlassCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="mt-4">
            <GlassCard className="space-y-3" hover={false}>
              <div className="flex items-center gap-3">
                <Icon3D icon={Palette} grad="fuchsia" />
                <div>
                  <p className="text-sm font-semibold">Console appearance</p>
                  <p className="text-[11px] text-muted-foreground">Density and motion preferences</p>
                </div>
              </div>
              <ToggleRow label="Compact table density" defaultChecked />
              <ToggleRow label="Glass depth effects" defaultChecked />
              <ToggleRow label="Reduce motion" />
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
      <span className="text-xs">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
