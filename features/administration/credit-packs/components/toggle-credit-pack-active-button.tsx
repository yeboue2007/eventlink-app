"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { toggleCreditPackActiveAction } from "@/features/administration/credit-packs/actions/credit-pack.actions";

export function ToggleCreditPackActiveButton({
  packId,
  active,
}: {
  packId: string;
  active: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant={active ? "outline" : "primary"}
      disabled={isPending}
      onClick={() => startTransition(() => toggleCreditPackActiveAction(packId, !active))}
    >
      {active ? "Désactiver" : "Activer"}
    </Button>
  );
}
