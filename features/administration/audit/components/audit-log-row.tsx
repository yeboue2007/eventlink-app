"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { AuditLogEntry } from "@/features/administration/audit/queries/search-audit-log";

export function AuditLogRow({ entry }: { entry: AuditLogEntry }) {
  const [ouvert, setOuvert] = useState(false);
  const metadata = entry.metadata as {
    ancienne_valeur?: unknown;
    nouvelle_valeur?: unknown;
    commentaire?: string | null;
    ip?: string | null;
  } | null;

  return (
    <div className="border-b border-border py-3 last:border-0">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-2">
          {ouvert ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          <Badge variant="secondary">{entry.action}</Badge>
          <span className="text-sm text-foreground">
            {entry.profiles?.full_name ?? "Système"}
          </span>
          <span className="text-xs text-muted-foreground">
            sur {entry.entity_type}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(entry.created_at).toLocaleString("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </span>
      </button>

      {ouvert && (
        <div className="mt-2 ml-6 space-y-1 rounded-lg bg-muted/40 p-3 text-xs">
          {metadata?.commentaire && (
            <p className="text-foreground">{metadata.commentaire}</p>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="font-medium text-muted-foreground">Avant</p>
              <pre className="whitespace-pre-wrap break-all text-muted-foreground">
                {JSON.stringify(metadata?.ancienne_valeur ?? {}, null, 2)}
              </pre>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Après</p>
              <pre className="whitespace-pre-wrap break-all text-muted-foreground">
                {JSON.stringify(metadata?.nouvelle_valeur ?? {}, null, 2)}
              </pre>
            </div>
          </div>
          {metadata?.ip && (
            <p className="text-muted-foreground">Adresse IP : {metadata.ip}</p>
          )}
          {entry.entity_id && (
            <p className="text-muted-foreground">ID concerné : {entry.entity_id}</p>
          )}
        </div>
      )}
    </div>
  );
}
