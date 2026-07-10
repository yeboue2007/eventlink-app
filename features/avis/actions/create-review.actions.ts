"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createReviewSchema } from "@/features/avis/schemas/review.schema";

export type CreateReviewActionState = { error?: string } | undefined;

export async function createReviewAction(
  demandeId: string,
  entrepriseId: string,
  _prevState: CreateReviewActionState,
  formData: FormData
): Promise<CreateReviewActionState> {
  const parsed = createReviewSchema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  // La RLS (reviews_insert_client) vérifie déjà : projet terminé, offre
  // acceptée pour cette entreprise, conversation existante. Si l'une de ces
  // conditions manque, l'insertion échoue simplement — pas de duplication
  // de cette logique métier côté application.
  const { error } = await supabase.from("reviews").insert({
    demande_id: demandeId,
    entreprise_id: entrepriseId,
    client_id: user.id,
    rating: parsed.data.rating,
    comment: parsed.data.comment ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Vous avez déjà laissé un avis pour cette prestation." };
    }
    return {
      error:
        "Impossible de publier cet avis. Vérifiez que l'événement est bien marqué comme terminé.",
    };
  }

  revalidatePath(`/client/demandes/${demandeId}`);
  return undefined;
}
