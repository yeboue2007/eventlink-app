import { ArrowRight, Phone, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OFFRES = [
  {
    nom: "Prestataire A",
    verification: { label: "Téléphone vérifié", icone: Phone },
    prestations: "Sonorisation + DJ",
    prix: "850 000 FCFA",
  },
  {
    nom: "Prestataire B",
    verification: { label: "Pro vérifié", icone: ShieldCheck },
    prestations: "Sonorisation + DJ + Éclairage",
    prix: "980 000 FCFA",
  },
  {
    nom: "Prestataire C",
    verification: { label: "Multi-services", icone: Sparkles },
    prestations: "Sonorisation + DJ + Décoration",
    prix: "1 100 000 FCFA",
  },
];

export function DemoPreview() {
  return (
    <section className="border-y border-border bg-card py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <Badge variant="secondary">Aperçu</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
            Ce que vous recevez après avoir publié
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
          {/* Votre demande */}
          <div className="border-b border-border bg-el-navy px-6 py-5 text-white">
            <p className="text-xs font-medium uppercase tracking-wide text-white/60">
              Votre demande
            </p>
            <p className="mt-1 font-medium">Mariage • Abidjan • 250 invités</p>
            <p className="text-sm text-white/70">15 décembre 2026</p>
            <div className="mt-3 grid gap-1 text-sm text-white/80 sm:grid-cols-2">
              <p>
                <span className="text-white/60">Prestations : </span>
                Sonorisation + DJ + Décoration
              </p>
              <p>
                <span className="text-white/60">Budget : </span>
                800 000 – 1 200 000 FCFA
              </p>
            </div>
          </div>

          {/* Offres reçues */}
          <div className="px-6 py-6">
            <p className="text-sm font-medium text-foreground">3 propositions reçues</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {OFFRES.map((offre) => {
                const Icone = offre.verification.icone;
                return (
                  <Card key={offre.nom}>
                    <CardContent className="space-y-2 py-4">
                      <p className="font-medium text-foreground">{offre.nom}</p>
                      <p className="flex items-center gap-1.5 text-xs text-el-violet">
                        <Icone className="size-3.5" />
                        {offre.verification.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{offre.prestations}</p>
                      <p className="font-semibold text-foreground">{offre.prix}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-5 flex justify-center">
              <Button variant="primary">
                Comparer les offres
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
