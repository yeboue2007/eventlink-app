import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type CurrentProfile = {
  user: { id: string; email: string | null };
  profile: Tables<"profiles">;
};

/**
 * Récupère l'utilisateur authentifié et son profil métier.
 * Retourne null si personne n'est connecté — à appeler uniquement depuis des
 * Server Components/Actions protégés par un layout qui gère déjà la redirection.
 */
export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return { user: { id: user.id, email: user.email ?? null }, profile };
}
