"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { recalculerStatsAction } from "@/features/administration/statistiques/actions/recalculer-stats.actions";

export function RecalculerStatsButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await recalculerStatsAction();
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Statistiques du jour recalculées.");
      }
    });
  }

  return (
    <Button variant="outline" size="sm" disabled={isPending} onClick={handleClick}>
      {isPending ? "Calcul…" : "Recalculer aujourd'hui"}
    </Button>
  );
}
