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

export function ClientFilters() {
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
      router.push(`/admin/clients?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          applyParams({ q, ville });
        }}
      >
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nom du client…"
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

      {(searchParams.get("q") || searchParams.get("ville") || searchParams.get("statut")) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setQ("");
            setVille("");
            router.push("/admin/clients");
          }}
        >
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
