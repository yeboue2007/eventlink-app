import { Card, CardContent } from "@/components/ui/card";

export function KpiCard({
  label,
  value,
  sousTexte,
}: {
  label: string;
  value: string | number;
  sousTexte?: string;
}) {
  return (
    <Card>
      <CardContent className="py-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        {sousTexte && <p className="mt-1 text-xs text-muted-foreground">{sousTexte}</p>}
      </CardContent>
    </Card>
  );
}
