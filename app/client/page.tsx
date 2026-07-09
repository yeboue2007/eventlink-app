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
import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";

export default async function EspaceClientPage() {
  const [current, demandes] = await Promise.all([
    getCurrentProfile(),
    listDemandesForClient(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Bonjour {current?.profile.full_name?.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground">
            Votre espace organisateur d&rsquo;événements.
          </p>
        </div>
        <Button asChild variant="primary">
          <Link href="/client/demandes/nouvelle">Publier une demande</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes demandes récentes</CardTitle>
          {demandes.length === 0 && (
            <CardDescription>
              Vous n&rsquo;avez pas encore publié de demande.
            </CardDescription>
          )}
        </CardHeader>
        {demandes.length > 0 && (
          <CardContent className="space-y-3">
            {demandes.slice(0, 5).map((demande) => (
              <Link
                key={demande.id}
                href={`/client/demandes/${demande.id}`}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:bg-muted"
              >
                <span className="font-medium text-foreground">{demande.titre}</span>
                <DemandeStatusBadge status={demande.status} />
              </Link>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
