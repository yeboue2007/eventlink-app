"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

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

export function AuditFilters({
  actions,
  acteurs,
}: {
  actions: string[];
  acteurs: Pick<Tables<"profiles">, "id" | "full_name">[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function applyParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/admin/audit?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Select
        value={searchParams.get("acteur") ?? undefined}
        onValueChange={(v) => applyParams({ acteur: v })}
      >
        <SelectTrigger className="w-52"><SelectValue placeholder="Administrateur" /></SelectTrigger>
        <SelectContent>
          {acteurs.map((a) => (
            <SelectItem key={a.id} value={a.id}>{a.full_name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("action") ?? undefined}
        onValueChange={(v) => applyParams({ action: v })}
      >
        <SelectTrigger className="w-56"><SelectValue placeholder="Type d'action" /></SelectTrigger>
        <SelectContent>
          {actions.map((a) => (
            <SelectItem key={a} value={a}>{a}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        className="w-40"
        defaultValue={searchParams.get("depuis")?.slice(0, 10) ?? ""}
        onChange={(e) => applyParams({ depuis: e.target.value ? `${e.target.value}T00:00:00Z` : undefined })}
      />
      <Input
        type="date"
        className="w-40"
        defaultValue={searchParams.get("jusqua")?.slice(0, 10) ?? ""}
        onChange={(e) => applyParams({ jusqua: e.target.value ? `${e.target.value}T23:59:59Z` : undefined })}
      />

      {(searchParams.get("acteur") ||
        searchParams.get("action") ||
        searchParams.get("depuis") ||
        searchParams.get("jusqua")) && (
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/audit")}>
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
