import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export const CLES_COULEURS_MARQUE = [
  "brand_color_navy",
  "brand_color_violet",
  "brand_color_rose",
  "brand_color_orange",
  "brand_color_gold",
] as const;

export type CleCouleurMarque = (typeof CLES_COULEURS_MARQUE)[number];

export const CLES_TEXTES_SITE = [
  "site_baseline",
  "site_footer_text",
  "site_contact_email",
] as const;

export type CleTexteSite = (typeof CLES_TEXTES_SITE)[number];

function extraireValeurTexte(value: unknown): string {
  return typeof value === "string" ? value : String(value ?? "");
}

/**
 * Lecture publique (utilisée aussi par le layout racine pour injecter les
 * couleurs) — jamais throw, retombe sur des valeurs par défaut si la ligne
 * est absente pour ne jamais casser le rendu du site.
 */
export async function getBrandColors(): Promise<Record<CleCouleurMarque, string>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("platform_settings")
    .select("key, value")
    .in("key", CLES_COULEURS_MARQUE);

  const defauts: Record<CleCouleurMarque, string> = {
    brand_color_navy: "#2C1E47",
    brand_color_violet: "#6A3EC9",
    brand_color_rose: "#E94E8B",
    brand_color_orange: "#FF8A00",
    brand_color_gold: "#FFC107",
  };

  for (const row of data ?? []) {
    if (CLES_COULEURS_MARQUE.includes(row.key as CleCouleurMarque)) {
      defauts[row.key as CleCouleurMarque] = extraireValeurTexte(row.value);
    }
  }

  return defauts;
}

export async function getSiteTexts(): Promise<Record<CleTexteSite, string>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("platform_settings")
    .select("key, value")
    .in("key", CLES_TEXTES_SITE);

  const defauts: Record<CleTexteSite, string> = {
    site_baseline: "",
    site_footer_text: "",
    site_contact_email: "",
  };

  for (const row of data ?? []) {
    if (CLES_TEXTES_SITE.includes(row.key as CleTexteSite)) {
      defauts[row.key as CleTexteSite] = extraireValeurTexte(row.value);
    }
  }

  return defauts;
}

export async function listLegalPagesAdmin(): Promise<Tables<"legal_pages">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("legal_pages")
    .select("*")
    .order("slug", { ascending: true });

  if (error) throw error;
  return data;
}
