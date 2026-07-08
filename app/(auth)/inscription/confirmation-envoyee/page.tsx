import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ConfirmationEnvoyeePage() {
  return (
    <div className="space-y-5 text-center">
      <h1 className="text-xl font-semibold text-foreground">
        Vérifiez votre boîte mail
      </h1>
      <p className="text-sm text-muted-foreground">
        Nous vous avons envoyé un lien de confirmation. Cliquez dessus pour
        activer votre compte EventLink.
      </p>
      <Button asChild variant="outline" className="w-full">
        <Link href="/connexion">Retour à la connexion</Link>
      </Button>
    </div>
  );
}
