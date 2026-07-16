import "server-only";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";

/**
 * Enregistre une action admin sensible. À appeler systématiquement après
 * (ou avant, si l'action peut échouer) toute modification effectuée depuis
 * le back-office — aucune modification sensible ne doit rester non tracée.
 */
export async function logAdminAction(params: {
  action: string;
  entityType: string;
  entityId?: string;
  ancienneValeur?: unknown;
  nouvelleValeur?: unknown;
  commentaire?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    null;

  await supabase.from("audit_log").insert({
    actor_profile_id: user?.id ?? null,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId ?? null,
    metadata: {
      ancienne_valeur: params.ancienneValeur ?? null,
      nouvelle_valeur: params.nouvelleValeur ?? null,
      commentaire: params.commentaire ?? null,
      ip,
    } as Json,
  });
}

