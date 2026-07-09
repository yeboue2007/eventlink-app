import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

/** Packs de crédits actuellement actifs et dans leur fenêtre de validité. */
export async function listActiveCreditPacks(): Promise<Tables<"credit_packs">[]> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("credit_packs")
    .select("*")
    .eq("active", true)
    .lte("valid_from", nowIso)
    .or(`valid_to.is.null,valid_to.gte.${nowIso}`)
    .order("credits_amount", { ascending: true });

  if (error) throw error;
  return data;
}

/** Historique des mouvements du wallet d'une entreprise, du plus récent au plus ancien. */
export async function listWalletTransactions(
  entrepriseId: string
): Promise<Tables<"credit_transactions">[]> {
  const supabase = await createClient();

  const { data: wallet } = await supabase
    .from("wallets")
    .select("id")
    .eq("entreprise_id", entrepriseId)
    .single();

  if (!wallet) return [];

  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("wallet_id", wallet.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}
