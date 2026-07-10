import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

const PAGE_SIZE = 12;

export type EntrepriseResultat = Tables<"entreprises"> & {
  prestataire_categories: { categories: Tables<"categories"> | null }[];
  note_moyenne: number | null;
  nb_avis: number;
};

export type SearchFilters = {
  q?: string;
  ville?: string;
  categoryId?: number;
  minRating?: number;
  soloTag?: boolean; // filtre "solution tout-en-un"
  page?: number;
};

/**
 * Recherche de prestataires. Conçue pour accueillir facilement de nouveaux
 * filtres (badges, prix, disponibilité, ancienneté...) sans changer la
 * signature : ajouter une clé à SearchFilters + une condition ci-dessous.
 */
export async function searchEntreprises(
  filters: SearchFilters
): Promise<{ results: EntrepriseResultat[]; total: number; page: number; totalPages: number }> {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const relationCategories = filters.categoryId
    ? "prestataire_categories!inner(categories(*))"
    : "prestataire_categories(categories(*))";

  let query = supabase
    .from("entreprises")
    .select(`*, ${relationCategories}`, { count: "exact" })
    .is("deleted_at", null);

  if (filters.q) {
    query = query.ilike("nom", `%${filters.q}%`);
  }
  if (filters.ville) {
    query = query.ilike("ville", `%${filters.ville}%`);
  }
  if (filters.soloTag) {
    query = query.eq("is_solution_tout_en_un", true);
  }
  if (filters.categoryId) {
    query = query.eq("prestataire_categories.category_id", filters.categoryId);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const entrepriseIds = (data ?? []).map((e) => e.id);
  const { data: notes } = entrepriseIds.length
    ? await supabase
        .from("v_entreprise_rating")
        .select("*")
        .in("entreprise_id", entrepriseIds)
    : { data: [] as Tables<"v_entreprise_rating">[] };

  const notesParEntreprise = new Map(
    (notes ?? []).map((n) => [n.entreprise_id, n])
  );

  let results = (data ?? []).map((e) => ({
    ...e,
    note_moyenne: notesParEntreprise.get(e.id)?.note_moyenne ?? null,
    nb_avis: notesParEntreprise.get(e.id)?.nb_avis ?? 0,
  })) as EntrepriseResultat[];

  if (filters.minRating) {
    results = results.filter((r) => (r.note_moyenne ?? 0) >= filters.minRating!);
  }

  const total = count ?? results.length;
  return { results, total, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}
