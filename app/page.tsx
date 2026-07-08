import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Page de vérification du système de design (Phase 1).
 * Sera remplacée par la landing réelle en Phase 5 (voir eventlink_landing.html
 * pour le contenu déjà validé côté marque).
 */
export default function DesignSystemCheckPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="space-y-2">
        <p className="text-sm font-medium text-el-violet">EventLink</p>
        <h1 className="text-el-gradient text-3xl font-semibold">
          Connexion. Confiance. Événements réussis.
        </h1>
        <p className="text-muted-foreground">
          Socle d&rsquo;architecture Phase 1 — arborescence, conventions et
          système de design. Aucune fonctionnalité métier sur cette page.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Aperçu des composants</CardTitle>
          <CardDescription>
            Vérification visuelle des tokens de marque appliqués au design system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Publier une demande</Button>
            <Button variant="default">Explorer les prestataires</Button>
            <Button variant="outline">En savoir plus</Button>
            <Button variant="ghost">Annuler</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="trust">Pro vérifié</Badge>
            <Badge variant="default">Sonorisation</Badge>
            <Badge variant="success">Offre acceptée</Badge>
            <Badge variant="warning">En attente</Badge>
            <Badge variant="outline">Mariage</Badge>
          </div>

          <div className="max-w-sm space-y-1.5">
            <Label htmlFor="check-email">Adresse e-mail</Label>
            <Input id="check-email" type="email" placeholder="vous@exemple.com" />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
