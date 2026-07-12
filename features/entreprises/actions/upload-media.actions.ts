"use server";

import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

import { getCurrentEntreprise } from "@/features/entreprises/queries/get-current-entreprise";
import { createClient } from "@/lib/supabase/server";
import { getR2BucketName, getR2Client, getR2PublicUrl } from "@/lib/r2/client";

const TYPES_AUTORISES = new Set(["image/webp", "image/jpeg", "image/png"]);

export type UploadMediaState = { error?: string; success?: boolean };

/**
 * Reçoit l'image déjà compressée (WebP, redimensionnée côté navigateur) et
 * l'envoie elle-même vers R2 depuis le serveur, plutôt que de faire uploader
 * le navigateur directement vers R2 via une URL présignée. Volontairement
 * plus simple à opérer : élimine entièrement le besoin de configurer le CORS
 * sur le bucket, seul point qui posait problème en pratique.
 */
export async function uploadMediaFileAction(
  entrepriseId: string,
  formData: FormData
): Promise<UploadMediaState> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "Aucun fichier reçu." };
  }
  if (!TYPES_AUTORISES.has(file.type)) {
    return { error: "Format d'image non supporté." };
  }

  const entreprise = await getCurrentEntreprise();
  if (!entreprise || entreprise.id !== entrepriseId) {
    return { error: "Non autorisé." };
  }

  const supabase = await createClient();
  const { count } = await supabase
    .from("media_files")
    .select("*", { count: "exact", head: true })
    .eq("entreprise_id", entrepriseId);

  const { data: setting } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "max_photos_par_entreprise")
    .maybeSingle();
  const limite = Number(setting?.value ?? 20);
  if ((count ?? 0) >= limite) {
    return { error: `Limite de ${limite} photos atteinte pour votre offre actuelle.` };
  }

  const extension = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
  const key = `entreprises/${entrepriseId}/${randomUUID()}.${extension}`;

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

    const { error } = await supabase.from("media_files").insert({
      entreprise_id: entrepriseId,
      type: "image",
      url: publicUrl,
      display_order: count ?? 0,
    });

    if (error) {
      console.error("[uploadMediaFileAction] échec de l'enregistrement en base :", error);
      return { error: "Photo envoyée mais impossible à enregistrer. Réessayez." };
    }

    return { success: true };
  } catch (error) {
    console.error("[uploadMediaFileAction] échec de l'envoi vers R2 :", error);
    return { error: "Stockage média non configuré. Vérifiez les identifiants R2." };
  } finally {
    revalidatePath("/prestataire/parametres/profil");
    revalidatePath(`/entreprises/${entrepriseId}`);
  }
}
