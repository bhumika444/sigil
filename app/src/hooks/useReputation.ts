import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Reputation = Tables<"reputation">;

export function useReputation() {
  return useQuery({
    queryKey: ["reputation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reputation")
        .select("*");
      if (error) throw error;
      return data as Reputation[];
    },
  });
}
