# SolarOps Luxembourg — Operations Demo

> **Operations console for solar installers in Luxembourg.** Quotes in 5 minutes, visible pipeline, CREOS bottlenecks, and installation checklist — all in one place. Built to show control, speed, and process (Operations & Digital).

---

## What is this?

A **demo MVP** that replaces scattered Excel, WhatsApp, and paper with a single operations panel. In **30 seconds** a manager sees: leads, pipeline value, CREOS bottlenecks, and instant quote generation with **Klimabonus 2026** (Luxembourg subsidy) and professional PDF output.

- **Quote in 5 minutes** — Real-time kWp, Klimabonus, payback; PDF and WhatsApp-ready; indicative price range (not a fixed quote).
- **Visible pipeline** — Lead → Quote → CREOS → Installation → Done. Kanban with drag-and-drop.
- **Bottlenecks at a glance** — CREOS stuck >21 days, quote no reply >14 days, no contact >7 days.
- **Next action** per project + **per-project installation checklist** (state persisted in `localStorage`).

---

## Quick start

**Requirements:** Node.js 18+, npm or yarn.

```bash
git clone https://github.com/Hugomelo123/demosolar.git
cd demosolar
npm install
npm run dev:client
```

Open **http://localhost:5002** — you’ll see the dashboard, pipeline, and quote flow in under 30 seconds.

---

## Features

| Feature | Description |
|--------|-------------|
| **Quote in 5 min** | Form with live calculations (kWp, Klimabonus, payback); professional PDF; indicative cost range. |
| **Add to pipeline** | Turn a quote into a project (Quote Sent column); redirects to project detail. |
| **Dashboard** | Metrics (leads, quotes sent, CREOS/install count, pipeline value); funnel; Kanban. |
| **Alerts** | CREOS >21 days, quote >14 days, no contact >7 days — with links to projects. |
| **Project detail** | Stepper, notes, schedule site visit, next action, WhatsApp templates. |
| **Installation checklist** | Per-project checklist (pre / day-of / post install); state saved per project in `localStorage`. |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:client` | Frontend only (Vite), http://localhost:5002 |
| `npm run dev` | Full stack (client + server) |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm test` | Unit tests (Vitest) — calculations & business rules |
| `npm run check` | TypeScript check |

---

## Demo mode

- **No database.** Data lives in React state and is persisted in `localStorage` (survives reloads).
- **Reset:** Clear `localStorage` in the browser (keys `solarops_projects` and `solarops_checklist`) or use a private window.

### Calculation rules (simplified for demo)

- **kWp:** roof area (m²) × 0.17 · **Production:** kWp × 1150 kWh/year.
- **Klimabonus (indicative):** ≤15 kWp → €9,300; >15 kWp → €9,300 + €620/kWp extra; battery +€2,250.
- **Installation:** Basic €2,100/kWp, Premium €2,400/kWp; battery ~€6,500.
- **Annual savings:** % of annual bill (low 35%, normal 45%, high 55%). Net cost = max(0, installation − Klimabonus).
- **Quote range:** Net cost shown as a band (e.g. €12,000 – €13,440), not a single price; ~12% margin on upper bound for post–site-visit adjustment.

---

## Adapting for another company or region

**Branding (single file):** **`client/src/config/demo.ts`**

- `companyName` — Company name (navbar, PDF).
- `consoleTagline` — Console subtitle.
- `userName` / `userRole` — User name and role (top-right).
- `subsidyName` / `operatorName` — Subsidy and grid operator names (e.g. Klimabonus, CREOS).

All other UI copy is in **`client/src/config/opsCopy.ts`**. Calculation rules and constants are in **`client/src/lib/calculations.ts`** — change the constants at the top for another country or year.

---

## Deploy (live link for emails)

To publish the demo (e.g. Vercel or Netlify): see **[docs/DEPLOY.md](docs/DEPLOY.md)** for build command and output directory (`dist/public`).

---

## Tech stack

- **Frontend:** React 19, Vite 7, Wouter, Tailwind CSS 4, Radix UI, TanStack Query
- **Backend:** Express 5 (API routes not yet wired to the app)
- **Types:** TypeScript (strict), Zod
- **Tests:** Vitest (calculation and business-rule tests)

---

## License

MIT
