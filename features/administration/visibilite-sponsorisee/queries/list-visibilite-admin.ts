import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type TarifAvecCategorie = Tables<"sponsored_visibility_rates"> & {
  categories: Tables<"categories"> | null;
};

export async function listSponsoredVisibilityRatesAdmin(): Promise<TarifAvecCategorie[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sponsored_visibility_rates")
    .select("*, categories(*)")
    .order("active", { ascending: false })
    .order("ville", { ascending: true, nullsFirst: true });

  if (error) throw error;
  return data as TarifAvecCategorie[];
}

export type CampagneAvecRelations = Tables<"sponsored_visibility"> & {
  categories: Tables<"categories"> | null;
  entreprises: Tables<"entreprises"> | null;
};

export async function listSponsoredVisibilityCampagnesAdmin(): Promise<CampagneAvecRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sponsored_visibility")
    .select("*, categories(*), entreprises!sponsored_visibility_entreprise_id_fkey(*)")
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data as CampagneAvecRelations[];
}

/**
 * Liste légère des prestataires actifs pour le sélecteur du formulaire de
 * campagne — pas besoin des relations lourdes utilisées ailleurs dans le
 * back-office (wallet, catégories, etc.).
 */
export async function listEntreprisesPourSelecteur(): Promise<
  Pick<Tables<"entreprises">, "id" | "nom" | "ville">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entreprises")
    .select("id, nom, ville")
    .is("deleted_at", null)
    .order("nom", { ascending: true });

  if (error) throw error;
  return data;
}
