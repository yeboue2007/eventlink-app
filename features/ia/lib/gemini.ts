import "server-only";

import { env } from "@/lib/env";

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Appel minimal à l'API Gemini (palier gratuit Google AI Studio — aucune
 * carte bancaire requise, limité en requêtes/minute). Simple appel REST
 * plutôt qu'un SDK, pour une seule fonctionnalité aussi ponctuelle.
 */
export async function demanderCompletion(prompt: string, maxTokens = 400): Promise<string> {
  const apiKey = env("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY manquante.");

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.4 },
    }),
  });

  if (!response.ok) {
    const corps = await response.text().catch(() => "");
    throw new Error(`Gemini a répondu avec le statut ${response.status} : ${corps.slice(0, 500)}`);
  }

  const data = await response.json();
  const texte: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!texte) {
    throw new Error(`Réponse IA vide. Payload reçu : ${JSON.stringify(data).slice(0, 500)}`);
  }
  return texte.trim();
}
