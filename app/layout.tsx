import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
