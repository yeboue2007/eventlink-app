"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { NavLinks, type SidebarNavItem } from "@/components/layout/nav-links";

export function MobileNavDrawer({ items }: { items: SidebarNavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Se referme automatiquement après une navigation — ajustement d'état
  // pendant le rendu (pattern recommandé par React) plutôt que dans un
  // effet, pour éviter un rendu en cascade évitable.
  const [pathnamePrecedent, setPathnamePrecedent] = useState(pathname);
  if (pathname !== pathnamePrecedent) {
    setPathnamePrecedent(pathname);
    setOpen(false);
  }

  // Se referme avec Échap, et bloque le scroll du fond pendant l'ouverture.
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-muted"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            className="fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] overflow-y-auto bg-card shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <span className="text-sm font-medium text-foreground">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <NavLinks items={items} onNavigate={() => setOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
