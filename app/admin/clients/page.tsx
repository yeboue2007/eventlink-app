import Link from "next/link";

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
import { ClientFilters } from "@/features/administration/clients/components/client-filters";
import { searchClientsAdmin } from "@/features/administration/clients/queries/search-clients-admin";
import { requireAdminAccess } from "@/features/administration/permissions/guard";
import { StatutCompteBadge } from "@/features/administration/prestataires/components/statut-compte-badge";

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ville?: string; statut?: string; page?: string }>;
}) {
  await requireAdminAccess("clients", "lecture");
  const params = await searchParams;

  const { results, total, page, totalPages } = await searchClientsAdmin({
    q: params.q,
    ville: params.ville,
    statut: params.statut as never,
    page: params.page ? Number(params.page) : 1,
  });

  function hrefForPage(p: number) {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) next.set(k, v);
    next.set("page", String(p));
    return `/admin/clients?${next.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
        <p className="text-muted-foreground">{total} client(s)</p>
      </div>

      <ClientFilters />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Demandes publiées</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link href={`/admin/clients/${c.id}`} className="font-medium text-foreground hover:underline">
                      {c.full_name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.ville ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{c.phone}</TableCell>
                  <TableCell>{c.nb_demandes}</TableCell>
                  <TableCell>
                    <StatutCompteBadge statut={c.statut} />
                  </TableCell>
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
