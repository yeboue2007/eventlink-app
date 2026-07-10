import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Note requise").max(5),
  comment: z.string().trim().max(1000).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
