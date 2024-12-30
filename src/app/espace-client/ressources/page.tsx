'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { FiVideo, FiBook, FiDownload, FiExternalLink } from 'react-icons/fi';
import dynamic from 'next/dynamic';

const NeuralBackground = dynamic(() => import('@/components/NeuralBackground'), { ssr: false });

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'pdf';
  url: string;
  createdAt: string;
}

export default function ResourcesPage() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/espace-client');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resourcesCollection = collection(db, 'resources');
        const resourcesSnapshot = await getDocs(resourcesCollection);
        
        // Si aucune ressource n'existe, créer des ressources de test
        if (resourcesSnapshot.empty) {
          const testResources = [
            {
              title: 'Introduction au développement web',
              description: 'Une vidéo explicative sur les bases du développement web moderne',
              type: 'video',
              url: 'https://www.youtube.com/watch?v=example1',
              createdAt: new Date().toISOString()
            },
            {
              title: 'Guide des bonnes pratiques',
              description: 'Un PDF détaillant les meilleures pratiques de développement',
              type: 'pdf',
              url: 'https://example.com/guide.pdf',
              createdAt: new Date().toISOString()
            },
            {
              title: 'Tutoriel React',
              description: 'Apprenez à créer des applications web avec React',
              type: 'video',
              url: 'https://www.youtube.com/watch?v=example2',
              createdAt: new Date().toISOString()
            }
          ];

          // Ajouter les ressources de test à Firestore
          for (const resource of testResources) {
            await addDoc(resourcesCollection, resource);
          }

          // Récupérer à nouveau les ressources
          const newSnapshot = await getDocs(resourcesCollection);
          const resourcesList = newSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Resource[];
          
          setResources(resourcesList);
        } else {
          const resourcesList = resourcesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Resource[];
          
          setResources(resourcesList);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des ressources:', error);
      } finally {
        setLoadingResources(false);
      }
    };

    if (user) {
      fetchResources();
    }
  }, [user]);

  if (loading || loadingResources) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040911] via-[#071018] to-[#0A1525] relative">
      <NeuralBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-primary/20 z-0"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="flex justify-center mb-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Mes Ressources</h1>
            <p className="text-gray-400 mt-2">Accédez à vos vidéos et documents</p>
          </div>
        </div>

        {resources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Aucune ressource disponible pour le moment.</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div key={resource.id} className="bg-white/5 backdrop-blur-xl rounded-lg p-6 border border-white/10 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="flex items-start mb-4">
                    {resource.type === 'video' ? (
                      <FiVideo className="text-blue-400 text-xl flex-shrink-0 mt-1" />
                    ) : (
                      <FiBook className="text-green-400 text-xl flex-shrink-0 mt-1" />
                    )}
                    <div className="ml-3">
                      <h3 className="text-xl font-semibold text-white">{resource.title}</h3>
                      <p className="text-gray-300 mt-1">{resource.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-400">
                      {new Date(resource.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center px-4 py-2 rounded transition-colors ${
                        resource.type === 'pdf'
                          ? 'text-green-400 hover:text-green-300'
                          : 'text-blue-400 hover:text-blue-300'
                      }`}
                    >
                      {resource.type === 'pdf' ? (
                        <>
                          <FiDownload className="mr-2" />
                          Télécharger
                        </>
                      ) : (
                        <>
                          <FiExternalLink className="mr-2" />
                          Voir la vidéo
                        </>
                      )}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
