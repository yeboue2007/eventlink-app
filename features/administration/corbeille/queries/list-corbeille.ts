import "server-only";

import { createClient } from "@/lib/supabase/server";

export type TableCorbeille = "demandes" | "projets" | "offres" | "entreprises" | "agences";

const LIMITE_PAR_TABLE = 50;

export type ElementCorbeille = {
  table: TableCorbeille;
  id: string;
  label: string;
  sousLabel: string;
  deletedAt: string;
};

/**
 * Chaque table à soft-delete est interrogée séparément (colonnes et
 * relations trop différentes pour une requête générique unique), puis les
 * résultats sont normalisés dans un format d'affichage commun et fusionnés
 * par date de suppression décroissante.
 */
export async function listCorbeilleAdmin(): Promise<ElementCorbeille[]> {
  const supabase = await createClient();

  const [demandes, projets, offres, entreprises, agences] = await Promise.all([
    supabase
      .from("demandes")
      .select("id, titre, ville, deleted_at, profiles(full_name)")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
      .limit(LIMITE_PAR_TABLE),
    supabase
      .from("projets")
      .select("id, titre, ville, deleted_at, profiles(full_name)")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
      .limit(LIMITE_PAR_TABLE),
    supabase
      .from("offres")
      .select(
        "id, total_price, deleted_at, entreprises!offres_entreprise_id_fkey(nom), demandes(titre)"
      )
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
      .limit(LIMITE_PAR_TABLE),
    supabase
      .from("entreprises")
      .select("id, nom, ville, type, deleted_at")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
      .limit(LIMITE_PAR_TABLE),
    supabase
      .from("agences")
      .select("id, nom, ville, deleted_at, entreprises!agences_entreprise_id_fkey(nom)")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
      .limit(LIMITE_PAR_TABLE),
  ]);

  for (const result of [demandes, projets, offres, entreprises, agences]) {
    if (result.error) throw result.error;
  }

  const elements: ElementCorbeille[] = [
    ...(demandes.data ?? []).map((d) => ({
      table: "demandes" as const,
      id: d.id,
      label: d.titre,
      sousLabel: `Demande — ${d.profiles?.full_name ?? "Client inconnu"} · ${d.ville}`,
      deletedAt: d.deleted_at as string,
    })),
    ...(projets.data ?? []).map((p) => ({
      table: "projets" as const,
      id: p.id,
      label: p.titre,
      sousLabel: `Projet — ${p.profiles?.full_name ?? "Client inconnu"} · ${p.ville}`,
      deletedAt: p.deleted_at as string,
    })),
    ...(offres.data ?? []).map((o) => ({
      table: "offres" as const,
      id: o.id,
      label: `Offre de ${o.entreprises?.nom ?? "prestataire inconnu"}`,
      sousLabel: `${new Intl.NumberFormat("fr-FR").format(o.total_price)} FCFA — pour "${o.demandes?.titre ?? "demande supprimée"}"`,
      deletedAt: o.deleted_at as string,
    })),
    ...(entreprises.data ?? []).map((e) => ({
      table: "entreprises" as const,
      id: e.id,
      label: e.nom,
      sousLabel: `Entreprise — ${e.type === "individuel" ? "Individuel" : "Entreprise"} · ${e.ville ?? "Ville inconnue"}`,
      deletedAt: e.deleted_at as string,
    })),
    ...(agences.data ?? []).map((a) => ({
      table: "agences" as const,
      id: a.id,
      label: a.nom,
      sousLabel: `Agence de ${a.entreprises?.nom ?? "entreprise inconnue"} · ${a.ville}`,
      deletedAt: a.deleted_at as string,
    })),
  ];

  return elements.sort(
    (a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
  );
}
