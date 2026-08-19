import { z } from "zod";

export const tarifSchema = z.object({
  pricePerWeekFcfa: z.coerce.number().int().positive("Le tarif doit être positif"),
  categoryId: z.coerce.number().optional(),
  ville: z.string().trim().optional(),
});

export type TarifInput = z.infer<typeof tarifSchema>;

export const campagneSchema = z
  .object({
    entrepriseId: z.string().uuid("Sélectionnez un prestataire"),
    categoryId: z.coerce.number({ message: "Sélectionnez une catégorie" }),
    ville: z.string().trim().min(1, "La ville est requise"),
    startDate: z.string().min(1, "Date de début requise"),
    endDate: z.string().min(1, "Date de fin requise"),
    pricePaidFcfa: z.coerce.number().int().nonnegative("Montant invalide"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "La date de fin doit être postérieure à la date de début",
    path: ["endDate"],
  });

export type CampagneInput = z.infer<typeof campagneSchema>;
