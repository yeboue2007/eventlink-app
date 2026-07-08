"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Centre de notifications éphémères (toasts). Distinct de la table
 * `notifications` (centre persistant en base) — ceci est uniquement le
 * feedback immédiat d'une action ("Offre envoyée", "Erreur réseau"...).
 */
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-lg border border-border bg-card text-foreground shadow-md",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          success: "!border-success/30",
          error: "!border-destructive/30",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
export { toast } from "sonner";
