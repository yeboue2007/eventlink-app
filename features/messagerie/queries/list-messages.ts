import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type MessageAvecAuteur = Tables<"messages"> & {
  profiles: Pick<Tables<"profiles">, "id" | "full_name"> | null;
};

/** Messages d'une conversation liée à une offre, du plus ancien au plus récent. */
export async function listMessagesForOffre(offreId: string): Promise<MessageAvecAuteur[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*, profiles(id, full_name)")
    .eq("offre_id", offreId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as MessageAvecAuteur[];
}
