import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type ClientAdminDetail = {
  profile: Tables<"profiles">;
  demandes: (Tables<"demandes"> & {
    demande_lots: { categories: Tables<"categories"> | null }[];
  })[];
};

export async function getClientAdminDetail(profileId: string): Promise<ClientAdminDetail | null> {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .eq("role", "client")
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) return null;

  const { data: demandes, error: demandesError } = await supabase
    .from("demandes")
    .select("*, demande_lots(categories(*))")
    .eq("client_id", profileId)
    .order("created_at", { ascending: false });

  if (demandesError) throw demandesError;

  return { profile, demandes: demandes as ClientAdminDetail["demandes"] };
}
