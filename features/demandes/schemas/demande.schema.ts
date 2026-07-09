import { z } from "zod";

export const createDemandeSchema = z
  .object({
    titre: z.string().min(3, "Donnez un titre à votre événement"),
    typeEvenement: z.string().optional(),
    dateEvenement: z.string().optional(), // format yyyy-mm-dd, optionnel
    ville: z.string().min(2, "La ville est requise").default("Abidjan"),
    lieu: z.string().optional(),
    budgetMin: z.coerce.number({ message: "Budget minimum invalide" }).positive(),
    budgetMax: z.coerce.number({ message: "Budget maximum invalide" }).positive(),
    description: z.string().optional(),
    categoryIds: z
      .array(z.coerce.number())
      .min(1, "Sélectionnez au moins une prestation"),
  })
  .refine((data) => data.budgetMax >= data.budgetMin, {
    message: "Le budget maximum doit être supérieur ou égal au budget minimum",
    path: ["budgetMax"],
  });

export type CreateDemandeInput = z.infer<typeof createDemandeSchema>;
