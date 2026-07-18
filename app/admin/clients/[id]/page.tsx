import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DemandeStatusBadge } from "@/features/demandes/components/demande-status-badge";
import { getClientAdminDetail } from "@/features/administration/clients/queries/get-client-admin-detail";
import { StatutClientSelect } from "@/features/administration/clients/components/statut-client-select";
import { requireAdminAccess } from "@/features/administration/permissions/guard";

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const current = await requireAdminAccess("clients", "lecture");
  const { id } = await params;
  const detail = await getClientAdminDetail(id);
  if (!detail) notFound();

  const peutGerer = current.profile.admin_role
    ? current.profile.admin_role === "super_admin" ||
      current.profile.admin_role === "admin" ||
      current.profile.admin_role === "support_client"
    : false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{detail.profile.full_name}</h1>
        <p className="text-muted-foreground">
          {detail.profile.ville ?? "—"} · {detail.profile.phone}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statut du compte</CardTitle>
        </CardHeader>
        <CardContent>
          {peutGerer ? (
            <StatutClientSelect profileId={detail.profile.id} statutActuel={detail.profile.statut} />
          ) : (
            <Badge variant="outline">{detail.profile.statut}</Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demandes ({detail.demandes.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {detail.demandes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune demande publiée.</p>
          ) : (
            detail.demandes.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
              >
                <div>
                  <p className="font-medium text-foreground">{d.titre}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.ville} ·{" "}
                    {d.demande_lots.map((l) => l.categories?.label).filter(Boolean).join(", ")}
                  </p>
                </div>
                <DemandeStatusBadge status={d.status} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
