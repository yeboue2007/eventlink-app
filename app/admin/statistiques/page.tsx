import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecalculerStatsButton } from "@/features/administration/statistiques/components/recalculer-stats-button";
import { StatsChart } from "@/features/administration/statistiques/components/stats-chart";
import {
  getTotauxPlateforme,
  listDailyStats,
} from "@/features/administration/statistiques/queries/list-stats";
import { requireAdminAccess } from "@/features/administration/permissions/guard";

function formatFcfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

export default async function AdminStatistiquesPage() {
  await requireAdminAccess("statistiques", "lecture");
  const [totaux, dailyStats] = await Promise.all([getTotauxPlateforme(), listDailyStats(30)]);

  const revenuTotal30j = dailyStats.reduce((sum, d) => sum + d.revenus_fcfa, 0);
  const creditsConsommes30j = dailyStats.reduce((sum, d) => sum + d.credits_consommes, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Statistiques</h1>
          <p className="text-muted-foreground">
            Calculées quotidiennement (Vercel Cron), jamais recalculées à
            l&rsquo;affichage.
          </p>
        </div>
        <RecalculerStatsButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">Demandes (total)</p>
            <p className="text-2xl font-semibold text-foreground">{totaux.totalDemandes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">Offres (total)</p>
            <p className="text-2xl font-semibold text-foreground">{totaux.totalOffres}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">Entreprises inscrites</p>
            <p className="text-2xl font-semibold text-foreground">{totaux.totalEntreprises}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">Clients inscrits</p>
            <p className="text-2xl font-semibold text-foreground">{totaux.totalClients}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">Revenus (30 derniers jours)</p>
            <p className="text-2xl font-semibold text-el-violet">
              {formatFcfa(revenuTotal30j)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">Crédits consommés (30 derniers jours)</p>
            <p className="text-2xl font-semibold text-foreground">{creditsConsommes30j}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution (30 derniers jours)</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyStats.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune statistique calculée pour le moment — utilisez le bouton
              &laquo; Recalculer aujourd&rsquo;hui &raquo; ou attendez le prochain calcul
              automatique.
            </p>
          ) : (
            <StatsChart data={dailyStats} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
