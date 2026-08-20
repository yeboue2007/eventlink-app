import Link from "next/link";
import { BarChart3, CreditCard, Settings, Tags, Users, Briefcase, UserCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";
import { peutAcceder, type ModuleAdmin } from "@/features/administration/permissions/permissions";
import { AlertesTableauDeBord } from "@/features/administration/tableau-de-bord/components/alertes";
import { KpiCard } from "@/features/administration/tableau-de-bord/components/kpi-card";
import { getIndicateursTableauDeBord } from "@/features/administration/tableau-de-bord/queries/get-indicateurs";

function formatFcfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

const RACCOURCIS: { href: string; icon: typeof BarChart3; titre: string; description: string; module: ModuleAdmin }[] = [
  {
    href: "/admin/statistiques",
    icon: BarChart3,
    titre: "Statistiques",
    description: "Demandes, offres, revenus, taux de conversion.",
    module: "statistiques",
  },
  {
    href: "/admin/prestataires",
    icon: Briefcase,
    titre: "Prestataires",
    description: "Recherche, filtres, vérification, statut de compte.",
    module: "prestataires",
  },
  {
    href: "/admin/clients",
    icon: UserCircle,
    titre: "Clients",
    description: "Recherche, statut de compte, historique des demandes.",
    module: "clients",
  },
  {
    href: "/admin/categories",
    icon: Tags,
    titre: "Catégories",
    description: "Créer de nouveaux métiers sans toucher au code.",
    module: "categories",
  },
  {
    href: "/admin/credit-packs",
    icon: CreditCard,
    titre: "Packs de crédits",
    description: "Prix, quantités, promotions de lancement.",
    module: "credits",
  },
  {
    href: "/admin/subscription-plans",
    icon: CreditCard,
    titre: "Abonnements",
    description: "Starter, Pro, Agence — prix et avantages.",
    module: "abonnements",
  },
  {
    href: "/admin/parametres",
    icon: Settings,
    titre: "Paramètres généraux",
    description: "Quotas, limites, badges — tout ce qui n'a pas encore sa table.",
    module: "parametres_generaux",
  },
  {
    href: "/admin/equipe",
    icon: Users,
    titre: "Équipe & permissions",
    description: "Rôles fixes du back-office.",
    module: "equipe",
  },
];

export default async function EspaceAdminPage() {
  const current = await getCurrentProfile();
  const adminRole = current?.profile.admin_role;

  const raccourcisVisibles = adminRole
    ? RACCOURCIS.filter((r) => peutAcceder(adminRole, r.module))
    : [];

  const peutVoirIndicateurs = adminRole
    ? peutAcceder(adminRole, "tableau_de_bord", "lecture")
    : false;

  const indicateurs = peutVoirIndicateurs ? await getIndicateursTableauDeBord() : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Back-office EventLink</h1>

      {indicateurs && (
        <>
          <AlertesTableauDeBord indicateurs={indicateurs} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Demandes (total)" value={indicateurs.totalDemandes} />
            <KpiCard label="Offres (total)" value={indicateurs.totalOffres} />
            <KpiCard label="Entreprises inscrites" value={indicateurs.totalEntreprises} />
            <KpiCard label="Clients inscrits" value={indicateurs.totalClients} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Revenus (7 derniers jours)"
              value={formatFcfa(indicateurs.revenu7j)}
            />
            <KpiCard
              label="Revenus (30 derniers jours)"
              value={formatFcfa(indicateurs.revenu30j)}
            />
            <KpiCard
              label="Nouvelles demandes ouvertes"
              value={indicateurs.demandesOuvertes7j}
              sousTexte="7 derniers jours"
            />
          </div>
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {raccourcisVisibles.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <Icon className="size-5 text-el-violet" />
                  <CardTitle>{item.titre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
