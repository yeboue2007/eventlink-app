"use client";

import Image from "next/image";
import { useActionState, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Trash2, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICON_LABELS, ICON_SLUGS, HeroIcon } from "@/components/marketing/hero-icon-registry";
import {
  deleteHeroSlideAction,
  moveHeroSlideAction,
  removeHeroSlideImageAction,
  toggleHeroSlideActiveAction,
  updateHeroSlideAction,
  uploadHeroSlideImageAction,
} from "@/features/administration/hero-slides/actions/hero-slide.actions";
import type { Tables } from "@/lib/supabase/database.types";

const TAILLE_MAX_PX = 1600;
const QUALITE_WEBP = 0.85;

/** Redimensionne (max 1600px) et convertit en WebP directement dans le navigateur. */
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

export function HeroSlideRow({
  slide,
  isFirst,
  isLast,
}: {
  slide: Tables<"hero_slides">;
  isFirst: boolean;
  isLast: boolean;
}) {
  const updateAction = updateHeroSlideAction.bind(null, slide.id);
  const [state, formAction, isPending] = useActionState(updateAction, undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [isPendingAutre, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setIsUploading(true);
    try {
      const blob = await compresserImage(file);
      const formData = new FormData();
      formData.append("file", blob, "hero.webp");
      const result = await uploadHeroSlideImageAction(slide.id, formData);
      if (result?.error) toast.error(result.error);
      else toast.success("Image mise à jour.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible de traiter cette image.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemoveImage() {
    startTransition(async () => {
      const result = await removeHeroSlideImageAction(slide.id);
      if (result?.error) toast.error(result.error);
    });
  }

  function handleToggleActive() {
    startTransition(async () => {
      const result = await toggleHeroSlideActiveAction(slide.id, !slide.active);
      if (result?.error) toast.error(result.error);
    });
  }

  function handleMove(direction: "haut" | "bas") {
    startTransition(async () => {
      const result = await moveHeroSlideAction(slide.id, direction);
      if (result?.error) toast.error(result.error);
    });
  }

  function handleDelete() {
    if (!confirm(`Supprimer la diapositive "${slide.categorie}" ?`)) return;
    startTransition(async () => {
      const result = await deleteHeroSlideAction(slide.id);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row">
      {/* Aperçu image / repli icône */}
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-lg border border-border sm:w-32">
        {slide.image_url ? (
          <Image src={slide.image_url} alt={slide.alt} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-el-gradient">
            <HeroIcon slug={slide.icon_slug} className="size-6 text-white/90" />
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={slide.active ? "success" : "outline"}>
            {slide.active ? "Visible" : "Masquée"}
          </Badge>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-3.5" />
            {slide.image_url ? "Remplacer la photo" : "Ajouter une photo"}
          </Button>
          {slide.image_url && (
            <Button type="button" size="sm" variant="ghost" onClick={handleRemoveImage}>
              Retirer la photo
            </Button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <form action={formAction} className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor={`categorie-${slide.id}`}>Catégorie</Label>
            <Input id={`categorie-${slide.id}`} name="categorie" defaultValue={slide.categorie} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`iconSlug-${slide.id}`}>Icône de repli</Label>
            <Select name="iconSlug" defaultValue={slide.icon_slug}>
              <SelectTrigger id={`iconSlug-${slide.id}`}><SelectValue /></SelectTrigger>
              <SelectContent>
                {ICON_SLUGS.map((slug) => (
                  <SelectItem key={slug} value={slug}>{ICON_LABELS[slug]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`alt-${slide.id}`}>Texte alternatif</Label>
            <Input id={`alt-${slide.id}`} name="alt" defaultValue={slide.alt} required />
          </div>

          {state?.error && (
            <p className="sm:col-span-3 text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 sm:col-span-3">
            <Button type="submit" size="sm" variant="outline" disabled={isPending}>
              {isPending ? "Enregistrement…" : "Enregistrer le texte"}
            </Button>

            <div className="ml-auto flex items-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={isFirst || isPendingAutre}
                onClick={() => handleMove("haut")}
                aria-label="Monter"
              >
                <ArrowUp className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={isLast || isPendingAutre}
                onClick={() => handleMove("bas")}
                aria-label="Descendre"
              >
                <ArrowDown className="size-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPendingAutre}
                onClick={handleToggleActive}
              >
                {slide.active ? "Masquer" : "Afficher"}
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={isPendingAutre}
                onClick={handleDelete}
                aria-label="Supprimer"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
