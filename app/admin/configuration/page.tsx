import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandColorsForm } from "@/features/administration/configuration/components/brand-colors-form";
import { LegalPageForm } from "@/features/administration/configuration/components/legal-page-form";
import { SiteTextsForm } from "@/features/administration/configuration/components/site-texts-form";
import {
  getBrandColors,
  getSiteTexts,
  listLegalPagesAdmin,
} from "@/features/administration/configuration/queries/list-configuration";
import { requireAdminAccess } from "@/features/administration/permissions/guard";

export default async function AdminConfigurationPage() {
  await requireAdminAccess("configuration", "gestion");

  const [couleurs, textes, pagesLegales] = await Promise.all([
    getBrandColors(),
    getSiteTexts(),
    listLegalPagesAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Configuration</h1>
        <p className="text-muted-foreground">
          Couleurs de marque, textes affichés sur le site public, et pages
          légales (CGU, confidentialité). Pas de logo ni de favicon
          dynamiques pour l&apos;instant.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Couleurs de marque</CardTitle>
        </CardHeader>
        <CardContent>
          <BrandColorsForm couleurs={couleurs} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Textes du site</CardTitle>
        </CardHeader>
        <CardContent>
          <SiteTextsForm textes={textes} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pages légales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {pagesLegales.map((page) => (
            <div key={page.slug} className="space-y-2 border-b border-border pb-8 last:border-0 last:pb-0">
              <h3 className="text-sm font-medium text-foreground">{page.title}</h3>
              <LegalPageForm page={page} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
