import { z } from "zod";

export const ajusterCreditsSchema = z.object({
  montant: z.coerce
    .number({ message: "Montant invalide" })
    .int("Le montant doit être un nombre entier")
    .refine((v) => v !== 0, "Le montant ne peut pas être nul"),
  type: z.enum(["bonus_gratuit", "correction_manuelle", "remboursement", "promotion", "annulation"]),
  justification: z.string().trim().min(5, "Justification obligatoire (5 caractères minimum)"),
});

export type AjusterCreditsInput = z.infer<typeof ajusterCreditsSchema>;
