# Lovable Prompt — Phase 1: Agent Registration + Credential Issuance

Paste everything below the line into Lovable as a follow-up prompt:

---

Update the app with these changes:

## 1. Update the "Register Agent" form

Expand the Register Agent modal/drawer form to include these additional fields after the existing ones:

- Permitted Categories (multi-select chips: "office-supplies", "software-licenses", "cloud-infrastructure", "travel", "marketing", "consulting", "raw-materials", "logistics")
- Permitted Counterparties (text input — comma-separated list of allowed counterparty names)
- Permitted Geographies (multi-select chips: "US", "EU", "UK", "APAC", "Global")
- Spend Limit — total (number input, default 10000, in USD)
- Spend Limit — per transaction (number input, default 1000, in USD)

## 2. On form submit — call n8n webhook

When the form is submitted, instead of inserting directly into Supabase, make a POST request to this n8n webhook URL:

`https://vgunda.app.n8n.cloud/webhook/issue-credential`

Send this JSON body:
```json
{
  "name": "<agent name>",
  "description": "<description>",
  "principal_org": "<principal org>",
  "principal_user": "<principal user>",
  "agent_type": "<selected type>",
  "permitted_categories": ["<selected categories>"],
  "permitted_counterparties": ["<comma-split counterparties>"],
  "permitted_geographies": ["<selected geographies>"],
  "spend_limit": <number>,
  "spend_per_transaction": <number>
}
```

On success, the webhook returns a JSON response with `agent`, `credential`, and `sigil_score` objects. Show a success toast: "Sigil Passport issued to {agent.agent_code}" and refresh the agents list.

On error, show an error toast.

## 3. Agent Detail Page

When clicking on an agent row in the Agents table, navigate to an agent detail page (`/agents/:id`) that shows:

### Header section:
- Agent code in large monospace text (e.g. "SGL-4f9a-procurement-01")
- Agent name and description below it
- Status badge (active=green, suspended=amber, revoked=red)
- Agent type badge in purple

### Sigil Passport card:
A prominent card with a dark purple background (#1A1730) and a subtle purple border (#534AB7), showing:
- "Sigil Passport" title with a shield icon
- Principal: "{principal_org} / {principal_user}"
- Scope section showing permitted categories as chips, counterparties as a list, geographies as chips
- Spend Limit: "${spend_limit} total / ${spend_per_transaction} per txn"
- Issued: date
- Expires: date
- Status badge
- A "Revoke Sigil" button (red outline) in the top right corner of the card (non-functional for now — just the button)

### Sigil Score card:
- Large number display of the score (0-100)
- Circular progress ring around the number, colored: green (80-100), amber (50-79), red (0-49)
- Stats below: total transactions, successful, anomalies

### Recent Activity:
- Table of the last 20 transactions for this agent (from the transactions table)
- Table of the last 20 audit log entries for this agent

Load the agent data, credential, reputation, transactions, and audit logs from Supabase using the agent's ID.

## 4. Agents table update

In the main Agents list table, make each row clickable to navigate to the agent detail page. Also add the Sigil Score column — fetch from the reputation table and display the score with color coding.
