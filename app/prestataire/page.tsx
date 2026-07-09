import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";
import { getCurrentEntreprise } from "@/features/entreprises/queries/get-current-entreprise";
import { listMatchingDemandesForPrestataire } from "@/features/demandes/queries/list-demandes";

export default async function EspacePrestatairePage() {
  const [current, entreprise, demandes] = await Promise.all([
    getCurrentProfile(),
    getCurrentEntreprise(),
    listMatchingDemandesForPrestataire(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Bonjour {current?.profile.full_name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          Votre espace prestataire — {entreprise?.nom}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Solde de crédits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-el-violet">
              {entreprise?.wallets?.balance ?? 0}
            </p>
            <p className="text-sm text-muted-foreground">crédits disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vérification</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="trust">
              {entreprise?.verification_level === "niveau_1" && "Niveau 1 — Téléphone vérifié"}
              {entreprise?.verification_level === "niveau_2" && "Niveau 2 — Pièce d'identité"}
              {entreprise?.verification_level === "niveau_3" && "Niveau 3 — Pro vérifié"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes correspondant à mes catégories</CardTitle>
          {demandes.length === 0 && (
            <CardDescription>
              Aucune demande pour le moment. Vérifiez vos{" "}
              <Link href="/prestataire/parametres/categories" className="text-primary hover:underline">
                catégories déclarées
              </Link>
              .
            </CardDescription>
          )}
        </CardHeader>
        {demandes.length > 0 && (
          <CardContent className="space-y-3">
            {demandes.slice(0, 5).map((demande) => (
              <div
                key={demande.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
              >
                <span className="font-medium text-foreground">{demande.titre}</span>
                <span className="text-muted-foreground">{demande.ville}</span>
              </div>
            ))}
            <Button asChild variant="outline" size="sm">
              <Link href="/prestataire/demandes">Voir toutes les demandes</Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
