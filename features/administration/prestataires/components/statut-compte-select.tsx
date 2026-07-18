"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { changerStatutEntrepriseAction } from "@/features/administration/prestataires/actions/prestataire-admin.actions";
import { LABEL_STATUT } from "@/features/administration/prestataires/components/statut-compte-badge";
import type { Enums } from "@/lib/supabase/database.types";

export function StatutCompteSelect({
  entrepriseId,
  statutActuel,
}: {
  entrepriseId: string;
  statutActuel: Enums<"compte_statut">;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      const result = await changerStatutEntrepriseAction(
        entrepriseId,
        value as Enums<"compte_statut">
      );
      if (result?.error) toast.error(result.error);
      else toast.success("Statut mis à jour.");
    });
  }

  return (
    <Select value={statutActuel} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(LABEL_STATUT).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
