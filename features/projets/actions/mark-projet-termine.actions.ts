"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function markProjetTermineAction(projetId: string, demandeId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projets")
    .update({ status: "termine" })
    .eq("id", projetId);

  if (error) {
    return { error: "Impossible de marquer l'événement comme terminé." };
  }

  revalidatePath(`/client/demandes/${demandeId}`);
  return { success: true };
}
