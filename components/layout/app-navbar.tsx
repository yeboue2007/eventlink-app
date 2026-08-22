import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/marketing/logo";
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer";
import type { SidebarNavItem } from "@/components/layout/nav-links";
import { signOutAction } from "@/features/auth/actions/auth.actions";
import { NotificationsBell } from "@/features/notifications/components/notifications-bell";
import type { Tables } from "@/lib/supabase/database.types";

const LABEL_ROLE = {
  client: "Client",
  prestataire: "Prestataire",
  admin: "Administrateur",
} as const;

export function AppNavbar({
  role,
  profileId,
  initialNotifications,
  navItems,
}: {
  role: keyof typeof LABEL_ROLE;
  profileId: string;
  initialNotifications: Tables<"notifications">[];
  navItems: SidebarNavItem[];
}) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <MobileNavDrawer items={navItems} />
          <Link href="/">
            <Logo size="sm" />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <NotificationsBell profileId={profileId} initialNotifications={initialNotifications} />
          <Badge variant="trust">{LABEL_ROLE[role]}</Badge>
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="sm">
              Déconnexion
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
