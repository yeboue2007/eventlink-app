import { NavLinks, type SidebarNavItem } from "@/components/layout/nav-links";

export type { SidebarNavItem } from "@/components/layout/nav-links";

/**
 * Navigation latérale générique (desktop uniquement, ≥ md) : ne connaît
 * rien du métier, reçoit sa liste d'éléments en prop. Chaque espace
 * (client/prestataire/admin) définit ses propres items dans son layout.
 * Sur mobile, voir MobileNavDrawer qui affiche les mêmes items en tiroir.
 */
function Sidebar({ items }: { items: SidebarNavItem[] }) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:block">
      <NavLinks items={items} />
    </aside>
  );
}

export { Sidebar };
