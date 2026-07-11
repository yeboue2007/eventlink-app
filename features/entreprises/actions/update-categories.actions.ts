"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { updateCategoriesSchema } from "@/features/entreprises/schemas/update-categories.schema";

export type UpdateCategoriesActionState =
  | { error?: string; success?: boolean; savedIds?: number[] }
  | undefined;

export async function updateCategoriesAction(
  entrepriseId: string,
  _prevState: UpdateCategoriesActionState,
  formData: FormData
): Promise<UpdateCategoriesActionState> {
  const parsed = updateCategoriesSchema.safeParse({
    categoryIds: formData.getAll("categoryIds"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  // RPC atomique : remplace la liste en une seule transaction, jamais de
  // désynchronisation possible (ancienne version : DELETE puis INSERT en
  // deux appels distincts, avec risque de tout perdre si l'INSERT échouait).
  const { error } = await supabase.rpc("rpc_definir_categories_prestataire", {
    p_entreprise_id: entrepriseId,
    p_category_ids: parsed.data.categoryIds,
  });

  if (error) {
    return { error: "Impossible de mettre à jour vos catégories. Veuillez réessayer." };
  }

  revalidatePath("/prestataire/parametres/categories");
  revalidatePath("/prestataire/demandes");
  revalidatePath("/prestataire");
  return { success: true, savedIds: parsed.data.categoryIds };
}
