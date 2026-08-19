"use server";

import { revalidatePath } from "next/cache";

import { logAdminAction } from "@/features/administration/audit/log-admin-action";
import { requireAdminAccess } from "@/features/administration/permissions/guard";
import {
  campagneSchema,
  tarifSchema,
} from "@/features/administration/visibilite-sponsorisee/schemas/visibilite.schema";
import { createClient } from "@/lib/supabase/server";

export type VisibiliteActionState = { error?: string } | undefined;

const PATH = "/admin/visibilite-sponsorisee";

// ---------------------------------------------------------------------------
// Tarifs
// ---------------------------------------------------------------------------

export async function createTarifAction(
  _prevState: VisibiliteActionState,
  formData: FormData
): Promise<VisibiliteActionState> {
  await requireAdminAccess("visibilite_sponsorisee", "gestion");

  const parsed = tarifSchema.safeParse({
    pricePerWeekFcfa: formData.get("pricePerWeekFcfa"),
    categoryId: formData.get("categoryId") || undefined,
    ville: formData.get("ville") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { data: created, error } = await supabase
    .from("sponsored_visibility_rates")
    .insert({
      price_per_week_fcfa: parsed.data.pricePerWeekFcfa,
      category_id: parsed.data.categoryId ?? null,
      ville: parsed.data.ville || null,
    })
    .select("id")
    .single();

  if (error) return { error: "Impossible de créer le tarif." };

  await logAdminAction({
    action: "creation_tarif_visibilite_sponsorisee",
    entityType: "sponsored_visibility_rates",
    entityId: created.id,
    nouvelleValeur: parsed.data,
  });

  revalidatePath(PATH);
  return undefined;
}

export async function toggleActiveTarifAction(tarifId: string, active: boolean) {
  await requireAdminAccess("visibilite_sponsorisee", "gestion");

  const supabase = await createClient();
  const { error } = await supabase
    .from("sponsored_visibility_rates")
    .update({ active })
    .eq("id", tarifId);

  if (error) return { error: "Impossible de mettre à jour le tarif." };

  await logAdminAction({
    action: active ? "activation_tarif_visibilite_sponsorisee" : "desactivation_tarif_visibilite_sponsorisee",
    entityType: "sponsored_visibility_rates",
    entityId: tarifId,
  });

  revalidatePath(PATH);
  return { success: true };
}

export async function deleteTarifAction(tarifId: string) {
  await requireAdminAccess("visibilite_sponsorisee", "gestion");

  const supabase = await createClient();
  const { error } = await supabase.from("sponsored_visibility_rates").delete().eq("id", tarifId);
  if (error) return { error: "Impossible de supprimer le tarif." };

  await logAdminAction({
    action: "suppression_tarif_visibilite_sponsorisee",
    entityType: "sponsored_visibility_rates",
    entityId: tarifId,
  });

  revalidatePath(PATH);
  return { success: true };
}

// ---------------------------------------------------------------------------
// Campagnes (placements)
// ---------------------------------------------------------------------------

export async function createCampagneAction(
  _prevState: VisibiliteActionState,
  formData: FormData
): Promise<VisibiliteActionState> {
  await requireAdminAccess("visibilite_sponsorisee", "gestion");

  const parsed = campagneSchema.safeParse({
    entrepriseId: formData.get("entrepriseId"),
    categoryId: formData.get("categoryId"),
    ville: formData.get("ville"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    pricePaidFcfa: formData.get("pricePaidFcfa"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { data: created, error } = await supabase
    .from("sponsored_visibility")
    .insert({
      entreprise_id: parsed.data.entrepriseId,
      category_id: parsed.data.categoryId,
      ville: parsed.data.ville,
      start_date: parsed.data.startDate,
      end_date: parsed.data.endDate,
      price_paid_fcfa: parsed.data.pricePaidFcfa,
    })
    .select("id")
    .single();

  if (error) return { error: "Impossible de créer la campagne." };

  await logAdminAction({
    action: "creation_campagne_visibilite_sponsorisee",
    entityType: "sponsored_visibility",
    entityId: created.id,
    nouvelleValeur: parsed.data,
  });

  revalidatePath(PATH);
  return undefined;
}

export async function deleteCampagneAction(campagneId: string) {
  await requireAdminAccess("visibilite_sponsorisee", "gestion");

  const supabase = await createClient();
  const { error } = await supabase.from("sponsored_visibility").delete().eq("id", campagneId);
  if (error) return { error: "Impossible de supprimer la campagne." };

  await logAdminAction({
    action: "suppression_campagne_visibilite_sponsorisee",
    entityType: "sponsored_visibility",
    entityId: campagneId,
  });

  revalidatePath(PATH);
  return { success: true };
}
