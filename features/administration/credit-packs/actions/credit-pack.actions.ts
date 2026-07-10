"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { creditPackSchema } from "@/features/administration/credit-packs/schemas/credit-pack.schema";

export type CreditPackActionState = { error?: string } | undefined;

export async function createCreditPackAction(
  _prevState: CreditPackActionState,
  formData: FormData
): Promise<CreditPackActionState> {
  const parsed = creditPackSchema.safeParse({
    label: formData.get("label"),
    creditsAmount: formData.get("creditsAmount"),
    priceFcfa: formData.get("priceFcfa"),
    isPopular: formData.get("isPopular") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("credit_packs").insert({
    label: parsed.data.label,
    credits_amount: parsed.data.creditsAmount,
    price_fcfa: parsed.data.priceFcfa,
    is_popular: parsed.data.isPopular ?? false,
  });

  if (error) {
    return { error: "Impossible de créer le pack." };
  }

  revalidatePath("/admin/credit-packs");
  revalidatePath("/prestataire/credits");
  return undefined;
}

export async function toggleCreditPackActiveAction(packId: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("credit_packs").update({ active }).eq("id", packId);
  revalidatePath("/admin/credit-packs");
  revalidatePath("/prestataire/credits");
}
