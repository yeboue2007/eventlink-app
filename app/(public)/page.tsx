import Link from "next/link";
import { CheckCircle2, MessageSquare, Search, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BudgetSection } from "@/components/marketing/budget-section";
import { CategoryIcon } from "@/components/marketing/category-icon";
import { DemoPreview } from "@/components/marketing/demo-preview";
import { Hero } from "@/components/marketing/hero";
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
    titre: "Comparez et choisissez",
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
      <Hero />

      <DemoPreview />

      {/* Signature : un prestataire, plusieurs services */}
      <section className="border-y border-border bg-card py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 lg:grid-cols-2 lg:gap-10">
          <div className="text-center lg:text-left">
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
          <div className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
            <MultiServiceDiagram />
          </div>
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

      <BudgetSection />

      {/* Catégories */}
      {categories.length > 0 && (
        <section id="categories" className="border-t border-border bg-card py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Toutes les prestations pour votre événement
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/recherche?categorie=${category.id}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <CategoryIcon slug={category.slug} className="size-5 shrink-0 text-el-violet" />
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
            Recevez des demandes correspondant à vos services, sans
            commission sur vos contrats.
          </p>
          <Button asChild variant="primary" size="lg" className="mt-6">
            <Link href="/inscription/prestataire">Inscrire mon entreprise</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
