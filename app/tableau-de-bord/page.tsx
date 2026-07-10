import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";

const ESPACE_PAR_ROLE = {
  client: "/client",
  prestataire: "/prestataire",
  admin: "/admin",
} as const;

/**
 * Redirecteur central. Lit le rôle directement en base (comme les layouts
 * de chaque espace) plutôt que depuis le JWT (user.app_metadata) : ce
 * dernier n'est rafraîchi qu'à la reconnexion et peut rester obsolète ou
 * absent (ex. comptes créés avant l'ajout du trigger de synchronisation),
 * ce qui provoquait une boucle de redirection infinie entre cette page et
 * l'espace réel de l'utilisateur.
 */
export default async function TableauDeBordRedirectPage() {
  const current = await getCurrentProfile();

  if (!current) {
    redirect("/connexion");
  }

  redirect(ESPACE_PAR_ROLE[current.profile.role] ?? "/client");
}
