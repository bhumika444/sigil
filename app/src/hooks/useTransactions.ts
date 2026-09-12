import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Transaction = Tables<"transactions"> & { agents?: { name: string; agent_code: string } | null };

export function useTransactions(limit?: number) {
  return useQuery({
    queryKey: ["transactions", limit],
    queryFn: async () => {
      let query = supabase
        .from("transactions")
        .select("*, agents(name, agent_code)")
        .order("created_at", { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data as Transaction[];
    },
  });
}
