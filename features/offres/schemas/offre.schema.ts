import { z } from "zod";

export const createOffreSchema = z.object({
  demandeId: z.string().uuid(),
  demandeLotIds: z.array(z.string().uuid()).min(1, "Sélectionnez au moins une prestation"),
  message: z.string().optional(),
});

export type CreateOffreInput = z.infer<typeof createOffreSchema>;
