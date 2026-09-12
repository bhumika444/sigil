# Lovable Prompt — Sigil KYA Dashboard (Phase 0)

Paste everything below the line into Lovable:

---

Build a dashboard app called "Sigil" — a Know Your Agent (KYA) identity platform for AI agents in finance.

## Design System

Use this exact color palette:
- Background: #0F0D1A (very dark purple-black)
- Card/surface backgrounds: #1A1730
- Sidebar: #16132B
- Primary brand color: #534AB7 (purple — buttons, active states, links)
- Secondary text: #AFA9EC (light purple)
- Light fill for badges/chips: #EEEDFE
- Verified/active status: #1D9E75 (green)
- Revoked/alert status: #E24B4A (red)
- Warning/flagged: #E89B3E (amber)
- Body text: #E2E0F0 (off-white)

Typography: Use Inter or system sans-serif. The logo text "sigil" should be lowercase, letter-spacing: 0.15em, font-weight 600.

The overall aesthetic should feel like a premium fintech compliance dashboard — dark mode, clean, minimal, data-dense. Think Linear meets Bloomberg terminal.

## Layout

Sidebar navigation on the left with these items:
- Dashboard (home icon) — overview page
- Agents (users icon) — agent registry
- Credentials (shield icon) — Sigil Passports
- Transactions (arrows icon) — payment activity
- Audit Log (scroll icon) — Sigil Vault
- Settings (gear icon)

Top bar should show "sigil" logo text on the left and a user avatar/org name on the right ("Acme Corp").

## Dashboard Page (home/default)

Show 4 stat cards at the top in a row:
1. "Active Agents" — number, green accent
2. "Credentials Issued" — number, purple accent
3. "Transactions (30d)" — number + dollar amount, purple accent
4. "Avg Sigil Score" — number out of 100, with a small circular progress indicator

Below the stat cards, two columns:
- Left (wider): "Recent Transactions" — a table showing last 10 transactions with columns: Agent, Amount, Counterparty, Category, Status (badge: settled=green, rejected=red, flagged=amber), Time
- Right (narrower): "Alerts" — a list of recent anomaly events with severity badges (warning=amber, critical=red) and short descriptions

## Agents Page

A table/list of registered agents with columns:
- Agent ID (format: SGL-XXXX-name-NN, monospace font)
- Name
- Principal Org
- Type (badge: procurement, trading, research, payment)
- Sigil Score (number with color: 80-100 green, 50-79 amber, 0-49 red)
- Status (badge: active=green, suspended=amber, revoked=red)
- Created date

Include a prominent "Register Agent" button (purple, top right) that opens a modal/drawer form with fields:
- Agent Name (text)
- Description (textarea)
- Principal Organization (text)
- Principal User (text)
- Agent Type (select: procurement, trading, research, payment)

On form submit, it should create a row in the Supabase `agents` table and auto-generate an `agent_code` in format `SGL-{4 random hex chars}-{name slug}-01`.

## Credentials Page

Table of issued credentials:
- Agent (linked to agent name)
- Scope summary (text summary of JSON scope)
- Spend Limit
- Per-Transaction Limit
- Status (active=green, expired=amber, revoked=red)
- Issued date
- Expires date

## Transactions Page

Full transaction history table:
- Agent ID
- Amount + Currency
- Counterparty
- Category
- Status badge
- Rejection reason (if any, shown on hover or in expandable row)
- Timestamp

## Audit Log Page

Event log table:
- Event type (use the exact event names like "sigil.credential.issued", monospace font)
- Agent
- Severity badge (info=purple, warning=amber, critical=red)
- Details (expandable JSON or summary text)
- Timestamp

Filter bar at top: filter by agent, event type, severity, date range.

## Important

- Connect to Supabase — I have an existing project with tables: agents, credentials, transactions, audit_logs, reputation. Use the Supabase integration to read/write from these tables.
- All data should be live from Supabase, not mock/hardcoded.
- Use Tanstack Query (React Query) for data fetching.
- Make all tables sortable and searchable.
- Responsive but desktop-first.
- No authentication needed yet — open access for hackathon.
