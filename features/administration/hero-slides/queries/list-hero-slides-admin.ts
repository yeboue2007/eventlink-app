import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export async function listHeroSlidesAdmin(): Promise<Tables<"hero_slides">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
}
