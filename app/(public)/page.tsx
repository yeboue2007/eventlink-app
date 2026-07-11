import Link from "next/link";
import { CheckCircle2, MessageSquare, Search, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MultiServiceDiagram } from "@/components/marketing/multi-service-diagram";
import { listRootCategories } from "@/features/categories/queries/list-categories";

const ETAPES = [
  {
    icon: Search,
    titre: "Décrivez votre besoin",
    description:
      "Type d'événement, budget, ville, prestations recherchées — en quelques minutes.",
  },
  {
    icon: MessageSquare,
    titre: "Recevez plusieurs offres",
    description:
      "Les prestataires concernés sont notifiés et vous répondent directement, avec prix et conditions.",
  },
  {
    icon: CheckCircle2,
    titre: "Choisissez en confiance",
    description:
      "Comparez, négociez par message, et acceptez l'offre qui vous convient.",
  },
];

const NIVEAUX_VERIFICATION = [
  { niveau: "Niveau 1", description: "Numéro de téléphone vérifié" },
  { niveau: "Niveau 2", description: "Pièce d'identité et justificatif d'activité" },
  { niveau: "Niveau 3", description: "Entreprise enregistrée — badge Pro vérifié" },
];

export default async function LandingPage() {
  const categories = await listRootCategories();

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 text-center">
        <p className="text-sm font-medium text-el-violet">EventLink</p>
        <h1 className="mx-auto mt-2 max-w-3xl text-4xl font-semibold text-foreground sm:text-5xl">
          <span className="text-el-gradient">Connexion. Confiance.</span>{" "}
          Événements réussis.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Décrivez votre événement, recevez plusieurs propositions de
          prestataires vérifiés à Abidjan, et choisissez en toute confiance.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/inscription/client">Publier une demande</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/recherche">Explorer les prestataires</Link>
          </Button>
        </div>
      </section>

      {/* Signature : un prestataire, plusieurs services */}
      <section className="border-y border-border bg-card py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-2">
          <div>
            <Badge variant="secondary">Différenciateur EventLink</Badge>
            <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
              Un prestataire, plusieurs services
            </h2>
            <p className="mt-3 text-muted-foreground">
              Vos prestataires ne sont pas limités à une seule catégorie. Une
              agence qui couvre sonorisation, DJ et éclairage peut répondre à
              votre demande avec une seule offre groupée — un seul prix, un
              seul fil de discussion, souvent à prix réduit.
            </p>
          </div>
          <MultiServiceDiagram />
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-semibold text-foreground sm:text-3xl">
          Comment ça marche
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {ETAPES.map((etape, index) => {
            const Icon = etape.icon;
            return (
              <Card key={etape.titre}>
                <CardContent className="space-y-3 py-6">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-full bg-el-gradient text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <Icon className="size-5 text-el-violet" />
                  </div>
                  <h3 className="font-medium text-foreground">{etape.titre}</h3>
                  <p className="text-sm text-muted-foreground">{etape.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Catégories */}
      {categories.length > 0 && (
        <section id="categories" className="border-t border-border bg-card py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Toutes les prestations pour votre événement
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/recherche?categorie=${category.id}`}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Confiance */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-6 text-el-navy" />
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Un indice de fiabilité, gratuit et public
          </h2>
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Chaque profil affiche son niveau de vérification, son taux de
          réponse et les avis clients — y compris pour les prestataires
          indépendants, sans structure formelle.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {NIVEAUX_VERIFICATION.map((niveau) => (
            <Card key={niveau.niveau}>
              <CardContent className="space-y-2 py-6">
                <Badge variant="trust">{niveau.niveau}</Badge>
                <p className="text-sm text-muted-foreground">{niveau.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA prestataire */}
      <section className="bg-el-navy py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Vous êtes prestataire événementiel ?
          </h2>
          <p className="mt-3 text-white/80">
            Recevez des demandes ciblées sur toutes vos catégories de
            services, sans commission sur vos contrats.
          </p>
          <Button asChild variant="primary" size="lg" className="mt-6">
            <Link href="/inscription/prestataire">Inscrire mon entreprise</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
