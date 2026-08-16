import type {
  ActivityEvent,
  Customer,
  Device,
  Invoice,
  JobOrder,
  Lead,
  LedgerEntry,
  Onu,
  Payment,
  PaymentPlan,
  SerialUnit,
  ServicePlan,
  StockItem,
  Subnet,
  Subscription,
  TaxRule,
  Ticket,
  Transfer,
  Warehouse,
} from "@/types";

export const plans: ServicePlan[] = [
  { id: "PL-100", name: "Residential 100", down: 100, up: 50, price: 49.0, technology: "GPON", dataPolicy: "Unlimited", contractTerm: "12 months", subscribers: 1842 },
  { id: "PL-300", name: "Residential 300", down: 300, up: 150, price: 69.0, technology: "GPON", dataPolicy: "Unlimited", contractTerm: "12 months", subscribers: 2610 },
  { id: "PL-1G", name: "Residential Gig", down: 1000, up: 500, price: 99.0, technology: "GPON", dataPolicy: "Unlimited", contractTerm: "24 months", subscribers: 1173 },
  { id: "PL-FW50", name: "Rural Wireless 50", down: 50, up: 10, price: 59.0, technology: "Fixed Wireless", dataPolicy: "1 TB soft cap", contractTerm: "Month to month", subscribers: 736 },
  { id: "PL-BIZ500", name: "Business 500 SLA", down: 500, up: 500, price: 249.0, technology: "Fiber", dataPolicy: "Unlimited / 99.9% SLA", contractTerm: "36 months", subscribers: 214 },
  { id: "PL-BIZ1G", name: "Business Gig Dedicated", down: 1000, up: 1000, price: 599.0, technology: "Fiber", dataPolicy: "Dedicated / 99.99% SLA", contractTerm: "36 months", subscribers: 61 },
];

const firstNames = ["Maya", "Declan", "Priya", "Tomas", "Awa", "Henrik", "Rosa", "Kwame", "Ingrid", "Samir", "Lena", "Oscar", "Nadia", "Ivan", "Claire", "Bo", "Farah", "Milo", "Zara", "Elias"];
const lastNames = ["Okafor", "Whitfield", "Raman", "Alvarez", "Diallo", "Sorensen", "Delgado", "Mensah", "Halvorsen", "Haddad", "Petrova", "Lindqvist", "Rahim", "Kovac", "Beaumont", "Tran", "Nasser", "Ferraro", "Ahmadi", "Roussel"];
const cities = ["Northgate", "Ridgemont", "Cedar Flats", "Harbor Point", "Alder Creek", "Westmill"];
const streets = ["Foundry Rd", "Lakeshore Ave", "Beacon St", "Quarry Ln", "Sycamore Dr", "Signal Hill Rd"];
const statuses: Customer["status"][] = ["active", "active", "active", "active", "suspended", "pending_install", "lead", "cancelled"];

export const customers: Customer[] = Array.from({ length: 48 }, (_, i) => {
  const plan = plans[i % plans.length];
  const status = statuses[i % statuses.length];
  const balance = status === "suspended" ? 120 + (i % 7) * 31.5 : i % 5 === 0 ? (i % 3) * 24.75 : 0;
  return {
    id: `CUS-${1000 + i}`,
    accountNumber: `AC-${20450 + i * 3}`,
    name: `${firstNames[i % firstNames.length]} ${lastNames[(i * 7) % lastNames.length]}`,
    company: i % 6 === 0 ? `${lastNames[i % lastNames.length]} Logistics` : undefined,
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[(i * 7) % lastNames.length].toLowerCase()}@mail.test`,
    phone: `+1 (555) ${String(200 + i).padStart(3, "0")}-${String(1000 + i * 13).slice(0, 4)}`,
    address: `${120 + i * 4} ${streets[i % streets.length]}`,
    city: cities[i % cities.length],
    status,
    planId: plan.id,
    balance: Number(balance.toFixed(2)),
    mrr: status === "active" || status === "suspended" ? plan.price : 0,
    since: `20${20 + (i % 6)}-0${(i % 9) + 1}-1${i % 9}`,
    tags: [plan.technology, i % 6 === 0 ? "Business" : "Residential", ...(balance > 100 ? ["Collections"] : [])],
    lat: 44.62 + ((i % 8) - 4) * 0.022,
    lng: -63.58 + ((i % 11) - 5) * 0.03,
  };
});

export const subscriptions: Subscription[] = customers
  .filter((c) => c.status === "active" || c.status === "suspended" || c.status === "pending_install")
  .map((c, i) => {
    const plan = plans.find((p) => p.id === c.planId)!;
    return {
      id: `SUB-${5000 + i}`,
      customerId: c.id,
      customerName: c.name,
      planId: plan.id,
      planName: plan.name,
      status:
        c.status === "active" ? "active" : c.status === "suspended" ? "suspended" : "pending",
      activatedAt: c.since,
      pppoeUser: `${c.accountNumber.toLowerCase()}@isp.net`,
      ipAddress: `10.${40 + (i % 6)}.${i % 250}.${(i * 3) % 250}`,
      nasDevice: ["bng-core-01", "bng-core-02", "bng-edge-north"][i % 3],
      vlan: 700 + (i % 40),
      mrr: plan.price,
    } satisfies Subscription;
  });

export const invoices: Invoice[] = customers.slice(0, 34).map((c, i) => {
  const plan = plans.find((p) => p.id === c.planId)!;
  const subtotal = plan.price + (i % 4 === 0 ? 10 : 0);
  const tax = Number((subtotal * 0.13).toFixed(2));
  const status: Invoice["status"] =
    i % 9 === 0 ? "overdue" : i % 5 === 0 ? "open" : i % 17 === 0 ? "draft" : "paid";
  return {
    id: `INV-${9000 + i}`,
    number: `2026-${String(1400 + i)}`,
    customerId: c.id,
    customerName: c.name,
    issued: `2026-07-0${(i % 9) + 1}`,
    due: `2026-08-0${(i % 9) + 1}`,
    status,
    subtotal,
    tax,
    total: Number((subtotal + tax).toFixed(2)),
    lines: [
      { description: `${plan.name} — monthly service`, qty: 1, rate: plan.price },
      ...(i % 4 === 0 ? [{ description: "Managed Wi-Fi router rental", qty: 1, rate: 10 }] : []),
    ],
  };
});

export const payments: Payment[] = customers.slice(0, 26).map((c, i) => ({
  id: `PAY-${7000 + i}`,
  customerId: c.id,
  customerName: c.name,
  date: `2026-08-${String((i % 27) + 1).padStart(2, "0")}`,
  method: (["Card", "ACH", "Bank Transfer", "Cash", "Wallet"] as const)[i % 5],
  reference: `TXN-${483920 + i * 17}`,
  amount: Number((plans[i % plans.length].price * 1.13).toFixed(2)),
  status: (["settled", "settled", "settled", "pending", "failed", "refunded"] as const)[i % 6],
}));

export const ledger: LedgerEntry[] = customers.slice(0, 18).map((c, i) => ({
  id: `LED-${3000 + i}`,
  customerId: c.id,
  customerName: c.name,
  date: `2026-08-${String((i % 27) + 1).padStart(2, "0")}`,
  type: i % 3 === 0 ? "debit" : "credit",
  reason: [
    "Outage service credit",
    "Late payment fee",
    "Goodwill adjustment",
    "Reconnection fee",
    "Prorated plan change",
    "Equipment damage charge",
  ][i % 6],
  amount: Number((8 + (i % 7) * 6.25).toFixed(2)),
  appliedBy: ["R. Delgado", "S. Haddad", "System", "K. Mensah"][i % 4],
}));

export const paymentPlans: PaymentPlan[] = customers
  .filter((c) => c.balance > 100)
  .slice(0, 9)
  .map((c, i) => ({
    id: `PP-${400 + i}`,
    customerId: c.id,
    customerName: c.name,
    total: Number((c.balance + 60).toFixed(2)),
    remaining: Number((c.balance * 0.6).toFixed(2)),
    installments: 4 + (i % 3),
    paid: 1 + (i % 3),
    nextDue: `2026-09-${String((i % 27) + 1).padStart(2, "0")}`,
    status: (["on_track", "at_risk", "on_track", "completed"] as const)[i % 4],
  }));

export const taxRules: TaxRule[] = [
  { id: "TX-1", name: "State communications tax", jurisdiction: "State", rate: 6.5, appliesTo: "All broadband services", active: true },
  { id: "TX-2", name: "Municipal right-of-way fee", jurisdiction: "Northgate", rate: 2.0, appliesTo: "Wireline services", active: true },
  { id: "TX-3", name: "Universal service fund", jurisdiction: "Federal", rate: 4.5, appliesTo: "Voice + broadband", active: true },
  { id: "TX-4", name: "Equipment rental tax", jurisdiction: "State", rate: 7.0, appliesTo: "Hardware rentals", active: true },
  { id: "TX-5", name: "Rural surcharge (retired)", jurisdiction: "County", rate: 1.25, appliesTo: "Fixed wireless", active: false },
];

export const devices: Device[] = [
  { id: "DV-1", hostname: "bng-core-01", type: "BNG", vendor: "Northwind", model: "NX-9400", site: "Central POP", mgmtIp: "10.0.0.11", status: "online", uptimeDays: 214, cpu: 38, clients: 2410, lat: 44.648, lng: -63.575 },
  { id: "DV-2", hostname: "bng-core-02", type: "BNG", vendor: "Northwind", model: "NX-9400", site: "Central POP", mgmtIp: "10.0.0.12", status: "online", uptimeDays: 214, cpu: 44, clients: 2288, lat: 44.649, lng: -63.573 },
  { id: "DV-3", hostname: "olt-northgate-a", type: "OLT", vendor: "Lumitek", model: "GX-16", site: "Northgate Hub", mgmtIp: "10.0.4.20", status: "online", uptimeDays: 88, cpu: 27, clients: 986, lat: 44.671, lng: -63.601 },
  { id: "DV-4", hostname: "olt-cedar-b", type: "OLT", vendor: "Lumitek", model: "GX-8", site: "Cedar Flats Hut", mgmtIp: "10.0.4.21", status: "degraded", uptimeDays: 12, cpu: 81, clients: 612, lat: 44.601, lng: -63.63 },
  { id: "DV-5", hostname: "edge-harbor-01", type: "Edge Router", vendor: "Northwind", model: "NX-3200", site: "Harbor Point", mgmtIp: "10.0.1.30", status: "online", uptimeDays: 160, cpu: 19, clients: 402, lat: 44.63, lng: -63.52 },
  { id: "DV-6", hostname: "ap-ridgemont-tower", type: "Access Point", vendor: "AirSpan", model: "PTMP-5G", site: "Ridgemont Tower", mgmtIp: "10.0.6.44", status: "offline", uptimeDays: 0, cpu: 0, clients: 0, lat: 44.598, lng: -63.512 },
  { id: "DV-7", hostname: "sw-alder-dist", type: "Switch", vendor: "Corevolt", model: "CV-48T", site: "Alder Creek", mgmtIp: "10.0.2.15", status: "maintenance", uptimeDays: 3, cpu: 12, clients: 128, lat: 44.66, lng: -63.54 },
  { id: "DV-8", hostname: "edge-westmill-01", type: "Edge Router", vendor: "Northwind", model: "NX-3200", site: "Westmill", mgmtIp: "10.0.1.31", status: "online", uptimeDays: 96, cpu: 31, clients: 355, lat: 44.615, lng: -63.66 },
];

export const onus: Onu[] = Array.from({ length: 14 }, (_, i) => ({
  id: `ONU-${100 + i}`,
  serial: `LMTK${String(48210033 + i * 41)}`,
  customerName: customers[i].name,
  olt: i % 2 === 0 ? "olt-northgate-a" : "olt-cedar-b",
  ponPort: `0/${(i % 4) + 1}/${(i % 16) + 1}`,
  rxPower: Number((-18.4 - (i % 8) * 0.9).toFixed(1)),
  status: i % 9 === 0 ? "los" : i % 11 === 0 ? "dying_gasp" : i % 7 === 0 ? "offline" : "online",
  model: i % 3 === 0 ? "LX-220 ONT" : "LX-110 ONU",
}));

export const subnets: Subnet[] = [
  { id: "SN-1", cidr: "10.40.0.0/16", purpose: "PPPoE dynamic pool — North", vlan: 700, gateway: "10.40.0.1", used: 4210, size: 65534, site: "Central POP" },
  { id: "SN-2", cidr: "10.41.0.0/16", purpose: "PPPoE dynamic pool — South", vlan: 701, gateway: "10.41.0.1", used: 3106, size: 65534, site: "Central POP" },
  { id: "SN-3", cidr: "198.51.100.0/24", purpose: "Static business IPs", vlan: 720, gateway: "198.51.100.1", used: 188, size: 254, site: "Central POP" },
  { id: "SN-4", cidr: "10.0.0.0/22", purpose: "Device management", vlan: 10, gateway: "10.0.0.1", used: 340, size: 1022, site: "All sites" },
  { id: "SN-5", cidr: "100.64.8.0/22", purpose: "CGNAT block A", vlan: 750, gateway: "100.64.8.1", used: 960, size: 1022, site: "Central POP" },
  { id: "SN-6", cidr: "10.60.0.0/20", purpose: "Fixed wireless pool", vlan: 760, gateway: "10.60.0.1", used: 712, size: 4094, site: "Ridgemont Tower" },
];

export const leads: Lead[] = Array.from({ length: 16 }, (_, i) => ({
  id: `LD-${200 + i}`,
  name: i % 3 === 0 ? `${lastNames[i % lastNames.length]} Dental Group` : `${firstNames[(i * 3) % firstNames.length]} ${lastNames[(i * 5) % lastNames.length]}`,
  contact: `${firstNames[(i * 3) % firstNames.length]} ${lastNames[(i * 5) % lastNames.length]}`,
  phone: `+1 (555) ${String(300 + i).padStart(3, "0")}-77${String(10 + i).slice(0, 2)}`,
  source: ["Web form", "Referral", "Door knock", "Trade show", "Inbound call"][i % 5],
  stage: (["new", "qualified", "survey", "quoted", "won", "lost"] as const)[i % 6],
  value: 49 + (i % 6) * 55,
  owner: ["R. Delgado", "K. Mensah", "L. Petrova"][i % 3],
  updated: `2026-08-${String((i % 16) + 1).padStart(2, "0")}`,
  address: `${40 + i * 6} ${streets[(i + 2) % streets.length]}, ${cities[i % cities.length]}`,
}));

export const tickets: Ticket[] = Array.from({ length: 22 }, (_, i) => {
  const c = customers[(i * 3) % customers.length];
  return {
    id: `TK-${600 + i}`,
    number: `T-${48210 + i}`,
    subject: [
      "No internet after storm",
      "Intermittent packet loss in evenings",
      "Slow speeds on Wi-Fi only",
      "Requesting static IP block",
      "Billing dispute on last invoice",
      "ONT red LOS light",
      "Router keeps rebooting",
      "Relocation of service to new address",
    ][i % 8],
    customerId: c.id,
    customerName: c.name,
    category: ["Connectivity", "Performance", "Billing", "Provisioning", "Hardware"][i % 5],
    priority: (["urgent", "high", "normal", "normal", "low"] as const)[i % 5],
    status: (["new", "open", "pending", "escalated", "resolved", "closed"] as const)[i % 6],
    assignee: ["S. Haddad", "K. Mensah", "Unassigned", "L. Petrova", "T. Alvarez"][i % 5],
    created: `2026-08-${String((i % 16) + 1).padStart(2, "0")} 0${i % 9}:15`,
    slaDueMinutes: [-45, 22, 180, 640, 1200, 90][i % 6],
    channel: (["Phone", "Email", "Portal", "Chat", "Walk-in"] as const)[i % 5],
    messages: [
      { author: c.name, role: "customer", internal: false, time: "09:12", body: "Service dropped last night around 11pm and has not returned. Power cycled the ONT twice." },
      { author: "System", role: "system", internal: false, time: "09:12", body: "Auto-diagnostics: ONT unreachable, last seen 23:04. PON port 0/2/7 shows LOS." },
      { author: "S. Haddad", role: "agent", internal: true, time: "09:31", body: "Cedar Flats OLT reported degraded earlier — checking whether this is part of the same fault domain." },
      { author: "S. Haddad", role: "agent", internal: false, time: "09:40", body: "Thanks for the details. We've dispatched a technician for tomorrow 08:00–10:00 and credited today's outage." },
    ],
    attachments: i % 3 === 0 ? [{ name: "ont-led-photo.jpg", size: "1.2 MB" }, { name: "speedtest.pdf", size: "240 KB" }] : [],
  };
});

export const jobs: JobOrder[] = Array.from({ length: 20 }, (_, i) => {
  const c = customers[(i * 5) % customers.length];
  return {
    id: `JB-${800 + i}`,
    number: `WO-${31200 + i}`,
    type: (["Installation", "Repair", "Upgrade", "Relocation", "Disconnection"] as const)[i % 5],
    customerId: c.id,
    customerName: c.name,
    address: `${c.address}, ${c.city}`,
    technician: ["M. Okafor", "D. Whitfield", "P. Raman", "Unassigned", "I. Kovac"][i % 5],
    scheduled: `2026-08-${String(16 + (i % 6)).padStart(2, "0")}`,
    window: ["08:00–10:00", "10:00–12:00", "13:00–15:00", "15:00–17:00"][i % 4],
    status: (["scheduled", "en_route", "in_progress", "completed", "unassigned", "failed"] as const)[i % 6],
    priority: (["normal", "high", "low"] as const)[i % 3],
    equipment: [
      { item: i % 2 === 0 ? "LX-110 ONU" : "Managed Wi-Fi 6 Router", qty: 1 },
      { item: "Drop cable 150 ft", qty: 1 },
    ],
    notes: "Confirm dish/drop path and capture photos of the installed CPE before closing the order.",
  };
});

export const warehouses: Warehouse[] = [
  { id: "WH-1", name: "Central Depot", location: "Central POP", skus: 82, units: 4210, manager: "I. Kovac" },
  { id: "WH-2", name: "Northgate Hub", location: "Northgate", skus: 41, units: 1188, manager: "P. Raman" },
  { id: "WH-3", name: "Field Van 12", location: "Mobile — D. Whitfield", skus: 18, units: 96, manager: "D. Whitfield" },
  { id: "WH-4", name: "RMA Quarantine", location: "Central POP", skus: 26, units: 214, manager: "M. Okafor" },
];

export const stock: StockItem[] = [
  { id: "ST-1", sku: "ONU-LX110", name: "Lumitek LX-110 ONU", category: "ONU", warehouse: "Central Depot", onHand: 412, reserved: 60, reorderPoint: 150, unitCost: 38.5, serialized: true },
  { id: "ST-2", sku: "ONT-LX220", name: "Lumitek LX-220 ONT (dual-band)", category: "ONU", warehouse: "Central Depot", onHand: 96, reserved: 34, reorderPoint: 120, unitCost: 62.0, serialized: true },
  { id: "ST-3", sku: "RTR-WIFI6", name: "Managed Wi-Fi 6 Router", category: "Router", warehouse: "Central Depot", onHand: 288, reserved: 71, reorderPoint: 100, unitCost: 74.25, serialized: true },
  { id: "ST-4", sku: "CPE-FW5G", name: "Fixed Wireless CPE 5 GHz", category: "CPE", warehouse: "Northgate Hub", onHand: 41, reorderPoint: 60, reserved: 12, unitCost: 118.0, serialized: true },
  { id: "ST-5", sku: "DRP-150", name: "Fiber drop cable 150 ft", category: "Cable", warehouse: "Northgate Hub", onHand: 620, reserved: 40, reorderPoint: 200, unitCost: 9.4, serialized: false },
  { id: "ST-6", sku: "SFP-BIDI", name: "BiDi SFP+ 10G optic", category: "Optic", warehouse: "Central Depot", onHand: 22, reserved: 6, reorderPoint: 40, unitCost: 46.0, serialized: true },
  { id: "ST-7", sku: "TOOL-FSPL", name: "Fusion splicer kit", category: "Tool", warehouse: "Field Van 12", onHand: 3, reserved: 0, reorderPoint: 2, unitCost: 2140.0, serialized: true },
  { id: "ST-8", sku: "CPE-BIZ", name: "Business edge CPE", category: "CPE", warehouse: "Central Depot", onHand: 58, reserved: 9, reorderPoint: 25, unitCost: 210.0, serialized: true },
];

export const serials: SerialUnit[] = Array.from({ length: 18 }, (_, i) => ({
  id: `SR-${900 + i}`,
  serial: `SN${String(77420011 + i * 137)}`,
  sku: stock[i % stock.length].sku,
  model: stock[i % stock.length].name,
  state: (["in_stock", "assigned", "deployed", "deployed", "rma", "retired"] as const)[i % 6],
  location: warehouses[i % warehouses.length].name,
  assignedTo: i % 6 === 1 || i % 6 === 2 ? customers[i % customers.length].name : undefined,
}));

export const transfers: Transfer[] = Array.from({ length: 8 }, (_, i) => ({
  id: `TR-${500 + i}`,
  reference: `TRF-${9120 + i}`,
  from: warehouses[i % warehouses.length].name,
  to: warehouses[(i + 1) % warehouses.length].name,
  items: 4 + (i % 9) * 3,
  status: (["in_transit", "received", "draft", "cancelled"] as const)[i % 4],
  created: `2026-08-${String((i % 20) + 1).padStart(2, "0")}`,
  requestedBy: ["I. Kovac", "P. Raman", "M. Okafor"][i % 3],
}));

export const activity: ActivityEvent[] = [
  { id: "AC-1", time: "2 min ago", actor: "System", action: "Auto-suspended service for non-payment", target: "AC-20487 · Priya Raman", kind: "billing" },
  { id: "AC-2", time: "9 min ago", actor: "S. Haddad", action: "Escalated ticket", target: "T-48213 · ONT red LOS light", kind: "support" },
  { id: "AC-3", time: "17 min ago", actor: "Monitoring", action: "Device state changed to offline", target: "ap-ridgemont-tower", kind: "network" },
  { id: "AC-4", time: "34 min ago", actor: "D. Whitfield", action: "Completed work order", target: "WO-31203 · Installation", kind: "field" },
  { id: "AC-5", time: "48 min ago", actor: "Payments", action: "Settled card payment $77.97", target: "AC-20463 · Tomas Alvarez", kind: "billing" },
  { id: "AC-6", time: "1 hr ago", actor: "I. Kovac", action: "Stock below reorder point", target: "ONT-LX220 · Central Depot", kind: "inventory" },
  { id: "AC-7", time: "1 hr ago", actor: "R. Delgado", action: "Moved lead to Quoted", target: "LD-206 · Sorensen Dental Group", kind: "crm" },
  { id: "AC-8", time: "2 hr ago", actor: "Provisioning", action: "Restored PPPoE session after payment", target: "ac-20472@isp.net", kind: "network" },
];

export const revenueSeries = [
  { month: "Feb", mrr: 384, collected: 366, churn: 1.4 },
  { month: "Mar", mrr: 392, collected: 379, churn: 1.2 },
  { month: "Apr", mrr: 404, collected: 388, churn: 1.6 },
  { month: "May", mrr: 417, collected: 402, churn: 1.1 },
  { month: "Jun", mrr: 428, collected: 415, churn: 0.9 },
  { month: "Jul", mrr: 441, collected: 421, churn: 1.3 },
  { month: "Aug", mrr: 456, collected: 402, churn: 1.0 },
];

export const arAging = [
  { bucket: "Current", amount: 128400 },
  { bucket: "1–30", amount: 42150 },
  { bucket: "31–60", amount: 18600 },
  { bucket: "61–90", amount: 9240 },
  { bucket: "90+", amount: 6110 },
];

export const trafficSeries = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  gbps: Number((18 + Math.sin((i / 24) * Math.PI * 2 - 1.6) * 12 + (i > 18 ? 6 : 0)).toFixed(1)),
}));

export function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function getCustomer(id: string) {
  return customers.find((c) => c.id === id);
}
