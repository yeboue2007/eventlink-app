"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { initiateSubscriptionAction } from "@/features/abonnements/actions/initiate-subscription.actions";

export function SubscribeButton({
  planId,
  amountFcfa,
  planLabel,
  label = "S'abonner",
}: {
  planId: string;
  amountFcfa: number;
  planLabel: string;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await initiateSubscriptionAction(planId, amountFcfa, planLabel);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Button variant="primary" className="w-full" disabled={isPending} onClick={handleClick}>
      {isPending ? "Redirection…" : label}
    </Button>
  );
}
