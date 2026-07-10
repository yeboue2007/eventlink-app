"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";

export type SettingActionState = { error?: string } | undefined;

function parseValue(raw: string): Json {
  try {
    return JSON.parse(raw) as Json;
  } catch {
    return raw; // valeur texte simple, stockée telle quelle en jsonb string
  }
}

export async function updatePlatformSettingAction(
  key: string,
  _prevState: SettingActionState,
  formData: FormData
): Promise<SettingActionState> {
  const rawValue = formData.get("value");
  if (typeof rawValue !== "string" || rawValue.trim() === "") {
    return { error: "La valeur ne peut pas être vide." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("platform_settings")
    .update({ value: parseValue(rawValue), updated_at: new Date().toISOString() })
    .eq("key", key);

  if (error) {
    return { error: "Impossible de mettre à jour ce paramètre." };
  }

  revalidatePath("/admin/parametres");
  return undefined;
}

export async function createPlatformSettingAction(
  _prevState: SettingActionState,
  formData: FormData
): Promise<SettingActionState> {
  const key = formData.get("key");
  const rawValue = formData.get("value");
  const description = formData.get("description");

  if (typeof key !== "string" || key.trim() === "") {
    return { error: "La clé est requise." };
  }
  if (typeof rawValue !== "string" || rawValue.trim() === "") {
    return { error: "La valeur ne peut pas être vide." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("platform_settings").insert({
    key: key.trim(),
    value: parseValue(rawValue),
    description: typeof description === "string" && description ? description : null,
  });

  if (error) {
    return {
      error: error.code === "23505" ? "Cette clé existe déjà." : "Impossible de créer ce paramètre.",
    };
  }

  revalidatePath("/admin/parametres");
  return undefined;
}
