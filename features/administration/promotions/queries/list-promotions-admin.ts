import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type PromotionAvecRelations = Tables<"promotions"> & {
  categories: Tables<"categories"> | null;
  subscription_plans: Tables<"subscription_plans"> | null;
};

export async function listAllPromotionsAdmin(): Promise<PromotionAvecRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("promotions")
    .select("*, categories(*), subscription_plans(*)")
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data as PromotionAvecRelations[];
}
