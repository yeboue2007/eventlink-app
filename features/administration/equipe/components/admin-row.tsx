"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  changerRoleAdminAction,
  retirerAdminAction,
} from "@/features/administration/equipe/actions/equipe.actions";
import {
  labelRole,
  TOUS_LES_ROLES,
  type AdminRole,
} from "@/features/administration/permissions/permissions";

export function AdminRow({
  profileId,
  nom,
  role,
  estMoi,
}: {
  profileId: string;
  nom: string;
  role: AdminRole;
  estMoi: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleRoleChange(nouveauRole: string) {
    startTransition(async () => {
      const result = await changerRoleAdminAction(profileId, nouveauRole as AdminRole);
      if (result?.error) toast.error(result.error);
      else toast.success("Rôle mis à jour.");
    });
  }

  function handleRetirer() {
    startTransition(async () => {
      const result = await retirerAdminAction(profileId);
      if (result?.error) toast.error(result.error);
      else toast.success("Droits d'administration retirés.");
    });
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-0">
      <div>
        <p className="font-medium text-foreground">
          {nom} {estMoi && <span className="text-xs text-muted-foreground">(vous)</span>}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Select value={role} onValueChange={handleRoleChange} disabled={estMoi || isPending}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TOUS_LES_ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {labelRole(r)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          disabled={estMoi || isPending}
          onClick={handleRetirer}
        >
          Retirer
        </Button>
      </div>
    </div>
  );
}
