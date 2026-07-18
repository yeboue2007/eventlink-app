import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { AuditFilters } from "@/features/administration/audit/components/audit-filters";
import { AuditLogRow } from "@/features/administration/audit/components/audit-log-row";
import {
  listActeursDistincts,
  listActionsDistinctes,
  searchAuditLog,
} from "@/features/administration/audit/queries/search-audit-log";
import { requireAdminAccess } from "@/features/administration/permissions/guard";

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{
    acteur?: string;
    action?: string;
    depuis?: string;
    jusqua?: string;
    page?: string;
  }>;
}) {
  await requireAdminAccess("audit", "lecture");
  const params = await searchParams;

  const [{ results, total, page, totalPages }, actions, acteurs] = await Promise.all([
    searchAuditLog({
      actorProfileId: params.acteur,
      action: params.action,
      depuis: params.depuis,
      jusqua: params.jusqua,
      page: params.page ? Number(params.page) : 1,
    }),
    listActionsDistinctes(),
    listActeursDistincts(),
  ]);

  function hrefForPage(p: number) {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) next.set(k, v);
    next.set("page", String(p));
    return `/admin/audit?${next.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Historique des actions</h1>
        <p className="text-muted-foreground">
          {total} action(s) enregistrée(s) — aucune modification sensible
          n&rsquo;est effectuée sans être tracée ici.
        </p>
      </div>

      <AuditFilters actions={actions} acteurs={acteurs} />

      <Card>
        <CardHeader>
          <CardTitle>Journal</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune action ne correspond à ces critères.
            </p>
          ) : (
            results.map((entry) => <AuditLogRow key={entry.id} entry={entry} />)
          )}
        </CardContent>
      </Card>

      <Pagination page={page} totalPages={totalPages} hrefForPage={hrefForPage} />
    </div>
  );
}
