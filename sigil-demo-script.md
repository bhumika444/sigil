# Sigil — Product Demo Script

**Duration:** ~12-15 minutes  
**Audience:** Investors, enterprise buyers, compliance teams  
**URL:** https://id-preview--6a9d2f05-0bb2-4702-a6ca-0d9c9637f272.lovable.app

---

## Opening (30 seconds)

> "Sigil is a Know-Your-Agent platform — KYA for AI. As autonomous agents start making financial decisions, organizations need a way to credential them, monitor their behavior, and enforce compliance in real time. Let me show you how it works."

---

## Scene 1 — Dashboard Overview (1–2 minutes)

**Navigate to:** `/` (Home)

**What to show:**
- The four stat cards: Active Agents, Credentials Issued, 30-day Transactions, and Average Sigil Score
- The Recent Transactions table (settled and rejected entries)
- The Anomaly Alerts panel

**What to say:**

> "This is the Sigil dashboard — a single pane of glass for your entire agent fleet. You can see we're tracking three agents across two organizations. The Sigil Score is our trust metric — it starts at 50 and moves based on agent behavior. Green means healthy, amber means watch, red means intervene."

> "Notice we already have some anomaly alerts — these are flagged automatically when agents act outside their permitted scope."

---

## Scene 2 — Agent Registration (2–3 minutes)

**Navigate to:** `/agents` → Click **Register Agent**

**What to say:**

> "Let's register a new agent. Every AI agent that wants to transact through Sigil needs a Sigil Passport — think of it as a digital identity with built-in guardrails."

**Fill in the form:**
| Field | Value |
|-------|-------|
| Agent Name | `Nova Payment Bot` |
| Description | `Handles vendor invoice payments for Quantum Labs` |
| Principal Organization | `Quantum Labs` |
| Principal User | `finance@quantumlabs.io` |
| Agent Type | Payment |
| Permitted Categories | Select: `software-licenses`, `cloud-infrastructure` |
| Counterparties | `AWS, Google Cloud, Microsoft Azure` |
| Geographies | Select: `US`, `EU` |
| Spend Limit | `50000` |
| Per Transaction | `10000` |

**Click "Register Agent"**

> "Behind the scenes, this triggers our credentialing workflow. The agent gets a unique Sigil code, a verifiable credential with spending limits, geographic and category restrictions, and a starting reputation score. The credential is cryptographically issued — not just a database entry."

**After toast appears:**

> "The agent is now live. Let's click into it to see the full passport."

**Click the new agent row** to go to its detail page.

> "Here's the Sigil Passport — you can see the permitted categories, counterparties, geographies, and spending limits. The Sigil Score starts at 50. As the agent transacts within its bounds, the score goes up. If it misbehaves, the score drops."

---

## Scene 3 — Transaction Settlement (2 minutes)

**Navigate to:** `/agents` → Click **Atlas Procurement Bot** → Click **Simulate Transaction**

**What to say:**

> "Now let's see what happens when an agent tries to make a purchase. Atlas here is a procurement bot for Acme Corp."

**Fill in the Simulate Transaction form:**
| Field | Value |
|-------|-------|
| Agent ID | *(pre-filled or use `a1000000-0000-0000-0000-000000000001`)* |
| Amount | `2500` |
| Currency | `USD` |
| Counterparty | `Staples` |
| Category | `office-supplies` |

**Click "Submit Transaction"**

> "The transaction is validated against the agent's credential — is the amount within the per-transaction limit? Is 'office-supplies' a permitted category? Is 'Staples' an approved counterparty? Everything checks out, so it settles. The reputation score ticks up, and an audit log entry is created."

**Show the transaction appearing in the Recent Transactions table.**

---

## Scene 4 — Transaction Rejection (2 minutes)

**Stay on Atlas detail page → Simulate Transaction again**

**What to say:**

> "But what happens when an agent goes rogue? Let's simulate a suspicious transaction."

**Fill in:**
| Field | Value |
|-------|-------|
| Amount | `99999` |
| Currency | `USD` |
| Counterparty | `Unknown Vendor` |
| Category | `gambling` |

**Click "Submit Transaction"**

> "This one gets rejected. The category 'gambling' isn't in the permitted list, the counterparty isn't recognized, and the amount exceeds the per-transaction limit. Sigil flags it immediately."

> "Notice the Sigil Score dropped, and a warning-level audit entry was created. The agent's principal — Alice at Acme Corp — would get alerted in a production setup."

**Show the rejected transaction with the rejection reason visible.**

---

## Scene 5 — Verify Agent Identity (1–2 minutes)

**Navigate to:** `/verify`

**What to say:**

> "Any counterparty can verify an agent before doing business with it. This is the public-facing verification endpoint."

**Enter:** `SGL-4f9a-procurement-01` → Click **Verify**

> "You get the full trust profile: the agent's identity, its credential status, spending limits, scope restrictions, and its reputation score with risk tier. A counterparty can make an informed decision — should I accept a purchase order from this agent?"

> "If the agent were revoked or had a low trust score, this page would clearly flag that."

---

## Scene 6 — Compliance Report (1–2 minutes)

**Navigate to:** `/compliance`

**What to say:**

> "For compliance officers, Sigil generates AI-powered audit reports across an entire organization's agent fleet."

**Fill in:**
| Field | Value |
|-------|-------|
| Principal Organization | `Acme Corp` |
| Days | `7` |

**Click "Generate Report"**

> "This pulls all agents under Acme Corp, their transactions over the last 7 days, and any audit events. An AI model analyzes the data and produces a compliance summary with risk assessment and recommendations."

> "This is the report a CISO or compliance officer would review weekly. It covers agent count, transaction volume, anomaly rates, and specific flags."

---

## Scene 7 — Credential Revocation (1–2 minutes)

**Navigate to:** `/agents` → Click **Athena Research Agent** (or any active agent)

**What to say:**

> "If an agent is compromised or decommissioned, we can revoke its Sigil Passport immediately."

**Click "Revoke Sigil"** → Confirm in the dialog

> "The credential is now revoked. The agent's status changes to 'revoked,' a critical audit log entry is created, and any future transaction attempts will be rejected. This is irreversible — like revoking a certificate."

> "In a production environment, this would propagate to all counterparties in real time."

---

## Scene 8 — Audit Log (30 seconds)

**Navigate to:** `/audit-log`

**What to say:**

> "Finally, every action in Sigil is immutably logged. Agent registrations, credential issuances, transactions, rejections, revocations — everything is timestamped and severity-coded. This is your audit trail for regulators."

---

## Closing (30 seconds)

> "To summarize: Sigil provides identity, credentialing, real-time monitoring, and compliance for autonomous AI agents. Think of it as the trust layer between AI agents and the financial system."

> "We're building the infrastructure so that when your AI agent sends a purchase order, the counterparty can verify who it is, what it's allowed to do, and whether it should be trusted — all in milliseconds."

---

## Backup Talking Points

**If asked "How is this different from API keys?"**
> "API keys authenticate a service. Sigil credentials authenticate an *agent* — with behavioral scope, spending limits, and a dynamic trust score. An API key doesn't tell you if the agent is acting within its mandate."

**If asked "What about regulatory compliance?"**
> "We map to existing frameworks — SOC 2, ISO 27001, and emerging AI governance standards. The audit log and compliance reports are designed for regulatory review."

**If asked "What's the business model?"**
> "Per-agent credentialing with tiered pricing based on transaction volume and fleet size. Enterprise plans include custom compliance reporting and SLA-backed monitoring."

**If asked "Can agents interact with each other?"**
> "That's our roadmap — agent-to-agent trust verification. Before two agents transact, they can verify each other's Sigil Passports and negotiate trust thresholds."
