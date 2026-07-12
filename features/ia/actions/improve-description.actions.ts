"use server";

import { demanderCompletion } from "@/features/ia/lib/gemini";
import { isIaActivee } from "@/features/ia/lib/is-ia-enabled";

export type ImproveDescriptionState =
  | { error: string }
  | { suggestion: string };

const PROMPT_SYSTEME = `Tu aides un client à rédiger la description d'une demande de prestation événementielle sur EventLink, une plateforme à Abidjan. Reformule le texte fourni en français, de façon claire, concrète et professionnelle, pour aider les prestataires à bien comprendre le besoin. Ne rajoute aucune information inventée (pas de budget, pas de date, pas de lieu si non mentionnés). Réponds uniquement avec le texte reformulé, sans préambule ni guillemets.`;

/**
 * Aide à la rédaction (service optionnel du cahier des charges). Le
 * formulaire de demande fonctionne intégralement sans cette fonctionnalité
 * — elle ne fait qu'améliorer un champ texte optionnel.
 */
export async function improveDescriptionAction(rawText: string): Promise<ImproveDescriptionState> {
  if (!rawText || rawText.trim().length < 10) {
    return { error: "Ajoutez d'abord quelques mots à améliorer." };
  }

  const activee = await isIaActivee();
  if (!activee) {
    return { error: "L'assistant de rédaction est momentanément indisponible." };
  }

  try {
    const suggestion = await demanderCompletion(
      `${PROMPT_SYSTEME}\n\nTexte du client :\n"""${rawText.slice(0, 1500)}"""`,
      300
    );
    return { suggestion };
  } catch {
    return { error: "L'assistant de rédaction est momentanément indisponible." };
  }
}
