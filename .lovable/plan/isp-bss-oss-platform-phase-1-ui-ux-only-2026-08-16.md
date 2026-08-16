# ISP BSS/OSS Platform — Phase 1 (UI/UX Only)

An original, production-grade ISP Business & Operations Support System interface. Frontend only: no backend, no database, no real integrations. All screens run on local seed data.

## Design direction

Dense operations console, not a generic admin template:
- Dark-capable enterprise palette with a signal accent (network-teal) plus semantic status colors (active / suspended / overdue / offline / pending).
- Compact typographic scale, tabular numerals for money and IDs, tight row heights for high data density.
- Persistent left sidebar (grouped: Overview, Billing, Subscribers, CRM, Support, Field Ops, Network, Inventory, Reports, Settings), top bar with global search (Cmd+K), NOC status pill, notifications, and user menu.
- Collapsible sidebar on tablet, bottom tab bar + sheet navigation on mobile; every table has a card fallback layout below `md`.

## Screens to build

**Dashboard** — revenue MRR/ARPU tiles, subscriber counts, active vs suspended, outstanding AR aging, network health, open tickets by SLA, today's jobs, low-stock alerts, recent activity feed, revenue and churn charts.

**BSS**
- Customers list + Customer 360 (overview, services, billing, invoices, payments, tickets, jobs, documents, timeline).
- Subscribers / service subscriptions with lifecycle states (lead → pending install → active → suspended → restored → cancelled).
- Service plans catalog (speed tiers, price, data policy, contract term).
- Invoices (list, detail, line items, taxes, credits/debits), payments, credits & debits ledger, payment plans, tax rules.
- Auto-suspension rules screen and restoration action flows.

**OSS / Network**
- Provisioning workspace: PPPoE credential form, RADIUS profile mapping, service activation / suspension / restoration flows (simulated, with confirm modals and progress states).
- Device inventory: routers, OLTs, ONU/ONT with status, uptime, signal levels.
- IP address management (subnets, pools, assignments).
- Network status board + map view of sites/devices with status pins.

**CRM** — leads list, kanban sales pipeline, contacts, notes, documents, contracts, communication log, per-customer service/billing/support history and unified timeline.

**Support** — ticket queue with filters, ticket detail (priority, SLA countdown, assignment, status, public replies vs internal notes, attachments, timeline), complaint intake form.

**Field Operations** — job orders (install, repair, upgrade, relocation, disconnection), calendar + dispatch board, technician assignment, work status, equipment used per job.

**Inventory** — warehouses, stock levels, equipment/CPE items with serial numbers, transfers, assignment to customers/jobs, low-stock alerts.

**Reports** — revenue, churn, ARPU, collections, ticket SLA, technician productivity, with charts and export buttons (UI only).

## UI system components

Data table shell (sort, column filters, saved views, bulk actions, pagination, density toggle), filter bar, status badges, drawers, modals, multi-step forms, tabbed detail layouts, timelines, charts, map view, notification center, plus consistent loading skeletons, empty states, and error states for every list and detail screen.

## Technical notes

- TanStack Start file-based routes, one route file per screen with its own `head()` metadata; `/` becomes the dashboard.
- Design tokens defined in `src/styles.css` (`@theme inline` + oklch values); no hardcoded color utilities in components.
- shadcn/ui primitives extended with app-specific variants; Recharts for charts; a lightweight SVG/canvas map (no Mapbox key needed).
- Seed data in `src/data/*.ts` as typed fixtures; shared TypeScript domain types in `src/types/`.
- Shared shell components under `src/components/layout/`, reusable table/filter/state primitives under `src/components/common/`.
- No Lovable Cloud, no server functions, no external API calls in this phase.

## Out of scope (Phase 2)

Backend, database, real APIs, MikroTik/ZTE/RADIUS, payment gateways, SMS/email/WhatsApp, real provisioning.
