import Link from "next/link";

import { Logo } from "@/components/marketing/logo";

const LIENS = [
  {
    titre: "EventLink",
    items: [
      { label: "Comment ça marche", href: "/#comment-ca-marche" },
      { label: "Catégories", href: "/#categories" },
      { label: "Devenir prestataire", href: "/inscription/prestataire" },
    ],
  },
  {
    titre: "Légal",
    items: [
      { label: "Conditions d'utilisation", href: "/cgu" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
];

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              Connexion. Confiance. Événements réussis.
            </p>
          </div>

          {LIENS.map((section) => (
            <div key={section.titre} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{section.titre}</h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} EventLink — Abidjan, Côte d&rsquo;Ivoire.
        </p>
      </div>
    </footer>
  );
}

export { Footer };
