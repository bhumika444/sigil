# n8n Scene 5 — Revoke Credential

**Workflow name:** `Sigil — Revoke Credential`
**Webhook path:** `revoke-credential`
**Production URL:** `https://vgunda.app.n8n.cloud/webhook/revoke-credential`
**Supabase Proxy:** `https://twyldpgtuityovzgnksq.supabase.co/functions/v1/n8n-proxy`

---

## Flow diagram

```
Webhook POST (agent_id)
  → HTTP Request (n8n-proxy: revoke_credential)
  → Respond to Webhook
```

Simplest workflow — one HTTP call does everything.

---

## Node 1 — Webhook

| Setting | Value |
|---------|-------|
| HTTP Method | `POST` |
| Path | `revoke-credential` |
| Authentication | None |
| Respond | Using "Respond to Webhook" node |
| Options → Allowed Origins | `*` |

**Expected request body:**

```json
{
  "agent_id": "uuid-of-agent"
}
```

---

## Node 2 — HTTP Request: "Revoke Credential"

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
  action: "revoke_credential",
  agent_id: $json.body.agent_id
}) }}
```

**What the edge function should do for `revoke_credential`:**

1. Update `credentials` → set `status = 'revoked'`, `revoked_at = now()` where `agent_id` matches and `status = 'active'`
2. Update `agents` → set `status = 'revoked'`, `updated_at = now()` where `id` matches
3. Insert `audit_logs` → `event_type: 'sigil.credential.revoked'`, `severity: 'critical'`
4. Return `{ success: true, revoked_at: "..." }`

---

## Node 3 — Respond to Webhook

**Type:** Respond to Webhook
**Connected from:** Revoke Credential

| Setting | Value |
|---------|-------|
| Respond With | JSON |

**Response Body:**

```
{{ JSON.stringify({
  success: true,
  revoked: true,
  agent_id: $('Webhook').first().json.body.agent_id,
  revoked_at: $json.revoked_at || new Date().toISOString()
}) }}
```

**Options → Response Headers:**
- `Access-Control-Allow-Origin` = `*`

---

## Edge function action needed

| Action | What it does |
|--------|-------------|
| `revoke_credential` | Update credential + agent status to `revoked`, insert critical audit log, return confirmation |

---

## Test

```bash
curl -sS -X POST 'https://vgunda.app.n8n.cloud/webhook/revoke-credential' \
  -H 'Content-Type: application/json' \
  -d '{ "agent_id": "PASTE-REAL-UUID-HERE" }'
```

**Expected:** `success: true`, `revoked: true`.

**Verify:** After revocation, calling Scene 2 (settle-transaction) with this agent should **reject** — the Validate Scope code checks `agent.status !== 'active'`.

---

## Summary of all edge function actions needed

| Action | Used in | Description |
|--------|---------|-------------|
| `insert_agent` | Scene 1 | Create agent + credential + reputation |
| `insert_audit_log` | Scene 1 | Create audit log entry |
| `get_agent` | Scene 2, 4 | Fetch agent + credential + reputation by agent_code |
| `settle_transaction` | Scene 2 | Insert settled txn, update reputation, audit log |
| `reject_transaction` | Scene 2 | Insert rejected txn, update reputation, audit log |
| `get_compliance_data` | Scene 3 | Fetch agents + txns + logs for org within date range |
| `revoke_credential` | Scene 5 | Revoke credential + agent, critical audit log |
