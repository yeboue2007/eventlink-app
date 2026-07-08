"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import {
  requestPasswordResetSchema,
  signInSchema,
  signUpClientSchema,
  signUpPrestataireSchema,
  updatePasswordSchema,
} from "@/features/auth/schemas/auth.schema";

export type AuthActionState = { error?: string } | undefined;

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Adresse e-mail ou mot de passe incorrect" };
  }

  redirect("/tableau-de-bord");
}

export async function signUpClientAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signUpClientSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    ville: formData.get("ville") || "Abidjan",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/confirm`,
      data: {
        role: "client",
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
        ville: parsed.data.ville,
      },
    },
  });

  if (error) {
    return { error: traduireErreurSupabase(error.message) };
  }

  redirect("/inscription/confirmation-envoyee");
}

export async function signUpPrestataireAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signUpPrestataireSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    ville: formData.get("ville") || "Abidjan",
    companyName: formData.get("companyName"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/confirm`,
      data: {
        role: "prestataire",
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
        ville: parsed.data.ville,
        company_name: parsed.data.companyName,
      },
    },
  });

  if (error) {
    return { error: traduireErreurSupabase(error.message) };
  }

  redirect("/inscription/confirmation-envoyee");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}

export async function requestPasswordResetAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = requestPasswordResetSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  // On ne révèle jamais si l'e-mail existe ou non (protection contre l'énumération de comptes).
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/confirm?next=/reinitialiser-mot-de-passe`,
  });

  redirect("/mot-de-passe-oublie/envoye");
}

export async function updatePasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { error: "Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré." };
  }

  redirect("/tableau-de-bord");
}

function traduireErreurSupabase(message: string): string {
  if (message.includes("already registered") || message.includes("already been registered")) {
    return "Un compte existe déjà avec cette adresse e-mail.";
  }
  if (message.includes("Password should be at least")) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  return "Une erreur est survenue. Veuillez réessayer.";
}
