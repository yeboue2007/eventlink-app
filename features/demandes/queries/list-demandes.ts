import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type DemandeAvecLots = Tables<"demandes"> & {
  demande_lots: (Tables<"demande_lots"> & { categories: Tables<"categories"> | null })[];
  projets: Tables<"projets"> | null;
};

/** Demandes du client connecté, les plus récentes en premier. */
export async function listDemandesForClient(): Promise<DemandeAvecLots[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("demandes")
    .select("*, demande_lots(*, categories(*)), projets(*)")
    .eq("client_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as DemandeAvecLots[];
}

/** Détail d'une demande (avec ses lots et son projet), null si introuvable/non autorisée. */
export async function getDemandeById(id: string): Promise<DemandeAvecLots | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("demandes")
    .select("*, demande_lots(*, categories(*)), projets(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as DemandeAvecLots | null;
}
