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
import { CreateSubscriptionPlanForm } from "@/features/administration/subscription-plans/components/create-subscription-plan-form";
import { ToggleSubscriptionPlanActiveButton } from "@/features/administration/subscription-plans/components/toggle-subscription-plan-active-button";
import { listAllSubscriptionPlansAdmin } from "@/features/administration/subscription-plans/queries/list-subscription-plans-admin";

function formatFcfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

export default async function AdminSubscriptionPlansPage() {
  const plans = await listAllSubscriptionPlansAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Plans d&rsquo;abonnement</h1>
        <p className="text-muted-foreground">
          Nom, prix, crédits inclus et avantages — tout modifiable ici.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un plan</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateSubscriptionPlanForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plans existants ({plans.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Libellé</TableHead>
                <TableHead>Prix / mois</TableHead>
                <TableHead>Crédits inclus</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    {plan.label}
                    {plan.badge_label && (
                      <Badge variant="secondary" className="ml-2">
                        {plan.badge_label}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatFcfa(plan.price_fcfa)}</TableCell>
                  <TableCell>{plan.credits_included}</TableCell>
                  <TableCell>
                    <Badge variant={plan.active ? "success" : "outline"}>
                      {plan.active ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ToggleSubscriptionPlanActiveButton planId={plan.id} active={plan.active} />
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
