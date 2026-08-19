import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listRootCategories } from "@/features/categories/queries/list-categories";
import { CampagneRow } from "@/features/administration/visibilite-sponsorisee/components/campagne-row";
import { CreateCampagneForm } from "@/features/administration/visibilite-sponsorisee/components/create-campagne-form";
import { CreateTarifForm } from "@/features/administration/visibilite-sponsorisee/components/create-tarif-form";
import { TarifRow } from "@/features/administration/visibilite-sponsorisee/components/tarif-row";
import {
  listEntreprisesPourSelecteur,
  listSponsoredVisibilityCampagnesAdmin,
  listSponsoredVisibilityRatesAdmin,
} from "@/features/administration/visibilite-sponsorisee/queries/list-visibilite-admin";
import { requireAdminAccess } from "@/features/administration/permissions/guard";

export default async function AdminVisibiliteSponsoriseePage() {
  await requireAdminAccess("visibilite_sponsorisee", "gestion");

  const [tarifs, campagnes, categories, entreprises] = await Promise.all([
    listSponsoredVisibilityRatesAdmin(),
    listSponsoredVisibilityCampagnesAdmin(),
    listRootCategories(),
    listEntreprisesPourSelecteur(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Visibilité sponsorisée</h1>
        <p className="text-muted-foreground">
          Tarifs de mise en avant et campagnes de placement en cours pour les prestataires.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Créer un tarif</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateTarifForm categories={categories} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tarifs configurés ({tarifs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarif</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tarifs.map((tarif) => (
                <TarifRow key={tarif.id} tarif={tarif} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Créer une campagne</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCampagneForm entreprises={entreprises} categories={categories} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campagnes ({campagnes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prestataire</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Montant payé</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {campagnes.map((campagne) => (
                <CampagneRow key={campagne.id} campagne={campagne} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
