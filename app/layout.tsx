import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { InstallPromptBanner } from "@/components/pwa/install-prompt-banner";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { Toaster } from "@/components/ui/sonner";
import { getBrandColors } from "@/features/administration/configuration/queries/list-configuration";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EventLink — Connexion. Confiance. Événements réussis.",
    template: "%s | EventLink",
  },
  description:
    "EventLink met en relation les organisateurs d'événements et les prestataires événementiels à Abidjan : publiez une demande, recevez plusieurs offres, choisissez en toute confiance.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EventLink",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2C1E47",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Couleurs de marque configurables depuis /admin/configuration — lues à
  // chaque requête et injectées en override des variables CSS définies en
  // dur dans globals.css. Si la table est vide ou injoignable, getBrandColors
  // retombe silencieusement sur les valeurs par défaut du design system.
  const couleurs = await getBrandColors();

  return (
    <html lang="fr" className={`${poppins.variable} h-full antialiased`}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--el-navy:${couleurs.brand_color_navy};--el-violet:${couleurs.brand_color_violet};--el-rose:${couleurs.brand_color_rose};--el-orange:${couleurs.brand_color_orange};--el-gold:${couleurs.brand_color_gold};}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
        <ServiceWorkerRegister />
        <InstallPromptBanner />
      </body>
    </html>
  );
}
