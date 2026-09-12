import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type AuditLog = Tables<"audit_logs"> & { agents?: { name: string } | null };

export function useAuditLogs() {
  return useQuery({
    queryKey: ["audit_logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*, agents(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as AuditLog[];
    },
  });
}
