'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040911] via-[#071018] to-[#0A1525] flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Une erreur est survenue</h2>
        <p className="text-gray-300 mb-6">
          {error.message || "Désolé, quelque chose s'est mal passé."}
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Réessayer
          </button>
          <Link
            href="/admin"
            className="block w-full py-2 px-4 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors text-center"
          >
            Retour à la page de connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
