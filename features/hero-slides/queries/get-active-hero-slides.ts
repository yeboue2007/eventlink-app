import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

/**
 * Lecture publique (RLS select ouverte) — utilisée par le Hero de la
 * landing page. Ne throw jamais : un souci de connexion ne doit pas casser
 * l'accueil, juste retomber sur un carrousel vide (le composant gère ce cas).
 */
export async function getActiveHeroSlidesPublic(): Promise<Tables<"hero_slides">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[getActiveHeroSlidesPublic] échec de lecture :", error);
    return [];
  }
  return data;
}
