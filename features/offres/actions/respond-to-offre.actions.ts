"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function respondToOffreAction(
  offreId: string,
  demandeId: string,
  decision: "acceptee" | "refusee"
) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("rpc_repondre_offre", {
    p_offre_id: offreId,
    p_decision: decision,
  });

  if (error) {
    return { error: "Impossible de mettre à jour l'offre. Veuillez réessayer." };
  }

  revalidatePath(`/client/demandes/${demandeId}`);
  revalidatePath("/client/demandes");
  return { success: true };
}
