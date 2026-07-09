"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { sendMessageSchema } from "@/features/messagerie/schemas/message.schema";

export type SendMessageActionState = { error?: string } | undefined;

export async function sendMessageAction(
  demandeId: string,
  offreId: string,
  revalidateBasePath: string,
  _prevState: SendMessageActionState,
  formData: FormData
): Promise<SendMessageActionState> {
  const parsed = sendMessageSchema.safeParse({ content: formData.get("content") });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Message invalide" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté pour envoyer un message." };
  }

  const { error } = await supabase.from("messages").insert({
    demande_id: demandeId,
    offre_id: offreId,
    sender_id: user.id,
    type: "texte",
    content: parsed.data.content,
  });

  if (error) {
    return { error: "Impossible d'envoyer le message. Veuillez réessayer." };
  }

  revalidatePath(revalidateBasePath);
  return undefined;
}
