import { createElement } from "react";
import {
  Heart,
  Image as ImageIcon,
  Lightbulb,
  Mic2,
  Music4,
  PartyPopper,
  Presentation,
  Sparkles,
  Speaker,
  type LucideIcon,
} from "lucide-react";

export const ICON_SLUGS = [
  "heart",
  "music",
  "speaker",
  "screen",
  "light",
  "decoration",
  "conference",
  "reception",
  "generic",
] as const;

export type IconSlug = (typeof ICON_SLUGS)[number];

export const ICON_LABELS: Record<IconSlug, string> = {
  heart: "Cœur (mariage)",
  music: "Musique (concert)",
  speaker: "Enceinte (sonorisation)",
  screen: "Écran (LED)",
  light: "Lumière (éclairage)",
  decoration: "Décoration",
  conference: "Micro (conférence)",
  reception: "Fête (réception)",
  generic: "Générique",
};

const REGISTRE: Record<IconSlug, LucideIcon> = {
  heart: Heart,
  music: Music4,
  speaker: Speaker,
  screen: Presentation,
  light: Lightbulb,
  decoration: Sparkles,
  conference: Mic2,
  reception: PartyPopper,
  generic: ImageIcon,
};

export function getHeroIcon(slug: string): LucideIcon {
  return REGISTRE[slug as IconSlug] ?? ImageIcon;
}

/** Rend l'icône de repli d'une diapositive — évite d'assigner un composant
 * dynamique à une variable capitalisée directement dans le rendu. */
export function HeroIcon({ slug, className }: { slug: string; className?: string }) {
  return createElement(getHeroIcon(slug), { className, strokeWidth: 1.5 });
}
