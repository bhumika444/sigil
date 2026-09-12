# n8n Scene 2 — Settle Transaction (Agent Makes a Payment)

**Workflow name:** `Sigil — Settle Transaction`
**Webhook path:** `settle-transaction`
**Production URL:** `https://vgunda.app.n8n.cloud/webhook/settle-transaction`
**Supabase Proxy:** `https://twyldpgtuityovzgnksq.supabase.co/functions/v1/n8n-proxy`

---

## Flow diagram

```
Webhook POST (agent_code, amount, counterparty, category)
  → HTTP Request (n8n-proxy: get_agent — fetch agent + credential + reputation)
  → Code (Validate Scope)
  → IF (scope valid?)
    ├─ YES → HTTP Request (n8n-proxy: settle_transaction)
    │        → Respond to Webhook (success)
    └─ NO  → HTTP Request (n8n-proxy: reject_transaction)
             → Respond to Webhook (rejected)
```

---

## Node 1 — Webhook

| Setting | Value |
|---------|-------|
| HTTP Method | `POST` |
| Path | `settle-transaction` |
| Authentication | None |
| Respond | Using "Respond to Webhook" node |
| Options → Allowed Origins | `*` |

**Expected request body:**

```json
{
  "agent_code": "SGL-4f9a-procurement-01",
  "amount": 450.00,
  "currency": "USDC",
  "counterparty": "Staples",
  "category": "office-supplies"
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

**Expected response:** The edge function returns the agent row, its active credential, and reputation data. Check the actual response shape after first run and adjust downstream references accordingly.

---

## Node 3 — Code: "Validate Scope"

**Type:** Code (JavaScript)
**Connected from:** Get Agent Data

```javascript
const body = $('Webhook').first().json.body;
const response = $input.first().json;

// Adjust these paths based on what the edge function actually returns
const agent = response.agent || response;
const credential = response.credential || {};
const reputation = response.reputation || {};

const scope = typeof credential.scope === 'string'
  ? JSON.parse(credential.scope)
  : (credential.scope || {});

const errors = [];

if (agent.status !== 'active') {
  errors.push(`Agent status is ${agent.status}`);
}

if (credential.status !== 'active') {
  errors.push(`Credential status is ${credential.status}`);
}

if (credential.expires_at && new Date(credential.expires_at) < new Date()) {
  errors.push('Credential expired');
}

if (scope.categories && scope.categories.length > 0) {
  if (!scope.categories.includes(body.category)) {
    errors.push(`Category "${body.category}" not in permitted: [${scope.categories.join(', ')}]`);
  }
}

if (scope.counterparties && scope.counterparties.length > 0) {
  if (!scope.counterparties.includes(body.counterparty)) {
    errors.push(`Counterparty "${body.counterparty}" not in permitted: [${scope.counterparties.join(', ')}]`);
  }
}

const perTxnLimit = parseFloat(credential.spend_per_transaction || credential.per_txn_limit || 1000);
if (parseFloat(body.amount) > perTxnLimit) {
  errors.push(`Amount $${body.amount} exceeds per-txn limit $${perTxnLimit}`);
}

const valid = errors.length === 0;

return [{
  json: {
    valid,
    errors,
    agent_id: agent.id,
    agent_code: agent.agent_code,
    credential_id: credential.id,
    amount: parseFloat(body.amount),
    currency: body.currency || 'USDC',
    counterparty: body.counterparty,
    category: body.category,
    rejection_reason: valid ? null : errors.join('; ')
  }
}];
```

---

## Node 4 — IF: "Scope Valid?"

**Type:** IF
**Connected from:** Validate Scope

| Setting | Value |
|---------|-------|
| Condition | `{{ $json.valid }}` equals `true` (boolean) |

---

## TRUE branch — transaction settles

### Node 5a — HTTP Request: "Settle Transaction"

**Connected from:** IF (true output)

| Setting | Value |
|---------|-------|
| Method | `POST` |
| URL | `https://twyldpgtuityovzgnksq.supabase.co/functions/v1/n8n-proxy` |
| Body Content Type | JSON |

**Body (Expression):**

```
{{ JSON.stringify({
  action: "settle_transaction",
  transaction: {
    agent_id: $json.agent_id,
    credential_id: $json.credential_id,
    amount: $json.amount,
    currency: $json.currency,
    counterparty: $json.counterparty,
    category: $json.category,
    status: "settled"
  },
  audit_log: {
    agent_id: $json.agent_id,
    event_type: "sigil.transaction.settled",
    severity: "info",
    details: {
      amount: $json.amount,
      counterparty: $json.counterparty,
      category: $json.category
    }
  }
}) }}
```

### Node 6a — Respond to Webhook (Success)

**Connected from:** Settle Transaction

**Response Body:**

```
{{ JSON.stringify({
  success: true,
  transaction: {
    id: $json.transaction?.id || $json.id,
    status: "settled",
    amount: $('Validate Scope').first().json.amount,
    counterparty: $('Validate Scope').first().json.counterparty,
    category: $('Validate Scope').first().json.category
  },
  agent_code: $('Validate Scope').first().json.agent_code
}) }}
```

---

## FALSE branch — transaction rejected

### Node 5b — HTTP Request: "Reject Transaction"

**Connected from:** IF (false output)

| Setting | Value |
|---------|-------|
| Method | `POST` |
| URL | `https://twyldpgtuityovzgnksq.supabase.co/functions/v1/n8n-proxy` |
| Body Content Type | JSON |

**Body (Expression):**

```
{{ JSON.stringify({
  action: "reject_transaction",
  transaction: {
    agent_id: $json.agent_id,
    credential_id: $json.credential_id,
    amount: $json.amount,
    currency: $json.currency,
    counterparty: $json.counterparty,
    category: $json.category,
    status: "rejected",
    rejection_reason: $json.rejection_reason
  },
  audit_log: {
    agent_id: $json.agent_id,
    event_type: "sigil.scope.exceeded",
    severity: "warning",
    details: {
      errors: $json.errors,
      amount: $json.amount,
      counterparty: $json.counterparty,
      category: $json.category
    }
  }
}) }}
```

### Node 6b — Respond to Webhook (Rejected)

**Connected from:** Reject Transaction

**Response Body:**

```
{{ JSON.stringify({
  success: false,
  rejected: true,
  reason: $('Validate Scope').first().json.rejection_reason,
  agent_code: $('Validate Scope').first().json.agent_code
}) }}
```

---

## Edge function actions needed

Your `n8n-proxy` edge function needs to support these actions for Scene 2:

| Action | What it does |
|--------|-------------|
| `get_agent` | Fetch agent by `agent_code`, plus its active credential and reputation |
| `settle_transaction` | Insert into `transactions` (settled), increment reputation `total_transactions` + `successful_transactions`, insert audit log |
| `reject_transaction` | Insert into `transactions` (rejected), increment reputation `total_transactions` + `anomaly_count`, insert audit log |

If your edge function only supports `insert_agent` right now, you'll need to add these actions to the edge function code.

---

## Test: valid transaction

```bash
curl -sS -X POST 'https://vgunda.app.n8n.cloud/webhook/settle-transaction' \
  -H 'Content-Type: application/json' \
  -d '{
    "agent_code": "SGL-XXXX-procurement-bot-01",
    "amount": 450.00,
    "currency": "USDC",
    "counterparty": "Staples",
    "category": "office-supplies"
  }'
```

## Test: out-of-scope (should reject)

```bash
curl -sS -X POST 'https://vgunda.app.n8n.cloud/webhook/settle-transaction' \
  -H 'Content-Type: application/json' \
  -d '{
    "agent_code": "SGL-XXXX-procurement-bot-01",
    "amount": 9999.00,
    "currency": "USDC",
    "counterparty": "Unknown Vendor",
    "category": "gambling"
  }'
```
