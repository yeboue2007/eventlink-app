import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarGrid } from "@/features/calendrier/components/calendar-grid";
import { listAvailabilityForMonth } from "@/features/calendrier/queries/list-availability";
import { getCurrentEntreprise } from "@/features/entreprises/queries/get-current-entreprise";

export default async function CalendrierPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const entreprise = await getCurrentEntreprise();
  if (!entreprise) redirect("/prestataire");

  const params = await searchParams;
  const now = new Date();
  const year = params.year ? Number(params.year) : now.getFullYear();
  const month = params.month ? Number(params.month) : now.getMonth() + 1;

  const slots = await listAvailabilityForMonth(entreprise.id, year, month);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mon calendrier</h1>
        <p className="text-muted-foreground">
          Indiquez vos disponibilités — les clients ne voient pas le détail,
          seule votre disponibilité future pourra être prise en compte dans
          la recherche.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disponibilité</CardTitle>
          <CardDescription>Cliquez sur un jour pour le modifier.</CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarGrid entrepriseId={entreprise.id} year={year} month={month} slots={slots} />
        </CardContent>
      </Card>
    </div>
  );
}
