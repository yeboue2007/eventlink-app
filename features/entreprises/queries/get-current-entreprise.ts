import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

/**
 * Entreprise du prestataire connecté. Un compte peut en théorie appartenir
 * à plusieurs entreprises (employé multi-structures) — pour l'instant on
 * prend la première, la sélection multi-entreprise viendra avec la gestion
 * des employés/agences.
 */
export async function getCurrentEntreprise(): Promise<
  (Tables<"entreprises"> & { wallets: Tables<"wallets"> | null }) | null
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membre } = await supabase
    .from("entreprise_membres")
    .select("entreprise_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membre) return null;

  const { data: entreprise, error } = await supabase
    .from("entreprises")
    .select("*, wallets(*)")
    .eq("id", membre.entreprise_id)
    .single();

  if (error) throw error;
  return entreprise as Tables<"entreprises"> & { wallets: Tables<"wallets"> | null };
}

/** Identifiants des catégories déjà déclarées par l'entreprise. */
export async function listSelectedCategoryIds(entrepriseId: string): Promise<number[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prestataire_categories")
    .select("category_id")
    .eq("entreprise_id", entrepriseId);

  if (error) throw error;
  return data.map((row) => row.category_id);
}

/** Profil public d'une entreprise (fiche prestataire consultable par tous). */
export async function getPublicEntrepriseProfile(entrepriseId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entreprises")
    .select("*, prestataire_categories(categories(*))")
    .eq("id", entrepriseId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { data: rating } = await supabase
    .from("v_entreprise_rating")
    .select("*")
    .eq("entreprise_id", entrepriseId)
    .maybeSingle();

  return { ...data, note_moyenne: rating?.note_moyenne ?? null, nb_avis: rating?.nb_avis ?? 0 };
}

/** Photos du portfolio d'une entreprise, dans leur ordre d'affichage. */
export async function listMediaFiles(entrepriseId: string): Promise<Tables<"media_files">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_files")
    .select("*")
    .eq("entreprise_id", entrepriseId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
}
