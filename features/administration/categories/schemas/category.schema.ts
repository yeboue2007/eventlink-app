import { z } from "zod";

export const categorySchema = z.object({
  label: z.string().min(2, "Le libellé est requis"),
  slug: z
    .string()
    .min(2, "Le slug est requis")
    .regex(/^[a-z0-9-]+$/, "Uniquement lettres minuscules, chiffres et tirets"),
  icon: z.string().optional(),
  parentId: z.coerce.number().optional(),
  displayOrder: z.coerce.number().default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;
