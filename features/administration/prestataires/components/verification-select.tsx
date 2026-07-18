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
import { changerVerificationAction } from "@/features/administration/prestataires/actions/prestataire-admin.actions";
import type { Enums } from "@/lib/supabase/database.types";

const OPTIONS = [
  { value: "niveau_1", label: "Niveau 1 — Téléphone vérifié" },
  { value: "niveau_2", label: "Niveau 2 — Pièce d'identité" },
  { value: "niveau_3", label: "Niveau 3 — Pro vérifié" },
];

export function VerificationSelect({
  entrepriseId,
  niveauActuel,
}: {
  entrepriseId: string;
  niveauActuel: Enums<"verification_level">;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      const result = await changerVerificationAction(
        entrepriseId,
        value as Enums<"verification_level">
      );
      if (result?.error) toast.error(result.error);
      else toast.success("Niveau de vérification mis à jour.");
    });
  }

  return (
    <Select value={niveauActuel} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-64">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
