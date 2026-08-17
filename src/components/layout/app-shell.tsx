import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  Moon,
  Search,
  Signal,
  Sun,
  Waves,
} from "lucide-react";
import { navGroups } from "./nav-config";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { customers, tickets, jobs } from "@/data/seed";

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 px-3 py-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground">
        <Waves className="size-4" />
      </span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-sidebar-foreground">
            Ferrolink OSS
          </span>
          <span className="block text-[10px] uppercase tracking-wider text-sidebar-foreground/50">
            Operator Console
          </span>
        </span>
      )}
    </Link>
  );
}

function NavList({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-4 pb-8">
      {navGroups.map((group) => (
        <div key={group.label}>
          {!collapsed && (
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
              {group.label}
            </p>
          )}
          <ul className="space-y-0.5 px-2">
            {group.items.map((item) => {
              const active =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    title={item.label}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                      active
                        ? "bg-sidebar-accent font-medium text-sidebar-primary"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-full max-w-md items-center gap-2 rounded-md border border-border bg-surface-2 px-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/40"
      >
        <Search className="size-3.5" />
        <span className="truncate">Search customers, tickets, jobs, devices…</span>
        <kbd className="ml-auto hidden rounded border border-border px-1 text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {navGroups.flatMap((g) => g.items).map((i) => (
              <CommandItem key={i.to} value={`${g(i.label)}`} onSelect={() => go(i.to)}>
                <i.icon className="size-4" /> {i.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Customers">
            {customers.slice(0, 6).map((c) => (
              <CommandItem
                key={c.id}
                value={`${c.name} ${c.accountNumber}`}
                onSelect={() => go(`/customers/${c.id}`)}
              >
                {c.name}
                <span className="ml-auto text-xs text-muted-foreground">{c.accountNumber}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Tickets">
            {tickets.slice(0, 4).map((t) => (
              <CommandItem
                key={t.id}
                value={`${t.number} ${t.subject}`}
                onSelect={() => go(`/tickets/${t.id}`)}
              >
                {t.number} — {t.subject}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Job orders">
            {jobs.slice(0, 4).map((j) => (
              <CommandItem key={j.id} value={`${j.number} ${j.customerName}`} onSelect={() => go("/jobs")}>
                {j.number} — {j.customerName}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

const g = (s: string) => s;

function Notifications() {
  const items = [
    { title: "OLT-CENTRAL-02 PON 3 degraded", time: "4m", tone: "text-suspended" },
    { title: "12 accounts entered dunning stage 2", time: "22m", tone: "text-overdue" },
    { title: "ONU stock below reorder point (Depot West)", time: "1h", tone: "text-pending" },
    { title: "Ticket TCK-2291 breached first-response SLA", time: "2h", tone: "text-overdue" },
    { title: "Batch restore completed — 8 subscribers", time: "3h", tone: "text-active" },
  ];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative size-8 p-0">
          <Bell className="size-4" />
          <span className="absolute right-1 top-1 size-1.5 rounded-full bg-overdue" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-3 py-2 text-xs font-semibold">Notifications</div>
        <ul className="divide-y divide-border">
          {items.map((n) => (
            <li key={n.title} className="flex gap-2 px-3 py-2.5 text-xs hover:bg-accent/40">
              <span className={cn("mt-1 size-1.5 shrink-0 rounded-full bg-current", n.tone)} />
              <span className="flex-1">{n.title}</span>
              <span className="text-muted-foreground">{n.time}</span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);
  return (
    <Button
      variant="ghost"
      size="sm"
      className="size-8 p-0"
      aria-label="Toggle theme"
      onClick={() => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
      }}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex",
          collapsed ? "w-14" : "w-60",
        )}
      >
        <Brand collapsed={collapsed} />
        <ScrollArea className="flex-1">
          <NavList collapsed={collapsed} />
        </ScrollArea>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-2 border-t border-sidebar-border px-3 py-2 text-[11px] text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          {!collapsed && "Collapse"}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-border bg-surface px-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="size-8 p-0 md:hidden">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Brand />
              <ScrollArea className="h-[calc(100vh-3.5rem)]">
                <NavList onNavigate={() => setMobileOpen(false)} />
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <GlobalSearch />

          <div className="ml-auto flex items-center gap-1.5">
            <span className="hidden items-center gap-1.5 rounded-full border border-active/30 bg-active/10 px-2 py-1 text-[11px] font-medium text-active sm:inline-flex">
              <Signal className="size-3" /> NOC nominal
            </span>
            <ThemeToggle />
            <Notifications />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 flex items-center gap-2">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary/15 text-[11px] text-primary">
                      AM
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs">
                  Ava Moreno
                  <span className="block font-normal text-muted-foreground">
                    NOC Supervisor · Region 4
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs">Profile & shift</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Saved views</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="min-w-0 flex-1 pb-16 md:pb-0">{children}</main>
      </div>
    </div>
  );
}
