// Importation des fonctions nécessaires de Clerk pour gérer l'authentification
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Définition des routes publiques (sans authentification requise)
// `createRouteMatcher` crée une fonction qui vérifie si une route correspond aux modèles spécifiés
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  // Si la requête n'est pas sur une route publique, protéger l'accès avec Clerk
  if (!isPublicRoute(request)) {
    await auth.protect() // Empêche les utilisateurs non authentifiés d'accéder aux routes privées
  }
})

export const config = {
  matcher: [
    // Exclure les fichiers statiques et internes de Next.js pour ne pas appliquer le middleware
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Toujours exécuter le middleware pour les routes API (ex: `/api/*`, `/trpc/*`)
    '/(api|trpc)(.*)',
  ],
}
