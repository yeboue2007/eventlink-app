import "server-only";
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY manquante.");
  client = new Anthropic({ apiKey });
  return client;
}

/**
 * Appel minimal à l'API Anthropic. Toute erreur (clé manquante, quota,
 * réseau) est laissée remonter à l'appelant, qui doit toujours prévoir un
 * repli gracieux — le module IA ne doit jamais bloquer une fonctionnalité
 * essentielle (règle du cahier des charges).
 */
export async function demanderCompletion(prompt: string, maxTokens = 400): Promise<string> {
  const anthropic = getClient();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });

  const bloc = message.content.find((b) => b.type === "text");
  if (!bloc || bloc.type !== "text") throw new Error("Réponse IA vide.");
  return bloc.text.trim();
}
