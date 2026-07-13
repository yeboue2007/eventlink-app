import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/lib/supabase/database.types";
import { env } from "@/lib/env";

/**
 * Client Supabase pour les Server Components, Server Actions et Route Handlers.
 * Doit être recréé à chaque requête (jamais mis en cache/singleton global).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env("NEXT_PUBLIC_SUPABASE_URL") ?? "",
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY") ?? "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Appelé depuis un Server Component : ignoré si un middleware
            // rafraîchit déjà la session (voir middleware.ts).
          }
        },
      },
    }
  );
}
