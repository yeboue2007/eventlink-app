import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

/**
 * Client à privilèges élevés (clé de service), contourne entièrement la RLS.
 *
 * ⚠️ NE JAMAIS importer ce fichier depuis un composant client ni l'exposer
 * au navigateur. Réservé aux route handlers serveur qui reçoivent des
 * requêtes non-utilisateur (webhooks de paiement CinetPay) où il n'existe
 * pas de session Supabase à faire respecter par la RLS.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquante — requise pour le traitement des webhooks de paiement."
    );
  }

  return createSupabaseClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
