# SolarOps Luxembourg — Internal Operations Demo

> Demo created by Hugo Melo to show how I identify and solve operational problems inside solar companies in Luxembourg.

<p align="left">
  <img src="https://img.shields.io/badge/Status-Demo-blue" alt="Status Badge" />
  <img src="https://img.shields.io/badge/Focus-Internal%20Operations-green" alt="Focus Badge" />
  <img src="https://img.shields.io/badge/Market-Luxembourg-red" alt="Market Badge" />
  <img src="https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Node.js-black" alt="Stack Badge" />
</p>

---

## The problem I observed

Most solar installation companies in Luxembourg still manage their pipeline across Excel, WhatsApp, phone calls and paper notes.

In practice, this creates the same recurring problems:

- A sales rep sends a quote and no one knows if the client responded
- A CREOS file has been waiting 4 weeks — nobody flagged it until the client called
- The office doesn't know which technician is at which site today
- When the team grows, information is scattered across personal phones
- Leads come in but are not followed up in time — and go to a competitor

These are not technology problems. They are **visibility and coordination** problems — and they cost time, clients, and margin every week.

---

## What this demo shows

This is a portfolio piece that demonstrates operational thinking — not a ready-to-deploy product. It shows how I identify where information gets lost, map recurring bottlenecks, and structure the flow before building anything.

The tool is built around the real workflow, not around a generic template.

---

## Before / After

| Before | After |
|--------|-------|
| Excel + WhatsApp + paper | Single pipeline visible to the whole team |
| CREOS delays discovered too late | Automatic alerts after 21 days |
| Quote sent — then silence | Follow-up alert after 14 days without response |
| "Who is at which site today?" | Terrain dispatch view per technician |
| No contact history | Every action logged with timestamp |
| Quote calculated manually | Quote + Klimabonus PDF in 5 minutes |

---

## What the demo includes

### Dashboard — 30 seconds to see everything

Total pipeline, estimated value, active CREOS files, projects without recent contact, stage breakdown. No scrolling, no searching.

### Quote generation in 5 minutes

Fill in roof area, consumption profile and client name. The system calculates kWp, Klimabonus 2026 subsidy, indicative net cost and payback period. Generates a professional PDF ready to send.

Solves the problem of quotes made by hand in Word, with calculation errors, that take 2 days to prepare.

### Kanban pipeline

Lead → Visite → Devis → CREOS → Installation → Raccordement → Terminé

Every project has a stage, an owner, a due date and a next action. Nothing gets lost between steps.

### Automatic alerts

The system flags three patterns that cost money when missed:
- CREOS file pending for more than 21 days
- Quote sent more than 14 days ago with no movement
- Project without any contact for more than 7 days

### WhatsApp follow-up in one click

Each project has ready-made message templates: quote follow-up, CREOS update, installation confirmation. Click, preview the message, send. The event is logged in the project history.

Solves the problem of inconsistent follow-up between sales reps and contact history lost in someone's personal phone.

### Terrain dispatch board

The office sees, in real time: which technician is assigned to which site, the address, client, kWp, status of the work, and days on site. Unassigned active projects are flagged immediately.

Solves the problem of calling each technician every morning to ask where they are and what they have for the day.

### Project history

Every status change, note, contact logged, or WhatsApp sent is recorded with a timestamp. The full activity trail is visible inside each project.

Solves the question "who said what to the client and when" — which creates internal conflicts and loses deals when the answer doesn't exist.

### Installation checklist

Structured per project across three phases: before, during and after installation. Progress is visible and persistent.

Solves the problem of steps forgotten mid-installation, or incomplete handovers where nobody is sure if the final documentation was given to the client.

---

## A concrete example of the problem

A quote is sent on a Monday.
The client needs a few days to think.
CREOS status is unclear.
Sales thinks admin is following up.
Admin thinks sales already called.
Installation has no visibility on timing.

Nothing is fully broken — but the company loses time every week because the flow is not structured.

This demo shows one way to reduce that noise.

---

## Who this is for

This type of tool is relevant for solar installation companies of 3 to 30 people that:

- Already have enough pipeline to lose track without a system
- Want to professionalize client follow-up without hiring more administrative staff
- Are growing and need the whole team to share the same operational picture

Built around the real workflow — no technical training needed. Anyone on the team can use it from day one.

---

## How to use this demo

This demo is designed to be shown during a conversation — not downloaded and tested alone. The goal is to walk through the workflow together and discuss how it fits the real operation.

---

## Run locally

```bash
git clone https://github.com/Hugomelo123/demosolar.git
cd demosolar
npm install
npm run dev:client
```

Open **http://localhost:5002** — dashboard, pipeline and quote tool visible in under 30 seconds.

---

## About

**Hugo Melo** — operations and project coordination, focused on the Luxembourg solar sector.

I built this demo to show that I understand the real operational problems of an installation company — not just the technology, but the day-to-day reality of sales, CREOS, field teams and client follow-up.

Available for operations management, commercial coordination, or digital transformation roles in the solar sector.

- GitHub: [github.com/Hugomelo123](https://github.com/Hugomelo123)
- LinkedIn: [linkedin.com/in/hugomelo123](https://www.linkedin.com/in/hugomelo123)

---

## Technical note

The demo runs entirely in the browser with no server or database required. Data is stored locally.

For a real team deployment, the architecture is prepared for database connection and multi-user authentication — not implemented here because the goal of this version is to demonstrate the operations, not the infrastructure.

> Stack: React 19, TypeScript, Express, Tailwind CSS, pdf-lib. Tests: Vitest.
