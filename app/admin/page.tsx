import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EspaceAdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Back-office EventLink</h1>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres commerciaux</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Le panneau d&rsquo;administration (crédits, abonnements, promotions)
            arrive en Phase 5.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
