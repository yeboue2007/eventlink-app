"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  deletePromotionAction,
  toggleActivePromotionAction,
} from "@/features/administration/promotions/actions/promotion.actions";
import type { PromotionAvecRelations } from "@/features/administration/promotions/queries/list-promotions-admin";

const LABEL_APPLIES_TO: Record<string, string> = {
  credit_pack: "Packs de crédits",
  abonnement: "Abonnements",
  les_deux: "Les deux",
};

function formatValeur(promo: PromotionAvecRelations) {
  return promo.discount_type === "pourcentage"
    ? `-${promo.discount_value}%`
    : `-${new Intl.NumberFormat("fr-FR").format(promo.discount_value)} FCFA`;
}

function cibles(promo: PromotionAvecRelations): string[] {
  const c: string[] = [];
  if (promo.target_ville) c.push(promo.target_ville);
  if (promo.categories) c.push(promo.categories.label);
  if (promo.target_min_seniority_days) c.push(`≥ ${promo.target_min_seniority_days} j`);
  if (promo.target_role) c.push(promo.target_role === "client" ? "Clients" : "Prestataires");
  if (promo.subscription_plans) c.push(promo.subscription_plans.label);
  return c;
}

export function PromotionRow({ promo }: { promo: PromotionAvecRelations }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleActivePromotionAction(promo.id, !promo.active);
      if (result?.error) toast.error(result.error);
    });
  }

  function handleDelete() {
    if (!confirm(`Supprimer définitivement la promotion "${promo.label}" ?`)) return;
    startTransition(async () => {
      const result = await deletePromotionAction(promo.id);
      if (result?.error) toast.error(result.error);
    });
  }

  const listeCibles = cibles(promo);

  return (
    <TableRow>
      <TableCell>
        <p className="font-medium text-foreground">{promo.label}</p>
        {promo.code && <p className="text-xs text-muted-foreground">Code : {promo.code}</p>}
      </TableCell>
      <TableCell className="text-muted-foreground">{LABEL_APPLIES_TO[promo.applies_to]}</TableCell>
      <TableCell>{formatValeur(promo)}</TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {new Date(promo.start_date).toLocaleDateString("fr-FR")} →{" "}
        {new Date(promo.end_date).toLocaleDateString("fr-FR")}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {listeCibles.length === 0 ? (
            <span className="text-xs text-muted-foreground">Tout le monde</span>
          ) : (
            listeCibles.map((c) => <Badge key={c} variant="outline">{c}</Badge>)
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={promo.active ? "success" : "outline"}>
          {promo.active ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={isPending} onClick={handleToggle}>
            {promo.active ? "Désactiver" : "Activer"}
          </Button>
          <Button size="sm" variant="ghost" disabled={isPending} onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
