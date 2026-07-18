import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Enums, Tables } from "@/lib/supabase/database.types";

const PAGE_SIZE = 20;

export type ClientAdminResultat = Tables<"profiles"> & { nb_demandes: number };

export type ClientAdminFilters = {
  q?: string;
  ville?: string;
  statut?: Enums<"compte_statut">;
  page?: number;
};

export async function searchClientsAdmin(filters: ClientAdminFilters): Promise<{
  results: ClientAdminResultat[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase.from("profiles").select("*", { count: "exact" }).eq("role", "client");

  if (filters.q) query = query.ilike("full_name", `%${filters.q}%`);
  if (filters.ville) query = query.ilike("ville", `%${filters.ville}%`);
  if (filters.statut) query = query.eq("statut", filters.statut);

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const ids = (data ?? []).map((c) => c.id);
  const { data: demandes } = ids.length
    ? await supabase.from("demandes").select("client_id").in("client_id", ids)
    : { data: [] as { client_id: string }[] };

  const nbDemandesParClient = new Map<string, number>();
  for (const d of demandes ?? []) {
    nbDemandesParClient.set(d.client_id, (nbDemandesParClient.get(d.client_id) ?? 0) + 1);
  }

  const results: ClientAdminResultat[] = (data ?? []).map((c) => ({
    ...c,
    nb_demandes: nbDemandesParClient.get(c.id) ?? 0,
  }));

  const total = count ?? results.length;
  return { results, total, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}
