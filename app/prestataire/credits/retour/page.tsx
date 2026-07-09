import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyAndFinalizeCinetpayTransaction } from "@/features/credits/lib/finalize-transaction";

export default async function RetourPaiementPage({
  searchParams,
}: {
  searchParams: Promise<{ transaction_id?: string }>;
}) {
  const { transaction_id } = await searchParams;

  const resultat = transaction_id
    ? await verifyAndFinalizeCinetpayTransaction(transaction_id)
    : "erreur";

  const config = {
    credite: {
      icon: CheckCircle2,
      color: "text-success",
      titre: "Paiement confirmé",
      description: "Vos crédits ont été ajoutés à votre wallet.",
    },
    echoue: {
      icon: XCircle,
      color: "text-destructive",
      titre: "Paiement refusé",
      description: "Le paiement n'a pas abouti. Vous pouvez réessayer.",
    },
    en_attente: {
      icon: Clock,
      color: "text-warning",
      titre: "Paiement en cours de confirmation",
      description:
        "Certains opérateurs mobile money confirment avec un léger délai. Votre solde sera mis à jour automatiquement dès confirmation.",
    },
    erreur: {
      icon: XCircle,
      color: "text-destructive",
      titre: "Impossible de vérifier ce paiement",
      description: "Contactez le support si le montant a bien été débité.",
    },
  }[resultat];

  const Icon = config.icon;

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <Card className="w-full">
        <CardHeader className="items-center">
          <Icon className={`size-12 ${config.color}`} />
          <CardTitle>{config.titre}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{config.description}</p>
          <Button asChild variant="primary" className="w-full">
            <Link href="/prestataire/credits">Retour à mes crédits</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
