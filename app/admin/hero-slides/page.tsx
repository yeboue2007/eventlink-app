import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateHeroSlideForm } from "@/features/administration/hero-slides/components/create-hero-slide-form";
import { HeroSlideRow } from "@/features/administration/hero-slides/components/hero-slide-row";
import { listHeroSlidesAdmin } from "@/features/administration/hero-slides/queries/list-hero-slides-admin";
import { requireAdminAccess } from "@/features/administration/permissions/guard";

export default async function AdminHeroSlidesPage() {
  await requireAdminAccess("configuration", "gestion");

  const slides = await listHeroSlidesAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Hero (page d&apos;accueil)</h1>
        <p className="text-muted-foreground">
          Photos du carrousel affiché en haut de la landing page. Une
          diapositive sans photo affiche une carte de repli avec son icône.
          Seules les diapositives « Visible » apparaissent sur le site.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter une diapositive</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateHeroSlideForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diapositives ({slides.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {slides.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune diapositive pour l&apos;instant.
            </p>
          ) : (
            slides.map((slide, i) => (
              <HeroSlideRow
                key={slide.id}
                slide={slide}
                isFirst={i === 0}
                isLast={i === slides.length - 1}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
