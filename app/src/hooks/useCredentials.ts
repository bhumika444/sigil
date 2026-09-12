import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Credential = Tables<"credentials"> & { agents?: { name: string } | null };

export function useCredentials() {
  return useQuery({
    queryKey: ["credentials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credentials")
        .select("*, agents(name)")
        .order("issued_at", { ascending: false });
      if (error) throw error;
      return data as Credential[];
    },
  });
}
