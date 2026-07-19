"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ajusterCreditsAction } from "@/features/administration/credits/actions/ajuster-credits.actions";

const OPTIONS_TYPE = [
  { value: "bonus_gratuit", label: "Bonus offert" },
  { value: "correction_manuelle", label: "Correction de solde" },
  { value: "remboursement", label: "Remboursement" },
  { value: "promotion", label: "Promotion" },
  { value: "annulation", label: "Annulation" },
];

export function AjusterCreditsDialog({ entrepriseId }: { entrepriseId: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await ajusterCreditsAction(entrepriseId, undefined, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success("Crédits ajustés.");
        setOpen(false);
        formRef.current?.reset();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Ajuster les crédits</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajuster le solde de crédits</DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="montant">Montant</Label>
            <Input
              id="montant"
              name="montant"
              type="number"
              placeholder="Ex. 10 pour ajouter, -10 pour retirer"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="type">Type d&rsquo;opération</Label>
            <Select name="type" defaultValue="correction_manuelle">
              <SelectTrigger id="type"><SelectValue /></SelectTrigger>
              <SelectContent>
                {OPTIONS_TYPE.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="justification">Justification (obligatoire)</Label>
            <Textarea
              id="justification"
              name="justification"
              rows={3}
              required
              minLength={5}
              placeholder="Raison de cet ajustement…"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Application…" : "Appliquer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
