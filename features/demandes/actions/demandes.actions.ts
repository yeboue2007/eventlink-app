"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createDemandeSchema } from "@/features/demandes/schemas/demande.schema";

export type CreateDemandeActionState = { error?: string } | undefined;

export async function createDemandeAction(
  _prevState: CreateDemandeActionState,
  formData: FormData
): Promise<CreateDemandeActionState> {
  const parsed = createDemandeSchema.safeParse({
    titre: formData.get("titre"),
    typeEvenement: formData.get("typeEvenement") || undefined,
    dateEvenement: formData.get("dateEvenement") || undefined,
    ville: formData.get("ville") || "Abidjan",
    lieu: formData.get("lieu") || undefined,
    budgetMin: formData.get("budgetMin"),
    budgetMax: formData.get("budgetMax"),
    description: formData.get("description") || undefined,
    categoryIds: formData.getAll("categoryIds"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { data: demandeId, error } = await supabase.rpc("rpc_creer_demande", {
    p_projet_id: null,
    p_titre: parsed.data.titre,
    p_type_evenement: parsed.data.typeEvenement ?? null,
    p_date_evenement: parsed.data.dateEvenement ?? null,
    p_ville: parsed.data.ville,
    p_lieu: parsed.data.lieu ?? null,
    p_budget_min: parsed.data.budgetMin,
    p_budget_max: parsed.data.budgetMax,
    p_description: parsed.data.description ?? null,
    p_category_ids: parsed.data.categoryIds,
  });

  if (error || !demandeId) {
    return { error: "Impossible de publier la demande. Veuillez réessayer." };
  }

  redirect(`/client/demandes/${demandeId}?creee=1`);
}
