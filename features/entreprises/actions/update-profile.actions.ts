"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { updateEntrepriseProfileSchema } from "@/features/entreprises/schemas/update-profile.schema";

export type UpdateEntrepriseProfileState = { error?: string; success?: boolean } | undefined;

export async function updateEntrepriseProfileAction(
  entrepriseId: string,
  _prevState: UpdateEntrepriseProfileState,
  formData: FormData
): Promise<UpdateEntrepriseProfileState> {
  const parsed = updateEntrepriseProfileSchema.safeParse({
    nom: formData.get("nom"),
    ville: formData.get("ville"),
    bio: formData.get("bio") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("entreprises")
    .update({
      nom: parsed.data.nom,
      ville: parsed.data.ville,
      bio: parsed.data.bio ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", entrepriseId);

  if (error) {
    return { error: "Impossible de mettre à jour le profil. Veuillez réessayer." };
  }

  revalidatePath("/prestataire/parametres/profil");
  revalidatePath("/prestataire");
  revalidatePath(`/entreprises/${entrepriseId}`);
  return { success: true };
}
