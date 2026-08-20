"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LABEL_TYPE: Record<string, string> = {
  inscription: "Inscription",
  achat_credit: "Achat de crédits",
  achat_abonnement: "Achat d'abonnement",
  paiement_echoue: "Paiement échoué",
  job_cron: "Job planifié",
  erreur: "Erreur",
};

const SEVERITES = [
  { value: "info", label: "Info" },
  { value: "warning", label: "Avertissement" },
  { value: "error", label: "Erreur" },
];

export function JournalSystemeFilters({ eventTypes }: { eventTypes: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function applyParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    startTransition(() => {
      router.push(`/admin/journal-systeme?${params.toString()}`);
    });
  }

  const hasFilters = searchParams.get("type") || searchParams.get("severite");

  return (
    <div className="flex flex-wrap gap-2">
      <Select
        value={searchParams.get("type") ?? undefined}
        onValueChange={(v) => applyParams({ type: v })}
      >
        <SelectTrigger className="w-52"><SelectValue placeholder="Type d'événement" /></SelectTrigger>
        <SelectContent>
          {eventTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {LABEL_TYPE[type] ?? type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("severite") ?? undefined}
        onValueChange={(v) => applyParams({ severite: v })}
      >
        <SelectTrigger className="w-44"><SelectValue placeholder="Sévérité" /></SelectTrigger>
        <SelectContent>
          {SEVERITES.map((s) => (
            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/journal-systeme")}>
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
