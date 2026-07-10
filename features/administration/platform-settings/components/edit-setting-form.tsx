"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePlatformSettingAction } from "@/features/administration/platform-settings/actions/platform-setting.actions";

export function EditSettingForm({
  settingKey,
  currentValue,
}: {
  settingKey: string;
  currentValue: unknown;
}) {
  const [state, formAction, isPending] = useActionState(
    updatePlatformSettingAction.bind(null, settingKey),
    undefined
  );

  const valeurAffichee =
    typeof currentValue === "string" ? currentValue : JSON.stringify(currentValue);

  return (
    <form action={formAction} className="flex items-start gap-2">
      <div className="flex-1">
        <Input name="value" defaultValue={valeurAffichee} />
        {state?.error && <p className="mt-1 text-xs text-destructive">{state.error}</p>}
      </div>
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        {isPending ? "…" : "Enregistrer"}
      </Button>
    </form>
  );
}
