"use server";

import { revalidatePath } from "next/cache";

import {
  CLES_COULEURS_MARQUE,
  CLES_TEXTES_SITE,
} from "@/features/administration/configuration/queries/list-configuration";
import { requireAdminAccess } from "@/features/administration/permissions/guard";
import { createClient } from "@/lib/supabase/server";

export type ConfigurationActionState = { error?: string; success?: boolean } | undefined;

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

export async function updateBrandColorsAction(
  _prevState: ConfigurationActionState,
  formData: FormData
): Promise<ConfigurationActionState> {
  await requireAdminAccess("configuration", "gestion");

  const supabase = await createClient();

  for (const cle of CLES_COULEURS_MARQUE) {
    const valeur = formData.get(cle);
    if (typeof valeur !== "string" || !HEX_REGEX.test(valeur)) {
      return { error: `Couleur invalide pour ${cle} — format attendu #RRGGBB.` };
    }
  }

  for (const cle of CLES_COULEURS_MARQUE) {
    const valeur = formData.get(cle) as string;
    const { error } = await supabase
      .from("platform_settings")
      .update({ value: valeur, updated_at: new Date().toISOString() })
      .eq("key", cle);
    if (error) return { error: "Impossible d'enregistrer les couleurs." };
  }

  revalidatePath("/admin/configuration");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateSiteTextsAction(
  _prevState: ConfigurationActionState,
  formData: FormData
): Promise<ConfigurationActionState> {
  await requireAdminAccess("configuration", "gestion");

  const supabase = await createClient();

  for (const cle of CLES_TEXTES_SITE) {
    const valeur = formData.get(cle);
    if (typeof valeur !== "string") continue;
    const { error } = await supabase
      .from("platform_settings")
      .update({ value: valeur, updated_at: new Date().toISOString() })
      .eq("key", cle);
    if (error) return { error: "Impossible d'enregistrer les textes du site." };
  }

  revalidatePath("/admin/configuration");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateLegalPageAction(
  slug: "cgu" | "confidentialite",
  _prevState: ConfigurationActionState,
  formData: FormData
): Promise<ConfigurationActionState> {
  await requireAdminAccess("configuration", "gestion");

  const content = formData.get("content");
  if (typeof content !== "string" || content.trim() === "") {
    return { error: "Le contenu ne peut pas être vide." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("legal_pages")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) return { error: "Impossible d'enregistrer cette page." };

  revalidatePath("/admin/configuration");
  return { success: true };
}
