import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

let client: S3Client | null = null;

/**
 * Cloudflare R2 est compatible S3 — on réutilise le SDK AWS avec un
 * endpoint personnalisé. Supabase ne stocke jamais les fichiers médias
 * eux-mêmes, uniquement leurs métadonnées (table media_files).
 */
export function getR2Client(): S3Client {
  if (client) return client;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Configuration Cloudflare R2 manquante (R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY)."
    );
  }

  client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  return client;
}

export function getR2BucketName(): string {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME manquant.");
  return bucket;
}

export function getR2PublicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_URL;
  if (!base) throw new Error("R2_PUBLIC_URL manquant.");
  return `${base.replace(/\/$/, "")}/${key}`;
}
