import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DemandeStatusBadge } from "@/features/demandes/components/demande-status-badge";
import { listDemandesForClient } from "@/features/demandes/queries/list-demandes";

function formatFcfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

export default async function DemandesPage() {
  const demandes = await listDemandesForClient();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Mes demandes</h1>
          <p className="text-muted-foreground">
            Retrouvez toutes vos demandes publiées et leur statut.
          </p>
        </div>
        <Button asChild variant="primary">
          <Link href="/client/demandes/nouvelle">Publier une demande</Link>
        </Button>
      </div>

      {demandes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucune demande pour le moment</CardTitle>
            <CardDescription>
              Publiez votre premier besoin pour recevoir des offres de
              prestataires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="primary">
              <Link href="/client/demandes/nouvelle">Publier une demande</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {demandes.map((demande) => (
            <Link key={demande.id} href={`/client/demandes/${demande.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between gap-4 py-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h2 className="font-medium text-foreground">{demande.titre}</h2>
                      <DemandeStatusBadge status={demande.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {demande.ville}
                      {demande.date_evenement &&
                        ` · ${new Date(demande.date_evenement).toLocaleDateString("fr-FR")}`}
                      {" · "}
                      {formatFcfa(demande.budget_min)} – {formatFcfa(demande.budget_max)}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {demande.demande_lots.map((lot) => (
                        <span
                          key={lot.id}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {lot.categories?.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
