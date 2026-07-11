import { Coins, CreditCard, FileText, LayoutDashboard, Tags } from "lucide-react";
import { redirect } from "next/navigation";

import { AppNavbar } from "@/components/layout/app-navbar";
import { Sidebar, type SidebarNavItem } from "@/components/layout/sidebar";
import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";
import { listRecentNotifications } from "@/features/notifications/queries/list-notifications";

// Complété au fil des phases suivantes (calendrier...).
const NAV_ITEMS: SidebarNavItem[] = [
  { label: "Tableau de bord", href: "/prestataire", icon: <LayoutDashboard className="size-4" /> },
  { label: "Demandes correspondantes", href: "/prestataire/demandes", icon: <FileText className="size-4" /> },
  { label: "Mes crédits", href: "/prestataire/credits", icon: <Coins className="size-4" /> },
  { label: "Mon abonnement", href: "/prestataire/abonnement", icon: <CreditCard className="size-4" /> },
  { label: "Mes catégories", href: "/prestataire/parametres/categories", icon: <Tags className="size-4" /> },
];

export default async function PrestataireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = await getCurrentProfile();

  if (!current) redirect("/connexion");
  if (current.profile.role !== "prestataire") redirect("/tableau-de-bord");

  const notifications = await listRecentNotifications();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppNavbar
        role="prestataire"
        homeHref="/prestataire"
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
