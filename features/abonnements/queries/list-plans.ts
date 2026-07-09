import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export async function listActivePlans(): Promise<Tables<"subscription_plans">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("active", true)
    .order("price_fcfa", { ascending: true });

  if (error) throw error;
  return data;
}

export type AbonnementActuel = Tables<"prestataire_subscriptions"> & {
  subscription_plans: Tables<"subscription_plans"> | null;
};

export async function getCurrentSubscription(
  entrepriseId: string
): Promise<AbonnementActuel | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prestataire_subscriptions")
    .select("*, subscription_plans(*)")
    .eq("entreprise_id", entrepriseId)
    .eq("status", "active")
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as AbonnementActuel | null;
}
