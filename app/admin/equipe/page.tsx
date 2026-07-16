import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminRow } from "@/features/administration/equipe/components/admin-row";
import { PromouvoirAdminForm } from "@/features/administration/equipe/components/promouvoir-admin-form";
import { listAdmins } from "@/features/administration/equipe/queries/list-admins";
import { requireAdminAccess } from "@/features/administration/permissions/guard";
import { labelRole } from "@/features/administration/permissions/permissions";

export default async function AdminEquipePage() {
  const current = await requireAdminAccess("equipe", "lecture");
  const admins = await listAdmins();
  const peutGerer = current.profile.admin_role === "super_admin";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Équipe &amp; permissions</h1>
        <p className="text-muted-foreground">
          5 rôles fixes (Super Administrateur, Administrateur, Support Client,
          Modérateur, Comptabilité) — les permissions de chaque rôle sont
          définies dans le code, pas éditables ici.
        </p>
      </div>

      {peutGerer && (
        <Card>
          <CardHeader>
            <CardTitle>Promouvoir un compte existant</CardTitle>
            <CardDescription>
              La personne doit déjà avoir un compte client ou prestataire sur
              EventLink.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PromouvoirAdminForm />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Comptes administrateurs ({admins.length})</CardTitle>
          {!peutGerer && (
            <CardDescription>
              Lecture seule — seul un Super Administrateur peut modifier les
              rôles.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {admins.map((admin) =>
            peutGerer ? (
              <AdminRow
                key={admin.id}
                profileId={admin.id}
                nom={admin.full_name}
                role={admin.admin_role ?? "support_client"}
                estMoi={admin.id === current.user.id}
              />
            ) : (
              <div key={admin.id} className="flex items-center justify-between border-b border-border py-3 last:border-0">
                <p className="font-medium text-foreground">{admin.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {admin.admin_role ? labelRole(admin.admin_role) : "—"}
                </p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
