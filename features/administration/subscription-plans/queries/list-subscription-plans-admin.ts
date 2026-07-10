import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export async function listAllSubscriptionPlansAdmin(): Promise<Tables<"subscription_plans">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("price_fcfa", { ascending: true });

  if (error) throw error;
  return data;
}
