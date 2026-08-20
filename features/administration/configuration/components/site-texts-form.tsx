"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSiteTextsAction } from "@/features/administration/configuration/actions/configuration.actions";
import type { CleTexteSite } from "@/features/administration/configuration/queries/list-configuration";

const CHAMPS: { cle: CleTexteSite; label: string }[] = [
  { cle: "site_baseline", label: "Accroche du site" },
  { cle: "site_footer_text", label: "Texte du pied de page" },
  { cle: "site_contact_email", label: "E-mail de contact public" },
];

export function SiteTextsForm({ textes }: { textes: Record<CleTexteSite, string> }) {
  const [state, formAction, isPending] = useActionState(updateSiteTextsAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {CHAMPS.map(({ cle, label }) => (
        <div key={cle} className="space-y-1.5">
          <Label htmlFor={cle}>{label}</Label>
          <Input id={cle} name={cle} defaultValue={textes[cle]} />
        </div>
      ))}

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && <p className="text-sm text-success">Textes enregistrés.</p>}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Enregistrement…" : "Enregistrer les textes"}
      </Button>
    </form>
  );
}
