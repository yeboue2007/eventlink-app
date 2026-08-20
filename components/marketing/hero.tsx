import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/marketing/hero-carousel";
import { getActiveHeroSlidesPublic } from "@/features/hero-slides/queries/get-active-hero-slides";

const REASSURANCES = [
  "Plusieurs propositions",
  "Prestataires vérifiés",
  "Négociation libre",
];

export async function Hero() {
  const slides = await getActiveHeroSlidesPublic();

  return (
    <section className="mx-auto max-w-6xl px-6 pt-10 pb-14 sm:pt-16 sm:pb-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Contenu */}
        <div className="text-center lg:text-left">
          <p className="text-sm font-medium text-el-violet">EventLink</p>
          <h1 className="mt-2 text-4xl font-semibold text-foreground sm:text-5xl">
            Trouvez les bons prestataires{" "}
            <span className="text-el-gradient">pour vos événements</span>.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground lg:mx-0">
            Décrivez votre événement une seule fois et recevez plusieurs
            propositions de prestataires adaptés à vos besoins.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button asChild variant="primary" size="lg">
              <Link href="/inscription/client">Publier une demande</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/recherche">Explorer les prestataires</Link>
            </Button>
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground lg:justify-start">
            {REASSURANCES.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-el-violet" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Carrousel photo — géré depuis /admin/hero-slides */}
        {slides.length > 0 && (
          <div className="flex justify-center lg:justify-end">
            <HeroCarousel slides={slides} />
          </div>
        )}
      </div>
    </section>
  );
}
