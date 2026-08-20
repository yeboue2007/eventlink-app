"use server";

import { randomUUID } from "node:crypto";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

import { heroSlideSchema } from "@/features/administration/hero-slides/schemas/hero-slide.schema";
import { requireAdminAccess } from "@/features/administration/permissions/guard";
import { createClient } from "@/lib/supabase/server";
import { getR2BucketName, getR2Client, getR2PublicUrl } from "@/lib/r2/client";

const PATH = "/admin/hero-slides";
const PATH_ACCUEIL = "/";
const TYPES_AUTORISES = new Set(["image/webp", "image/jpeg", "image/png"]);

export type HeroSlideActionState = { error?: string; success?: boolean } | undefined;

function revalider() {
  revalidatePath(PATH);
  revalidatePath(PATH_ACCUEIL);
}

export async function createHeroSlideAction(
  _prevState: HeroSlideActionState,
  formData: FormData
): Promise<HeroSlideActionState> {
  await requireAdminAccess("configuration", "gestion");

  const parsed = heroSlideSchema.safeParse({
    categorie: formData.get("categorie"),
    alt: formData.get("alt"),
    iconSlug: formData.get("iconSlug"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { count } = await supabase
    .from("hero_slides")
    .select("*", { count: "exact", head: true });

  const { error } = await supabase.from("hero_slides").insert({
    categorie: parsed.data.categorie,
    alt: parsed.data.alt,
    icon_slug: parsed.data.iconSlug,
    display_order: count ?? 0,
  });

  if (error) return { error: "Impossible de créer cette diapositive." };

  revalider();
  return { success: true };
}

export async function updateHeroSlideAction(
  slideId: string,
  _prevState: HeroSlideActionState,
  formData: FormData
): Promise<HeroSlideActionState> {
  await requireAdminAccess("configuration", "gestion");

  const parsed = heroSlideSchema.safeParse({
    categorie: formData.get("categorie"),
    alt: formData.get("alt"),
    iconSlug: formData.get("iconSlug"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("hero_slides")
    .update({
      categorie: parsed.data.categorie,
      alt: parsed.data.alt,
      icon_slug: parsed.data.iconSlug,
      updated_at: new Date().toISOString(),
    })
    .eq("id", slideId);

  if (error) return { error: "Impossible d'enregistrer cette diapositive." };

  revalider();
  return { success: true };
}

export async function toggleHeroSlideActiveAction(slideId: string, active: boolean) {
  await requireAdminAccess("configuration", "gestion");

  const supabase = await createClient();
  const { error } = await supabase
    .from("hero_slides")
    .update({ active, updated_at: new Date().toISOString() })
    .eq("id", slideId);

  if (error) return { error: "Impossible de mettre à jour cette diapositive." };

  revalider();
  return { success: true };
}

export async function deleteHeroSlideAction(slideId: string) {
  await requireAdminAccess("configuration", "gestion");

  const supabase = await createClient();
  const { error } = await supabase.from("hero_slides").delete().eq("id", slideId);
  if (error) return { error: "Impossible de supprimer cette diapositive." };

  revalider();
  return { success: true };
}

/**
 * Échange l'ordre d'affichage entre une diapositive et sa voisine —
 * suffisant pour une poignée d'éléments, pas besoin de glisser-déposer.
 */
export async function moveHeroSlideAction(slideId: string, direction: "haut" | "bas") {
  await requireAdminAccess("configuration", "gestion");

  const supabase = await createClient();
  const { data: slides, error } = await supabase
    .from("hero_slides")
    .select("id, display_order")
    .order("display_order", { ascending: true });

  if (error || !slides) return { error: "Impossible de réordonner." };

  const index = slides.findIndex((s) => s.id === slideId);
  const voisinIndex = direction === "haut" ? index - 1 : index + 1;
  if (index === -1 || voisinIndex < 0 || voisinIndex >= slides.length) {
    return { success: true }; // déjà en haut/bas, rien à faire
  }

  const courant = slides[index];
  const voisin = slides[voisinIndex];

  const [res1, res2] = await Promise.all([
    supabase.from("hero_slides").update({ display_order: voisin.display_order }).eq("id", courant.id),
    supabase.from("hero_slides").update({ display_order: courant.display_order }).eq("id", voisin.id),
  ]);

  if (res1.error || res2.error) return { error: "Impossible de réordonner." };

  revalider();
  return { success: true };
}

export async function uploadHeroSlideImageAction(
  slideId: string,
  formData: FormData
): Promise<HeroSlideActionState> {
  await requireAdminAccess("configuration", "gestion");

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Aucun fichier reçu." };
  if (!TYPES_AUTORISES.has(file.type)) return { error: "Format d'image non supporté." };

  const supabase = await createClient();
  const { data: slide } = await supabase
    .from("hero_slides")
    .select("image_url")
    .eq("id", slideId)
    .maybeSingle();

  const extension = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
  const key = `hero-slides/${slideId}/${randomUUID()}.${extension}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: getR2BucketName(),
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const publicUrl = getR2PublicUrl(key);

    const { error } = await supabase
      .from("hero_slides")
      .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", slideId);

    if (error) return { error: "Image envoyée mais impossible à enregistrer. Réessayez." };

    // Nettoyage de l'ancienne image après confirmation que la nouvelle est enregistrée.
    if (slide?.image_url) {
      const ancienneKey = slide.image_url.split("/").slice(-3).join("/");
      await getR2Client()
        .send(new DeleteObjectCommand({ Bucket: getR2BucketName(), Key: ancienneKey }))
        .catch(() => {}); // best-effort : un orphelin dans R2 n'est pas bloquant
    }

    revalider();
    return { success: true };
  } catch (error) {
    console.error("[uploadHeroSlideImageAction] échec de l'envoi vers R2 :", error);
    return { error: "Stockage média non configuré. Vérifiez les identifiants R2." };
  }
}

export async function removeHeroSlideImageAction(slideId: string) {
  await requireAdminAccess("configuration", "gestion");

  const supabase = await createClient();
  const { data: slide } = await supabase
    .from("hero_slides")
    .select("image_url")
    .eq("id", slideId)
    .maybeSingle();

  const { error } = await supabase
    .from("hero_slides")
    .update({ image_url: null, updated_at: new Date().toISOString() })
    .eq("id", slideId);

  if (error) return { error: "Impossible de retirer cette image." };

  if (slide?.image_url) {
    const key = slide.image_url.split("/").slice(-3).join("/");
    await getR2Client()
      .send(new DeleteObjectCommand({ Bucket: getR2BucketName(), Key: key }))
      .catch(() => {});
  }

  revalider();
  return { success: true };
}
