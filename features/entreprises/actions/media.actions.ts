"use server";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getR2BucketName, getR2Client } from "@/lib/r2/client";

export async function confirmMediaUploadAction(entrepriseId: string, publicUrl: string) {
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

  const { error } = await supabase.from("media_files").insert({
    entreprise_id: entrepriseId,
    type: "image",
    url: publicUrl,
    display_order: count ?? 0,
  });

  if (error) {
    return { error: "Impossible d'enregistrer la photo." };
  }

  revalidatePath("/prestataire/parametres/profil");
  revalidatePath(`/entreprises/${entrepriseId}`);
  return { success: true };
}

export async function deleteMediaFileAction(mediaFileId: string, entrepriseId: string) {
  const supabase = await createClient();

  const { data: media } = await supabase
    .from("media_files")
    .select("url")
    .eq("id", mediaFileId)
    .maybeSingle();

  await supabase.from("media_files").delete().eq("id", mediaFileId);

  if (media?.url) {
    try {
      const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
      const key = publicBase ? media.url.replace(`${publicBase}/`, "") : null;
      if (key) {
        await getR2Client().send(
          new DeleteObjectCommand({ Bucket: getR2BucketName(), Key: key })
        );
      }
    } catch {
      // La suppression en base est déjà faite ; un fichier orphelin sur R2
      // n'est pas bloquant, on ne fait pas échouer l'action pour autant.
    }
  }

  revalidatePath("/prestataire/parametres/profil");
  revalidatePath(`/entreprises/${entrepriseId}`);
}
