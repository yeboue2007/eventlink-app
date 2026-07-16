import Link from "next/link";
import { BarChart3, CreditCard, Settings, Tags, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";
import { peutAcceder, type ModuleAdmin } from "@/features/administration/permissions/permissions";

const RACCOURCIS: { href: string; icon: typeof BarChart3; titre: string; description: string; module: ModuleAdmin }[] = [
  {
    href: "/admin/statistiques",
    icon: BarChart3,
    titre: "Statistiques",
    description: "Demandes, offres, revenus, taux de conversion.",
    module: "statistiques",
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Back-office EventLink</h1>

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
