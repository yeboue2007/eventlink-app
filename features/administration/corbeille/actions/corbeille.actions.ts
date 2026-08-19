"use server";

import { revalidatePath } from "next/cache";

import { logAdminAction } from "@/features/administration/audit/log-admin-action";
import { requireAdminAccess } from "@/features/administration/permissions/guard";
import type { TableCorbeille } from "@/features/administration/corbeille/queries/list-corbeille";
import { createClient } from "@/lib/supabase/server";

const PATH = "/admin/corbeille";

// Liste blanche stricte : jamais construire le nom de table à partir d'une
// valeur non validée, même si elle provient d'un composant serveur de
// confiance — un bouton mal câblé ne doit pas pouvoir cibler une table hors
// périmètre de la corbeille.
const TABLES_AUTORISEES: TableCorbeille[] = ["demandes", "projets", "offres", "entreprises", "agences"];

function verifierTable(table: string): asserts table is TableCorbeille {
  if (!TABLES_AUTORISEES.includes(table as TableCorbeille)) {
    throw new Error("Table non autorisée pour cette action.");
  }
}

export async function restoreItemAction(table: TableCorbeille, id: string) {
  await requireAdminAccess("corbeille", "gestion");
  verifierTable(table);

  const supabase = await createClient();
  const { error } = await supabase.from(table).update({ deleted_at: null }).eq("id", id);
  if (error) return { error: "Impossible de restaurer cet élément." };

  await logAdminAction({
    action: "restauration_corbeille",
    entityType: table,
    entityId: id,
  });

  revalidatePath(PATH);
  return { success: true };
}

export async function purgeItemAction(table: TableCorbeille, id: string) {
  await requireAdminAccess("corbeille", "gestion");
  verifierTable(table);

  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return { error: "Impossible de supprimer définitivement cet élément." };

  await logAdminAction({
    action: "purge_definitive_corbeille",
    entityType: table,
    entityId: id,
  });

  revalidatePath(PATH);
  return { success: true };
}
