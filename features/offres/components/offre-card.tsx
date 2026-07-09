"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageThread } from "@/features/messagerie/components/message-thread";
import type { MessageAvecAuteur } from "@/features/messagerie/queries/list-messages";
import { respondToOffreAction } from "@/features/offres/actions/respond-to-offre.actions";
import { OffreStatusBadge } from "@/features/offres/components/offre-status-badge";
import type { OffreAvecLots } from "@/features/offres/queries/list-offres";

function formatFcfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

export function OffreCard({
  offre,
  demandeId,
  currentUserId,
  initialMessages,
  revalidateBasePath,
}: {
  offre: OffreAvecLots;
  demandeId: string;
  currentUserId: string;
  initialMessages: MessageAvecAuteur[];
  revalidateBasePath: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [showThread, setShowThread] = useState(false);

  function respond(decision: "acceptee" | "refusee") {
    startTransition(async () => {
      const result = await respondToOffreAction(offre.id, demandeId, decision);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(decision === "acceptee" ? "Offre acceptée" : "Offre refusée");
      }
    });
  }

  const peutRepondre = offre.status === "envoyee" || offre.status === "vue";
  const conversationDisponible = offre.status !== "refusee" && offre.status !== "retiree";

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{offre.entreprises?.nom}</CardTitle>
        <OffreStatusBadge status={offre.status} />
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-lg font-semibold text-el-violet">
          {formatFcfa(offre.total_price)}
        </p>

        <div className="space-y-1">
          {offre.offre_lots.map((lot) => (
            <p key={lot.id} className="text-sm text-muted-foreground">
              {lot.demande_lots?.categories?.label} —{" "}
              {formatFcfa(lot.prix_lot)}
            </p>
          ))}
        </div>

        {offre.message && (
          <p className="rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
            {offre.message}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {peutRepondre && (
            <>
              <Button
                size="sm"
                variant="primary"
                disabled={isPending}
                onClick={() => respond("acceptee")}
              >
                Accepter
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => respond("refusee")}
              >
                Refuser
              </Button>
            </>
          )}
          {conversationDisponible && (
            <Button size="sm" variant="ghost" onClick={() => setShowThread((v) => !v)}>
              {showThread ? "Masquer la conversation" : "Voir la conversation"}
              {initialMessages.length > 0 && ` (${initialMessages.length})`}
            </Button>
          )}
        </div>

        {showThread && conversationDisponible && (
          <div className="pt-2">
            <MessageThread
              demandeId={demandeId}
              offreId={offre.id}
              currentUserId={currentUserId}
              initialMessages={initialMessages}
              revalidateBasePath={revalidateBasePath}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
