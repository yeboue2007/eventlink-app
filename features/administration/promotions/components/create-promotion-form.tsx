"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPromotionAction } from "@/features/administration/promotions/actions/promotion.actions";
import type { Tables } from "@/lib/supabase/database.types";

export function CreatePromotionForm({
  categories,
  plans,
}: {
  categories: Tables<"categories">[];
  plans: Tables<"subscription_plans">[];
}) {
  const [state, formAction, isPending] = useActionState(createPromotionAction, undefined);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="label">Libellé</Label>
        <Input id="label" name="label" placeholder="Ex. Lancement -30%" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="code">Code promo (optionnel)</Label>
        <Input id="code" name="code" placeholder="Ex. LANCEMENT30" />
      </div>
      <div className="flex items-end gap-2">
        <Checkbox id="autoApply" name="autoApply" />
        <Label htmlFor="autoApply">Application automatique (sans code)</Label>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="appliesTo">S&rsquo;applique à</Label>
        <Select name="appliesTo" defaultValue="credit_pack">
          <SelectTrigger id="appliesTo"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="credit_pack">Packs de crédits</SelectItem>
            <SelectItem value="abonnement">Abonnements</SelectItem>
            <SelectItem value="les_deux">Les deux</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="discountType">Type de remise</Label>
        <Select name="discountType" defaultValue="pourcentage">
          <SelectTrigger id="discountType"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="pourcentage">Pourcentage</SelectItem>
            <SelectItem value="montant_fixe">Montant fixe (FCFA)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="discountValue">Valeur</Label>
        <Input id="discountValue" name="discountValue" type="number" min={1} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="startDate">Date de début</Label>
        <Input id="startDate" name="startDate" type="date" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="endDate">Date de fin</Label>
        <Input id="endDate" name="endDate" type="date" required />
      </div>
      <div />

      <p className="sm:col-span-3 text-sm font-medium text-muted-foreground">
        Ciblage (laisser vide = tout le monde)
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="targetVille">Ville</Label>
        <Input id="targetVille" name="targetVille" placeholder="Ex. Abidjan" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="targetCategoryId">Catégorie</Label>
        <Select name="targetCategoryId">
          <SelectTrigger id="targetCategoryId"><SelectValue placeholder="Toutes" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="targetMinSeniorityDays">Ancienneté minimum (jours)</Label>
        <Input id="targetMinSeniorityDays" name="targetMinSeniorityDays" type="number" min={0} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="targetRole">Type de compte</Label>
        <Select name="targetRole">
          <SelectTrigger id="targetRole"><SelectValue placeholder="Tous" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="prestataire">Prestataire</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="targetPlanId">Abonnement</Label>
        <Select name="targetPlanId">
          <SelectTrigger id="targetPlanId"><SelectValue placeholder="Tous" /></SelectTrigger>
          <SelectContent>
            {plans.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {state?.error && (
        <p className="sm:col-span-3 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending} className="sm:col-span-3">
        {isPending ? "Création…" : "Créer la promotion"}
      </Button>
    </form>
  );
}
