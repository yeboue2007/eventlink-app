import "server-only";

import { createClient } from "@/lib/supabase/server";

export type IndicateursTableauDeBord = {
  totalDemandes: number;
  totalOffres: number;
  totalEntreprises: number;
  totalClients: number;
  revenu7j: number;
  revenu30j: number;
  demandesOuvertes7j: number;
  verificationsEnAttente: number;
  entreprisesSuspendues: number;
  clientsSuspendus: number;
  erreurs7j: number;
  elementsCorbeille: number;
};

/**
 * Compteurs "à date" pour la vue d'ensemble du back-office. Volontairement
 * distinct de /admin/statistiques (qui détaille l'évolution quotidienne) —
 * cette page ne montre que ce qui nécessite l'attention immédiate d'un
 * administrateur, plus quelques totaux de contexte.
 */
export async function getIndicateursTableauDeBord(): Promise<IndicateursTableauDeBord> {
  const supabase = await createClient();
  const depuis7j = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const depuis30j = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);
  const depuis7jDate = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);

  const [
    demandes,
    offres,
    entreprises,
    clients,
    statsDaily,
    demandesOuvertes7j,
    verifications,
    entreprisesSuspendues,
    clientsSuspendus,
    erreurs,
    corbeilleDemandes,
    corbeilleProjets,
    corbeilleOffres,
    corbeilleEntreprises,
    corbeilleAgences,
  ] = await Promise.all([
    supabase.from("demandes").select("*", { count: "exact", head: true }),
    supabase.from("offres").select("*", { count: "exact", head: true }),
    supabase.from("entreprises").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client"),
    supabase.from("platform_stats_daily").select("date, revenus_fcfa").gte("date", depuis30j),
    supabase
      .from("demandes")
      .select("*", { count: "exact", head: true })
      .eq("status", "ouverte")
      .gte("created_at", depuis7j),
    supabase
      .from("verification_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "en_attente"),
    supabase
      .from("entreprises")
      .select("*", { count: "exact", head: true })
      .eq("statut", "suspendu"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("statut", "suspendu"),
    supabase
      .from("system_log")
      .select("*", { count: "exact", head: true })
      .eq("severity", "error")
      .gte("created_at", depuis7j),
    supabase.from("demandes").select("*", { count: "exact", head: true }).not("deleted_at", "is", null),
    supabase.from("projets").select("*", { count: "exact", head: true }).not("deleted_at", "is", null),
    supabase.from("offres").select("*", { count: "exact", head: true }).not("deleted_at", "is", null),
    supabase.from("entreprises").select("*", { count: "exact", head: true }).not("deleted_at", "is", null),
    supabase.from("agences").select("*", { count: "exact", head: true }).not("deleted_at", "is", null),
  ]);

  const stats = statsDaily.data ?? [];
  const revenu30j = stats.reduce((sum, d) => sum + d.revenus_fcfa, 0);
  const revenu7j = stats
    .filter((d) => d.date >= depuis7jDate)
    .reduce((sum, d) => sum + d.revenus_fcfa, 0);

  return {
    totalDemandes: demandes.count ?? 0,
    totalOffres: offres.count ?? 0,
    totalEntreprises: entreprises.count ?? 0,
    totalClients: clients.count ?? 0,
    revenu7j,
    revenu30j,
    demandesOuvertes7j: demandesOuvertes7j.count ?? 0,
    verificationsEnAttente: verifications.count ?? 0,
    entreprisesSuspendues: entreprisesSuspendues.count ?? 0,
    clientsSuspendus: clientsSuspendus.count ?? 0,
    erreurs7j: erreurs.count ?? 0,
    elementsCorbeille:
      (corbeilleDemandes.count ?? 0) +
      (corbeilleProjets.count ?? 0) +
      (corbeilleOffres.count ?? 0) +
      (corbeilleEntreprises.count ?? 0) +
      (corbeilleAgences.count ?? 0),
  };
}
