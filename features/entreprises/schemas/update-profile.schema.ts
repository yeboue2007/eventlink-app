import { z } from "zod";

export const updateEntrepriseProfileSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  ville: z.string().min(2, "La ville est requise"),
  bio: z.string().max(1000, "1000 caractères maximum").optional(),
});

export type UpdateEntrepriseProfileInput = z.infer<typeof updateEntrepriseProfileSchema>;
