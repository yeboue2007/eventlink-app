import { z } from "zod";

export const updateCategoriesSchema = z.object({
  categoryIds: z.array(z.coerce.number()).min(1, "Sélectionnez au moins une catégorie"),
});

export type UpdateCategoriesInput = z.infer<typeof updateCategoriesSchema>;
