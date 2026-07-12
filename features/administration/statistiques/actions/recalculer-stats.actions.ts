"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function recalculerStatsAction() {
  const supabase = await createClient();
  const { error } = await supabase.rpc("rpc_recalculer_stats_admin", {});

  if (error) {
    return { error: "Impossible de recalculer les statistiques." };
  }

  revalidatePath("/admin/statistiques");
  return { success: true };
}
