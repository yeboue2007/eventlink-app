import { Badge } from "@/components/ui/badge";
import type { Enums } from "@/lib/supabase/database.types";

const CONFIG: Record<
  Enums<"offre_status">,
  { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" }
> = {
  envoyee: { label: "Envoyée", variant: "warning" },
  vue: { label: "Vue", variant: "secondary" },
  acceptee: { label: "Acceptée", variant: "success" },
  refusee: { label: "Refusée", variant: "destructive" },
  retiree: { label: "Retirée", variant: "secondary" },
};

export function OffreStatusBadge({ status }: { status: Enums<"offre_status"> }) {
  const config = CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
