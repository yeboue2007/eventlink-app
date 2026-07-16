import "server-only";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";
import {
  peutAcceder,
  type ModuleAdmin,
  type NiveauAcces,
} from "@/features/administration/permissions/permissions";

/**
 * À appeler en tête de chaque page admin. Redirige si l'utilisateur n'a pas
 * le niveau d'accès requis pour ce module — la Sidebar cache déjà les liens
 * non autorisés, mais l'accès direct par URL doit être bloqué ici aussi.
 */
export async function requireAdminAccess(module: ModuleAdmin, minimum: NiveauAcces = "lecture") {
  const current = await getCurrentProfile();

  if (!current || current.profile.role !== "admin") {
    redirect("/tableau-de-bord");
  }

  // Un admin sans admin_role assigné n'a par défaut aucun accès (fail-safe).
  if (!current.profile.admin_role || !peutAcceder(current.profile.admin_role, module, minimum)) {
    redirect("/admin?erreur=acces_refuse");
  }

  return current;
}
