import { z } from "zod";

export const setAvailabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
  status: z.enum(["disponible", "occupe", "conge", "indisponible", "maintenance"]),
  note: z.string().max(200).optional(),
});

export type SetAvailabilityInput = z.infer<typeof setAvailabilitySchema>;
