import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listRootCategories } from "@/features/categories/queries/list-categories";
import { UpdateCategoriesForm } from "@/features/entreprises/components/update-categories-form";
import {
  getCurrentEntreprise,
  listSelectedCategoryIds,
} from "@/features/entreprises/queries/get-current-entreprise";

export default async function CategoriesSettingsPage() {
  const entreprise = await getCurrentEntreprise();
  if (!entreprise) redirect("/prestataire");

  const [categories, selectedIds] = await Promise.all([
    listRootCategories(),
    listSelectedCategoryIds(entreprise.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mes catégories</h1>
        <p className="text-muted-foreground">
          Un prestataire multi-services : déclarez tout ce que vous proposez.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prestations proposées</CardTitle>
          <CardDescription>{entreprise.nom}</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateCategoriesForm
            entrepriseId={entreprise.id}
            categories={categories}
            selectedIds={selectedIds}
          />
        </CardContent>
      </Card>
    </div>
  );
}
