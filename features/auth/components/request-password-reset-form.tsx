"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordResetAction } from "@/features/auth/actions/auth.actions";

export function RequestPasswordResetForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold text-foreground">Mot de passe oublié</h1>
        <p className="text-sm text-muted-foreground">
          Indiquez votre adresse e-mail, nous vous enverrons un lien de réinitialisation.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Adresse e-mail</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
        {isPending ? "Envoi en cours…" : "Envoyer le lien"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/connexion" className="text-primary hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </form>
  );
}
