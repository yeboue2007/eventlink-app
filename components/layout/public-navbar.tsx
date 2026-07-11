import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/marketing/logo";
import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";

export async function PublicNavbar() {
  const current = await getCurrentProfile();

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/">
          <Logo size="sm" />
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/recherche">Explorer les prestataires</Link>
          </Button>

          {current ? (
            <Button asChild variant="primary" size="sm">
              <Link href="/tableau-de-bord">Mon espace</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/connexion">Se connecter</Link>
              </Button>
              <Button asChild variant="primary" size="sm">
                <Link href="/inscription">Créer un compte</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
