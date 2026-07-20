import { z } from "zod";

export const promotionSchema = z
  .object({
    label: z.string().min(2, "Le libellé est requis"),
    code: z.string().trim().optional(),
    appliesTo: z.enum(["credit_pack", "abonnement", "les_deux"]),
    discountType: z.enum(["pourcentage", "montant_fixe"]),
    discountValue: z.coerce.number().positive("Valeur invalide"),
    startDate: z.string().min(1, "Date de début requise"),
    endDate: z.string().min(1, "Date de fin requise"),
    autoApply: z.coerce.boolean().optional(),
    targetVille: z.string().trim().optional(),
    targetCategoryId: z.coerce.number().optional(),
    targetMinSeniorityDays: z.coerce.number().int().nonnegative().optional(),
    targetRole: z.enum(["client", "prestataire"]).optional(),
    targetPlanId: z.string().uuid().optional(),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "La date de fin doit être postérieure à la date de début",
    path: ["endDate"],
  })
  .refine(
    (data) => data.discountType !== "pourcentage" || data.discountValue <= 100,
    { message: "Un pourcentage ne peut pas dépasser 100", path: ["discountValue"] }
  );

export type PromotionInput = z.infer<typeof promotionSchema>;
