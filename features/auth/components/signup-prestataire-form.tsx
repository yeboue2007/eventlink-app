"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpPrestataireAction } from "@/features/auth/actions/auth.actions";

export function SignUpPrestataireForm() {
  const [state, formAction, isPending] = useActionState(
    signUpPrestataireAction,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold text-foreground">
          Inscrire mon entreprise
        </h1>
        <p className="text-sm text-muted-foreground">
          Recevez des demandes ciblées sur toutes vos catégories de services.
          Aucune entreprise formelle requise pour démarrer.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="companyName">Nom de l&rsquo;entreprise / activité</Label>
        <Input id="companyName" name="companyName" required autoComplete="organization" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fullName">Votre nom complet</Label>
        <Input id="fullName" name="fullName" required autoComplete="name" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="07 00 00 00 00"
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ville">Ville</Label>
        <Input id="ville" name="ville" defaultValue="Abidjan" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
        {isPending ? "Création en cours…" : "Créer mon compte prestataire"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Vous organisez un événement ?{" "}
        <Link href="/inscription/client" className="text-primary hover:underline">
          Créez un compte client
        </Link>
      </p>
    </form>
  );
}
