import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  Boxes,
  Fingerprint,
  Gauge,
  HeadphonesIcon,
  LockKeyhole,
  Mail,
  Radio,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Button3D, Icon3D, type Grad } from "@/components/common/ui3d";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in — Ferrolink OSS" },
      { name: "description", content: "Operator sign-in for the Ferrolink ISP business and operations console." },
      { property: "og:title", content: "Sign in — Ferrolink OSS" },
      { property: "og:description", content: "Operator sign-in for the Ferrolink ISP console." },
    ],
  }),
});

const ROLES: { id: string; label: string; desc: string; grad: Grad; icon: typeof Gauge }[] = [
  { id: "noc", label: "NOC Engineer", desc: "Network, provisioning, OLT/ONU", grad: "cyan", icon: Radio },
  { id: "billing", label: "Billing Ops", desc: "Invoices, payments, dunning", grad: "emerald", icon: Gauge },
  { id: "support", label: "Support Agent", desc: "Tickets, SLA, complaints", grad: "violet", icon: HeadphonesIcon },
  { id: "field", label: "Field Tech", desc: "Job orders, dispatch, stock", grad: "sunset", icon: Wrench },
  { id: "admin", label: "Administrator", desc: "Full platform access", grad: "fuchsia", icon: ShieldCheck },
];

const HIGHLIGHTS: { label: string; value: string; grad: Grad; icon: typeof Gauge }[] = [
  { label: "Elements monitored", value: "1,284", grad: "ocean", icon: Activity },
  { label: "Subscribers billed", value: "6,361", grad: "lime", icon: Gauge },
  { label: "Depot SKUs", value: "167", grad: "indigo", icon: Boxes },
];

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("noc");
  const [scope, setScope] = useState([60]);
  const active = ROLES.find((r) => r.id === role) ?? ROLES[0]!;

  const scopeLabel = scope[0]! < 34 ? "Read only" : scope[0]! < 67 ? "Operate" : "Operate + approve";

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand / marketing section */}
      <section className="aurora relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <div className="relative z-10 flex items-center gap-3">
          <Icon3D icon={Radio} grad="cyan" size="lg" />
          <div>
            <p className="text-lg font-semibold tracking-tight">Ferrolink</p>
            <p className="text-xs text-muted-foreground">ISP Business &amp; Operations Console</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            One console for billing, provisioning and the field.
          </h1>
          <p className="text-sm text-muted-foreground">
            Subscriber lifecycle, dunning ladders, PON health, dispatch boards and depot inventory —
            all in a single operator surface built for network teams.
          </p>
          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            {HIGHLIGHTS.map((h) => (
              <div key={h.label} className="glass-panel elevate p-3">
                <Icon3D icon={h.icon} grad={h.grad} size="sm" />
                <p className="num mt-2 text-lg font-semibold">{h.value}</p>
                <p className="text-[11px] text-muted-foreground">{h.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[11px] text-muted-foreground">
          Demo environment — seed data only. No live network is reachable from this console.
        </p>
      </section>

      {/* Auth section */}
      <section className="flex items-center justify-center p-6 md:p-10">
        <div className="glass-panel w-full max-w-md p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <Icon3D icon={Radio} grad="cyan" />
            <p className="font-semibold tracking-tight">Ferrolink</p>
          </div>

          <h2 className="text-xl font-semibold tracking-tight">Operator sign-in</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose your workspace role to continue.</p>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ROLES.map((r) => {
              const on = r.id === role;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`btn-3d sheen flex flex-col items-start gap-1 p-2.5 text-left text-white transition-transform ${
                    on ? "scale-[1.02] ring-2 ring-ring" : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundImage: `var(--grad-${r.grad})` }}
                >
                  <r.icon className="relative z-10 size-4" />
                  <span className="relative z-10 text-[11px] font-semibold leading-tight">{r.label}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{active.desc}</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success(`Signed in as ${active.label}`, { description: `Access scope: ${scopeLabel}` });
              navigate({ to: "/" });
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Work email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" required defaultValue="s.haddad@ferrolink.test" className="pl-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" required defaultValue="demo-password" className="pl-9" />
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Access scope</Label>
                <span className="text-[11px] font-medium text-muted-foreground">{scopeLabel}</span>
              </div>
              <Slider value={scope} onValueChange={setScope} max={100} step={1} />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Read only</span><span>Operate</span><span>Approve</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
              <span className="flex items-center gap-2 text-xs">
                <Fingerprint className="size-4 text-muted-foreground" /> Remember this workstation
              </span>
              <Switch defaultChecked />
            </div>

            <Button3D grad={active.grad} type="submit" className="w-full">
              Enter console
            </Button3D>
            <p className="text-center text-[11px] text-muted-foreground">
              Protected by workstation policy · SSO available for enterprise tenants
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
