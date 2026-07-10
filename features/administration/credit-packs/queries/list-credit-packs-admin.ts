import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export async function listAllCreditPacksAdmin(): Promise<Tables<"credit_packs">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("credit_packs")
    .select("*")
    .order("credits_amount", { ascending: true });

  if (error) throw error;
  return data;
}
