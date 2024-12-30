'use client';

import { createAdminAccount } from '@/lib/firebase/auth';
import { useEffect, useState } from 'react';

export default function SetupAdmin() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const setup = async () => {
      try {
        const result = await createAdminAccount();
        if (result.success) {
          setStatus('Compte admin créé avec succès !');
        } else {
          setStatus('Erreur : ' + result.error);
        }
      } catch (error) {
        setStatus('Erreur lors de la création du compte admin');
      }
    };
    setup();
  }, []);

  return (
    <div className="min-h-screen bg-[#040911] flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
        <h1 className="text-2xl font-bold text-white mb-4">Configuration Admin</h1>
        <p className="text-gray-300">{status}</p>
      </div>
    </div>
  );
}
