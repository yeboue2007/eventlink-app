"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { respondToOffreAction } from "@/features/offres/actions/respond-to-offre.actions";
import { OffreStatusBadge } from "@/features/offres/components/offre-status-badge";
import type { OffreAvecLots } from "@/features/offres/queries/list-offres";

function formatFcfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

export function OffreCard({ offre, demandeId }: { offre: OffreAvecLots; demandeId: string }) {
  const [isPending, startTransition] = useTransition();

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

        {peutRepondre && (
          <div className="flex gap-2 pt-2">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
