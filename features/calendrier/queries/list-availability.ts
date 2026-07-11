import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

/** Créneaux de disponibilité déclarés pour le mois (year, month 1-indexé). */
export async function listAvailabilityForMonth(
  entrepriseId: string,
  year: number,
  month: number
): Promise<Tables<"availability_slots">[]> {
  const supabase = await createClient();

  const debut = `${year}-${String(month).padStart(2, "0")}-01`;
  const finDate = new Date(year, month, 0).getDate(); // dernier jour du mois
  const fin = `${year}-${String(month).padStart(2, "0")}-${String(finDate).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("entreprise_id", entrepriseId)
    .gte("date", debut)
    .lte("date", fin);

  if (error) throw error;
  return data;
}
