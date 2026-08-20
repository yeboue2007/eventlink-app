import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JournalSystemeFilters } from "@/features/administration/journal-systeme/components/journal-systeme-filters";
import { JournalSystemeRow } from "@/features/administration/journal-systeme/components/journal-systeme-row";
import {
  listEventTypesDistincts,
  listSystemLogAdmin,
} from "@/features/administration/journal-systeme/queries/list-journal-systeme";
import { requireAdminAccess } from "@/features/administration/permissions/guard";

export default async function AdminJournalSystemePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; severite?: string }>;
}) {
  await requireAdminAccess("journal_systeme", "lecture");

  const { type, severite } = await searchParams;

  const [entrees, eventTypes] = await Promise.all([
    listSystemLogAdmin({ eventType: type, severity: severite }),
    listEventTypesDistincts(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Journal système</h1>
        <p className="text-muted-foreground">
          Événements globaux de la plateforme (inscriptions, achats, échecs de
          paiement, jobs planifiés) — distinct de l&apos;historique des actions
          administrateur.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Événements ({entrees.length} affichés, 100 max)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <JournalSystemeFilters eventTypes={eventTypes} />

          {entrees.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucun événement pour ces filtres.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Détail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entrees.map((entree) => (
                  <JournalSystemeRow key={entree.id} entree={entree} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
