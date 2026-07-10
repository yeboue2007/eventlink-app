import Link from "next/link";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { EntrepriseResultat } from "@/features/recherche/queries/search-entreprises";

const LABEL_VERIFICATION: Record<string, string> = {
  niveau_1: "Téléphone vérifié",
  niveau_2: "Pièce d'identité vérifiée",
  niveau_3: "Pro vérifié",
};

export function EntrepriseResultCard({ entreprise }: { entreprise: EntrepriseResultat }) {
  const categories = entreprise.prestataire_categories
    .map((pc) => pc.categories?.label)
    .filter(Boolean);

  return (
    <Link href={`/entreprises/${entreprise.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="space-y-3 py-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-foreground">{entreprise.nom}</h3>
            {entreprise.verification_level === "niveau_3" && (
              <Badge variant="trust">Pro vérifié</Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">{entreprise.ville}</p>

          {entreprise.note_moyenne !== null && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="size-4 fill-el-gold text-el-gold" />
              <span className="font-medium text-foreground">{entreprise.note_moyenne}</span>
              <span className="text-muted-foreground">({entreprise.nb_avis} avis)</span>
            </div>
          )}

          {entreprise.is_solution_tout_en_un && (
            <Badge variant="secondary">Solution tout-en-un</Badge>
          )}

          <div className="flex flex-wrap gap-1.5">
            {categories.map((label) => (
              <span
                key={label}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>

          {entreprise.verification_level !== "niveau_3" && (
            <p className="text-xs text-muted-foreground">
              {LABEL_VERIFICATION[entreprise.verification_level]}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
