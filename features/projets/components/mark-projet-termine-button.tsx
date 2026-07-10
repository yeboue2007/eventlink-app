"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { markProjetTermineAction } from "@/features/projets/actions/mark-projet-termine.actions";

export function MarkProjetTermineButton({
  projetId,
  demandeId,
}: {
  projetId: string;
  demandeId: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await markProjetTermineAction(projetId, demandeId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Événement marqué comme terminé — vous pouvez laisser un avis.");
      }
    });
  }

  return (
    <Button variant="outline" size="sm" disabled={isPending} onClick={handleClick}>
      {isPending ? "…" : "Marquer l'événement comme terminé"}
    </Button>
  );
}
