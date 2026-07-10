import { z } from "zod";

export const creditPackSchema = z.object({
  label: z.string().min(2, "Le libellé est requis"),
  creditsAmount: z.coerce.number().int().positive("Nombre de crédits invalide"),
  priceFcfa: z.coerce.number().positive("Prix invalide"),
  isPopular: z.coerce.boolean().optional(),
});

export type CreditPackInput = z.infer<typeof creditPackSchema>;
