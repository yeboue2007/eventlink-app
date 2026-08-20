import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { IndicateursTableauDeBord } from "@/features/administration/tableau-de-bord/queries/get-indicateurs";

type Alerte = { label: string; count: number; href: string };

export function AlertesTableauDeBord({
  indicateurs,
}: {
  indicateurs: IndicateursTableauDeBord;
}) {
  const alertes: Alerte[] = [
    {
      label: "vérification(s) prestataire en attente",
      count: indicateurs.verificationsEnAttente,
      href: "/admin/prestataires?verification=en_attente",
    },
    {
      label: "compte(s) prestataire suspendu(s)",
      count: indicateurs.entreprisesSuspendues,
      href: "/admin/prestataires?statut=suspendu",
    },
    {
      label: "compte(s) client suspendu(s)",
      count: indicateurs.clientsSuspendus,
      href: "/admin/clients?statut=suspendu",
    },
    {
      label: "erreur(s) système ces 7 derniers jours",
      count: indicateurs.erreurs7j,
      href: "/admin/journal-systeme?severite=error",
    },
    {
      label: "élément(s) en attente dans la corbeille",
      count: indicateurs.elementsCorbeille,
      href: "/admin/corbeille",
    },
  ].filter((a) => a.count > 0);

  if (alertes.length === 0) {
    return (
      <Card className="border-success/40 bg-success/5">
        <CardContent className="py-4 text-sm text-foreground">
          Aucun élément n&apos;attend d&apos;action administrateur en ce moment.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {alertes.map((alerte) => (
        <Link key={alerte.href} href={alerte.href}>
          <Card className="border-warning/40 bg-warning/5 transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertTriangle className="size-5 shrink-0 text-warning" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">{alerte.count}</span> {alerte.label}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
