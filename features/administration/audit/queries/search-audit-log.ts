import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

const PAGE_SIZE = 30;

export type AuditLogEntry = Tables<"audit_log"> & {
  profiles: Pick<Tables<"profiles">, "id" | "full_name"> | null;
};

export type AuditLogFilters = {
  actorProfileId?: string;
  action?: string;
  entityType?: string;
  depuis?: string; // date ISO
  jusqua?: string; // date ISO
  page?: number;
};

export async function searchAuditLog(filters: AuditLogFilters): Promise<{
  results: AuditLogEntry[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("audit_log")
    .select("*, profiles(id, full_name)", { count: "exact" });

  if (filters.actorProfileId) query = query.eq("actor_profile_id", filters.actorProfileId);
  if (filters.action) query = query.eq("action", filters.action);
  if (filters.entityType) query = query.eq("entity_type", filters.entityType);
  if (filters.depuis) query = query.gte("created_at", filters.depuis);
  if (filters.jusqua) query = query.lte("created_at", filters.jusqua);

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const total = count ?? 0;
  return {
    results: data as AuditLogEntry[],
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

/** Liste des types d'actions déjà enregistrées, pour peupler le filtre. */
export async function listActionsDistinctes(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("audit_log").select("action");
  if (error) throw error;
  return [...new Set((data ?? []).map((d) => d.action))].sort();
}

/** Liste des admins ayant déjà réalisé au moins une action, pour le filtre. */
export async function listActeursDistincts(): Promise<
  Pick<Tables<"profiles">, "id" | "full_name">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "admin")
    .order("full_name", { ascending: true });
  if (error) throw error;
  return data;
}
