import "server-only";

import { createClient } from "@/lib/supabase/server";

type LotAFacturer = { categoryId: number; projectSize: string };

/**
 * Calcule le coût en crédits d'une offre à partir de la grille tarifaire
 * `credit_costs` (pilotée depuis l'admin, jamais codée en dur ici).
 * Une offre groupée (2+ lots) bénéficie d'une remise de 20% sur la somme
 * des coûts individuels, conformément au cahier des charges.
 */
export async function calculateCreditCost(lots: LotAFacturer[]): Promise<number> {
  if (lots.length === 0) return 0;

  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data: rates, error } = await supabase
    .from("credit_costs")
    .select("*")
    .eq("active", true)
    .eq("is_grouped_offer", false)
    .lte("valid_from", nowIso)
    .or(`valid_to.is.null,valid_to.gte.${nowIso}`);

  if (error) throw error;

  const coutParLot = lots.map((lot) => {
    const tarifSpecifique = rates.find(
      (r) => r.category_id === lot.categoryId && r.project_size === lot.projectSize
    );
    const tarifDefaut = rates.find(
      (r) => r.category_id === null && r.project_size === lot.projectSize
    );
    return tarifSpecifique?.credit_cost ?? tarifDefaut?.credit_cost ?? 1;
  });

  const total = coutParLot.reduce((sum, cost) => sum + cost, 0);

  if (lots.length > 1) {
    return Math.max(1, Math.round(total * 0.8));
  }

  return total;
}
