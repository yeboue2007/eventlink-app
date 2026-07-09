"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { calculateCreditCost } from "@/features/credits/queries/calculate-credit-cost";
import { listSelectedCategoryIds } from "@/features/entreprises/queries/get-current-entreprise";
import { createOffreSchema } from "@/features/offres/schemas/offre.schema";

export type CreateOffreActionState = { error?: string } | undefined;

export async function createOffreAction(
  entrepriseId: string,
  _prevState: CreateOffreActionState,
  formData: FormData
): Promise<CreateOffreActionState> {
  const parsed = createOffreSchema.safeParse({
    demandeId: formData.get("demandeId"),
    demandeLotIds: formData.getAll("demandeLotIds"),
    message: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();

  // Défense en profondeur : on ne fait confiance ni au formulaire ni à l'UI —
  // on revérifie que chaque lot appartient bien à une catégorie déclarée par
  // cette entreprise avant de construire l'offre.
  const [{ data: demandeLots, error: lotsError }, categoryIds] = await Promise.all([
    supabase
      .from("demande_lots")
      .select("*")
      .in("id", parsed.data.demandeLotIds)
      .eq("demande_id", parsed.data.demandeId),
    listSelectedCategoryIds(entrepriseId),
  ]);

  if (lotsError || !demandeLots || demandeLots.length !== parsed.data.demandeLotIds.length) {
    return { error: "Certains lots sélectionnés sont introuvables." };
  }

  const lotsHorsCategories = demandeLots.filter(
    (lot) => !categoryIds.includes(lot.category_id)
  );
  if (lotsHorsCategories.length > 0) {
    return {
      error: "Vous ne pouvez proposer une offre que sur vos catégories déclarées.",
    };
  }

  const prix: Record<string, number> = {};
  for (const lot of demandeLots) {
    const raw = formData.get(`prix_${lot.id}`);
    const valeur = Number(raw);
    if (!raw || Number.isNaN(valeur) || valeur <= 0) {
      return { error: "Indiquez un prix valide pour chaque prestation sélectionnée." };
    }
    prix[lot.id] = valeur;
  }

  const totalPrice = Object.values(prix).reduce((sum, p) => sum + p, 0);

  const creditCost = await calculateCreditCost(
    demandeLots.map((lot) => ({ categoryId: lot.category_id, projectSize: lot.project_size }))
  );

  const { data: offreId, error } = await supabase.rpc("rpc_creer_offre", {
    p_demande_id: parsed.data.demandeId,
    p_entreprise_id: entrepriseId,
    p_total_price: totalPrice,
    p_message: parsed.data.message ?? "",
    p_lots: demandeLots.map((lot) => ({
      demande_lot_id: lot.id,
      prix_lot: prix[lot.id],
    })),
    p_credit_cost: creditCost,
  });

  if (error || !offreId) {
    if (error?.message?.includes("Solde de crédits insuffisant")) {
      return { error: "Solde de crédits insuffisant pour envoyer cette offre." };
    }
    return { error: "Impossible d'envoyer l'offre. Veuillez réessayer." };
  }

  redirect(`/prestataire/demandes/${parsed.data.demandeId}?offre_envoyee=1`);
}
