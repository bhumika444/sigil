

# Sigil Dashboard Update Plan

## Changes Overview

Four changes: expanded Register Agent form with n8n webhook, agent detail page, clickable agent rows.

## 1. Update RegisterAgentDialog

**File:** `src/components/RegisterAgentDialog.tsx`

- Add state for: `permittedCategories` (string[]), `counterparties` (string), `permittedGeographies` (string[]), `spendLimit` (number, default 10000), `spendPerTransaction` (number, default 1000)
- Add multi-select chip toggles for categories: "office-supplies", "software-licenses", "cloud-infrastructure", "travel", "marketing", "consulting", "raw-materials", "logistics"
- Add text input for counterparties (comma-separated)
- Add multi-select chip toggles for geographies: "US", "EU", "UK", "APAC", "Global"
- Add two number inputs for spend limits
- Make dialog scrollable since the form is now longer
- On submit: POST to `https://vgunda.app.n8n.cloud/webhook/issue-credential` with the specified JSON body instead of calling `useCreateAgent`
- On success: show toast with agent_code from response, invalidate `["agents"]` query
- Remove dependency on `useCreateAgent` mutation

## 2. Agent Detail Page

**New file:** `src/pages/AgentDetail.tsx`

- Route: `/agents/:id`
- Fetch agent by ID from `agents` table
- Fetch credential for this agent from `credentials` table (filter by agent_id)
- Fetch reputation for this agent from `reputation` table (filter by agent_id)
- Fetch last 20 transactions (filter by agent_id)
- Fetch last 20 audit logs (filter by agent_id)

Layout sections:
- **Header:** Agent code (large monospace), name, description, status badge, type badge
- **Sigil Passport card:** Dark purple card with shield icon, principal info, scope chips parsed from credential's `scope` JSON, spend limits, dates, status, "Revoke Sigil" button (non-functional)
- **Sigil Score card:** Large circular progress ring (reuse `SigilScore` component with larger size), stats from reputation table
- **Recent Activity:** Two tables — transactions and audit logs, last 20 each

**New hooks** (added to existing hook files):
- `useAgent(id)` — single agent by ID
- `useAgentCredentials(agentId)` — credentials filtered by agent_id
- `useAgentReputation(agentId)` — reputation filtered by agent_id
- `useAgentTransactions(agentId)` — last 20 transactions for agent
- `useAgentAuditLogs(agentId)` — last 20 audit logs for agent

## 3. Update App.tsx Router

Add route: `<Route path="/agents/:id" element={<AgentDetail />} />`

## 4. Make Agent Rows Clickable

**File:** `src/pages/Agents.tsx`

- Wrap each `TableRow` with `useNavigate` — on click, navigate to `/agents/${agent.id}`
- Add `cursor-pointer hover:bg-muted/50` styling to rows

## Technical Notes

- The n8n webhook is a public URL, so calling it directly from the client is fine — no edge function needed
- The chip multi-select will be built as simple toggle buttons (no external library needed)
- The credential `scope` field is JSONB containing `{ categories, counterparties, geographies }` — parse this for display on the detail page
- The `reputation` table has `total_transactions`, `flagged_transactions`, `sigil_score` — use these for the score card stats. Note: no `successful_transactions` or `anomaly_count` columns exist; derive successful = total - flagged

