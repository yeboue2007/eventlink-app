import type { Enums } from "@/lib/supabase/database.types";

export type AdminRole = Enums<"admin_role">;

export type ModuleAdmin =
  | "tableau_de_bord"
  | "prestataires"
  | "clients"
  | "credits"
  | "abonnements"
  | "promotions"
  | "visibilite_sponsorisee"
  | "categories"
  | "parametres_generaux"
  | "configuration"
  | "equipe"
  | "audit"
  | "journal_systeme"
  | "corbeille"
  | "statistiques";

export type NiveauAcces = "aucun" | "lecture" | "gestion";

const NIVEAUX = { aucun: 0, lecture: 1, gestion: 2 } as const;

/**
 * Matrice fixe : 5 rôles, définis une fois pour toutes dans le code.
 * Pas d'éditeur de permissions en base — décision explicite pour rester
 * simple. Si un besoin de rôles personnalisés apparaît plus tard, cette
 * matrice est le seul endroit à faire évoluer.
 */
const MATRICE: Record<AdminRole, Record<ModuleAdmin, NiveauAcces>> = {
  super_admin: {
    tableau_de_bord: "gestion",
    prestataires: "gestion",
    clients: "gestion",
    credits: "gestion",
    abonnements: "gestion",
    promotions: "gestion",
    visibilite_sponsorisee: "gestion",
    categories: "gestion",
    parametres_generaux: "gestion",
    configuration: "gestion",
    equipe: "gestion",
    audit: "gestion",
    journal_systeme: "gestion",
    corbeille: "gestion",
    statistiques: "gestion",
  },
  admin: {
    tableau_de_bord: "gestion",
    prestataires: "gestion",
    clients: "gestion",
    credits: "gestion",
    abonnements: "gestion",
    promotions: "gestion",
    visibilite_sponsorisee: "gestion",
    categories: "gestion",
    parametres_generaux: "gestion",
    configuration: "gestion",
    equipe: "lecture", // consulte l'équipe, mais ne gère pas les comptes admin
    audit: "lecture",
    journal_systeme: "lecture",
    corbeille: "gestion",
    statistiques: "gestion",
  },
  support_client: {
    tableau_de_bord: "lecture",
    prestataires: "gestion", // fiches + actions de compte (suspendre/réactiver)
    clients: "gestion",
    credits: "aucun",
    abonnements: "aucun",
    promotions: "aucun",
    visibilite_sponsorisee: "aucun",
    categories: "aucun",
    parametres_generaux: "aucun",
    configuration: "aucun",
    equipe: "aucun",
    audit: "aucun",
    journal_systeme: "aucun",
    corbeille: "aucun",
    statistiques: "aucun",
  },
  moderateur: {
    tableau_de_bord: "lecture",
    prestataires: "gestion", // vérifications, catégories déclarées
    clients: "lecture",
    credits: "aucun",
    abonnements: "aucun",
    promotions: "aucun",
    visibilite_sponsorisee: "aucun",
    categories: "gestion",
    parametres_generaux: "aucun",
    configuration: "aucun",
    equipe: "aucun",
    audit: "aucun",
    journal_systeme: "aucun",
    corbeille: "aucun",
    statistiques: "aucun",
  },
  comptabilite: {
    tableau_de_bord: "lecture",
    prestataires: "lecture",
    clients: "lecture",
    credits: "gestion",
    abonnements: "gestion",
    promotions: "gestion",
    visibilite_sponsorisee: "gestion",
    categories: "aucun",
    parametres_generaux: "aucun",
    configuration: "aucun",
    equipe: "aucun",
    audit: "aucun",
    journal_systeme: "aucun",
    corbeille: "aucun",
    statistiques: "gestion",
  },
};

const LABELS_ROLE: Record<AdminRole, string> = {
  super_admin: "Super administrateur",
  admin: "Administrateur",
  support_client: "Support client",
  moderateur: "Modérateur",
  comptabilite: "Comptabilité",
};

export function labelRole(role: AdminRole): string {
  return LABELS_ROLE[role];
}

export function niveauAcces(role: AdminRole, module: ModuleAdmin): NiveauAcces {
  return MATRICE[role][module];
}

export function peutAcceder(
  role: AdminRole,
  module: ModuleAdmin,
  minimum: NiveauAcces = "lecture"
): boolean {
  return NIVEAUX[MATRICE[role][module]] >= NIVEAUX[minimum];
}

export const TOUS_LES_ROLES: AdminRole[] = [
  "super_admin",
  "admin",
  "support_client",
  "moderateur",
  "comptabilite",
];
