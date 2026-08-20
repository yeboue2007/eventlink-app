import { createElement } from "react";
import {
  Building2,
  Camera,
  Clapperboard,
  Lightbulb,
  Music2,
  PartyPopper,
  Presentation,
  ShieldCheck,
  Speaker,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

/**
 * La liste et les libellés des catégories viennent toujours de la table
 * `categories` (listRootCategories) — ce mapping ne fait que choisir une
 * icône de présentation par slug. Tout nouveau slug non listé ici retombe
 * silencieusement sur une icône neutre plutôt que de casser l'affichage.
 */
const ICONES_PAR_SLUG: Record<string, LucideIcon> = {
  sonorisation: Speaker,
  ecrans_led: Presentation,
  podiums_scenes: Building2,
  eclairage: Lightbulb,
  agences_evenementielles: Building2,
  dj: Music2,
  photographes: Camera,
  videastes: Clapperboard,
  decorateurs: PartyPopper,
  traiteurs: UtensilsCrossed,
  securite: ShieldCheck,
  organisateurs_concerts: Music2,
  centres_conference: Presentation,
};

export function getIconePourCategorie(slug: string): LucideIcon {
  return ICONES_PAR_SLUG[slug] ?? PartyPopper;
}

/** Rend l'icône d'une catégorie — évite d'assigner un composant dynamique
 * à une variable capitalisée directement dans le rendu. */
export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  return createElement(getIconePourCategorie(slug), { className });
}
