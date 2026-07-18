import { BarChart3, CreditCard, LayoutDashboard, Settings, Tags, Users, Briefcase, UserCircle } from "lucide-react";
import { redirect } from "next/navigation";

import { AppNavbar } from "@/components/layout/app-navbar";
import { Sidebar, type SidebarNavItem } from "@/components/layout/sidebar";
import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";
import { listRecentNotifications } from "@/features/notifications/queries/list-notifications";
import { peutAcceder, type ModuleAdmin } from "@/features/administration/permissions/permissions";

const TOUS_LES_LIENS: { module: ModuleAdmin; item: SidebarNavItem }[] = [
  {
    module: "tableau_de_bord",
    item: { label: "Tableau de bord", href: "/admin", icon: <LayoutDashboard className="size-4" /> },
  },
  {
    module: "statistiques",
    item: { label: "Statistiques", href: "/admin/statistiques", icon: <BarChart3 className="size-4" /> },
  },
  {
    module: "prestataires",
    item: { label: "Prestataires", href: "/admin/prestataires", icon: <Briefcase className="size-4" /> },
  },
  {
    module: "clients",
    item: { label: "Clients", href: "/admin/clients", icon: <UserCircle className="size-4" /> },
  },
  {
    module: "categories",
    item: { label: "Catégories", href: "/admin/categories", icon: <Tags className="size-4" /> },
  },
  {
    module: "credits",
    item: { label: "Packs de crédits", href: "/admin/credit-packs", icon: <CreditCard className="size-4" /> },
  },
  {
    module: "abonnements",
    item: { label: "Abonnements", href: "/admin/subscription-plans", icon: <CreditCard className="size-4" /> },
  },
  {
    module: "parametres_generaux",
    item: { label: "Paramètres généraux", href: "/admin/parametres", icon: <Settings className="size-4" /> },
  },
  {
    module: "equipe",
    item: { label: "Équipe & permissions", href: "/admin/equipe", icon: <Users className="size-4" /> },
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = await getCurrentProfile();

  if (!current) redirect("/connexion");
  if (current.profile.role !== "admin") redirect("/tableau-de-bord");

  // Fail-safe : un admin sans admin_role assigné (ne devrait pas arriver en
  // pratique, le trigger d'inscription ne crée jamais ce rôle) ne voit rien.
  const adminRole = current.profile.admin_role;
  const navItems = adminRole
    ? TOUS_LES_LIENS.filter(({ module }) => peutAcceder(adminRole, module)).map((l) => l.item)
    : [];

  const notifications = await listRecentNotifications();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppNavbar
        role="admin"
        profileId={current.user.id}
        initialNotifications={notifications}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <Sidebar items={navItems} />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
