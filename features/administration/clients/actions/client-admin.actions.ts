"use server";

import { revalidatePath } from "next/cache";

import { logAdminAction } from "@/features/administration/audit/log-admin-action";
import { requireAdminAccess } from "@/features/administration/permissions/guard";
import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/lib/supabase/database.types";

export async function changerStatutClientAction(
  profileId: string,
  nouveauStatut: Enums<"compte_statut">
) {
  await requireAdminAccess("clients", "gestion");

  const supabase = await createClient();
  const { data: ancien } = await supabase
    .from("profiles")
    .select("statut, full_name")
    .eq("id", profileId)
    .maybeSingle();

  const { error } = await supabase
    .from("profiles")
    .update({ statut: nouveauStatut })
    .eq("id", profileId);

  if (error) {
    return { error: "Impossible de mettre à jour le statut." };
  }

  await logAdminAction({
    action: "changement_statut_client",
    entityType: "profiles",
    entityId: profileId,
    ancienneValeur: { statut: ancien?.statut },
    nouvelleValeur: { statut: nouveauStatut },
    commentaire: `${ancien?.full_name} : ${ancien?.statut} -> ${nouveauStatut}`,
  });

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${profileId}`);
  return { success: true };
}
