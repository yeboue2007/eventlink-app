import { CreateDemandeForm } from "@/features/demandes/components/create-demande-form";
import { listRootCategories } from "@/features/categories/queries/list-categories";

export default async function NouvelleDemandePage() {
  const categories = await listRootCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Publier une demande</h1>
        <p className="text-muted-foreground">
          Décrivez votre besoin, recevez plusieurs propositions de prestataires.
        </p>
      </div>

      <CreateDemandeForm categories={categories} />
    </div>
  );
}
