"use server";

import { revalidatePath } from "next/cache";

import { logAdminAction } from "@/features/administration/audit/log-admin-action";
import { ajusterCreditsSchema } from "@/features/administration/credits/schemas/ajuster-credits.schema";
import { requireAdminAccess } from "@/features/administration/permissions/guard";
import { createClient } from "@/lib/supabase/server";

export type AjusterCreditsState = { error?: string; success?: boolean } | undefined;

export async function ajusterCreditsAction(
  entrepriseId: string,
  _prevState: AjusterCreditsState,
  formData: FormData
): Promise<AjusterCreditsState> {
  await requireAdminAccess("credits", "gestion");

  const parsed = ajusterCreditsSchema.safeParse({
    montant: formData.get("montant"),
    type: formData.get("type"),
    justification: formData.get("justification"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { data: entreprise } = await supabase
    .from("entreprises")
    .select("nom")
    .eq("id", entrepriseId)
    .maybeSingle();

  const { error } = await supabase.rpc("rpc_ajuster_credits_admin", {
    p_entreprise_id: entrepriseId,
    p_montant: parsed.data.montant,
    p_type: parsed.data.type,
    p_justification: parsed.data.justification,
  });

  if (error) {
    return { error: error.message || "Impossible d'ajuster les crédits." };
  }

  // Double traçabilité : credit_transactions (le grand livre, déjà écrit par
  // la RPC) + audit_log (actions admin), qui répond à des questions
  // différentes ("quel est l'historique du wallet ?" vs "qu'a fait cet
  // administrateur ?").
  await logAdminAction({
    action: "ajustement_credits",
    entityType: "wallets",
    entityId: entrepriseId,
    nouvelleValeur: { montant: parsed.data.montant, type: parsed.data.type },
    commentaire: `${entreprise?.nom ?? entrepriseId} : ${parsed.data.montant > 0 ? "+" : ""}${parsed.data.montant} (${parsed.data.type}) — ${parsed.data.justification}`,
  });

  revalidatePath(`/admin/prestataires/${entrepriseId}`);
  return { success: true };
}
