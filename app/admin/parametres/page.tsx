import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateSettingForm } from "@/features/administration/platform-settings/components/create-setting-form";
import { EditSettingForm } from "@/features/administration/platform-settings/components/edit-setting-form";
import { listAllPlatformSettings } from "@/features/administration/platform-settings/queries/list-platform-settings";

export default async function AdminParametresPage() {
  const settings = await listAllPlatformSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Paramètres généraux</h1>
        <p className="text-muted-foreground">
          Tout réglage qui n&rsquo;a pas encore sa propre table dédiée (quotas,
          limites, badges…).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un paramètre</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateSettingForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres existants ({settings.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.key} className="space-y-1 border-b border-border pb-4 last:border-0">
              <p className="text-sm font-medium text-foreground">{setting.key}</p>
              {setting.description && (
                <CardDescription className="text-xs">{setting.description}</CardDescription>
              )}
              <EditSettingForm settingKey={setting.key} currentValue={setting.value} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
