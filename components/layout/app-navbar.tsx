import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions/auth.actions";

const LABEL_ROLE = {
  client: "Client",
  prestataire: "Prestataire",
  admin: "Administrateur",
} as const;

export function AppNavbar({
  role,
  homeHref,
}: {
  role: keyof typeof LABEL_ROLE;
  homeHref: string;
}) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href={homeHref} className="flex items-center gap-2">
          <Image
            src="/brand/eventlink-logo.png"
            alt="EventLink"
            width={140}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        <div className="flex items-center gap-3">
          <Badge variant="trust">{LABEL_ROLE[role]}</Badge>
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="sm">
              Déconnexion
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
