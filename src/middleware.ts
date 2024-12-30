import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes protégées qui nécessitent une authentification
const authRoutes = ['/admin/dashboard', '/espace-client/ressources'];
const publicRoutes = ['/admin', '/espace-client', '/auth/register'];

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const path = request.nextUrl.pathname;

  // Permettre l'accès aux routes publiques même sans session
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Si l'utilisateur essaie d'accéder à une route protégée sans session
  if (authRoutes.some(route => path.startsWith(route)) && !session) {
    // Si c'est une route admin, rediriger vers la page de connexion admin
    if (path.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Si c'est une route client, rediriger vers la page de connexion client
    return NextResponse.redirect(new URL('/espace-client', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/espace-client/:path*'
  ]
};
