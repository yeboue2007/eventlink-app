import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";
import { getDemandeById } from "@/features/demandes/queries/list-demandes";
import {
  getCurrentEntreprise,
  listSelectedCategoryIds,
} from "@/features/entreprises/queries/get-current-entreprise";
import { MessageThread } from "@/features/messagerie/components/message-thread";
import { listMessagesForOffre } from "@/features/messagerie/queries/list-messages";
import { CreateOffreForm } from "@/features/offres/components/create-offre-form";
import { OffreStatusBadge } from "@/features/offres/components/offre-status-badge";
import { listOffresForDemande } from "@/features/offres/queries/list-offres";

function formatFcfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

export default async function DemandePrestataireDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ offre_envoyee?: string }>;
}) {
  const { id } = await params;
  const { offre_envoyee } = await searchParams;

  const entreprise = await getCurrentEntreprise();
  if (!entreprise) redirect("/prestataire");

  const [demande, categoryIds, offres, current] = await Promise.all([
    getDemandeById(id),
    listSelectedCategoryIds(entreprise.id),
    listOffresForDemande(id),
    getCurrentProfile(),
  ]);

  if (!demande) notFound();

  const lotsCorrespondants = demande.demande_lots.filter((lot) =>
    categoryIds.includes(lot.category_id)
  );
  const monOffre = offres.find((o) => o.entreprise_id === entreprise.id);
  const mesMessages = monOffre ? await listMessagesForOffre(monOffre.id) : [];

  return (
    <div className="space-y-6">
      {offre_envoyee && (
        <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          Votre offre a été envoyée au client.
        </div>
      )}

      <div>
        <h1 className="text-2xl font-semibold text-foreground">{demande.titre}</h1>
        <p className="text-muted-foreground">
          {demande.ville}
          {demande.date_evenement &&
            ` · ${new Date(demande.date_evenement).toLocaleDateString("fr-FR")}`}
          {" · "}
          {formatFcfa(demande.budget_min)} – {formatFcfa(demande.budget_max)}
        </p>
      </div>

      {demande.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{demande.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {monOffre ? "Votre offre" : "Envoyer une offre"}
          </CardTitle>
          {!monOffre && lotsCorrespondants.length === 0 && (
            <CardDescription>
              Aucun de vos catégories déclarées ne correspond aux prestations
              de cette demande.{" "}
              <Link
                href="/prestataire/parametres/categories"
                className="text-primary hover:underline"
              >
                Mettre à jour mes catégories
              </Link>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {monOffre ? (
            <div className="space-y-2">
              <OffreStatusBadge status={monOffre.status} />
              <p className="text-lg font-semibold text-el-violet">
                {formatFcfa(monOffre.total_price)}
              </p>
            </div>
          ) : (
            lotsCorrespondants.length > 0 && (
              <CreateOffreForm
                entrepriseId={entreprise.id}
                demandeId={demande.id}
                lots={lotsCorrespondants}
              />
            )
          )}
        </CardContent>
      </Card>

      {monOffre && monOffre.status !== "refusee" && monOffre.status !== "retiree" && (
        <Card>
          <CardHeader>
            <CardTitle>Conversation avec le client</CardTitle>
          </CardHeader>
          <CardContent>
            <MessageThread
              demandeId={demande.id}
              offreId={monOffre.id}
              currentUserId={current?.user.id ?? ""}
              initialMessages={mesMessages}
              revalidateBasePath={`/prestataire/demandes/${demande.id}`}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
