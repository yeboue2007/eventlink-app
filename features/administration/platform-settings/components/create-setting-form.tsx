"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPlatformSettingAction } from "@/features/administration/platform-settings/actions/platform-setting.actions";

export function CreateSettingForm() {
  const [state, formAction, isPending] = useActionState(createPlatformSettingAction, undefined);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="key">Clé</Label>
        <Input id="key" name="key" placeholder="ex. max_photos_par_entreprise" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="value">Valeur</Label>
        <Input id="value" name="value" placeholder="ex. 20" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description (optionnel)</Label>
        <Input id="description" name="description" />
      </div>

      {state?.error && (
        <p className="sm:col-span-3 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending} className="sm:col-span-3">
        {isPending ? "Création…" : "Ajouter le paramètre"}
      </Button>
    </form>
  );
}
