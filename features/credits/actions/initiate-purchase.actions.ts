"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";
import { initCinetpayPayment } from "@/features/credits/lib/cinetpay";
import { createClient } from "@/lib/supabase/server";

export type InitiatePurchaseState = { error?: string } | undefined;

export async function initiatePurchaseAction(
  packId: string,
  amountFcfa: number,
  packLabel: string
): Promise<InitiatePurchaseState> {
  const current = await getCurrentProfile();
  if (!current) {
    return { error: "Vous devez être connecté." };
  }

  const supabase = await createClient();
  const transactionId = `el-${randomUUID().replace(/-/g, "").slice(0, 20)}`;

  // Crée la commande en base d'abord (RLS : vérifie que l'appelant appartient
  // bien à une entreprise et que le pack est actif) — avant tout appel à
  // CinetPay, pour ne jamais générer un paiement sans commande à réconcilier.
  const { error: orderError } = await supabase.rpc("rpc_creer_commande_credits", {
    p_credit_pack_id: packId,
    p_cinetpay_transaction_id: transactionId,
  });

  if (orderError) {
    return { error: "Impossible de créer la commande. Veuillez réessayer." };
  }

  const { success, paymentUrl } = await initCinetpayPayment({
    transactionId,
    amountFcfa,
    description: `Achat pack de crédits EventLink — ${packLabel}`,
    customerName: current.profile.full_name || "Prestataire",
    customerPhone: current.profile.phone,
  });

  if (!success || !paymentUrl) {
    return { error: "Impossible d'initier le paiement CinetPay. Veuillez réessayer." };
  }

  redirect(paymentUrl);
}
