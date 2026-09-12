import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Agent = Tables<"agents">;

export function useAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Agent[];
    },
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (agent: Omit<TablesInsert<"agents">, "agent_code" | "id">) => {
      const hex = Math.random().toString(16).substring(2, 6);
      const slug = agent.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").substring(0, 20);
      const agent_code = `SGL-${hex}-${slug}-01`;
      const { data, error } = await supabase
        .from("agents")
        .insert({ ...agent, agent_code })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agents"] }),
  });
}
