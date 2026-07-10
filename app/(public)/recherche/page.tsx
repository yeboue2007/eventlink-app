import { Pagination } from "@/components/ui/pagination";
import { listRootCategories } from "@/features/categories/queries/list-categories";
import { EntrepriseResultCard } from "@/features/recherche/components/entreprise-result-card";
import { SearchFilters } from "@/features/recherche/components/search-filters";
import { searchEntreprises } from "@/features/recherche/queries/search-entreprises";

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    ville?: string;
    categorie?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const categories = await listRootCategories();

  const { results, total, page, totalPages } = await searchEntreprises({
    q: params.q,
    ville: params.ville,
    categoryId: params.categorie ? Number(params.categorie) : undefined,
    page: params.page ? Number(params.page) : 1,
  });

  function hrefForPage(p: number) {
    const next = new URLSearchParams();
    if (params.q) next.set("q", params.q);
    if (params.ville) next.set("ville", params.ville);
    if (params.categorie) next.set("categorie", params.categorie);
    next.set("page", String(p));
    return `/recherche?${next.toString()}`;
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Trouvez votre prestataire
        </h1>
        <p className="text-muted-foreground">
          {total} prestataire{total > 1 ? "s" : ""} correspondant
          {total > 1 ? "ent" : ""} à votre recherche.
        </p>
      </div>

      <SearchFilters categories={categories} />

      {results.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Aucun prestataire ne correspond à ces critères pour le moment.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((entreprise) => (
            <EntrepriseResultCard key={entreprise.id} entreprise={entreprise} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} hrefForPage={hrefForPage} />
    </main>
  );
}
