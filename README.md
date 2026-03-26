# SolarOps Luxembourg — Internal Operations Demo

> Demo created by Hugo Melo to show how I identify and solve operational problems inside solar companies in Luxembourg.

<p align="left">
  <img src="https://img.shields.io/badge/Status-Demo-blue" alt="Status Badge" />
  <img src="https://img.shields.io/badge/Focus-Internal%20Operations-green" alt="Focus Badge" />
  <img src="https://img.shields.io/badge/Market-Luxembourg-red" alt="Market Badge" />
  <img src="https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Node.js-black" alt="Stack Badge" />
</p>

---

## Overview

In many solar companies, daily operations are still managed across Excel, WhatsApp, calls and paper.

This usually creates the same problems:

- no clear pipeline visibility  
- CREOS delays discovered too late  
- information lost between teams  
- weak follow-up on quotes and projects  
- client-facing output that is too technical or too heavy  

This demo is a simple example of how I would help structure those internal operations.

---

## Why this demo

I studied the Luxembourg solar market and focused on one practical issue:

Sales, admin and installation teams often work with fragmented information.  
The company moves forward, but the process stays reactive instead of structured.

The result is predictable:

- blocked files stay invisible for too long  
- next actions are not always clear  
- quote follow-up depends too much on memory  
- teams do extra work because the flow is not organized  
- the client receives too much complexity and not enough clarity  

---

## What this demo shows

This is **not a product** and **not a ready-to-deploy solution**.

It is a portfolio demo that shows how I work inside a company:

- start from a real operational problem  
- identify the repeating pattern  
- simplify the workflow  
- organize the information  
- build an internal tool adapted to the team  

The objective is to demonstrate operational thinking, not to sell software.

---

## Core operational logic

### Before
- Excel + WhatsApp + calls  
- fragmented project tracking  
- manual follow-up  
- reactive decisions  
- difficult overview for management  

### After
- clear pipeline from lead to installation  
- structured project follow-up  
- visible delays and blocked steps  
- simplified quote generation  
- better internal visibility for next actions  

---

## Main features

### 1. Dashboard in under 30 seconds
Quick overview of:
- total pipeline  
- estimated pipeline value  
- CREOS alerts  
- projects without contact  
- current project stages  

### 2. Quote generation in minutes
- real-time calculations  
- indicative Klimabonus 2026 logic  
- professional PDF output  
- indicative price range instead of rigid fixed price  

### 3. Kanban pipeline
Clear internal flow:

**Lead → Visit → Quote → CREOS → Installation → Done**

This makes project status visible without searching across messages or files.

### 4. Alert system
Built to highlight common delays:
- CREOS pending for too long  
- quote sent but no movement  
- project without contact for several days  

### 5. Project detail page
Each project includes:
- current status  
- notes  
- next action  
- visit scheduling  
- WhatsApp templates  
- internal follow-up structure  

### 6. Installation checklist
Per-project checklist with 3 phases:
- before installation  
- installation day  
- after installation  

Saved locally for quick demo usage.

---

## Example of the problem this demo addresses

A quote is sent.  
The client waits.  
CREOS status is unclear.  
Sales thinks admin is following.  
Admin thinks sales already called.  
Installation has no clear visibility on timing.

Nothing is fully broken, but the company loses time because the process is not structured.

This demo shows one way to reduce that noise.

---

## Approach

My logic is always the same:

1. observe the real workflow  
2. identify where information gets lost  
3. map the repeated bottlenecks  
4. simplify the process  
5. build a tool around the workflow, not around technology  

---

## Quick start

### Requirements
- Node.js 18+  
- npm  

### Run locally

```bash
git clone https://github.com/Hugomelo123/demosolar.git
cd demosolar
npm install
npm run dev:client
