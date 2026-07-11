"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateEntrepriseProfileAction } from "@/features/entreprises/actions/update-profile.actions";
import type { Tables } from "@/lib/supabase/database.types";

export function UpdateEntrepriseProfileForm({
  entreprise,
}: {
  entreprise: Tables<"entreprises">;
}) {
  const [state, formAction, isPending] = useActionState(
    updateEntrepriseProfileAction.bind(null, entreprise.id),
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="nom">Nom de l&rsquo;entreprise / activité</Label>
        <Input id="nom" name="nom" defaultValue={entreprise.nom} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ville">Ville</Label>
        <Input id="ville" name="ville" defaultValue={entreprise.ville ?? ""} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Présentation (visible publiquement)</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={5}
          defaultValue={entreprise.bio ?? ""}
          placeholder="Présentez votre activité, votre expérience, ce qui vous distingue…"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-sm text-success" role="status">
          Profil mis à jour.
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
