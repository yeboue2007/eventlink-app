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
import { changerStatutClientAction } from "@/features/administration/clients/actions/client-admin.actions";
import { LABEL_STATUT } from "@/features/administration/prestataires/components/statut-compte-badge";
import type { Enums } from "@/lib/supabase/database.types";

export function StatutClientSelect({
  profileId,
  statutActuel,
}: {
  profileId: string;
  statutActuel: Enums<"compte_statut">;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      const result = await changerStatutClientAction(profileId, value as Enums<"compte_statut">);
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
