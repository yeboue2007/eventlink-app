"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { deleteCampagneAction } from "@/features/administration/visibilite-sponsorisee/actions/visibilite.actions";
import type { CampagneAvecRelations } from "@/features/administration/visibilite-sponsorisee/queries/list-visibilite-admin";

function statutCampagne(campagne: CampagneAvecRelations): "à venir" | "en cours" | "terminée" {
  const now = new Date();
  const start = new Date(campagne.start_date);
  const end = new Date(campagne.end_date);
  if (now < start) return "à venir";
  if (now > end) return "terminée";
  return "en cours";
}

const VARIANT_STATUT: Record<string, "success" | "outline" | "secondary"> = {
  "à venir": "secondary",
  "en cours": "success",
  terminée: "outline",
};

export function CampagneRow({ campagne }: { campagne: CampagneAvecRelations }) {
  const [isPending, startTransition] = useTransition();
  const statut = statutCampagne(campagne);

  function handleDelete() {
    if (!confirm(`Supprimer la campagne de "${campagne.entreprises?.nom ?? "ce prestataire"}" ?`)) return;
    startTransition(async () => {
      const result = await deleteCampagneAction(campagne.id);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">
        {campagne.entreprises?.nom ?? "—"}
      </TableCell>
      <TableCell className="text-muted-foreground">{campagne.categories?.label ?? "—"}</TableCell>
      <TableCell className="text-muted-foreground">{campagne.ville}</TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {new Date(campagne.start_date).toLocaleDateString("fr-FR")} →{" "}
        {new Date(campagne.end_date).toLocaleDateString("fr-FR")}
      </TableCell>
      <TableCell>{new Intl.NumberFormat("fr-FR").format(campagne.price_paid_fcfa)} FCFA</TableCell>
      <TableCell>
        <Badge variant={VARIANT_STATUT[statut]}>{statut}</Badge>
      </TableCell>
      <TableCell>
        <Button size="sm" variant="ghost" disabled={isPending} onClick={handleDelete}>
          Supprimer
        </Button>
      </TableCell>
    </TableRow>
  );
}
