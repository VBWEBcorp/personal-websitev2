'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const NeuralBackground = dynamic(() => import('@/components/NeuralBackground'), { ssr: false });

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040911] via-[#071018] to-[#0A1525] relative">
      <NeuralBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-primary/20 z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-4xl font-bold text-white mb-4">Page non trouvée</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Désolé, la page que vous recherchez n'existe pas. Voici quelques liens utiles :
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à l'accueil
          </Link>
          
          <Link
            href="/espace-client"
            className="block px-6 py-3 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            Espace Client
          </Link>
          
          <Link
            href="/admin"
            className="block px-6 py-3 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            Espace Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
