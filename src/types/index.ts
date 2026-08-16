export type CustomerStatus =
  | "lead"
  | "pending_install"
  | "active"
  | "suspended"
  | "cancelled";

export type ServiceStatus = "active" | "suspended" | "pending" | "cancelled";

export interface Customer {
  id: string;
  accountNumber: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: CustomerStatus;
  planId: string;
  balance: number;
  mrr: number;
  since: string;
  tags: string[];
  lat: number;
  lng: number;
}

export interface ServicePlan {
  id: string;
  name: string;
  down: number;
  up: number;
  price: number;
  technology: "GPON" | "Fiber" | "Fixed Wireless" | "DOCSIS";
  dataPolicy: string;
  contractTerm: string;
  subscribers: number;
}

export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  planId: string;
  planName: string;
  status: ServiceStatus;
  activatedAt: string;
  pppoeUser: string;
  ipAddress: string;
  nasDevice: string;
  vlan: number;
  mrr: number;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  issued: string;
  due: string;
  status: "paid" | "open" | "overdue" | "draft" | "void";
  subtotal: number;
  tax: number;
  total: number;
  lines: { description: string; qty: number; rate: number }[];
}

export interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  method: "Card" | "ACH" | "Cash" | "Bank Transfer" | "Wallet";
  reference: string;
  amount: number;
  status: "settled" | "pending" | "failed" | "refunded";
}

export interface LedgerEntry {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  type: "credit" | "debit";
  reason: string;
  amount: number;
  appliedBy: string;
}

export interface PaymentPlan {
  id: string;
  customerId: string;
  customerName: string;
  total: number;
  remaining: number;
  installments: number;
  paid: number;
  nextDue: string;
  status: "on_track" | "at_risk" | "completed";
}

export interface TaxRule {
  id: string;
  name: string;
  jurisdiction: string;
  rate: number;
  appliesTo: string;
  active: boolean;
}

export interface Device {
  id: string;
  hostname: string;
  type: "Edge Router" | "OLT" | "Access Point" | "Switch" | "BNG";
  vendor: string;
  model: string;
  site: string;
  mgmtIp: string;
  status: "online" | "degraded" | "offline" | "maintenance";
  uptimeDays: number;
  cpu: number;
  clients: number;
  lat: number;
  lng: number;
}

export interface Onu {
  id: string;
  serial: string;
  customerName: string;
  olt: string;
  ponPort: string;
  rxPower: number;
  status: "online" | "los" | "dying_gasp" | "offline";
  model: string;
}

export interface Subnet {
  id: string;
  cidr: string;
  purpose: string;
  vlan: number;
  gateway: string;
  used: number;
  size: number;
  site: string;
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  phone: string;
  source: string;
  stage: "new" | "qualified" | "survey" | "quoted" | "won" | "lost";
  value: number;
  owner: string;
  updated: string;
  address: string;
}

export interface Ticket {
  id: string;
  number: string;
  subject: string;
  customerId: string;
  customerName: string;
  category: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "new" | "open" | "pending" | "escalated" | "resolved" | "closed";
  assignee: string;
  created: string;
  slaDueMinutes: number;
  channel: "Phone" | "Email" | "Portal" | "Walk-in" | "Chat";
  messages: {
    author: string;
    role: "agent" | "customer" | "system";
    internal: boolean;
    time: string;
    body: string;
  }[];
  attachments: { name: string; size: string }[];
}

export interface JobOrder {
  id: string;
  number: string;
  type: "Installation" | "Repair" | "Upgrade" | "Relocation" | "Disconnection";
  customerId: string;
  customerName: string;
  address: string;
  technician: string;
  scheduled: string;
  window: string;
  status: "unassigned" | "scheduled" | "en_route" | "in_progress" | "completed" | "failed";
  priority: "low" | "normal" | "high";
  equipment: { item: string; qty: number }[];
  notes: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  skus: number;
  units: number;
  manager: string;
}

export interface StockItem {
  id: string;
  sku: string;
  name: string;
  category: "CPE" | "ONU" | "Router" | "Cable" | "Optic" | "Tool";
  warehouse: string;
  onHand: number;
  reserved: number;
  reorderPoint: number;
  unitCost: number;
  serialized: boolean;
}

export interface SerialUnit {
  id: string;
  serial: string;
  sku: string;
  model: string;
  state: "in_stock" | "assigned" | "deployed" | "rma" | "retired";
  location: string;
  assignedTo?: string;
}

export interface Transfer {
  id: string;
  reference: string;
  from: string;
  to: string;
  items: number;
  status: "draft" | "in_transit" | "received" | "cancelled";
  created: string;
  requestedBy: string;
}

export interface ActivityEvent {
  id: string;
  time: string;
  actor: string;
  action: string;
  target: string;
  kind: "billing" | "network" | "support" | "field" | "crm" | "inventory";
}
