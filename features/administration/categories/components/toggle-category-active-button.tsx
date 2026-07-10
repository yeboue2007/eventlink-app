"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { toggleCategoryActiveAction } from "@/features/administration/categories/actions/category.actions";

export function ToggleCategoryActiveButton({
  categoryId,
  active,
}: {
  categoryId: number;
  active: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant={active ? "outline" : "primary"}
      disabled={isPending}
      onClick={() => startTransition(() => toggleCategoryActiveAction(categoryId, !active))}
    >
      {active ? "Désactiver" : "Activer"}
    </Button>
  );
}
