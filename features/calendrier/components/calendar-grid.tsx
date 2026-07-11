"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  resetAvailabilityAction,
  setAvailabilityAction,
} from "@/features/calendrier/actions/availability.actions";
import { CONFIG_DISPONIBILITE } from "@/features/calendrier/components/availability-badge";
import type { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

const JOURS_SEMAINE = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const COULEUR_POINT: Record<string, string> = {
  disponible: "bg-success",
  occupe: "bg-warning",
  conge: "bg-muted-foreground",
  indisponible: "bg-destructive",
  maintenance: "bg-el-violet",
};

export function CalendarGrid({
  entrepriseId,
  year,
  month,
  slots,
}: {
  entrepriseId: string;
  year: number;
  month: number; // 1-12
  slots: Tables<"availability_slots">[];
}) {
  const router = useRouter();
  const [jourSelectionne, setJourSelectionne] = useState<string | null>(null);

  const slotParDate = new Map(slots.map((s) => [s.date, s]));

  const premierJour = new Date(year, month - 1, 1);
  const nbJours = new Date(year, month, 0).getDate();
  // Lundi = 0 ... Dimanche = 6
  const decalage = (premierJour.getDay() + 6) % 7;

  const cases: (string | null)[] = [
    ...Array(decalage).fill(null),
    ...Array.from({ length: nbJours }, (_, i) => {
      const jour = i + 1;
      return `${year}-${String(month).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;
    }),
  ];

  function changerMois(delta: number) {
    const d = new Date(year, month - 1 + delta, 1);
    router.push(`/prestataire/calendrier?year=${d.getFullYear()}&month=${d.getMonth() + 1}`);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => changerMois(-1)}>
          ← Mois précédent
        </Button>
        <p className="font-medium text-foreground">
          {premierJour.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
        </p>
        <Button variant="outline" size="sm" onClick={() => changerMois(1)}>
          Mois suivant →
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-muted-foreground">
        {JOURS_SEMAINE.map((jour) => (
          <div key={jour}>{jour}</div>
        ))}
      </div>

      <div className="mt-1.5 grid grid-cols-7 gap-1.5">
        {cases.map((date, i) => {
          if (!date) return <div key={`vide-${i}`} />;
          const slot = slotParDate.get(date);
          const jourNum = Number(date.slice(-2));
          return (
            <button
              key={date}
              type="button"
              onClick={() => setJourSelectionne(date)}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-border text-sm hover:border-primary"
            >
              <span>{jourNum}</span>
              {slot && slot.status !== "disponible" && (
                <span className={cn("size-1.5 rounded-full", COULEUR_POINT[slot.status])} />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        {Object.entries(CONFIG_DISPONIBILITE).map(([key, config]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", COULEUR_POINT[key])} />
            {config.label}
          </span>
        ))}
      </div>

      {jourSelectionne && (
        <EditDayDialog
          entrepriseId={entrepriseId}
          date={jourSelectionne}
          slot={slotParDate.get(jourSelectionne)}
          onClose={() => setJourSelectionne(null)}
        />
      )}
    </div>
  );
}

function EditDayDialog({
  entrepriseId,
  date,
  slot,
  onClose,
}: {
  entrepriseId: string;
  date: string;
  slot?: Tables<"availability_slots">;
  onClose: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    setAvailabilityAction.bind(null, entrepriseId),
    undefined
  );

  useEffect(() => {
    if (state?.success) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {new Date(date).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="date" value={date} />

          <div className="space-y-1.5">
            <Label htmlFor="status">Statut</Label>
            <Select name="status" defaultValue={slot?.status ?? "disponible"}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CONFIG_DISPONIBILITE).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">Note (optionnel)</Label>
            <Textarea id="note" name="note" defaultValue={slot?.note ?? ""} rows={2} />
          </div>

          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

          <DialogFooter>
            {slot && (
              <Button
                type="button"
                variant="ghost"
                onClick={async () => {
                  await resetAvailabilityAction(entrepriseId, date);
                  onClose();
                }}
              >
                Réinitialiser
              </Button>
            )}
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
