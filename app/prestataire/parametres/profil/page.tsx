import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaGallery } from "@/features/entreprises/components/media-gallery";
import { UpdateEntrepriseProfileForm } from "@/features/entreprises/components/update-profile-form";
import {
  getCurrentEntreprise,
  listMediaFiles,
} from "@/features/entreprises/queries/get-current-entreprise";

export default async function ProfilEntreprisePage() {
  const entreprise = await getCurrentEntreprise();
  if (!entreprise) redirect("/prestataire");

  const media = await listMediaFiles(entreprise.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mon profil</h1>
        <p className="text-muted-foreground">
          Ces informations sont visibles publiquement sur votre fiche prestataire.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateEntrepriseProfileForm entreprise={entreprise} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaGallery entrepriseId={entreprise.id} initialMedia={media} />
        </CardContent>
      </Card>
    </div>
  );
}
