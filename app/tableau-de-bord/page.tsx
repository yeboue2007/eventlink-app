import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const ESPACE_PAR_ROLE = {
  client: "/client",
  prestataire: "/prestataire",
  admin: "/admin",
} as const;

export default async function TableauDeBordRedirectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const role = (user.app_metadata?.role as keyof typeof ESPACE_PAR_ROLE) ?? "client";
  redirect(ESPACE_PAR_ROLE[role] ?? "/client");
}
