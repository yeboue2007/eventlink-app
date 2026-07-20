import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listRootCategories } from "@/features/categories/queries/list-categories";
import { CreatePromotionForm } from "@/features/administration/promotions/components/create-promotion-form";
import { PromotionRow } from "@/features/administration/promotions/components/promotion-row";
import { listAllPromotionsAdmin } from "@/features/administration/promotions/queries/list-promotions-admin";
import { requireAdminAccess } from "@/features/administration/permissions/guard";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPromotionsPage() {
  await requireAdminAccess("promotions", "gestion");

  const supabase = await createClient();
  const [promotions, categories, { data: plans }] = await Promise.all([
    listAllPromotionsAdmin(),
    listRootCategories(),
    supabase.from("subscription_plans").select("*").eq("active", true),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Promotions</h1>
        <p className="text-muted-foreground">
          Globales, par ville, catégorie, ancienneté, type de compte ou
          abonnement.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Créer une promotion</CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePromotionForm categories={categories} plans={plans ?? []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Promotions existantes ({promotions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Libellé</TableHead>
                <TableHead>S&rsquo;applique à</TableHead>
                <TableHead>Remise</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Ciblage</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => (
                <PromotionRow key={promo.id} promo={promo} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
