import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

/**
 * Catégories racines actives, triées par ordre d'affichage.
 * Utilisé partout où l'on doit choisir une prestation (demandes, profil
 * prestataire, recherche, administration) — un seul point de lecture.
 */
export async function listRootCategories(): Promise<Tables<"categories">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .is("parent_id", null)
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
}
