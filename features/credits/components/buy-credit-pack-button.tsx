"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { initiatePurchaseAction } from "@/features/credits/actions/initiate-purchase.actions";

export function BuyCreditPackButton({
  packId,
  amountFcfa,
  packLabel,
}: {
  packId: string;
  amountFcfa: number;
  packLabel: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await initiatePurchaseAction(packId, amountFcfa, packLabel);
      if (result?.error) {
        toast.error(result.error);
      }
      // En cas de succès, initiatePurchaseAction redirige déjà vers CinetPay.
    });
  }

  return (
    <Button variant="primary" className="w-full" disabled={isPending} onClick={handleClick}>
      {isPending ? "Redirection…" : "Acheter ce pack"}
    </Button>
  );
}
