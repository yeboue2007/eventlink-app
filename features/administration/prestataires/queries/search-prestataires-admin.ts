import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Enums, Tables } from "@/lib/supabase/database.types";

const PAGE_SIZE = 20;

export type PrestataireAdminResultat = Tables<"entreprises"> & {
  prestataire_categories: { categories: Tables<"categories"> | null }[];
  nb_offres: number;
  note_fiabilite: number | null;
  plan_actuel: string | null;
};

export type PrestataireAdminFilters = {
  q?: string;
  ville?: string;
  categoryId?: number;
  verificationLevel?: Enums<"verification_level">;
  statut?: Enums<"compte_statut">;
  planSlug?: string;
  tri?: "ancienneté" | "nb_offres" | "fiabilite";
  page?: number;
};

export async function searchPrestatairesAdmin(filters: PrestataireAdminFilters): Promise<{
  results: PrestataireAdminResultat[];
  total: number;
  page: number;
  totalPages: number;
}> {
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

  if (filters.q) query = query.ilike("nom", `%${filters.q}%`);
  if (filters.ville) query = query.ilike("ville", `%${filters.ville}%`);
  if (filters.verificationLevel) query = query.eq("verification_level", filters.verificationLevel);
  if (filters.statut) query = query.eq("statut", filters.statut);
  if (filters.categoryId) query = query.eq("prestataire_categories.category_id", filters.categoryId);

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const ids = (data ?? []).map((e) => e.id);

  const [ratings, offresCounts, abonnements] = await Promise.all([
    ids.length
      ? supabase.from("v_entreprise_rating").select("*").in("entreprise_id", ids)
      : Promise.resolve({ data: [] as Tables<"v_entreprise_rating">[] }),
    ids.length
      ? supabase.from("offres").select("entreprise_id").in("entreprise_id", ids)
      : Promise.resolve({ data: [] as { entreprise_id: string }[] }),
    ids.length
      ? supabase
          .from("prestataire_subscriptions")
          .select("entreprise_id, status, subscription_plans(slug, label)")
          .in("entreprise_id", ids)
          .eq("status", "active")
      : Promise.resolve({
          data: [] as {
            entreprise_id: string;
            subscription_plans: { slug: string; label: string } | null;
          }[],
        }),
  ]);

  const ratingParEntreprise = new Map((ratings.data ?? []).map((r) => [r.entreprise_id, r]));
  const nbOffresParEntreprise = new Map<string, number>();
  for (const o of offresCounts.data ?? []) {
    nbOffresParEntreprise.set(o.entreprise_id, (nbOffresParEntreprise.get(o.entreprise_id) ?? 0) + 1);
  }
  const planParEntreprise = new Map(
    (abonnements.data ?? []).map((a) => [a.entreprise_id, a.subscription_plans?.label ?? null])
  );

  let results: PrestataireAdminResultat[] = (data ?? []).map((e) => ({
    ...e,
    nb_offres: nbOffresParEntreprise.get(e.id) ?? 0,
    note_fiabilite: ratingParEntreprise.get(e.id)?.note_moyenne ?? null,
    plan_actuel: planParEntreprise.get(e.id) ?? null,
  }));

  if (filters.planSlug) {
    results = results.filter((r) =>
      filters.planSlug === "aucun" ? !r.plan_actuel : r.plan_actuel === filters.planSlug
    );
  }

  if (filters.tri === "nb_offres") {
    results = [...results].sort((a, b) => b.nb_offres - a.nb_offres);
  } else if (filters.tri === "fiabilite") {
    results = [...results].sort((a, b) => (b.note_fiabilite ?? 0) - (a.note_fiabilite ?? 0));
  }
  // "ancienneté" est déjà l'ordre par défaut (created_at desc côté SQL)

  const total = count ?? results.length;
  return { results, total, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}
