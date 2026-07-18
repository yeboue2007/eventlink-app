import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listRootCategories } from "@/features/categories/queries/list-categories";
import { PrestataireFilters } from "@/features/administration/prestataires/components/prestataire-filters";
import { StatutCompteBadge } from "@/features/administration/prestataires/components/statut-compte-badge";
import { searchPrestatairesAdmin } from "@/features/administration/prestataires/queries/search-prestataires-admin";
import { requireAdminAccess } from "@/features/administration/permissions/guard";

const LABEL_VERIFICATION: Record<string, string> = {
  niveau_1: "Niveau 1",
  niveau_2: "Niveau 2",
  niveau_3: "Niveau 3",
};

export default async function AdminPrestatairesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    ville?: string;
    categorie?: string;
    verification?: string;
    statut?: string;
    plan?: string;
    tri?: string;
    page?: string;
  }>;
}) {
  await requireAdminAccess("prestataires", "lecture");
  const params = await searchParams;
  const categories = await listRootCategories();

  const { results, total, page, totalPages } = await searchPrestatairesAdmin({
    q: params.q,
    ville: params.ville,
    categoryId: params.categorie ? Number(params.categorie) : undefined,
    verificationLevel: params.verification as never,
    statut: params.statut as never,
    planSlug: params.plan,
    tri: params.tri as never,
    page: params.page ? Number(params.page) : 1,
  });

  function hrefForPage(p: number) {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) next.set(k, v);
    next.set("page", String(p));
    return `/admin/prestataires?${next.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Prestataires</h1>
        <p className="text-muted-foreground">{total} prestataire(s)</p>
      </div>

      <PrestataireFilters categories={categories} />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Catégories</TableHead>
                <TableHead>Vérification</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Offres</TableHead>
                <TableHead>Fiabilité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((p) => (
                <TableRow key={p.id} className="cursor-pointer">
                  <TableCell>
                    <Link href={`/admin/prestataires/${p.id}`} className="font-medium text-foreground hover:underline">
                      {p.nom}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.ville}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {p.prestataire_categories.slice(0, 2).map((pc) => (
                        <Badge key={pc.categories?.id} variant="outline">
                          {pc.categories?.label}
                        </Badge>
                      ))}
                      {p.prestataire_categories.length > 2 && (
                        <Badge variant="outline">+{p.prestataire_categories.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {LABEL_VERIFICATION[p.verification_level]}
                  </TableCell>
                  <TableCell>
                    <StatutCompteBadge statut={p.statut} />
                  </TableCell>
                  <TableCell>{p.nb_offres}</TableCell>
                  <TableCell>{p.note_fiabilite ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination page={page} totalPages={totalPages} hrefForPage={hrefForPage} />
    </div>
  );
}
