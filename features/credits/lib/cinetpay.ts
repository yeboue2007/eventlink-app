import "server-only";

const CINETPAY_BASE_URL = "https://api-checkout.cinetpay.com/v2";

function getCredentials() {
  const apikey = process.env.CINETPAY_API_KEY;
  const siteId = process.env.CINETPAY_SITE_ID;
  if (!apikey || !siteId) {
    throw new Error("CINETPAY_API_KEY / CINETPAY_SITE_ID manquantes.");
  }
  return { apikey, siteId };
}

export type CinetpayInitResult = {
  success: boolean;
  paymentUrl?: string;
  rawResponse: unknown;
};

/**
 * Initialise un paiement CinetPay et retourne l'URL du guichet de paiement
 * vers laquelle rediriger l'utilisateur.
 * Doc : https://docs.cinetpay.com/api/1.0-fr/checkout/initialisation
 */
export async function initCinetpayPayment(params: {
  transactionId: string;
  amountFcfa: number;
  description: string;
  customerName: string;
  customerPhone: string;
}): Promise<CinetpayInitResult> {
  const { apikey, siteId } = getCredentials();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const response = await fetch(`${CINETPAY_BASE_URL}/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey,
      site_id: siteId,
      transaction_id: params.transactionId,
      amount: params.amountFcfa,
      currency: "XOF",
      description: params.description,
      customer_name: params.customerName,
      customer_phone_number: params.customerPhone,
      notify_url: `${siteUrl}/api/cinetpay/notify`,
      return_url: `${siteUrl}/prestataire/credits/retour?transaction_id=${params.transactionId}`,
      channels: "ALL",
    }),
  });

  const data = await response.json();

  return {
    success: data?.code === "201",
    paymentUrl: data?.data?.payment_url,
    rawResponse: data,
  };
}

export type CinetpayCheckStatus = "ACCEPTED" | "REFUSED" | "PENDING" | "UNKNOWN";

/**
 * Revérifie le statut réel d'une transaction directement auprès de CinetPay.
 * Ne jamais faire confiance au seul contenu d'une notification webhook —
 * toujours revérifier via cet appel avant de créditer quoi que ce soit.
 * Doc : https://docs.cinetpay.com/api/1.0-fr/checkout/verification
 */
export async function checkCinetpayPayment(transactionId: string): Promise<{
  status: CinetpayCheckStatus;
  rawResponse: unknown;
}> {
  const { apikey, siteId } = getCredentials();

  const response = await fetch(`${CINETPAY_BASE_URL}/payment/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey,
      site_id: siteId,
      transaction_id: transactionId,
    }),
  });

  const data = await response.json();
  const status = data?.data?.status;

  if (status === "ACCEPTED") return { status: "ACCEPTED", rawResponse: data };
  if (status === "REFUSED") return { status: "REFUSED", rawResponse: data };
  if (status === "WAITING_FOR_CUSTOMER" || status === "PENDING") {
    return { status: "PENDING", rawResponse: data };
  }
  return { status: "UNKNOWN", rawResponse: data };
}
