"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReviewAction } from "@/features/avis/actions/create-review.actions";
import { cn } from "@/lib/utils";

export function ReviewForm({
  demandeId,
  entrepriseId,
}: {
  demandeId: string;
  entrepriseId: string;
}) {
  const [state, formAction, isPending] = useActionState(
    createReviewAction.bind(null, demandeId, entrepriseId),
    undefined
  );
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                "size-7 transition-colors",
                (hovered || rating) >= n
                  ? "fill-el-gold text-el-gold"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
      <input type="hidden" name="rating" value={rating} />

      <Textarea
        name="comment"
        placeholder="Votre expérience avec ce prestataire (optionnel)…"
        rows={3}
      />

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending || rating === 0}>
        {isPending ? "Publication…" : "Publier mon avis"}
      </Button>
    </form>
  );
}
