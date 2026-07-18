"use server";

import { revalidatePath } from "next/cache";

import { logAdminAction } from "@/features/administration/audit/log-admin-action";
import { requireAdminAccess } from "@/features/administration/permissions/guard";
import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/lib/supabase/database.types";

export async function changerStatutEntrepriseAction(
  entrepriseId: string,
  nouveauStatut: Enums<"compte_statut">,
  commentaire?: string
) {
  await requireAdminAccess("prestataires", "gestion");

  const supabase = await createClient();
  const { data: ancien } = await supabase
    .from("entreprises")
    .select("statut, nom")
    .eq("id", entrepriseId)
    .maybeSingle();

  const { error } = await supabase
    .from("entreprises")
    .update({ statut: nouveauStatut })
    .eq("id", entrepriseId);

  if (error) {
    return { error: "Impossible de mettre à jour le statut." };
  }

  await logAdminAction({
    action: "changement_statut_entreprise",
    entityType: "entreprises",
    entityId: entrepriseId,
    ancienneValeur: { statut: ancien?.statut },
    nouvelleValeur: { statut: nouveauStatut },
    commentaire: commentaire || `${ancien?.nom} : ${ancien?.statut} -> ${nouveauStatut}`,
  });

  revalidatePath("/admin/prestataires");
  revalidatePath(`/admin/prestataires/${entrepriseId}`);
  revalidatePath(`/entreprises/${entrepriseId}`);
  return { success: true };
}

export async function changerVerificationAction(
  entrepriseId: string,
  nouveauNiveau: Enums<"verification_level">,
  commentaire?: string
) {
  await requireAdminAccess("prestataires", "gestion");

  const supabase = await createClient();
  const { data: ancien } = await supabase
    .from("entreprises")
    .select("verification_level, nom")
    .eq("id", entrepriseId)
    .maybeSingle();

  const { error } = await supabase
    .from("entreprises")
    .update({ verification_level: nouveauNiveau })
    .eq("id", entrepriseId);

  if (error) {
    return { error: "Impossible de mettre à jour la vérification." };
  }

  await logAdminAction({
    action: "changement_verification_entreprise",
    entityType: "entreprises",
    entityId: entrepriseId,
    ancienneValeur: { verification_level: ancien?.verification_level },
    nouvelleValeur: { verification_level: nouveauNiveau },
    commentaire: commentaire || `${ancien?.nom} : ${ancien?.verification_level} -> ${nouveauNiveau}`,
  });

  revalidatePath(`/admin/prestataires/${entrepriseId}`);
  revalidatePath(`/entreprises/${entrepriseId}`);
  return { success: true };
}
