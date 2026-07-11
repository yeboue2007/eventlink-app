import { Badge } from "@/components/ui/badge";
import type { Enums } from "@/lib/supabase/database.types";

export const CONFIG_DISPONIBILITE: Record<
  Enums<"availability_status">,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary" | "outline" }
> = {
  disponible: { label: "Disponible", variant: "success" },
  occupe: { label: "Occupé", variant: "warning" },
  conge: { label: "Congé", variant: "secondary" },
  indisponible: { label: "Indisponible", variant: "destructive" },
  maintenance: { label: "Maintenance", variant: "outline" },
};

export function AvailabilityBadge({ status }: { status: Enums<"availability_status"> }) {
  const config = CONFIG_DISPONIBILITE[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
