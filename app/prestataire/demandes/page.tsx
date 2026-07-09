import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listMatchingDemandesForPrestataire } from "@/features/demandes/queries/list-demandes";

function formatFcfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

export default async function DemandesCorrespondantesPage() {
  const demandes = await listMatchingDemandesForPrestataire();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Demandes correspondant à mes catégories
        </h1>
        <p className="text-muted-foreground">
          Ces demandes recoupent au moins une des prestations que vous avez
          déclarées.
        </p>
      </div>

      {demandes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucune demande pour le moment</CardTitle>
            <CardDescription>
              Vérifiez que vos catégories sont bien à jour dans{" "}
              <Link href="/prestataire/parametres/categories" className="text-primary hover:underline">
                Mes catégories
              </Link>
              , ou revenez plus tard.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {demandes.map((demande) => (
            <Link key={demande.id} href={`/prestataire/demandes/${demande.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="space-y-2 py-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium text-foreground">{demande.titre}</h2>
                    <span className="text-sm font-medium text-el-violet">
                      {formatFcfa(demande.budget_min)} – {formatFcfa(demande.budget_max)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {demande.ville}
                    {demande.date_evenement &&
                      ` · ${new Date(demande.date_evenement).toLocaleDateString("fr-FR")}`}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {demande.demande_lots.map((lot) => (
                      <span
                        key={lot.id}
                        className="rounded-full bg-secondary px-2 py-0.5 text-xs text-el-violet"
                      >
                        {lot.categories?.label}
                      </span>
                    ))}
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
