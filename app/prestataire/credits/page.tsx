import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BuyCreditPackButton } from "@/features/credits/components/buy-credit-pack-button";
import {
  listActiveCreditPacks,
  listWalletTransactions,
} from "@/features/credits/queries/list-credit-packs";
import { getCurrentEntreprise } from "@/features/entreprises/queries/get-current-entreprise";

function formatFcfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

const LABEL_TYPE_TRANSACTION: Record<string, string> = {
  achat: "Achat de pack",
  depense: "Réponse à une demande",
  bonus_gratuit: "Bonus gratuit",
  remboursement: "Remboursement",
  promotion: "Promotion",
  correction_manuelle: "Correction manuelle",
  annulation: "Annulation",
};

export default async function CreditsPage() {
  const entreprise = await getCurrentEntreprise();
  if (!entreprise) redirect("/prestataire");

  const [packs, transactions] = await Promise.all([
    listActiveCreditPacks(),
    listWalletTransactions(entreprise.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mes crédits</h1>
        <p className="text-muted-foreground">
          Les crédits sont utilisés pour répondre aux demandes des clients.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solde actuel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-el-violet">
            {entreprise.wallets?.balance ?? 0}
          </p>
          <p className="text-sm text-muted-foreground">crédits disponibles</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Acheter des crédits
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {packs.map((pack) => (
            <Card key={pack.id} className={pack.is_popular ? "border-primary" : undefined}>
              <CardHeader>
                {pack.is_popular && <Badge variant="default">Le plus populaire</Badge>}
                <CardTitle>{pack.label}</CardTitle>
                <CardDescription>{pack.credits_amount} crédits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-2xl font-semibold text-foreground">
                  {formatFcfa(pack.price_fcfa)}
                </p>
                <BuyCreditPackButton
                  packId={pack.id}
                  amountFcfa={pack.price_fcfa}
                  packLabel={pack.label}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
          {transactions.length === 0 && (
            <CardDescription>Aucun mouvement pour le moment.</CardDescription>
          )}
        </CardHeader>
        {transactions.length > 0 && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Solde après</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>
                      {new Date(txn.created_at).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>{LABEL_TYPE_TRANSACTION[txn.type] ?? txn.type}</TableCell>
                    <TableCell className={txn.amount >= 0 ? "text-success" : "text-destructive"}>
                      {txn.amount >= 0 ? "+" : ""}
                      {txn.amount}
                    </TableCell>
                    <TableCell>{txn.balance_after}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
