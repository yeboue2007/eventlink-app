import "server-only";

import { checkCinetpayPayment } from "@/features/credits/lib/cinetpay";
import { createServiceRoleClient } from "@/lib/supabase/service";

export type FinalizeResult = "credite" | "echoue" | "en_attente" | "erreur";

/**
 * Revérifie une transaction auprès de CinetPay (jamais sur la seule foi
 * d'un webhook ou d'une redirection) puis finalise la commande de manière
 * idempotente. Appelée à la fois par le webhook de notification et par la
 * page de retour — peut donc être invoquée plusieurs fois sans double
 * créditer le wallet (rpc_confirmer_achat_credits est un no-op si la
 * commande n'est plus 'en_attente').
 */
export async function verifyAndFinalizeCinetpayTransaction(
  transactionId: string
): Promise<FinalizeResult> {
  const { status } = await checkCinetpayPayment(transactionId);
  const supabase = createServiceRoleClient();

  if (status === "ACCEPTED") {
    const { error } = await supabase.rpc("rpc_confirmer_achat_credits", {
      p_cinetpay_transaction_id: transactionId,
    });
    return error ? "erreur" : "credite";
  }

  if (status === "REFUSED") {
    await supabase.rpc("rpc_echouer_achat_credits", {
      p_cinetpay_transaction_id: transactionId,
    });
    return "echoue";
  }

  return "en_attente";
}
