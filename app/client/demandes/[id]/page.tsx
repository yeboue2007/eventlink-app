import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DemandeStatusBadge } from "@/features/demandes/components/demande-status-badge";
import { getDemandeById } from "@/features/demandes/queries/list-demandes";
import { OffreCard } from "@/features/offres/components/offre-card";
import { listOffresForDemande } from "@/features/offres/queries/list-offres";

function formatFcfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

export default async function DemandeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creee?: string }>;
}) {
  const { id } = await params;
  const { creee } = await searchParams;
  const demande = await getDemandeById(id);

  if (!demande) notFound();

  const offres = await listOffresForDemande(id);

  return (
    <div className="space-y-6">
      {creee && (
        <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          Votre demande a été publiée avec succès. Les prestataires concernés
          vont être notifiés.
        </div>
      )}

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-foreground">{demande.titre}</h1>
        <DemandeStatusBadge status={demande.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Prestations demandées</CardTitle>
            <CardDescription>
              Un prestataire couvrant plusieurs lots peut envoyer une offre
              groupée.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demande.demande_lots.map((lot) => (
              <div
                key={lot.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
              >
                <span className="font-medium text-foreground">
                  {lot.categories?.label}
                </span>
                <DemandeStatusBadge status={lot.status} />
              </div>
            ))}

            {demande.description && (
              <div className="pt-2">
                <h3 className="mb-1 text-sm font-medium text-foreground">
                  Description
                </h3>
                <p className="text-sm text-muted-foreground">{demande.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Ville : </span>
              {demande.ville}
            </p>
            {demande.projets?.lieu && (
              <p>
                <span className="text-muted-foreground">Lieu : </span>
                {demande.projets.lieu}
              </p>
            )}
            {demande.date_evenement && (
              <p>
                <span className="text-muted-foreground">Date : </span>
                {new Date(demande.date_evenement).toLocaleDateString("fr-FR")}
              </p>
            )}
            <p>
              <span className="text-muted-foreground">Budget : </span>
              {formatFcfa(demande.budget_min)} – {formatFcfa(demande.budget_max)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offres reçues</CardTitle>
          {offres.length === 0 && (
            <CardDescription>
              Aucune offre pour le moment — les prestataires concernés ont été
              notifiés.
            </CardDescription>
          )}
        </CardHeader>
        {offres.length > 0 && (
          <CardContent className="space-y-3">
            {offres.map((offre) => (
              <OffreCard key={offre.id} offre={offre} demandeId={demande.id} />
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
