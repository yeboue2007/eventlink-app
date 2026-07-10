import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateCreditPackForm } from "@/features/administration/credit-packs/components/create-credit-pack-form";
import { ToggleCreditPackActiveButton } from "@/features/administration/credit-packs/components/toggle-credit-pack-active-button";
import { listAllCreditPacksAdmin } from "@/features/administration/credit-packs/queries/list-credit-packs-admin";

function formatFcfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

export default async function AdminCreditPacksPage() {
  const packs = await listAllCreditPacksAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Packs de crédits</h1>
        <p className="text-muted-foreground">
          Rien n&rsquo;est codé en dur côté application — tout vient de cette table.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un pack</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCreditPackForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Packs existants ({packs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Libellé</TableHead>
                <TableHead>Crédits</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Populaire</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {packs.map((pack) => (
                <TableRow key={pack.id}>
                  <TableCell>{pack.label}</TableCell>
                  <TableCell>{pack.credits_amount}</TableCell>
                  <TableCell>{formatFcfa(pack.price_fcfa)}</TableCell>
                  <TableCell>
                    {pack.is_popular && <Badge variant="default">Populaire</Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={pack.active ? "success" : "outline"}>
                      {pack.active ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ToggleCreditPackActiveButton packId={pack.id} active={pack.active} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
