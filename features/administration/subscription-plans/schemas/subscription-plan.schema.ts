import { z } from "zod";

export const subscriptionPlanSchema = z.object({
  label: z.string().min(2, "Le libellé est requis"),
  slug: z
    .string()
    .min(2, "Le slug est requis")
    .regex(/^[a-z0-9-]+$/, "Uniquement lettres minuscules, chiffres et tirets"),
  priceFcfa: z.coerce.number().positive("Prix invalide"),
  creditsIncluded: z.coerce.number().int().nonnegative(),
  badgeLabel: z.string().optional(),
  avantages: z.string().optional(), // une ligne par avantage, découpée côté serveur
});

export type SubscriptionPlanInput = z.infer<typeof subscriptionPlanSchema>;
