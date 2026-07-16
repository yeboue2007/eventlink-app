import { z } from "zod";

export const promouvoirAdminSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  adminRole: z.enum(["super_admin", "admin", "support_client", "moderateur", "comptabilite"]),
});

export type PromouvoirAdminInput = z.infer<typeof promouvoirAdminSchema>;
