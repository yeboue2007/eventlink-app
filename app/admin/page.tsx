import Link from "next/link";
import { CreditCard, Settings, Tags } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RACCOURCIS = [
  {
    href: "/admin/categories",
    icon: Tags,
    titre: "Catégories",
    description: "Créer de nouveaux métiers sans toucher au code.",
  },
  {
    href: "/admin/credit-packs",
    icon: CreditCard,
    titre: "Packs de crédits",
    description: "Prix, quantités, promotions de lancement.",
  },
  {
    href: "/admin/subscription-plans",
    icon: CreditCard,
    titre: "Abonnements",
    description: "Starter, Pro, Agence — prix et avantages.",
  },
  {
    href: "/admin/parametres",
    icon: Settings,
    titre: "Paramètres généraux",
    description: "Quotas, limites, badges — tout ce qui n'a pas encore sa table.",
  },
];

export default function EspaceAdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Back-office EventLink</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {RACCOURCIS.map((item) => {
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
