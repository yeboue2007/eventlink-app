import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

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
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/brand/eventlink-logo.png"
          alt="EventLink"
          width={160}
          height={48}
          className="h-10 w-auto"
          priority
        />
      </Link>
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        {children}
      </div>
    </main>
  );
}
