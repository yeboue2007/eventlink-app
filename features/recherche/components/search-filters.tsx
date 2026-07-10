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
import type { Tables } from "@/lib/supabase/database.types";

export function SearchFilters({ categories }: { categories: Tables<"categories">[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [ville, setVille] = useState(searchParams.get("ville") ?? "");

  function applyParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page"); // toute modification de filtre repart de la page 1
    startTransition(() => {
      router.push(`/recherche?${params.toString()}`);
    });
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
      onSubmit={(e) => {
        e.preventDefault();
        applyParams({ q, ville });
      }}
    >
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Nom du prestataire…"
        className="sm:max-w-xs"
      />
      <Input
        value={ville}
        onChange={(e) => setVille(e.target.value)}
        placeholder="Ville"
        className="sm:max-w-[160px]"
      />

      <Select
        value={searchParams.get("categorie") ?? undefined}
        onValueChange={(value) => applyParams({ categorie: value })}
      >
        <SelectTrigger className="sm:w-56">
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" variant="primary" disabled={isPending}>
        Rechercher
      </Button>

      {(searchParams.get("q") || searchParams.get("ville") || searchParams.get("categorie")) && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setQ("");
            setVille("");
            router.push("/recherche");
          }}
        >
          Réinitialiser
        </Button>
      )}
    </form>
  );
}
