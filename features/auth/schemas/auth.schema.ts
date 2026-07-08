import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});
export type SignInInput = z.infer<typeof signInSchema>;

const basePersonSchema = {
  fullName: z.string().min(2, "Le nom complet est requis"),
  email: z.string().email("Adresse e-mail invalide"),
  phone: z
    .string()
    .min(8, "Numéro de téléphone invalide")
    .regex(/^[0-9+\s-]+$/, "Numéro de téléphone invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  ville: z.string().min(2, "La ville est requise").default("Abidjan"),
};

export const signUpClientSchema = z.object(basePersonSchema);
export type SignUpClientInput = z.infer<typeof signUpClientSchema>;

export const signUpPrestataireSchema = z.object({
  ...basePersonSchema,
  companyName: z.string().min(2, "Le nom de l'entreprise ou de l'activité est requis"),
});
export type SignUpPrestataireInput = z.infer<typeof signUpPrestataireSchema>;

export const requestPasswordResetSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
});
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;

export const updatePasswordSchema = z
  .object({
    password: z.string().min(8, "8 caractères minimum"),
    confirmPassword: z.string().min(8, "8 caractères minimum"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
