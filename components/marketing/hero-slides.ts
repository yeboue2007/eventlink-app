import type { LucideIcon } from "lucide-react";
import { Heart, Mic2, Music4, PartyPopper, Presentation, Sparkles, Speaker, Sun } from "lucide-react";

export type HeroSlide = {
  id: string;
  categorie: string;
  /**
   * Chemin vers une photo réelle dans /public/hero/ (ex. "/hero/mariage.jpg").
   * Laisser `null` tant qu'aucune photo n'est disponible : le carrousel
   * affiche alors une carte de repli soignée (dégradé de marque + icône)
   * au lieu d'une fausse photo ou d'une image générique. Dès qu'un fichier
   * est déposé et référencé ici, il remplace automatiquement le repli —
   * aucune modification du composant HeroCarousel n'est nécessaire.
   */
  src: string | null;
  alt: string;
  icone: LucideIcon;
};

export const HERO_SLIDES: HeroSlide[] = [
  { id: "mariage", categorie: "Mariage", src: null, alt: "Réception de mariage", icone: Heart },
  { id: "concert", categorie: "Concert", src: null, alt: "Concert en plein air", icone: Music4 },
  { id: "sonorisation", categorie: "Sonorisation", src: null, alt: "Installation de sonorisation professionnelle", icone: Speaker },
  { id: "ecran-led", categorie: "Écran LED", src: null, alt: "Écran LED géant sur scène événementielle", icone: Presentation },
  { id: "eclairage", categorie: "Éclairage", src: null, alt: "Éclairage événementiel scénique", icone: Sun },
  { id: "decoration", categorie: "Décoration", src: null, alt: "Décoration florale de salle de réception", icone: Sparkles },
  { id: "conference", categorie: "Conférence", src: null, alt: "Séminaire d'entreprise avec intervenant", icone: Mic2 },
  { id: "reception", categorie: "Réception", src: null, alt: "Réception événementielle privée", icone: PartyPopper },
];
