"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCampagneAction } from "@/features/administration/visibilite-sponsorisee/actions/visibilite.actions";
import type { Tables } from "@/lib/supabase/database.types";

export function CreateCampagneForm({
  entreprises,
  categories,
}: {
  entreprises: Pick<Tables<"entreprises">, "id" | "nom" | "ville">[];
  categories: Tables<"categories">[];
}) {
  const [state, formAction, isPending] = useActionState(createCampagneAction, undefined);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-3">
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="entrepriseId">Prestataire</Label>
        <Select name="entrepriseId" required>
          <SelectTrigger id="entrepriseId"><SelectValue placeholder="Choisir un prestataire" /></SelectTrigger>
          <SelectContent>
            {entreprises.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.nom}{e.ville ? ` — ${e.ville}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="categoryId">Catégorie</Label>
        <Select name="categoryId" required>
          <SelectTrigger id="categoryId"><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ville">Ville</Label>
        <Input id="ville" name="ville" placeholder="Ex. Abidjan" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="startDate">Date de début</Label>
        <Input id="startDate" name="startDate" type="date" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="endDate">Date de fin</Label>
        <Input id="endDate" name="endDate" type="date" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pricePaidFcfa">Montant payé (FCFA)</Label>
        <Input id="pricePaidFcfa" name="pricePaidFcfa" type="number" min={0} required />
      </div>

      {state?.error && (
        <p className="sm:col-span-3 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending} className="sm:col-span-3">
        {isPending ? "Création…" : "Créer la campagne"}
      </Button>
    </form>
  );
}
