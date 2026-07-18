import { Badge } from "@/components/ui/badge";
import type { Enums } from "@/lib/supabase/database.types";

export const LABEL_STATUT: Record<Enums<"compte_statut">, string> = {
  actif: "Actif",
  suspendu: "Suspendu",
  desactive: "Désactivé",
  en_attente: "En attente",
};

const VARIANT_STATUT: Record<
  Enums<"compte_statut">,
  "success" | "warning" | "destructive" | "outline"
> = {
  actif: "success",
  suspendu: "warning",
  desactive: "destructive",
  en_attente: "outline",
};

export function StatutCompteBadge({ statut }: { statut: Enums<"compte_statut"> }) {
  return <Badge variant={VARIANT_STATUT[statut]}>{LABEL_STATUT[statut]}</Badge>;
}
