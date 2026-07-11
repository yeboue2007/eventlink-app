"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { updateCategoriesAction } from "@/features/entreprises/actions/update-categories.actions";
import type { Tables } from "@/lib/supabase/database.types";

export function UpdateCategoriesForm({
  entrepriseId,
  categories,
  selectedIds,
}: {
  entrepriseId: string;
  categories: Tables<"categories">[];
  selectedIds: number[];
}) {
  const [state, formAction, isPending] = useActionState(
    updateCategoriesAction.bind(null, entrepriseId),
    undefined
  );

  // État contrôlé (plutôt que defaultChecked) : garantit que les cases
  // reflètent toujours fidèlement ce qui a réellement été enregistré,
  // au lieu de dépendre du cycle de re-render d'un input non contrôlé
  // (ce qui donnait l'impression trompeuse que "ça ne s'enregistre pas").
  const [checked, setChecked] = useState<Set<number>>(new Set(selectedIds));

  useEffect(() => {
    if (state?.success) {
      toast.success("Vos catégories ont été mises à jour");
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  function toggle(categoryId: number) {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Sélectionnez toutes les prestations que vous proposez — vous serez
        notifié dès qu&rsquo;une demande correspond à l&rsquo;une d&rsquo;elles, et pourrez
        envoyer une offre groupée si plusieurs lots d&rsquo;une même demande vous
        concernent.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {categories.map((category) => (
          <label
            key={category.id}
            className="flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-secondary"
          >
            <Checkbox
              name="categoryIds"
              value={category.id}
              checked={checked.has(category.id)}
              onCheckedChange={() => toggle(category.id)}
            />
            {category.label}
          </label>
        ))}
      </div>

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Enregistrement…" : "Enregistrer mes catégories"}
      </Button>
    </form>
  );
}
