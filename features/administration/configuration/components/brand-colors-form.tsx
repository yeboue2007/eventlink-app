"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateBrandColorsAction } from "@/features/administration/configuration/actions/configuration.actions";
import type { CleCouleurMarque } from "@/features/administration/configuration/queries/list-configuration";

const CHAMPS: { cle: CleCouleurMarque; label: string }[] = [
  { cle: "brand_color_navy", label: "Navy" },
  { cle: "brand_color_violet", label: "Violet" },
  { cle: "brand_color_rose", label: "Rose" },
  { cle: "brand_color_orange", label: "Orange" },
  { cle: "brand_color_gold", label: "Gold" },
];

export function BrandColorsForm({
  couleurs,
}: {
  couleurs: Record<CleCouleurMarque, string>;
}) {
  const [state, formAction, isPending] = useActionState(updateBrandColorsAction, undefined);
  const [valeurs, setValeurs] = useState(couleurs);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-5">
        {CHAMPS.map(({ cle, label }) => (
          <div key={cle} className="space-y-1.5">
            <Label htmlFor={cle}>{label}</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label={`Sélecteur couleur ${label}`}
                value={valeurs[cle]}
                onChange={(e) => setValeurs((v) => ({ ...v, [cle]: e.target.value }))}
                className="h-9 w-9 shrink-0 cursor-pointer rounded border border-border"
              />
              <input
                id={cle}
                name={cle}
                value={valeurs[cle]}
                onChange={(e) => setValeurs((v) => ({ ...v, [cle]: e.target.value }))}
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm font-mono"
                maxLength={7}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        className="h-16 rounded-md"
        style={{
          background: `linear-gradient(90deg, ${valeurs.brand_color_violet} 0%, ${valeurs.brand_color_rose} 55%, ${valeurs.brand_color_orange} 100%)`,
        }}
        aria-hidden
      />

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && <p className="text-sm text-success">Couleurs enregistrées.</p>}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Enregistrement…" : "Enregistrer les couleurs"}
      </Button>
    </form>
  );
}
