import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import type { EntreeJournalSysteme } from "@/features/administration/journal-systeme/queries/list-journal-systeme";

const VARIANT_SEVERITE: Record<string, "success" | "warning" | "destructive"> = {
  info: "success",
  warning: "warning",
  error: "destructive",
};

const LABEL_TYPE: Record<string, string> = {
  inscription: "Inscription",
  achat_credit: "Achat de crédits",
  achat_abonnement: "Achat d'abonnement",
  paiement_echoue: "Paiement échoué",
  job_cron: "Job planifié",
  erreur: "Erreur",
};

export function JournalSystemeRow({ entree }: { entree: EntreeJournalSysteme }) {
  return (
    <TableRow>
      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
        {new Date(entree.created_at).toLocaleString("fr-FR", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </TableCell>
      <TableCell>
        <Badge variant={VARIANT_SEVERITE[entree.severity] ?? "outline"}>
          {LABEL_TYPE[entree.event_type] ?? entree.event_type}
        </Badge>
      </TableCell>
      <TableCell>
        <p className="text-foreground">{entree.message ?? "—"}</p>
        {(entree.profiles?.full_name || entree.entreprises?.nom) && (
          <p className="text-xs text-muted-foreground">
            {entree.profiles?.full_name}
            {entree.profiles?.full_name && entree.entreprises?.nom ? " · " : ""}
            {entree.entreprises?.nom}
          </p>
        )}
      </TableCell>
    </TableRow>
  );
}
