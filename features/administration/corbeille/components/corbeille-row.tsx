"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  purgeItemAction,
  restoreItemAction,
} from "@/features/administration/corbeille/actions/corbeille.actions";
import type { ElementCorbeille } from "@/features/administration/corbeille/queries/list-corbeille";

const LABEL_TABLE: Record<ElementCorbeille["table"], string> = {
  demandes: "Demande",
  projets: "Projet",
  offres: "Offre",
  entreprises: "Entreprise",
  agences: "Agence",
};

export function CorbeilleRow({ element }: { element: ElementCorbeille }) {
  const [isPending, startTransition] = useTransition();

  function handleRestore() {
    startTransition(async () => {
      const result = await restoreItemAction(element.table, element.id);
      if (result?.error) toast.error(result.error);
      else toast.success("Élément restauré.");
    });
  }

  function handlePurge() {
    if (
      !confirm(
        `Supprimer définitivement "${element.label}" ? Cette action est irréversible.`
      )
    )
      return;
    startTransition(async () => {
      const result = await purgeItemAction(element.table, element.id);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <TableRow>
      <TableCell>
        <Badge variant="outline">{LABEL_TABLE[element.table]}</Badge>
      </TableCell>
      <TableCell>
        <p className="font-medium text-foreground">{element.label}</p>
        <p className="text-xs text-muted-foreground">{element.sousLabel}</p>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {new Date(element.deletedAt).toLocaleString("fr-FR", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={isPending} onClick={handleRestore}>
            Restaurer
          </Button>
          <Button size="sm" variant="ghost" disabled={isPending} onClick={handlePurge}>
            Supprimer définitivement
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
