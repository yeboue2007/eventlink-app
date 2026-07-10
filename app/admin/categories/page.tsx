import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateCategoryForm } from "@/features/administration/categories/components/create-category-form";
import { ToggleCategoryActiveButton } from "@/features/administration/categories/components/toggle-category-active-button";
import { listAllCategoriesAdmin } from "@/features/administration/categories/queries/list-categories-admin";

export default async function AdminCategoriesPage() {
  const categories = await listAllCategoriesAdmin();
  const racines = categories.filter((c) => c.parent_id === null);

  function nomParent(parentId: number | null) {
    if (!parentId) return "—";
    return categories.find((c) => c.id === parentId)?.label ?? "—";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Catégories</h1>
        <p className="text-muted-foreground">
          Arbre illimité (catégorie → sous-catégorie → service) — aucune limite
          codée en dur.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter une catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCategoryForm categoriesRacines={racines} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les catégories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Libellé</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.label}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {nomParent(category.parent_id)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.active ? "success" : "outline"}>
                      {category.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ToggleCategoryActiveButton
                      categoryId={category.id}
                      active={category.active}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
