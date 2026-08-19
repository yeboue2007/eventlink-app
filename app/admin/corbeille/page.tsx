import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CorbeilleRow } from "@/features/administration/corbeille/components/corbeille-row";
import { listCorbeilleAdmin } from "@/features/administration/corbeille/queries/list-corbeille";
import { requireAdminAccess } from "@/features/administration/permissions/guard";

export default async function AdminCorbeillePage() {
  await requireAdminAccess("corbeille", "gestion");

  const elements = await listCorbeilleAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Corbeille</h1>
        <p className="text-muted-foreground">
          Demandes, projets, offres, entreprises et agences supprimés (50 plus
          récents par type). La suppression définitive est irréversible.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Éléments supprimés ({elements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {elements.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              La corbeille est vide.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Élément</TableHead>
                  <TableHead>Supprimé le</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {elements.map((element) => (
                  <CorbeilleRow key={`${element.table}-${element.id}`} element={element} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
