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
import { ICON_LABELS, ICON_SLUGS } from "@/components/marketing/hero-icon-registry";
import { createHeroSlideAction } from "@/features/administration/hero-slides/actions/hero-slide.actions";

export function CreateHeroSlideForm() {
  const [state, formAction, isPending] = useActionState(createHeroSlideAction, undefined);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-4">
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="categorie">Catégorie</Label>
        <Input id="categorie" name="categorie" placeholder="Ex. Baptême" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="iconSlug">Icône de repli</Label>
        <Select name="iconSlug" defaultValue="generic">
          <SelectTrigger id="iconSlug"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ICON_SLUGS.map((slug) => (
              <SelectItem key={slug} value={slug}>{ICON_LABELS[slug]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="alt">Texte alternatif</Label>
        <Input id="alt" name="alt" placeholder="Description pour lecteurs d'écran" required />
      </div>

      {state?.error && (
        <p className="sm:col-span-4 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending} className="sm:col-span-4">
        {isPending ? "Création…" : "Ajouter une diapositive"}
      </Button>
    </form>
  );
}
