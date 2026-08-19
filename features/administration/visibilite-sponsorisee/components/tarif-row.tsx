"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  deleteTarifAction,
  toggleActiveTarifAction,
} from "@/features/administration/visibilite-sponsorisee/actions/visibilite.actions";
import type { TarifAvecCategorie } from "@/features/administration/visibilite-sponsorisee/queries/list-visibilite-admin";

export function TarifRow({ tarif }: { tarif: TarifAvecCategorie }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleActiveTarifAction(tarif.id, !tarif.active);
      if (result?.error) toast.error(result.error);
    });
  }

  function handleDelete() {
    if (!confirm("Supprimer définitivement ce tarif ?")) return;
    startTransition(async () => {
      const result = await deleteTarifAction(tarif.id);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">
        {new Intl.NumberFormat("fr-FR").format(tarif.price_per_week_fcfa)} FCFA / semaine
      </TableCell>
      <TableCell className="text-muted-foreground">
        {tarif.categories?.label ?? "Toutes catégories"}
      </TableCell>
      <TableCell className="text-muted-foreground">{tarif.ville ?? "Toutes villes"}</TableCell>
      <TableCell>
        <Badge variant={tarif.active ? "success" : "outline"}>
          {tarif.active ? "Actif" : "Inactif"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={isPending} onClick={handleToggle}>
            {tarif.active ? "Désactiver" : "Activer"}
          </Button>
          <Button size="sm" variant="ghost" disabled={isPending} onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
