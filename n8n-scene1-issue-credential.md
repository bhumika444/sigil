# n8n Scene 1 — Issue Credential (KYA Enrollment)

**Workflow name:** `Sigil — Issue Credential`
**Webhook path:** `issue-credential`
**Production URL:** `https://vgunda.app.n8n.cloud/webhook/issue-credential`
**Supabase Proxy:** `https://twyldpgtuityovzgnksq.supabase.co/functions/v1/n8n-proxy`

---

## Architecture change

Lovable Cloud manages the Supabase backend, so there is no `service_role` key available. Instead, a Supabase Edge Function (`n8n-proxy`) acts as the write layer. All Supabase nodes are replaced with **HTTP Request** nodes that POST to the edge function.

---

## Flow diagram

```
Webhook POST
  → Code (Generate Credential)
  → HTTP Request (n8n-proxy: insert_agent — creates agent + credential + reputation)
  → HTTP Request (n8n-proxy: insert_audit_log)
  → Respond to Webhook
```

Only 4 nodes after the Webhook — much simpler than before.

---

## Node 1 — Webhook

| Setting | Value |
|---------|-------|
| HTTP Method | `POST` |
| Path | `issue-credential` |
| Authentication | None |
| Respond | Using "Respond to Webhook" node |
| Options → Allowed Origins | `*` |

---

## Node 2 — Code: "Generate Credential"

**Type:** Code (JavaScript)
**Connected from:** Webhook

Paste this JS:

```javascript
const agent = $input.first().json.body;

const hex = Math.random().toString(16).substring(2, 6);
const slug = agent.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 20);
const agentCode = `SGL-${hex}-${slug}-01`;

const scope = {
  categories: agent.permitted_categories || [],
  counterparties: agent.permitted_counterparties || [],
  geographies: agent.permitted_geographies || []
};

const header = { alg: 'HS256', typ: 'JWT' };
const now = Math.floor(Date.now() / 1000);
const payload = {
  iss: 'sigil.io',
  sub: agentCode,
  iat: now,
  exp: now + (90 * 24 * 60 * 60),
  principal_org: agent.principal_org,
  principal_user: agent.principal_user,
  agent_name: agent.name,
  agent_type: agent.agent_type || 'procurement',
  scope: scope,
  spend_limit: agent.spend_limit || 10000,
  per_txn_limit: agent.spend_per_transaction || 1000
};

function base64url(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}
const token = `${base64url(header)}.${base64url(payload)}.sigil_hackathon_sig`;

const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

return [{
  json: {
    agentCode,
    name: agent.name,
    description: agent.description || '',
    principal_org: agent.principal_org,
    principal_user: agent.principal_user,
    agent_type: agent.agent_type || 'procurement',
    jwt_token: token,
    scope: scope,
    spend_limit: agent.spend_limit || 10000,
    spend_per_transaction: agent.spend_per_transaction || 1000,
    expires_at: expiresAt
  }
}];
```

---

## Node 3 — HTTP Request: "Insert Agent + Credential + Reputation"

**Type:** HTTP Request
**Connected from:** Generate Credential

| Setting | Value |
|---------|-------|
| Method | `POST` |
| URL | `https://twyldpgtuityovzgnksq.supabase.co/functions/v1/n8n-proxy` |
| Authentication | None |
| Send Headers | Yes |
| Send Body | Yes |
| Body Content Type | JSON |

**Headers:**

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

**Body — use "JSON" and switch to Expression mode, then paste:**

```
{{ JSON.stringify({
  action: "insert_agent",
  agent: {
    name: $json.name,
    agent_code: $json.agentCode,
    description: $json.description,
    principal_org: $json.principal_org,
    principal_user: $json.principal_user,
    agent_type: $json.agent_type
  },
  credential: {
    credential_type: "sigil_passport",
    jwt_token: $json.jwt_token,
    scope: $json.scope,
    spend_limit: $json.spend_limit,
    per_txn_limit: $json.spend_per_transaction,
    expires_at: $json.expires_at
  },
  reputation: {
    sigil_score: 50,
    total_transactions: 0,
    flagged_transactions: 0
  }
}) }}
```

**How to set this up in n8n:**

1. Add an **HTTP Request** node after Generate Credential.
2. Set Method to **POST**.
3. Set URL to the proxy URL above.
4. Under **Body Parameters** → select **JSON**.
5. In the body field, click the **Expression** toggle (the `=` icon).
6. Paste the expression above.

**Expected response:** The edge function should return the inserted data including the agent `id`, credential `id`, etc.

---

## Node 4 — HTTP Request: "Audit Log"

**Type:** HTTP Request
**Connected from:** Insert Agent + Credential + Reputation

| Setting | Value |
|---------|-------|
| Method | `POST` |
| URL | `https://twyldpgtuityovzgnksq.supabase.co/functions/v1/n8n-proxy` |
| Body Content Type | JSON |

**Body (Expression):**

```
{{ JSON.stringify({
  action: "insert_audit_log",
  audit_log: {
    agent_id: $json.agent?.id || $json.id,
    event_type: "sigil.credential.issued",
    severity: "info",
    details: {
      agent_code: $('Generate Credential').first().json.agentCode,
      principal_org: $('Generate Credential').first().json.principal_org,
      scope: $('Generate Credential').first().json.scope
    }
  }
}) }}
```

**Note:** The `agent_id` expression depends on what the edge function returns from the `insert_agent` call. Check the response from Node 3 — look for the agent's UUID `id` field and adjust the path (e.g. `$json.agent.id` or `$json.data.id` or `$json.id`) to match.

If the edge function doesn't support `insert_audit_log` as an action yet, you may need to add it or skip this node for now.

---

## Node 5 — Respond to Webhook

**Type:** Respond to Webhook
**Connected from:** Audit Log (or Insert Agent if skipping audit)

| Setting | Value |
|---------|-------|
| Respond With | JSON |

**Response Body (Expression):**

```
{{ JSON.stringify({
  success: true,
  agent: {
    id: $('Insert Agent + Credential + Reputation').first().json.agent?.id || $('Insert Agent + Credential + Reputation').first().json.id,
    agent_code: $('Generate Credential').first().json.agentCode,
    name: $('Generate Credential').first().json.name,
    status: 'active'
  },
  credential: {
    scope: $('Generate Credential').first().json.scope,
    spend_limit: $('Generate Credential').first().json.spend_limit,
    spend_per_transaction: $('Generate Credential').first().json.spend_per_transaction,
    expires_at: $('Generate Credential').first().json.expires_at,
    status: 'active'
  },
  sigil_score: 50
}) }}
```

**Options → Response Headers:**
- `Access-Control-Allow-Origin` = `*`

**Tip:** After you run Node 3 once, check its OUTPUT to see the exact JSON shape the edge function returns. Then adjust the `$json.agent.id` paths in Node 4 and Node 5 to match.

---

## Test with curl

```bash
curl -sS -X POST 'https://vgunda.app.n8n.cloud/webhook/issue-credential' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Procurement Bot Alpha",
    "description": "Handles office supply orders",
    "principal_org": "Acme Corp",
    "principal_user": "ops@acme.com",
    "agent_type": "procurement",
    "permitted_categories": ["office-supplies", "software-licenses"],
    "permitted_counterparties": ["Staples", "CDW"],
    "permitted_geographies": ["US", "EU"],
    "spend_limit": 10000,
    "spend_per_transaction": 1000
  }'
```

**Expected:** HTTP 200 with JSON containing `success`, `agent`, `credential`, `sigil_score`.

**Verify in Supabase:** Check `agents`, `credentials`, `reputation`, `audit_logs` tables — new rows in each.

---

## Quick reference: edge function URL

All scenes use the same proxy URL — only the `action` field changes:

```
https://twyldpgtuityovzgnksq.supabase.co/functions/v1/n8n-proxy
```

No Supabase credentials needed in n8n. Just HTTP Request nodes.
