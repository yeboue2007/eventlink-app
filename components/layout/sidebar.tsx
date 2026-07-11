"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type SidebarNavItem = {
  label: string;
  href: string;
  /** Icône déjà rendue côté serveur (ex. `<LayoutDashboard className="size-4" />`),
   *  jamais une référence de composant — React interdit de faire transiter une
   *  fonction d'un Server Component vers un Client Component en tant que prop. */
  icon: React.ReactNode;
};

/**
 * Navigation latérale générique : ne connaît rien du métier, reçoit sa
 * liste d'éléments en prop. Chaque espace (client/prestataire/admin) définit
 * ses propres items dans son layout.
 */
function Sidebar({ items }: { items: SidebarNavItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:block">
      <nav className="flex flex-col gap-1 p-4">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-el-violet"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export { Sidebar };
