# n8n Scene 3 — Compliance Audit Trail (MiniMax Summarisation)

**Workflow name:** `Sigil — Compliance Audit`
**Webhook path:** `compliance-report`
**Production URL:** `https://vgunda.app.n8n.cloud/webhook/compliance-report`
**Supabase Proxy:** `https://twyldpgtuityovzgnksq.supabase.co/functions/v1/n8n-proxy`

---

## Flow diagram

```
Webhook POST (principal_org, days)
  → HTTP Request (n8n-proxy: get_compliance_data)
  → Code (Build MiniMax prompt)
  → HTTP Request (MiniMax API — summarise)
  → Code (Format report)
  → Respond to Webhook
```

---

## Node 1 — Webhook

| Setting | Value |
|---------|-------|
| HTTP Method | `POST` |
| Path | `compliance-report` |
| Authentication | None |
| Respond | Using "Respond to Webhook" node |
| Options → Allowed Origins | `*` |

**Expected request body:**

```json
{
  "principal_org": "Acme Corp",
  "days": 7
}
```

---

## Node 2 — HTTP Request: "Get Compliance Data"

**Type:** HTTP Request
**Connected from:** Webhook

| Setting | Value |
|---------|-------|
| Method | `POST` |
| URL | `https://twyldpgtuityovzgnksq.supabase.co/functions/v1/n8n-proxy` |
| Body Content Type | JSON |

**Body (Expression):**

```
{{ JSON.stringify({
  action: "get_compliance_data",
  principal_org: $json.body.principal_org,
  days: $json.body.days || 7
}) }}
```

**Expected response:** Agents for this org, their recent transactions, and audit logs for the period. The edge function should return something like:

```json
{
  "agents": [...],
  "transactions": [...],
  "audit_logs": [...],
  "stats": { "agent_count": 3, "total_transactions": 42 }
}
```

---

## Node 3 — Code: "Build MiniMax Prompt"

**Type:** Code (JavaScript)
**Connected from:** Get Compliance Data

```javascript
const data = $input.first().json;

const agents = data.agents || [];
const txns = data.transactions || [];
const logs = data.audit_logs || [];
const days = $('Webhook').first().json.body.days || 7;
const org = $('Webhook').first().json.body.principal_org;

const settled = txns.filter(t => t.status === 'settled');
const rejected = txns.filter(t => t.status === 'rejected');
const flagged = txns.filter(t => t.status === 'flagged');
const totalAmount = settled.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
const warnings = logs.filter(l => l.severity === 'warning' || l.severity === 'critical');

const prompt = `You are a financial compliance analyst. Summarise this week's AI agent activity for ${org} in clear, professional English suitable for a compliance officer.

Period: last ${days} days
Active agents: ${agents.length}
Total transactions: ${txns.length}
Settled: ${settled.length} (total: $${totalAmount.toFixed(2)})
Rejected: ${rejected.length}
Flagged: ${flagged.length}
Audit warnings/critical events: ${warnings.length}

${rejected.length > 0 ? 'Rejected transactions:\n' + rejected.map(t =>
  `- Agent ${t.agent_id}: $${t.amount} to ${t.counterparty} (${t.category}) — ${t.rejection_reason || 'no reason'}`
).join('\n') : 'No rejected transactions.'}

${warnings.length > 0 ? 'Warning events:\n' + warnings.map(w =>
  `- [${w.severity}] ${w.event_type}: ${JSON.stringify(w.details)}`
).join('\n') : 'No warning events.'}

Provide:
1. A 2-3 sentence executive summary
2. Key risk indicators (bullet points)
3. Recommended actions (if any anomalies)
4. Overall compliance status: GREEN / AMBER / RED`;

return [{
  json: {
    prompt,
    stats: {
      agent_count: agents.length,
      total_transactions: txns.length,
      settled_count: settled.length,
      settled_amount: totalAmount,
      rejected_count: rejected.length,
      flagged_count: flagged.length,
      warning_count: warnings.length
    }
  }
}];
```

---

## Node 4 — HTTP Request: "MiniMax Summarise"

**Type:** HTTP Request
**Connected from:** Build MiniMax Prompt

| Setting | Value |
|---------|-------|
| Method | `POST` |
| URL | `https://api.minimaxi.chat/v1/text/chatcompletion_v2` |
| Authentication | None (use header) |
| Body Content Type | JSON |

**Headers:**

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer YOUR_MINIMAX_API_KEY` |
| `Content-Type` | `application/json` |

Replace `YOUR_MINIMAX_API_KEY` with your real key.

**Body (Expression):**

```
{{ JSON.stringify({
  model: "MiniMax-Text-01",
  messages: [
    {
      role: "system",
      content: "You are a financial compliance analyst writing reports for a KYA (Know Your Agent) system."
    },
    {
      role: "user",
      content: $json.prompt
    }
  ],
  temperature: 0.3,
  max_tokens: 1000
}) }}
```

**Note:** Check MiniMax docs for the exact endpoint URL and model name. Adjust if your plan uses a different base URL.

---

## Node 5 — Code: "Format Report"

**Type:** Code (JavaScript)
**Connected from:** MiniMax Summarise

```javascript
const stats = $('Build MiniMax Prompt').first().json.stats;
const minimax = $input.first().json;

const summary = minimax.choices?.[0]?.message?.content
  || minimax.reply
  || 'Summary unavailable — check MiniMax response format';

return [{
  json: {
    report: {
      generated_at: new Date().toISOString(),
      summary: summary,
      stats: stats
    }
  }
}];
```

---

## Node 6 — Respond to Webhook

**Type:** Respond to Webhook
**Connected from:** Format Report

| Setting | Value |
|---------|-------|
| Respond With | JSON |

**Response Body:**

```
{{ JSON.stringify($json.report) }}
```

**Options → Response Headers:**
- `Access-Control-Allow-Origin` = `*`

---

## Edge function action needed

| Action | What it does |
|--------|-------------|
| `get_compliance_data` | Fetch all agents for the org, plus transactions and audit logs from the last N days |

---

## Test

```bash
curl -sS -X POST 'https://vgunda.app.n8n.cloud/webhook/compliance-report' \
  -H 'Content-Type: application/json' \
  -d '{
    "principal_org": "Acme Corp",
    "days": 7
  }'
```

**Expected:** JSON with `generated_at`, `summary` (natural language from MiniMax), and `stats`.

**Fallback:** If MiniMax is slow or errors, temporarily hardcode a summary in the Format Report node to keep the demo moving.
