"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LABEL_STATUT } from "@/features/administration/prestataires/components/statut-compte-badge";
import type { Tables } from "@/lib/supabase/database.types";

const NIVEAUX_VERIFICATION = [
  { value: "niveau_1", label: "Niveau 1 — Téléphone vérifié" },
  { value: "niveau_2", label: "Niveau 2 — Pièce d'identité" },
  { value: "niveau_3", label: "Niveau 3 — Pro vérifié" },
];

const OPTIONS_TRI = [
  { value: "ancienneté", label: "Ancienneté" },
  { value: "nb_offres", label: "Nombre d'offres" },
  { value: "fiabilite", label: "Indice de fiabilité" },
];

export function PrestataireFilters({ categories }: { categories: Tables<"categories">[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [ville, setVille] = useState(searchParams.get("ville") ?? "");

  function applyParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/admin/prestataires?${params.toString()}`);
    });
  }

  return (
    <div className="space-y-3">
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          applyParams({ q, ville });
        }}
      >
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nom du prestataire…"
          className="w-48"
        />
        <Input
          value={ville}
          onChange={(e) => setVille(e.target.value)}
          placeholder="Ville"
          className="w-40"
        />
        <Button type="submit" variant="outline" size="sm">
          Rechercher
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Select
          value={searchParams.get("categorie") ?? undefined}
          onValueChange={(v) => applyParams({ categorie: v })}
        >
          <SelectTrigger className="w-44"><SelectValue placeholder="Catégorie" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("verification") ?? undefined}
          onValueChange={(v) => applyParams({ verification: v })}
        >
          <SelectTrigger className="w-52"><SelectValue placeholder="Vérification" /></SelectTrigger>
          <SelectContent>
            {NIVEAUX_VERIFICATION.map((n) => (
              <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("statut") ?? undefined}
          onValueChange={(v) => applyParams({ statut: v })}
        >
          <SelectTrigger className="w-40"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            {Object.entries(LABEL_STATUT).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("tri") ?? "ancienneté"}
          onValueChange={(v) => applyParams({ tri: v })}
        >
          <SelectTrigger className="w-44"><SelectValue placeholder="Trier par" /></SelectTrigger>
          <SelectContent>
            {OPTIONS_TRI.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(searchParams.get("q") ||
          searchParams.get("ville") ||
          searchParams.get("categorie") ||
          searchParams.get("verification") ||
          searchParams.get("statut")) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQ("");
              setVille("");
              router.push("/admin/prestataires");
            }}
          >
            Réinitialiser
          </Button>
        )}
      </div>
    </div>
  );
}
