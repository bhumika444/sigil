# n8n Scene 4 — Verify Agent (Reputation Query)

**Workflow name:** `Sigil — Verify Agent`
**Webhook path:** `verify-agent`
**Production URL:** `https://vgunda.app.n8n.cloud/webhook/verify-agent`
**Supabase Proxy:** `https://twyldpgtuityovzgnksq.supabase.co/functions/v1/n8n-proxy`

---

## Flow diagram

```
Webhook POST (agent_code)
  → HTTP Request (n8n-proxy: get_agent)
  → Code (Build verification response)
  → Respond to Webhook
```

Only 3 nodes after webhook — simplest workflow.

---

## Node 1 — Webhook

| Setting | Value |
|---------|-------|
| HTTP Method | `POST` |
| Path | `verify-agent` |
| Authentication | None |
| Respond | Using "Respond to Webhook" node |
| Options → Allowed Origins | `*` |

**Expected request body:**

```json
{
  "agent_code": "SGL-4f9a-procurement-01"
}
```

---

## Node 2 — HTTP Request: "Get Agent Data"

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
  action: "get_agent",
  agent_code: $json.body.agent_code
}) }}
```

---

## Node 3 — Code: "Build Verification"

**Type:** Code (JavaScript)
**Connected from:** Get Agent Data

```javascript
const response = $input.first().json;
const agentCode = $('Webhook').first().json.body.agent_code;

const agent = response.agent || response;
const credential = response.credential || {};
const reputation = response.reputation || {};

if (!agent || !agent.id) {
  return [{
    json: {
      verified: false,
      reason: 'Agent not found',
      agent_code: agentCode
    }
  }];
}

const score = reputation.score || reputation.sigil_score || 0;
const credentialActive = credential.status === 'active';
const agentActive = agent.status === 'active';
const notExpired = credential.expires_at
  ? new Date(credential.expires_at) > new Date()
  : false;

let risk_tier;
if (score >= 80) risk_tier = 'LOW';
else if (score >= 50) risk_tier = 'MEDIUM';
else risk_tier = 'HIGH';

let recommendation;
if (!agentActive || !credentialActive || !notExpired) {
  recommendation = 'REJECT — credential inactive or expired';
} else if (risk_tier === 'LOW') {
  recommendation = 'ACCEPT — trusted agent';
} else if (risk_tier === 'MEDIUM') {
  recommendation = 'ACCEPT WITH MONITORING';
} else {
  recommendation = 'REQUIRE HUMAN REVIEW';
}

const scope = typeof credential.scope === 'string'
  ? JSON.parse(credential.scope)
  : (credential.scope || {});

return [{
  json: {
    verified: agentActive && credentialActive && notExpired,
    agent: {
      agent_code: agent.agent_code,
      name: agent.name,
      principal_org: agent.principal_org,
      agent_type: agent.agent_type,
      status: agent.status
    },
    credential: {
      active: credentialActive,
      expired: !notExpired,
      scope: scope,
      spend_limit: credential.spend_limit,
      spend_per_transaction: credential.spend_per_transaction || credential.per_txn_limit,
      expires_at: credential.expires_at
    },
    reputation: {
      score: score,
      risk_tier: risk_tier,
      total_transactions: reputation.total_transactions || 0,
      successful_transactions: reputation.successful_transactions || 0,
      anomaly_count: reputation.anomaly_count || reputation.flagged_transactions || 0
    },
    recommendation: recommendation
  }
}];
```

---

## Node 4 — Respond to Webhook

**Type:** Respond to Webhook
**Connected from:** Build Verification

| Setting | Value |
|---------|-------|
| Respond With | JSON |

**Response Body:**

```
{{ JSON.stringify($json) }}
```

**Options → Response Headers:**
- `Access-Control-Allow-Origin` = `*`

---

## Edge function action needed

| Action | What it does |
|--------|-------------|
| `get_agent` | Fetch agent by `agent_code`, plus its active credential and reputation row |

Same action used in Scene 2 — build it once, both workflows use it.

---

## Test: known agent

```bash
curl -sS -X POST 'https://vgunda.app.n8n.cloud/webhook/verify-agent' \
  -H 'Content-Type: application/json' \
  -d '{ "agent_code": "SGL-XXXX-procurement-bot-01" }'
```

## Test: unknown agent

```bash
curl -sS -X POST 'https://vgunda.app.n8n.cloud/webhook/verify-agent' \
  -H 'Content-Type: application/json' \
  -d '{ "agent_code": "FAKE-0000-nonexistent-01" }'
```

**Expected:** `verified: false`, `reason: "Agent not found"`.
