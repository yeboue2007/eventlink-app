import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";

export default async function EspaceClientPage() {
  const current = await getCurrentProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Bonjour {current?.profile.full_name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          Votre espace organisateur d&rsquo;événements.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes projets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucun projet pour le moment — la publication de demandes arrive en
            Phase 5.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
