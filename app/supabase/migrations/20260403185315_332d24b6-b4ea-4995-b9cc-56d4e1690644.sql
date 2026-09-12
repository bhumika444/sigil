
-- 1. Create app_role type if needed for future use
CREATE TYPE public.agent_status AS ENUM ('active', 'suspended', 'revoked');
CREATE TYPE public.credential_status AS ENUM ('active', 'expired', 'revoked');
CREATE TYPE public.transaction_status AS ENUM ('settled', 'pending', 'rejected', 'flagged');
CREATE TYPE public.severity_level AS ENUM ('info', 'warning', 'critical');

-- 2. Agents table
CREATE TABLE public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  principal_org text NOT NULL,
  principal_user text NOT NULL,
  agent_type text NOT NULL DEFAULT 'procurement',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on agents" ON public.agents FOR ALL USING (true) WITH CHECK (true);

-- 3. Credentials table
CREATE TABLE public.credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
  credential_type text NOT NULL DEFAULT 'sigil_passport',
  scope jsonb DEFAULT '{}',
  spend_limit numeric DEFAULT 0,
  per_txn_limit numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  issued_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on credentials" ON public.credentials FOR ALL USING (true) WITH CHECK (true);

-- 4. Transactions table
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
  credential_id uuid REFERENCES public.credentials(id),
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  counterparty text,
  category text,
  status text NOT NULL DEFAULT 'pending',
  rejection_reason text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

-- 5. Audit logs table
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES public.agents(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  details jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

-- 6. Reputation table
CREATE TABLE public.reputation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL UNIQUE,
  sigil_score integer NOT NULL DEFAULT 50,
  total_transactions integer DEFAULT 0,
  flagged_transactions integer DEFAULT 0,
  last_audit timestamptz DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reputation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on reputation" ON public.reputation FOR ALL USING (true) WITH CHECK (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reputation_updated_at BEFORE UPDATE ON public.reputation FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
