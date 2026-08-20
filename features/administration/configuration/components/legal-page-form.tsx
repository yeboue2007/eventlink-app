"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateLegalPageAction } from "@/features/administration/configuration/actions/configuration.actions";
import type { Tables } from "@/lib/supabase/database.types";

export function LegalPageForm({ page }: { page: Tables<"legal_pages"> }) {
  const action = updateLegalPageAction.bind(null, page.slug as "cgu" | "confidentialite");
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-3">
      <Textarea
        name="content"
        defaultValue={page.content}
        rows={12}
        className="font-mono text-sm"
      />
      <p className="text-xs text-muted-foreground">
        Format Markdown. Dernière modification :{" "}
        {new Date(page.updated_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
      </p>

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && <p className="text-sm text-success">Page enregistrée.</p>}

      <Button type="submit" variant="outline" disabled={isPending}>
        {isPending ? "Enregistrement…" : `Enregistrer « ${page.title} »`}
      </Button>
    </form>
  );
}
