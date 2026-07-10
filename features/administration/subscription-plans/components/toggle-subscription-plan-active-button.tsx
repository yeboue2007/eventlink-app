"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { toggleSubscriptionPlanActiveAction } from "@/features/administration/subscription-plans/actions/subscription-plan.actions";

export function ToggleSubscriptionPlanActiveButton({
  planId,
  active,
}: {
  planId: string;
  active: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant={active ? "outline" : "primary"}
      disabled={isPending}
      onClick={() => startTransition(() => toggleSubscriptionPlanActiveAction(planId, !active))}
    >
      {active ? "Désactiver" : "Activer"}
    </Button>
  );
}
