import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

/** Statistiques quotidiennes des N derniers jours, du plus ancien au plus récent. */
export async function listDailyStats(days = 30): Promise<Tables<"platform_stats_daily">[]> {
  const supabase = await createClient();
  const depuis = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("platform_stats_daily")
    .select("*")
    .gte("date", depuis)
    .order("date", { ascending: true });

  if (error) throw error;
  return data;
}

export type TotauxPlateforme = {
  totalDemandes: number;
  totalOffres: number;
  totalEntreprises: number;
  totalClients: number;
};

/** Compteurs globaux "à date" — lecture directe (peu coûteuse, comptages simples). */
export async function getTotauxPlateforme(): Promise<TotauxPlateforme> {
  const supabase = await createClient();

  const [demandes, offres, entreprises, clients] = await Promise.all([
    supabase.from("demandes").select("*", { count: "exact", head: true }),
    supabase.from("offres").select("*", { count: "exact", head: true }),
    supabase.from("entreprises").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client"),
  ]);

  return {
    totalDemandes: demandes.count ?? 0,
    totalOffres: offres.count ?? 0,
    totalEntreprises: entreprises.count ?? 0,
    totalClients: clients.count ?? 0,
  };
}
