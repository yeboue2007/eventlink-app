import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function isIaActivee(): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "ia_activee")
    .maybeSingle();

  // Par défaut activé si le paramètre n'existe pas encore (comportement
  // permissif), mais respecte explicitement false si un admin l'a désactivé.
  return data?.value !== false;
}
