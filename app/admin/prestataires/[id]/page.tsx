import { notFound } from "next/navigation";

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
import { AjusterCreditsDialog } from "@/features/administration/credits/components/ajuster-credits-dialog";
import { requireAdminAccess } from "@/features/administration/permissions/guard";
import { getPrestataireAdminDetail } from "@/features/administration/prestataires/queries/get-prestataire-admin-detail";
import { StatutCompteSelect } from "@/features/administration/prestataires/components/statut-compte-select";
import { VerificationSelect } from "@/features/administration/prestataires/components/verification-select";
import { listWalletTransactions } from "@/features/credits/queries/list-credit-packs";

const LABEL_TYPE_TRANSACTION: Record<string, string> = {
  achat: "Achat de pack",
  depense: "Réponse à une demande",
  bonus_gratuit: "Bonus offert (admin)",
  remboursement: "Remboursement (admin)",
  promotion: "Promotion (admin)",
  correction_manuelle: "Correction manuelle (admin)",
  annulation: "Annulation (admin)",
};

export default async function AdminPrestataireDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const current = await requireAdminAccess("prestataires", "lecture");
  const { id } = await params;
  const entreprise = await getPrestataireAdminDetail(id);
  if (!entreprise) notFound();

  const peutGerer = current.profile.admin_role
    ? current.profile.admin_role === "super_admin" ||
      current.profile.admin_role === "admin" ||
      current.profile.admin_role === "support_client"
    : false;

  const categories = entreprise.prestataire_categories.map((pc) => pc.categories?.label).filter(Boolean);
  const abonnementActif = entreprise.prestataire_subscriptions.find((s) => s.status === "active");
  const transactions = await listWalletTransactions(entreprise.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{entreprise.nom}</h1>
        <p className="text-muted-foreground">{entreprise.ville}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statut du compte</CardTitle>
          </CardHeader>
          <CardContent>
            {peutGerer ? (
              <StatutCompteSelect entrepriseId={entreprise.id} statutActuel={entreprise.statut} />
            ) : (
              <Badge variant="outline">{entreprise.statut}</Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vérification</CardTitle>
          </CardHeader>
          <CardContent>
            {peutGerer ? (
              <VerificationSelect
                entrepriseId={entreprise.id}
                niveauActuel={entreprise.verification_level}
              />
            ) : (
              <Badge variant="trust">{entreprise.verification_level}</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Solde de crédits</CardTitle>
          {peutGerer && <AjusterCreditsDialog entrepriseId={entreprise.id} />}
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-2xl font-semibold text-el-violet">
            {entreprise.wallets?.balance ?? 0}
          </p>

          {transactions.length > 0 && (
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
                {transactions.slice(0, 10).map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{new Date(txn.created_at).toLocaleDateString("fr-FR")}</TableCell>
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
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catégories déclarées</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune catégorie déclarée.</p>
          ) : (
            categories.map((label) => <Badge key={label} variant="outline">{label}</Badge>)
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
        </CardHeader>
        <CardContent>
          {abonnementActif ? (
            <div className="space-y-1">
              <p className="font-medium text-foreground">
                {abonnementActif.subscription_plans?.label}
              </p>
              <p className="text-sm text-muted-foreground">
                Valide jusqu&rsquo;au{" "}
                {new Date(abonnementActif.end_date).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Formule gratuite (aucun abonnement actif).</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Membres</CardTitle>
          <CardDescription>
            La gestion des employés/agences arrivera avec une prochaine évolution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {entreprise.entreprise_membres.map((m) => (
            <div key={m.profiles?.id} className="flex items-center justify-between text-sm">
              <span>{m.profiles?.full_name}</span>
              <Badge variant="secondary">{m.role}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
