"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSubscriptionPlanAction } from "@/features/administration/subscription-plans/actions/subscription-plan.actions";

export function CreateSubscriptionPlanForm() {
  const [state, formAction, isPending] = useActionState(
    createSubscriptionPlanAction,
    undefined
  );

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="label">Libellé</Label>
        <Input id="label" name="label" placeholder="Ex. Pro" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" placeholder="ex. pro" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="priceFcfa">Prix mensuel (FCFA)</Label>
        <Input id="priceFcfa" name="priceFcfa" type="number" min={0} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="creditsIncluded">Crédits inclus / mois</Label>
        <Input id="creditsIncluded" name="creditsIncluded" type="number" min={0} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="badgeLabel">Badge (optionnel)</Label>
        <Input id="badgeLabel" name="badgeLabel" placeholder="Ex. Populaire" />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="avantages">Avantages (un par ligne)</Label>
        <Textarea id="avantages" name="avantages" rows={4} placeholder={"Profil prioritaire\nStatistiques avancées"} />
      </div>

      {state?.error && (
        <p className="sm:col-span-2 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending} className="sm:col-span-2">
        {isPending ? "Création…" : "Ajouter le plan"}
      </Button>
    </form>
  );
}
