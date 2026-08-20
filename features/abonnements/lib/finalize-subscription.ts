import "server-only";

import { checkCinetpayPayment } from "@/features/credits/lib/cinetpay";
import { createServiceRoleClient } from "@/lib/supabase/service";

export type FinalizeResult = "credite" | "echoue" | "en_attente" | "erreur";

export async function verifyAndFinalizeSubscriptionTransaction(
  transactionId: string
): Promise<FinalizeResult> {
  const { status } = await checkCinetpayPayment(transactionId);
  const supabase = createServiceRoleClient();

  if (status === "ACCEPTED") {
    const { error } = await supabase.rpc("rpc_confirmer_achat_abonnement", {
      p_cinetpay_transaction_id: transactionId,
    });
    if (error) {
      await supabase.from("system_log").insert({
        event_type: "erreur",
        severity: "error",
        message: "Échec de confirmation d'un achat d'abonnement",
        metadata: { transaction_id: transactionId, erreur: error.message },
      });
      return "erreur";
    }
    return "credite";
  }

  if (status === "REFUSED") {
    await supabase.rpc("rpc_echouer_achat_abonnement", {
      p_cinetpay_transaction_id: transactionId,
    });
    return "echoue";
  }

  return "en_attente";
}
