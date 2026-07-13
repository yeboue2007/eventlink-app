import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import { createServiceRoleClient } from "@/lib/supabase/service";

/**
 * Appelée quotidiennement par Vercel Cron (voir vercel.json). Recalcule les
 * statistiques du jour et de la veille (pour rattraper un éventuel décalage
 * de fuseau horaire au moment de l'exécution).
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env("CRON_SECRET")}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const hier = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

  const { error: errorHier } = await supabase.rpc("rpc_calculer_stats_du_jour", {
    p_date: hier,
  });
  const { error: errorAujourdhui } = await supabase.rpc("rpc_calculer_stats_du_jour", {
    p_date: aujourdhui,
  });

  if (errorHier || errorAujourdhui) {
    return NextResponse.json({ error: "Échec du calcul des statistiques" }, { status: 500 });
  }

  return NextResponse.json({ success: true, dates: [hier, aujourdhui] });
}
