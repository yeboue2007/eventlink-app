import { z } from "zod";

export const sendMessageSchema = z.object({
  content: z.string().trim().min(1, "Le message ne peut pas être vide").max(2000),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
