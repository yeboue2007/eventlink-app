import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fusionne des classes Tailwind en résolvant les conflits (dernier gagne).
 * Utilisé par tous les composants du design system — jamais de concaténation
 * de chaînes brute pour les classNames conditionnels.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
