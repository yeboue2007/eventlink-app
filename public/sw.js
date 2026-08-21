// Service worker volontairement minimal : EventLink est une application
// transactionnelle (authentification, paiements, messagerie en temps réel,
// tableaux de bord multi-rôles). Mettre en cache des pages ou des réponses
// d'API exposerait à des données obsolètes ou incohérentes (solde de
// crédits, statut d'une offre, etc.). Ce service worker n'existe donc que
// pour satisfaire les critères d'installabilité des navigateurs — il ne
// met rien en cache et laisse passer toutes les requêtes vers le réseau.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Passthrough pur : aucune interception ni mise en cache.
  event.respondWith(fetch(event.request));
});
