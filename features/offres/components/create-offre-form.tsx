"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createOffreAction } from "@/features/offres/actions/offres.actions";
import type { Tables } from "@/lib/supabase/database.types";

type LotAvecCategorie = Tables<"demande_lots"> & {
  categories: Tables<"categories"> | null;
};

export function CreateOffreForm({
  entrepriseId,
  demandeId,
  lots,
}: {
  entrepriseId: string;
  demandeId: string;
  lots: LotAvecCategorie[];
}) {
  const [state, formAction, isPending] = useActionState(
    createOffreAction.bind(null, entrepriseId),
    undefined
  );

  const estGroupee = lots.length > 1;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="demandeId" value={demandeId} />

      {estGroupee && (
        <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-el-violet">
          Offre groupée : vous couvrez {lots.length} prestations de cette demande
          en une seule offre — coût en crédits réduit par rapport à des offres
          séparées.
        </p>
      )}

      <div className="space-y-3">
        {lots.map((lot) => (
          <div key={lot.id} className="space-y-1.5">
            <input type="hidden" name="demandeLotIds" value={lot.id} />
            <Label htmlFor={`prix_${lot.id}`}>{lot.categories?.label} — prix (FCFA)</Label>
            <Input
              id={`prix_${lot.id}`}
              name={`prix_${lot.id}`}
              type="number"
              min={0}
              required
            />
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message pour le client (optionnel)</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Présentez votre offre, votre expérience, vos conditions…"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Envoi en cours…" : "Envoyer mon offre"}
      </Button>
    </form>
  );
}
