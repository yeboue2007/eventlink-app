import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type OffreAvecLots = Tables<"offres"> & {
  offre_lots: (Tables<"offre_lots"> & {
    demande_lots: (Tables<"demande_lots"> & { categories: Tables<"categories"> | null }) | null;
  })[];
  entreprises: Tables<"entreprises"> | null;
};

/** Offres reçues pour une demande (visible par le client propriétaire ou les entreprises concernées, via RLS). */
export async function listOffresForDemande(demandeId: string): Promise<OffreAvecLots[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("offres")
    .select(
      "*, offre_lots(*, demande_lots(*, categories(*))), entreprises!offres_entreprise_id_fkey(*)"
    )
    .eq("demande_id", demandeId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as OffreAvecLots[];
}
