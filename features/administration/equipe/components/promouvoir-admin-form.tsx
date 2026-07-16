"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { promouvoirAdminAction } from "@/features/administration/equipe/actions/equipe.actions";
import { labelRole, TOUS_LES_ROLES } from "@/features/administration/permissions/permissions";

export function PromouvoirAdminForm() {
  const [state, formAction, isPending] = useActionState(promouvoirAdminAction, undefined);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail du compte existant</Label>
        <Input id="email" name="email" type="email" required placeholder="personne@exemple.com" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="adminRole">Rôle</Label>
        <Select name="adminRole" defaultValue="support_client">
          <SelectTrigger id="adminRole">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TOUS_LES_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {labelRole(role)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button type="submit" variant="primary" disabled={isPending} className="w-full">
          {isPending ? "Promotion…" : "Promouvoir"}
        </Button>
      </div>

      {state?.error && (
        <p className="sm:col-span-3 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="sm:col-span-3 text-sm text-success" role="status">
          Compte promu avec succès.
        </p>
      )}
    </form>
  );
}
