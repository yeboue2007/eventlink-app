import { Badge } from "@/components/ui/badge";
import type { Enums } from "@/lib/supabase/database.types";

const CONFIG: Record<
  Enums<"demande_status">,
  { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" }
> = {
  ouverte: { label: "Ouverte", variant: "success" },
  en_negociation: { label: "En négociation", variant: "warning" },
  cloturee: { label: "Clôturée", variant: "secondary" },
  annulee: { label: "Annulée", variant: "destructive" },
};

export function DemandeStatusBadge({ status }: { status: Enums<"demande_status"> }) {
  const config = CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
