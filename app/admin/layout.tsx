import { redirect } from "next/navigation";

import { AppNavbar } from "@/components/layout/app-navbar";
import { getCurrentProfile } from "@/features/auth/queries/get-current-profile";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = await getCurrentProfile();

  if (!current) redirect("/connexion");
  if (current.profile.role !== "admin") redirect("/tableau-de-bord");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppNavbar role="admin" homeHref="/admin" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
