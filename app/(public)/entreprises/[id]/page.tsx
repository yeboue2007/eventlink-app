import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarRating } from "@/features/avis/components/star-rating";
import { listReviewsForEntreprise } from "@/features/avis/queries/list-reviews";
import { getPublicEntrepriseProfile } from "@/features/entreprises/queries/get-current-entreprise";

const LABEL_VERIFICATION: Record<string, string> = {
  niveau_1: "Téléphone vérifié",
  niveau_2: "Pièce d'identité vérifiée",
  niveau_3: "Pro vérifié",
};

export default async function EntrepriseProfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entreprise = await getPublicEntrepriseProfile(id);
  if (!entreprise) notFound();

  const avis = await listReviewsForEntreprise(id);
  const categories = entreprise.prestataire_categories
    .map((pc) => pc.categories?.label)
    .filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-10">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold text-foreground">{entreprise.nom}</h1>
          <Badge variant="trust">{LABEL_VERIFICATION[entreprise.verification_level]}</Badge>
          {entreprise.is_solution_tout_en_un && (
            <Badge variant="secondary">Solution tout-en-un</Badge>
          )}
        </div>
        <p className="text-muted-foreground">{entreprise.ville}</p>
        {entreprise.note_moyenne !== null && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(entreprise.note_moyenne)} />
            <span className="text-sm text-muted-foreground">
              {entreprise.note_moyenne} ({entreprise.nb_avis} avis)
            </span>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((label) => (
            <span
              key={label}
              className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {entreprise.bio && (
        <Card>
          <CardContent className="py-5 text-sm text-foreground">{entreprise.bio}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Avis clients</CardTitle>
          {avis.length === 0 && (
            <CardDescription>Aucun avis pour le moment.</CardDescription>
          )}
        </CardHeader>
        {avis.length > 0 && (
          <CardContent className="space-y-4">
            {avis.map((review) => (
              <div key={review.id} className="border-b border-border pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {review.profiles?.full_name ?? "Client EventLink"}
                  </span>
                  <StarRating rating={review.rating} />
                </div>
                {review.comment && (
                  <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
