"use server";

import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getCurrentEntreprise } from "@/features/entreprises/queries/get-current-entreprise";
import { getR2BucketName, getR2Client, getR2PublicUrl } from "@/lib/r2/client";

const TYPES_AUTORISES = ["image/webp", "image/jpeg", "image/png"];

export type GenerateUploadUrlState =
  | { error: string }
  | { uploadUrl: string; publicUrl: string };

/**
 * Génère une URL signée pour un upload DIRECT du navigateur vers R2 (le
 * fichier ne transite jamais par notre serveur — évite les limites de
 * payload des fonctions serverless et les frais de bande passante).
 * Le redimensionnement/compression en WebP se fait côté navigateur avant
 * l'appel (voir features/entreprises/components/media-gallery.tsx).
 */
export async function generateUploadUrlAction(
  contentType: string
): Promise<GenerateUploadUrlState> {
  if (!TYPES_AUTORISES.includes(contentType)) {
    return { error: "Format d'image non supporté." };
  }

  const entreprise = await getCurrentEntreprise();
  if (!entreprise) {
    return { error: "Aucune entreprise associée à ce compte." };
  }

  const extension = contentType === "image/png" ? "png" : contentType === "image/jpeg" ? "jpg" : "webp";
  const key = `entreprises/${entreprise.id}/${randomUUID()}.${extension}`;

  try {
    const client = getR2Client();
    const bucket = getR2BucketName();

    const uploadUrl = await getSignedUrl(
      client,
      new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
      { expiresIn: 300 }
    );

    return { uploadUrl, publicUrl: getR2PublicUrl(key) };
  } catch (error) {
    console.error("[generateUploadUrlAction] échec de génération de l'URL R2 :", error);
    return { error: "Stockage média non configuré. Contactez l'administrateur." };
  }
}
