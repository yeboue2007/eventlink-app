"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { setAvailabilitySchema } from "@/features/calendrier/schemas/availability.schema";

export type SetAvailabilityState = { error?: string; success?: boolean } | undefined;

export async function setAvailabilityAction(
  entrepriseId: string,
  _prevState: SetAvailabilityState,
  formData: FormData
): Promise<SetAvailabilityState> {
  const parsed = setAvailabilitySchema.safeParse({
    date: formData.get("date"),
    status: formData.get("status"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("availability_slots").upsert(
    {
      entreprise_id: entrepriseId,
      date: parsed.data.date,
      status: parsed.data.status,
      note: parsed.data.note ?? null,
    },
    { onConflict: "entreprise_id,date" }
  );

  if (error) {
    return { error: "Impossible de mettre à jour le calendrier." };
  }

  revalidatePath("/prestataire/calendrier");
  return { success: true };
}

/** Réinitialise un jour à "disponible" en supprimant simplement le créneau
 *  explicite — l'absence de ligne équivaut par défaut à disponible. */
export async function resetAvailabilityAction(entrepriseId: string, date: string) {
  const supabase = await createClient();
  await supabase
    .from("availability_slots")
    .delete()
    .eq("entreprise_id", entrepriseId)
    .eq("date", date);

  revalidatePath("/prestataire/calendrier");
}
