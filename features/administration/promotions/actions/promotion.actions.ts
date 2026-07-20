"use server";

import { revalidatePath } from "next/cache";

import { logAdminAction } from "@/features/administration/audit/log-admin-action";
import { requireAdminAccess } from "@/features/administration/permissions/guard";
import { promotionSchema } from "@/features/administration/promotions/schemas/promotion.schema";
import { createClient } from "@/lib/supabase/server";

export type PromotionActionState = { error?: string } | undefined;

function parseForm(formData: FormData) {
  return promotionSchema.safeParse({
    label: formData.get("label"),
    code: formData.get("code") || undefined,
    appliesTo: formData.get("appliesTo"),
    discountType: formData.get("discountType"),
    discountValue: formData.get("discountValue"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    autoApply: formData.get("autoApply") === "on",
    targetVille: formData.get("targetVille") || undefined,
    targetCategoryId: formData.get("targetCategoryId") || undefined,
    targetMinSeniorityDays: formData.get("targetMinSeniorityDays") || undefined,
    targetRole: formData.get("targetRole") || undefined,
    targetPlanId: formData.get("targetPlanId") || undefined,
  });
}

export async function createPromotionAction(
  _prevState: PromotionActionState,
  formData: FormData
): Promise<PromotionActionState> {
  await requireAdminAccess("promotions", "gestion");

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { data: created, error } = await supabase
    .from("promotions")
    .insert({
      label: parsed.data.label,
      code: parsed.data.code || null,
      applies_to: parsed.data.appliesTo,
      discount_type: parsed.data.discountType,
      discount_value: parsed.data.discountValue,
      start_date: parsed.data.startDate,
      end_date: parsed.data.endDate,
      auto_apply: parsed.data.autoApply ?? false,
      target_ville: parsed.data.targetVille || null,
      target_category_id: parsed.data.targetCategoryId ?? null,
      target_min_seniority_days: parsed.data.targetMinSeniorityDays ?? null,
      target_role: parsed.data.targetRole || null,
      target_plan_id: parsed.data.targetPlanId || null,
    })
    .select("id")
    .single();

  if (error) {
    return {
      error: error.code === "23505" ? "Ce code promo existe déjà." : "Impossible de créer la promotion.",
    };
  }

  await logAdminAction({
    action: "creation_promotion",
    entityType: "promotions",
    entityId: created.id,
    nouvelleValeur: parsed.data,
  });

  revalidatePath("/admin/promotions");
  return undefined;
}

export async function toggleActivePromotionAction(promotionId: string, active: boolean) {
  await requireAdminAccess("promotions", "gestion");

  const supabase = await createClient();
  const { error } = await supabase.from("promotions").update({ active }).eq("id", promotionId);
  if (error) return { error: "Impossible de mettre à jour la promotion." };

  await logAdminAction({
    action: active ? "activation_promotion" : "desactivation_promotion",
    entityType: "promotions",
    entityId: promotionId,
  });

  revalidatePath("/admin/promotions");
  return { success: true };
}

export async function deletePromotionAction(promotionId: string) {
  await requireAdminAccess("promotions", "gestion");

  const supabase = await createClient();
  const { error } = await supabase.from("promotions").delete().eq("id", promotionId);
  if (error) return { error: "Impossible de supprimer la promotion." };

  await logAdminAction({
    action: "suppression_promotion",
    entityType: "promotions",
    entityId: promotionId,
  });

  revalidatePath("/admin/promotions");
  return { success: true };
}
