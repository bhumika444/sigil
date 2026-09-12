-- Sigil KYA System — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Agents — registered AI agents
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  agent_code text unique not null, -- e.g. SGL-4f9a-procurement-01
  name text not null,
  description text,
  principal_org text not null,
  principal_user text not null,
  agent_type text not null default 'procurement', -- procurement, trading, research, payment
  status text not null default 'active' check (status in ('active', 'suspended', 'revoked')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Credentials — Sigil Passports issued to agents
create table public.credentials (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete cascade not null,
  jwt_token text not null,
  scope jsonb not null default '{}', -- { categories: [], counterparties: [], geographies: [] }
  spend_limit numeric(12,2) not null default 10000.00,
  spend_per_transaction numeric(12,2) not null default 1000.00,
  expires_at timestamptz not null,
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  issued_at timestamptz default now(),
  revoked_at timestamptz
);

-- 3. Transactions — payment activity by agents
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete cascade not null,
  credential_id uuid references public.credentials(id) on delete set null,
  amount numeric(12,2) not null,
  currency text not null default 'USDC',
  counterparty text not null,
  category text not null,
  status text not null default 'settled' check (status in ('settled', 'rejected', 'flagged', 'pending')),
  rejection_reason text,
  created_at timestamptz default now()
);

-- 4. Audit logs — immutable event trail (Sigil Vault)
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete cascade not null,
  event_type text not null, -- sigil.credential.issued, sigil.credential.revoked, sigil.scope.exceeded, sigil.reputation.updated, sigil.transaction.settled, sigil.transaction.rejected
  severity text not null default 'info' check (severity in ('info', 'warning', 'critical')),
  details jsonb not null default '{}',
  created_at timestamptz default now()
);

-- 5. Reputation — Sigil Score per agent
create table public.reputation (
  agent_id uuid primary key references public.agents(id) on delete cascade,
  score integer not null default 50 check (score >= 0 and score <= 100),
  total_transactions integer not null default 0,
  successful_transactions integer not null default 0,
  anomaly_count integer not null default 0,
  last_updated timestamptz default now()
);

-- Indexes for common queries
create index idx_credentials_agent on public.credentials(agent_id);
create index idx_transactions_agent on public.transactions(agent_id);
create index idx_transactions_created on public.transactions(created_at desc);
create index idx_audit_logs_agent on public.audit_logs(agent_id);
create index idx_audit_logs_event on public.audit_logs(event_type);
create index idx_audit_logs_created on public.audit_logs(created_at desc);

-- Enable RLS (Lovable expects this)
alter table public.agents enable row level security;
alter table public.credentials enable row level security;
alter table public.transactions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.reputation enable row level security;

-- Allow all access for now (hackathon — tighten later)
create policy "Allow all" on public.agents for all using (true) with check (true);
create policy "Allow all" on public.credentials for all using (true) with check (true);
create policy "Allow all" on public.transactions for all using (true) with check (true);
create policy "Allow all" on public.audit_logs for all using (true) with check (true);
create policy "Allow all" on public.reputation for all using (true) with check (true);

