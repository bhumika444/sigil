# Scene 2 — Settle Transaction (≤5k chars)

**Workflow:** `Sigil — Settle Transaction`  
**Path:** `settle-transaction`  
**Prod webhook:** `https://vgunda.app.n8n.cloud/webhook/settle-transaction`  
**Proxy:** `https://twyldpgtuityovzgnksq.supabase.co/functions/v1/n8n-proxy`

## Flow

`Webhook POST` → `HTTP get_agent` → `Code Validate Scope` → `IF valid?`  
→ **true:** `HTTP settle_transaction` → `Respond`  
→ **false:** `HTTP reject_transaction` → `Respond`

Use **`={{ ... }}`** for n8n expressions (not bare `{{ }}`).

## 1 — Webhook

POST, path `settle-transaction`, Auth None, Respond = **Respond to Webhook** node, CORS `*`.

**Body:**

```json
{"agent_code":"SGL-…","amount":450,"currency":"USDC","counterparty":"Staples","category":"office-supplies"}
```

## 2 — HTTP: get_agent

POST → proxy URL. Body (expression):

`={{ JSON.stringify({ action: "get_agent", agent_code: $json.body.agent_code }) }}`

Adjust output paths after one test run (`agent`, `credential`, `reputation`).

## 3 — Code: Validate Scope

Check `agent.status`, `credential.status`, `expires_at`, `scope.categories` / `counterparties`, amount vs `per_txn_limit` or `spend_per_transaction`. Output: `valid`, `errors[]`, `agent_id`, `credential_id`, `amount`, `currency`, `counterparty`, `category`, `rejection_reason`.

## 4 — IF

Condition: `$json.valid` === `true` (boolean).

## 5a — Settle (true branch)

POST proxy. Body:

`={{ JSON.stringify({ action: "settle_transaction", transaction: { agent_id: $json.agent_id, credential_id: $json.credential_id, amount: $json.amount, currency: $json.currency, counterparty: $json.counterparty, category: $json.category, status: "settled" }, audit_log: { agent_id: $json.agent_id, event_type: "sigil.transaction.settled", severity: "info", details: { amount: $json.amount, counterparty: $json.counterparty, category: $json.category } } }) }}`

**Respond:** `={{ JSON.stringify({ success: true, transaction: { id: $json.id }, agent_code: $('Validate Scope').first().json.agent_code }) }}` (tweak paths to match proxy response).

## 5b — Reject (false branch)

POST proxy. Body:

`={{ JSON.stringify({ action: "reject_transaction", transaction: { agent_id: $json.agent_id, credential_id: $json.credential_id, amount: $json.amount, currency: $json.currency, counterparty: $json.counterparty, category: $json.category, status: "rejected", rejection_reason: $json.rejection_reason }, audit_log: { agent_id: $json.agent_id, event_type: "sigil.scope.exceeded", severity: "warning", details: { errors: $json.errors, amount: $json.amount, counterparty: $json.counterparty, category: $json.category } } }) }}`

**Respond:** `={{ JSON.stringify({ success: false, rejected: true, reason: $json.rejection_reason, agent_code: $('Validate Scope').first().json.agent_code }) }}`

## Edge function (deploy before Scene 2 works)

| Action | Role |
|--------|------|
| `get_agent` | By `agent_code`: agent + active credential + reputation |
| `settle_transaction` | Insert settled row, bump reputation, audit |
| `reject_transaction` | Insert rejected row, bump flags, audit |

## curl

```bash
curl -sS -X POST 'https://vgunda.app.n8n.cloud/webhook/settle-transaction' -H 'Content-Type: application/json' -d '{"agent_code":"SGL-xxx-…","amount":450,"currency":"USDC","counterparty":"Staples","category":"office-supplies"}'
```

Full code samples & branch details: see `n8n-scene2-settle-transaction.md`.
