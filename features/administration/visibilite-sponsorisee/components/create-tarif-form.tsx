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
import { createTarifAction } from "@/features/administration/visibilite-sponsorisee/actions/visibilite.actions";
import type { Tables } from "@/lib/supabase/database.types";

export function CreateTarifForm({ categories }: { categories: Tables<"categories">[] }) {
  const [state, formAction, isPending] = useActionState(createTarifAction, undefined);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-4">
      <div className="space-y-1.5">
        <Label htmlFor="pricePerWeekFcfa">Tarif / semaine (FCFA)</Label>
        <Input
          id="pricePerWeekFcfa"
          name="pricePerWeekFcfa"
          type="number"
          min={1}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="categoryId">Catégorie (optionnel)</Label>
        <Select name="categoryId">
          <SelectTrigger id="categoryId"><SelectValue placeholder="Toutes" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ville">Ville (optionnel)</Label>
        <Input id="ville" name="ville" placeholder="Ex. Abidjan" />
      </div>

      {state?.error && (
        <p className="sm:col-span-4 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending} className="sm:col-span-4">
        {isPending ? "Création…" : "Créer le tarif"}
      </Button>
    </form>
  );
}
