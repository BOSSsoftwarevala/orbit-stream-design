import {
  Activity,
  Boxes,
  Building2,
  CalendarClock,
  CircleDollarSign,
  Cpu,
  FileText,
  Gauge,
  GitBranch,
  Globe2,
  HardDrive,
  LifeBuoy,
  Network,
  PackageSearch,
  Percent,
  PiggyBank,
  Radio,
  ReceiptText,
  Repeat,
  Router,
  Settings,
  ShieldAlert,
  Truck,
  UserRound,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Command Dashboard", to: "/", icon: Gauge }],
  },
  {
    label: "Billing",
    items: [
      { label: "Invoices", to: "/invoices", icon: ReceiptText },
      { label: "Payments", to: "/payments", icon: Wallet },
      { label: "Credits & Debits", to: "/ledger", icon: CircleDollarSign },
      { label: "Payment Plans", to: "/payment-plans", icon: PiggyBank },
      { label: "Tax Rules", to: "/taxes", icon: Percent },
      { label: "Dunning & Suspension", to: "/dunning", icon: ShieldAlert },
    ],
  },
  {
    label: "Subscribers",
    items: [
      { label: "Customers", to: "/customers", icon: Users },
      { label: "Subscriptions", to: "/subscriptions", icon: Repeat },
      { label: "Service Plans", to: "/plans", icon: FileText },
    ],
  },
  {
    label: "CRM",
    items: [
      { label: "Leads", to: "/leads", icon: UserRound },
      { label: "Sales Pipeline", to: "/pipeline", icon: GitBranch },
      { label: "Contracts", to: "/contracts", icon: FileText },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "Ticket Queue", to: "/tickets", icon: LifeBuoy },
      { label: "Complaint Intake", to: "/complaints", icon: Activity },
    ],
  },
  {
    label: "Field Ops",
    items: [
      { label: "Job Orders", to: "/jobs", icon: Wrench },
      { label: "Dispatch Board", to: "/dispatch", icon: CalendarClock },
    ],
  },
  {
    label: "Network",
    items: [
      { label: "Provisioning", to: "/provisioning", icon: Radio },
      { label: "Devices", to: "/devices", icon: Router },
      { label: "OLT / ONU", to: "/onu", icon: Cpu },
      { label: "IP Management", to: "/ipam", icon: Network },
      { label: "Network Status", to: "/network", icon: Globe2 },
    ],
  },
  {
    label: "Inventory",
    items: [
      { label: "Warehouses", to: "/warehouses", icon: Building2 },
      { label: "Stock", to: "/stock", icon: Boxes },
      { label: "Serialized Units", to: "/serials", icon: HardDrive },
      { label: "Transfers", to: "/transfers", icon: Truck },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Reports", to: "/reports", icon: PackageSearch },
      { label: "Settings", to: "/settings", icon: Settings },
    ],
  },
];
