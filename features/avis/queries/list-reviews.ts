import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type AvisAvecAuteur = Tables<"reviews"> & {
  profiles: Pick<Tables<"profiles">, "full_name"> | null;
};

/** Avis publics d'une entreprise, du plus récent au plus ancien. */
export async function listReviewsForEntreprise(entrepriseId: string): Promise<AvisAvecAuteur[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(full_name)")
    .eq("entreprise_id", entrepriseId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as AvisAvecAuteur[];
}

/** L'avis du client connecté pour cette demande/entreprise, s'il existe déjà. */
export async function getMyReviewForDemande(
  demandeId: string,
  entrepriseId: string
): Promise<Tables<"reviews"> | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("demande_id", demandeId)
    .eq("entreprise_id", entrepriseId)
    .eq("client_id", user.id)
    .maybeSingle();

  return data;
}
