import { type NextRequest, NextResponse } from "next/server";

import { verifyAndFinalizeSubscriptionTransaction } from "@/features/abonnements/lib/finalize-subscription";
import { verifyAndFinalizeCinetpayTransaction } from "@/features/credits/lib/finalize-transaction";

/**
 * CinetPay appelle cette URL (notify_url) après un paiement. Conformément à
 * leur documentation, le contenu de la requête n'est JAMAIS considéré comme
 * fiable pour déterminer le statut — on ne s'en sert que pour retrouver
 * l'identifiant de transaction, puis on revérifie via l'API check.
 */
async function handleNotification(request: NextRequest) {
  let transactionId: string | null = null;

  try {
    if (request.method === "POST") {
      const contentType = request.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const body = await request.json();
        transactionId = body?.cpm_trans_id ?? body?.transaction_id ?? null;
      } else {
        const form = await request.formData();
        transactionId =
          (form.get("cpm_trans_id") as string) ?? (form.get("transaction_id") as string) ?? null;
      }
    }
  } catch {
    // ignoré : on retombe sur les query params ci-dessous
  }

  if (!transactionId) {
    transactionId = request.nextUrl.searchParams.get("transaction_id");
  }

  if (!transactionId) {
    return NextResponse.json({ error: "transaction_id manquant" }, { status: 400 });
  }

  // Le préfixe distingue un achat de crédits d'un achat d'abonnement — deux
  // tables de commandes et deux RPC de confirmation distinctes.
  if (transactionId.startsWith("el-sub-")) {
    await verifyAndFinalizeSubscriptionTransaction(transactionId);
  } else {
    await verifyAndFinalizeCinetpayTransaction(transactionId);
  }

  // CinetPay attend une réponse 200 pour ne pas retenter indéfiniment.
  return NextResponse.json({ received: true });
}

export async function POST(request: NextRequest) {
  return handleNotification(request);
}

export async function GET(request: NextRequest) {
  return handleNotification(request);
}
