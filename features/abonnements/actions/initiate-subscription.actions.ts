"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";
import { initCinetpayPayment } from "@/features/credits/lib/cinetpay";
import { createClient } from "@/lib/supabase/server";

export type InitiateSubscriptionState = { error?: string } | undefined;

export async function initiateSubscriptionAction(
  planId: string,
  amountFcfa: number,
  planLabel: string
): Promise<InitiateSubscriptionState> {
  const current = await getCurrentProfile();
  if (!current) {
    return { error: "Vous devez être connecté." };
  }

  const supabase = await createClient();
  const transactionId = `el-sub-${randomUUID().replace(/-/g, "").slice(0, 17)}`;

  const { error: orderError } = await supabase.rpc("rpc_creer_commande_abonnement", {
    p_plan_id: planId,
    p_cinetpay_transaction_id: transactionId,
  });

  if (orderError) {
    return { error: "Impossible de créer la commande. Veuillez réessayer." };
  }

  const { success, paymentUrl } = await initCinetpayPayment({
    transactionId,
    amountFcfa,
    description: `Abonnement EventLink — ${planLabel} (1 mois)`,
    customerName: current.profile.full_name || "Prestataire",
    customerPhone: current.profile.phone,
    returnPath: "/prestataire/abonnement/retour",
  });

  if (!success || !paymentUrl) {
    return { error: "Impossible d'initier le paiement CinetPay. Veuillez réessayer." };
  }

  redirect(paymentUrl);
}
