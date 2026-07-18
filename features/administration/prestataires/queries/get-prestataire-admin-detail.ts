import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type PrestataireAdminDetail = Tables<"entreprises"> & {
  wallets: Tables<"wallets"> | null;
  prestataire_categories: { categories: Tables<"categories"> | null }[];
  entreprise_membres: { profiles: Tables<"profiles"> | null; role: string }[];
  prestataire_subscriptions: (Tables<"prestataire_subscriptions"> & {
    subscription_plans: Tables<"subscription_plans"> | null;
  })[];
};

export async function getPrestataireAdminDetail(
  entrepriseId: string
): Promise<PrestataireAdminDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entreprises")
    .select(
      `*, wallets(*), prestataire_categories(categories(*)),
       entreprise_membres(role, profiles(*)),
       prestataire_subscriptions(*, subscription_plans(*))`
    )
    .eq("id", entrepriseId)
    .maybeSingle();

  if (error) throw error;
  return data as PrestataireAdminDetail | null;
}
