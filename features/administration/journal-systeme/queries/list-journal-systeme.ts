import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type EntreeJournalSysteme = Tables<"system_log"> & {
  profiles: Pick<Tables<"profiles">, "full_name"> | null;
  entreprises: Pick<Tables<"entreprises">, "nom"> | null;
};

export type FiltresJournalSysteme = {
  eventType?: string;
  severity?: string;
};

const LIMITE = 100;

export async function listSystemLogAdmin(
  filtres: FiltresJournalSysteme = {}
): Promise<EntreeJournalSysteme[]> {
  const supabase = await createClient();

  let query = supabase
    .from("system_log")
    .select("*, profiles(full_name), entreprises(nom)")
    .order("created_at", { ascending: false })
    .limit(LIMITE);

  if (filtres.eventType) {
    query = query.eq("event_type", filtres.eventType);
  }
  if (filtres.severity) {
    query = query.eq("severity", filtres.severity);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as EntreeJournalSysteme[];
}

/**
 * Types d'événements distincts actuellement présents, pour peupler le
 * filtre — évite de coder en dur une liste qui pourrait diverger du code
 * réel émettant les événements.
 */
export async function listEventTypesDistincts(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("system_log")
    .select("event_type")
    .limit(500);

  if (error) throw error;
  return Array.from(new Set((data ?? []).map((r) => r.event_type))).sort();
}
