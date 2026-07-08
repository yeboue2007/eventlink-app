import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function MotDePasseOublieEnvoyePage() {
  return (
    <div className="space-y-5 text-center">
      <h1 className="text-xl font-semibold text-foreground">E-mail envoyé</h1>
      <p className="text-sm text-muted-foreground">
        Si un compte existe avec cette adresse, vous recevrez un lien pour
        réinitialiser votre mot de passe d&rsquo;ici quelques minutes.
      </p>
      <Button asChild variant="outline" className="w-full">
        <Link href="/connexion">Retour à la connexion</Link>
      </Button>
    </div>
  );
}
