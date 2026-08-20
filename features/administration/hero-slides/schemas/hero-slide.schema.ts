import { z } from "zod";

import { ICON_SLUGS } from "@/components/marketing/hero-icon-registry";

export const heroSlideSchema = z.object({
  categorie: z.string().trim().min(1, "La catégorie est requise").max(60),
  alt: z.string().trim().min(1, "Le texte alternatif est requis").max(200),
  iconSlug: z.enum(ICON_SLUGS),
});

export type HeroSlideInput = z.infer<typeof heroSlideSchema>;
