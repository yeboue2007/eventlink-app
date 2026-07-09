"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { updateCategoriesSchema } from "@/features/entreprises/schemas/update-categories.schema";

export type UpdateCategoriesActionState = { error?: string; success?: boolean } | undefined;

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

  // Remplace intégralement la déclaration (simple et cohérent avec un
  // formulaire "tout ou rien" — la RLS garantit que seul un membre de
  // l'entreprise peut modifier ses propres catégories).
  const { error: deleteError } = await supabase
    .from("prestataire_categories")
    .delete()
    .eq("entreprise_id", entrepriseId);

  if (deleteError) {
    return { error: "Impossible de mettre à jour vos catégories. Veuillez réessayer." };
  }

  const { error: insertError } = await supabase.from("prestataire_categories").insert(
    parsed.data.categoryIds.map((categoryId) => ({
      entreprise_id: entrepriseId,
      category_id: categoryId,
    }))
  );

  if (insertError) {
    return { error: "Impossible de mettre à jour vos catégories. Veuillez réessayer." };
  }

  revalidatePath("/prestataire/parametres/categories");
  revalidatePath("/prestataire/demandes");
  return { success: true };
}
