import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getCurrentSubscription,
  listActivePlans,
} from "@/features/abonnements/queries/list-plans";
import { SubscribeButton } from "@/features/abonnements/components/subscribe-button";
import { getCurrentEntreprise } from "@/features/entreprises/queries/get-current-entreprise";

function formatFcfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

export default async function AbonnementPage() {
  const entreprise = await getCurrentEntreprise();
  if (!entreprise) redirect("/prestataire");

  const [plans, abonnementActuel] = await Promise.all([
    listActivePlans(),
    getCurrentSubscription(entreprise.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mon abonnement</h1>
        <p className="text-muted-foreground">
          Un abonnement inclut des crédits chaque mois et des avantages de
          visibilité.
        </p>
      </div>

      {abonnementActuel ? (
        <Card>
          <CardHeader>
            <Badge variant="trust">Abonnement actif</Badge>
            <CardTitle>{abonnementActuel.subscription_plans?.label}</CardTitle>
            <CardDescription>
              Valide jusqu&rsquo;au{" "}
              {new Date(abonnementActuel.end_date).toLocaleDateString("fr-FR")}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">
              Vous n&rsquo;avez pas d&rsquo;abonnement actif — vous utilisez la formule
              gratuite.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map((plan) => {
          const avantages = (plan.features as { avantages?: string[] } | null)?.avantages ?? [];
          const estActuel = abonnementActuel?.subscription_plans?.id === plan.id;

          return (
            <Card key={plan.id}>
              <CardHeader>
                {plan.badge_label && <Badge variant="secondary">{plan.badge_label}</Badge>}
                <CardTitle>{plan.label}</CardTitle>
                <CardDescription>{plan.credits_included} crédits / mois</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-2xl font-semibold text-foreground">
                  {formatFcfa(plan.price_fcfa)}
                  <span className="text-sm font-normal text-muted-foreground">/mois</span>
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {avantages.map((avantage) => (
                    <li key={avantage}>• {avantage}</li>
                  ))}
                </ul>
                {estActuel ? (
                  <Badge variant="success">Formule actuelle</Badge>
                ) : (
                  <SubscribeButton
                    planId={plan.id}
                    amountFcfa={plan.price_fcfa}
                    planLabel={plan.label}
                    label={abonnementActuel ? "Changer pour ce plan" : "S'abonner"}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Le renouvellement n&rsquo;est pas automatique pour le moment : pensez à
        renouveler manuellement depuis cette page avant la date d&rsquo;expiration.
      </p>
    </div>
  );
}
