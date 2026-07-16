"use server";

import { revalidatePath } from "next/cache";

import { promouvoirAdminSchema } from "@/features/administration/equipe/schemas/equipe.schema";
import { logAdminAction } from "@/features/administration/audit/log-admin-action";
import { requireAdminAccess } from "@/features/administration/permissions/guard";
import type { AdminRole } from "@/features/administration/permissions/permissions";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";

export type EquipeActionState = { error?: string; success?: boolean } | undefined;

/**
 * Promeut un compte existant (client ou prestataire) au rang d'administrateur
 * avec un rôle fixe donné. Réservé au Super Administrateur.
 */
export async function promouvoirAdminAction(
  _prevState: EquipeActionState,
  formData: FormData
): Promise<EquipeActionState> {
  await requireAdminAccess("equipe", "gestion");

  const parsed = promouvoirAdminSchema.safeParse({
    email: formData.get("email"),
    adminRole: formData.get("adminRole"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const service = createServiceRoleClient();

  // L'API admin ne permet pas de rechercher directement par e-mail dans
  // toutes les versions — on parcourt les utilisateurs (acceptable au
  // volume actuel ; à revoir avec une vraie recherche lors du module
  // "Gestion des clients/prestataires").
  const { data: usersPage, error: listError } = await service.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) {
    return { error: "Impossible de rechercher cet utilisateur." };
  }

  const utilisateur = usersPage.users.find(
    (u) => u.email?.toLowerCase() === parsed.data.email.toLowerCase()
  );
  if (!utilisateur) {
    return { error: "Aucun compte trouvé avec cette adresse e-mail." };
  }

  const { data: ancienProfile } = await service
    .from("profiles")
    .select("role, admin_role")
    .eq("id", utilisateur.id)
    .maybeSingle();

  const { error: updateError } = await service
    .from("profiles")
    .update({ role: "admin", admin_role: parsed.data.adminRole })
    .eq("id", utilisateur.id);

  if (updateError) {
    return { error: "Impossible de promouvoir ce compte." };
  }

  await service.auth.admin.updateUserById(utilisateur.id, {
    app_metadata: { role: "admin" },
  });

  await logAdminAction({
    action: "promotion_admin",
    entityType: "profiles",
    entityId: utilisateur.id,
    ancienneValeur: ancienProfile,
    nouvelleValeur: { role: "admin", admin_role: parsed.data.adminRole },
    commentaire: `Promotion de ${parsed.data.email} en ${parsed.data.adminRole}`,
  });

  revalidatePath("/admin/equipe");
  return { success: true };
}

export async function changerRoleAdminAction(profileId: string, nouveauRole: AdminRole) {
  const current = await requireAdminAccess("equipe", "gestion");

  if (current.user.id === profileId) {
    return { error: "Vous ne pouvez pas modifier votre propre rôle." };
  }

  const supabase = await createClient();
  const { data: ancienProfile } = await supabase
    .from("profiles")
    .select("admin_role")
    .eq("id", profileId)
    .maybeSingle();

  const { error } = await supabase
    .from("profiles")
    .update({ admin_role: nouveauRole })
    .eq("id", profileId);

  if (error) {
    return { error: "Impossible de modifier ce rôle." };
  }

  await logAdminAction({
    action: "changement_role_admin",
    entityType: "profiles",
    entityId: profileId,
    ancienneValeur: ancienProfile,
    nouvelleValeur: { admin_role: nouveauRole },
  });

  revalidatePath("/admin/equipe");
  return { success: true };
}

/** Retire les droits d'administration (repasse le compte en client). */
export async function retirerAdminAction(profileId: string) {
  const current = await requireAdminAccess("equipe", "gestion");

  if (current.user.id === profileId) {
    return { error: "Vous ne pouvez pas retirer vos propres droits d'administration." };
  }

  const service = createServiceRoleClient();
  const { data: ancienProfile } = await service
    .from("profiles")
    .select("role, admin_role")
    .eq("id", profileId)
    .maybeSingle();

  const { error } = await service
    .from("profiles")
    .update({ role: "client", admin_role: null })
    .eq("id", profileId);

  if (error) {
    return { error: "Impossible de retirer les droits d'administration." };
  }

  await service.auth.admin.updateUserById(profileId, { app_metadata: { role: "client" } });

  await logAdminAction({
    action: "retrait_admin",
    entityType: "profiles",
    entityId: profileId,
    ancienneValeur: ancienProfile,
    nouvelleValeur: { role: "client", admin_role: null },
  });

  revalidatePath("/admin/equipe");
  return { success: true };
}
