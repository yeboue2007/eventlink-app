"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCreditPackAction } from "@/features/administration/credit-packs/actions/credit-pack.actions";

export function CreateCreditPackForm() {
  const [state, formAction, isPending] = useActionState(createCreditPackAction, undefined);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="label">Libellé</Label>
        <Input id="label" name="label" placeholder="Ex. 30 crédits" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="creditsAmount">Nombre de crédits</Label>
        <Input id="creditsAmount" name="creditsAmount" type="number" min={1} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="priceFcfa">Prix (FCFA)</Label>
        <Input id="priceFcfa" name="priceFcfa" type="number" min={0} required />
      </div>

      <div className="flex items-center gap-2 sm:col-span-3">
        <Checkbox id="isPopular" name="isPopular" />
        <Label htmlFor="isPopular">Marquer comme &laquo; le plus populaire &raquo;</Label>
      </div>

      {state?.error && (
        <p className="sm:col-span-3 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending} className="sm:col-span-3">
        {isPending ? "Création…" : "Ajouter le pack"}
      </Button>
    </form>
  );
}
