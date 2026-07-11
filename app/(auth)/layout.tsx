import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "@/components/marketing/logo";
import { createClient } from "@/lib/supabase/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Un utilisateur déjà connecté n'a rien à faire sur les pages de connexion/inscription.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/tableau-de-bord");
  }

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-8 bg-background px-4 py-16">
      <Link href="/">
        <Logo size="lg" />
      </Link>
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        {children}
      </div>
    </main>
  );
}
