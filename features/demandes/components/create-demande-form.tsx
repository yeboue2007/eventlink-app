"use client";

import { useActionState, useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createDemandeAction } from "@/features/demandes/actions/demandes.actions";
import { improveDescriptionAction } from "@/features/ia/actions/improve-description.actions";
import type { Tables } from "@/lib/supabase/database.types";

const TYPES_EVENEMENT = [
  "Mariage",
  "Anniversaire",
  "Séminaire / Conférence",
  "Concert",
  "Baptême",
  "Autre",
];

export function CreateDemandeForm({
  categories,
}: {
  categories: Tables<"categories">[];
}) {
  const [state, formAction, isPending] = useActionState(createDemandeAction, undefined);
  const [description, setDescription] = useState("");
  const [isImproving, startImproving] = useTransition();

  function ameliorerAvecIA() {
    startImproving(async () => {
      const result = await improveDescriptionAction(description);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setDescription(result.suggestion);
        toast.success("Description reformulée par l'assistant.");
      }
    });
  }

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Votre événement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="titre">Titre de l&rsquo;événement</Label>
            <Input
              id="titre"
              name="titre"
              placeholder="Ex. Mariage de Fatou et Karim"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="typeEvenement">Type d&rsquo;événement</Label>
              <select
                id="typeEvenement"
                name="typeEvenement"
                className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                defaultValue=""
              >
                <option value="" disabled>
                  Sélectionnez un type
                </option>
                {TYPES_EVENEMENT.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dateEvenement">Date de l&rsquo;événement</Label>
              <Input id="dateEvenement" name="dateEvenement" type="date" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ville">Ville</Label>
              <Input id="ville" name="ville" defaultValue="Abidjan" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lieu">Lieu (optionnel)</Label>
              <Input id="lieu" name="lieu" placeholder="Ex. Salle des fêtes de Cocody" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prestations recherchées</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">
            Sélectionnez tout ce dont vous avez besoin — un prestataire couvrant
            plusieurs prestations pourra vous envoyer une seule offre groupée.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-secondary"
              >
                <Checkbox name="categoryIds" value={category.id} />
                {category.label}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget et détails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="budgetMin">Budget minimum (FCFA)</Label>
              <Input id="budgetMin" name="budgetMin" type="number" min={0} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="budgetMax">Budget maximum (FCFA)</Label>
              <Input id="budgetMax" name="budgetMax" type="number" min={0} required />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isImproving || description.trim().length < 10}
                onClick={ameliorerAvecIA}
              >
                <Sparkles className="size-3.5" />
                {isImproving ? "Reformulation…" : "Améliorer avec l'IA"}
              </Button>
            </div>
            <Textarea
              id="description"
              name="description"
              placeholder="Décrivez votre besoin plus en détail…"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={isPending}>
        {isPending ? "Publication en cours…" : "Publier ma demande"}
      </Button>
    </form>
  );
}
