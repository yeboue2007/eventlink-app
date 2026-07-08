import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";

export default async function EspacePrestatairePage() {
  const current = await getCurrentProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Bonjour {current?.profile.full_name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          Votre espace prestataire — entreprise {current?.profile.company_name}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes correspondant à mes catégories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Rien pour le moment — le matching et les crédits arrivent en Phase 5.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
