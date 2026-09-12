import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export function useAgent(id: string) {
  return useQuery({
    queryKey: ["agent", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("agents").select("*").eq("id", id).single();
      if (error) throw error;
      return data as Tables<"agents">;
    },
    enabled: !!id,
  });
}

export function useAgentCredentials(agentId: string) {
  return useQuery({
    queryKey: ["agent_credentials", agentId],
    queryFn: async () => {
      const { data, error } = await supabase.from("credentials").select("*").eq("agent_id", agentId).order("issued_at", { ascending: false });
      if (error) throw error;
      return data as Tables<"credentials">[];
    },
    enabled: !!agentId,
  });
}

export function useAgentReputation(agentId: string) {
  return useQuery({
    queryKey: ["agent_reputation", agentId],
    queryFn: async () => {
      const { data, error } = await supabase.from("reputation").select("*").eq("agent_id", agentId).single();
      if (error) throw error;
      return data as Tables<"reputation">;
    },
    enabled: !!agentId,
  });
}

export function useAgentTransactions(agentId: string) {
  return useQuery({
    queryKey: ["agent_transactions", agentId],
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*").eq("agent_id", agentId).order("created_at", { ascending: false }).limit(20);
      if (error) throw error;
      return data as Tables<"transactions">[];
    },
    enabled: !!agentId,
  });
}

export function useAgentAuditLogs(agentId: string) {
  return useQuery({
    queryKey: ["agent_audit_logs", agentId],
    queryFn: async () => {
      const { data, error } = await supabase.from("audit_logs").select("*").eq("agent_id", agentId).order("created_at", { ascending: false }).limit(20);
      if (error) throw error;
      return data as Tables<"audit_logs">[];
    },
    enabled: !!agentId,
  });
}
