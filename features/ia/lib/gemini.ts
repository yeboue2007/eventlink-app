import "server-only";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Appel minimal à l'API Gemini (palier gratuit Google AI Studio — aucune
 * carte bancaire requise, limité en requêtes/minute). Simple appel REST
 * plutôt qu'un SDK, pour une seule fonctionnalité aussi ponctuelle.
 */
export async function demanderCompletion(prompt: string, maxTokens = 400): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
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
    throw new Error(`Gemini a répondu avec le statut ${response.status}`);
  }

  const data = await response.json();
  const texte: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!texte) throw new Error("Réponse IA vide.");
  return texte.trim();
}
