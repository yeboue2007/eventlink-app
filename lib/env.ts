import "server-only";

/**
 * Lit une variable d'environnement en la nettoyant des espaces/retours à la
 * ligne parasites. Un copier-coller depuis un gestionnaire de mots de passe,
 * un email ou certains éditeurs ajoute fréquemment un caractère invisible en
 * fin de valeur — invisible dans la plupart des interfaces, mais suffisant
 * pour faire échouer une validation stricte côté fournisseur (ex. le SDK S3
 * qui rejette un nom de bucket contenant un retour à la ligne caché).
 */
export function env(name: string): string | undefined {
  const value = process.env[name];
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}
