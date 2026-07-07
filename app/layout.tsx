import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EventLink — Connexion. Confiance. Événements réussis.',
  description:
    "Trouvez les meilleurs prestataires pour vos événements à Abidjan, ou recevez des demandes ciblées pour votre activité événementielle.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
