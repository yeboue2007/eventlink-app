/**
 * Types globaux partagés entre plusieurs domaines métier.
 * Un type spécifique à un seul domaine vit dans features/<domaine>/types,
 * pas ici.
 */

export type Role = "client" | "prestataire" | "admin";
