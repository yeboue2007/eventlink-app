"use server";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getR2BucketName, getR2Client } from "@/lib/r2/client";

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
