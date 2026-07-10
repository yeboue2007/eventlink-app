import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";

import { AppNavbar } from "@/components/layout/app-navbar";
import { Sidebar, type SidebarNavItem } from "@/components/layout/sidebar";
import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";
import { listRecentNotifications } from "@/features/notifications/queries/list-notifications";

// Complété au fil des phases suivantes (paramètres commerciaux, utilisateurs, stats...).
const NAV_ITEMS: SidebarNavItem[] = [
  { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = await getCurrentProfile();

  if (!current) redirect("/connexion");
  if (current.profile.role !== "admin") redirect("/tableau-de-bord");

  const notifications = await listRecentNotifications();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppNavbar
        role="admin"
        homeHref="/admin"
        profileId={current.user.id}
        initialNotifications={notifications}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <Sidebar items={NAV_ITEMS} />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
