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
import { createCategoryAction } from "@/features/administration/categories/actions/category.actions";
import type { Tables } from "@/lib/supabase/database.types";

export function CreateCategoryForm({
  categoriesRacines,
}: {
  categoriesRacines: Tables<"categories">[];
}) {
  const [state, formAction, isPending] = useActionState(createCategoryAction, undefined);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="label">Libellé</Label>
        <Input id="label" name="label" placeholder="Ex. Photographes" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" placeholder="ex. photographes" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="parentId">Catégorie parente (optionnel)</Label>
        <Select name="parentId">
          <SelectTrigger>
            <SelectValue placeholder="Aucune (catégorie racine)" />
          </SelectTrigger>
          <SelectContent>
            {categoriesRacines.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="displayOrder">Ordre d&rsquo;affichage</Label>
        <Input id="displayOrder" name="displayOrder" type="number" defaultValue={0} />
      </div>

      {state?.error && (
        <p className="sm:col-span-2 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending} className="sm:col-span-2">
        {isPending ? "Création…" : "Ajouter la catégorie"}
      </Button>
    </form>
  );
}
