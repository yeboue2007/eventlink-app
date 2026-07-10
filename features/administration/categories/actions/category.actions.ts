"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/features/administration/categories/schemas/category.schema";

export type CategoryActionState = { error?: string } | undefined;

export async function createCategoryAction(
  _prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const parsed = categorySchema.safeParse({
    label: formData.get("label"),
    slug: formData.get("slug"),
    icon: formData.get("icon") || undefined,
    parentId: formData.get("parentId") || undefined,
    displayOrder: formData.get("displayOrder") || 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    label: parsed.data.label,
    slug: parsed.data.slug,
    icon: parsed.data.icon ?? null,
    parent_id: parsed.data.parentId ?? null,
    display_order: parsed.data.displayOrder,
  });

  if (error) {
    return {
      error: error.code === "23505" ? "Ce slug existe déjà." : "Impossible de créer la catégorie.",
    };
  }

  revalidatePath("/admin/categories");
  return undefined;
}

export async function toggleCategoryActiveAction(categoryId: number, active: boolean) {
  const supabase = await createClient();
  await supabase.from("categories").update({ active }).eq("id", categoryId);
  revalidatePath("/admin/categories");
}
