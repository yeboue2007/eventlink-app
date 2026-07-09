"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function respondToOffreAction(
  offreId: string,
  demandeId: string,
  decision: "acceptee" | "refusee"
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("offres")
    .update({ status: decision })
    .eq("id", offreId);

  if (error) {
    return { error: "Impossible de mettre à jour l'offre. Veuillez réessayer." };
  }

  if (decision === "acceptee") {
    await supabase
      .from("demandes")
      .update({ status: "en_negociation" })
      .eq("id", demandeId)
      .eq("status", "ouverte");
  }

  revalidatePath(`/client/demandes/${demandeId}`);
  return { success: true };
}
