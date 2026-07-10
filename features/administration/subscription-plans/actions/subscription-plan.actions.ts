"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { subscriptionPlanSchema } from "@/features/administration/subscription-plans/schemas/subscription-plan.schema";

export type SubscriptionPlanActionState = { error?: string } | undefined;

export async function createSubscriptionPlanAction(
  _prevState: SubscriptionPlanActionState,
  formData: FormData
): Promise<SubscriptionPlanActionState> {
  const parsed = subscriptionPlanSchema.safeParse({
    label: formData.get("label"),
    slug: formData.get("slug"),
    priceFcfa: formData.get("priceFcfa"),
    creditsIncluded: formData.get("creditsIncluded"),
    badgeLabel: formData.get("badgeLabel") || undefined,
    avantages: formData.get("avantages") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const avantages = (parsed.data.avantages ?? "")
    .split("\n")
    .map((ligne) => ligne.trim())
    .filter(Boolean);

  const supabase = await createClient();
  const { error } = await supabase.from("subscription_plans").insert({
    label: parsed.data.label,
    slug: parsed.data.slug,
    price_fcfa: parsed.data.priceFcfa,
    credits_included: parsed.data.creditsIncluded,
    badge_label: parsed.data.badgeLabel ?? null,
    features: { avantages },
  });

  if (error) {
    return {
      error: error.code === "23505" ? "Ce slug existe déjà." : "Impossible de créer le plan.",
    };
  }

  revalidatePath("/admin/subscription-plans");
  revalidatePath("/prestataire/abonnement");
  return undefined;
}

export async function toggleSubscriptionPlanActiveAction(planId: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("subscription_plans").update({ active }).eq("id", planId);
  revalidatePath("/admin/subscription-plans");
  revalidatePath("/prestataire/abonnement");
}
