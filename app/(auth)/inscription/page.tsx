import Link from "next/link";
import { Briefcase, PartyPopper } from "lucide-react";

export default function InscriptionPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold text-foreground">Créer un compte</h1>
        <p className="text-sm text-muted-foreground">
          Quel est votre profil sur EventLink ?
        </p>
      </div>

      <div className="grid gap-3">
        <Link
          href="/inscription/client"
          className="flex items-center gap-4 rounded-lg border border-input p-4 text-left transition-colors hover:border-primary hover:bg-muted"
        >
          <PartyPopper className="size-6 text-el-violet" />
          <span>
            <span className="block font-medium text-foreground">
              J&rsquo;organise un événement
            </span>
            <span className="block text-sm text-muted-foreground">
              Publiez une demande et recevez des offres
            </span>
          </span>
        </Link>

        <Link
          href="/inscription/prestataire"
          className="flex items-center gap-4 rounded-lg border border-input p-4 text-left transition-colors hover:border-primary hover:bg-muted"
        >
          <Briefcase className="size-6 text-el-orange" />
          <span>
            <span className="block font-medium text-foreground">
              Je suis prestataire événementiel
            </span>
            <span className="block text-sm text-muted-foreground">
              Recevez des demandes ciblées sur vos services
            </span>
          </span>
        </Link>
      </div>

      <p className="text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
