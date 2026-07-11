"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";

import { Loader } from "@/components/ui/loader";
import {
  confirmMediaUploadAction,
  deleteMediaFileAction,
} from "@/features/entreprises/actions/media.actions";
import { generateUploadUrlAction } from "@/features/entreprises/actions/upload-media.actions";
import type { Tables } from "@/lib/supabase/database.types";

const TAILLE_MAX_PX = 1920;
const QUALITE_WEBP = 0.85;

/** Redimensionne (max 1920px) et convertit en WebP directement dans le navigateur. */
function compresserImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > TAILLE_MAX_PX || height > TAILLE_MAX_PX) {
        const ratio = Math.min(TAILLE_MAX_PX / width, TAILLE_MAX_PX / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas non supporté"));
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Conversion WebP échouée"))),
        "image/webp",
        QUALITE_WEBP
      );
    };
    img.onerror = () => reject(new Error("Image invalide"));
    img.src = url;
  });
}

export function MediaGallery({
  entrepriseId,
  initialMedia,
}: {
  entrepriseId: string;
  initialMedia: Tables<"media_files">[];
}) {
  const [media, setMedia] = useState(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // permet de resélectionner le même fichier ensuite

    setIsUploading(true);
    try {
      const blob = await compresserImage(file);

      const result = await generateUploadUrlAction("image/webp");
      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      const uploadResponse = await fetch(result.uploadUrl, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": "image/webp" },
      });
      if (!uploadResponse.ok) {
        toast.error("Échec de l'envoi de l'image.");
        return;
      }

      const confirmResult = await confirmMediaUploadAction(entrepriseId, result.publicUrl);
      if (confirmResult?.error) {
        toast.error(confirmResult.error);
        return;
      }

      setMedia((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          entreprise_id: entrepriseId,
          type: "image" as const,
          url: result.publicUrl,
          display_order: current.length,
          created_at: new Date().toISOString(),
        },
      ]);
      toast.success("Photo ajoutée.");
    } catch {
      toast.error("Impossible de traiter cette image.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(mediaFileId: string) {
    setMedia((current) => current.filter((m) => m.id !== mediaFileId));
    await deleteMediaFileAction(mediaFileId, entrepriseId);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {media.map((item) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
            <Image src={item.url} alt="" fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="absolute top-1.5 right-1.5 rounded-full bg-el-navy/70 p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Supprimer cette photo"
            >
              <Trash2 className="size-3.5 text-white" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {isUploading ? (
            <Loader />
          ) : (
            <>
              <Upload className="size-5" />
              <span className="text-xs">Ajouter</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <p className="text-xs text-muted-foreground">
        Les images sont automatiquement redimensionnées et compressées avant l&rsquo;envoi.
      </p>
    </div>
  );
}
