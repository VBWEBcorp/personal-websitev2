'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllContent, getAllUsers } from '@/lib/firebase';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FiUsers, FiBook, FiVideo, FiDownload, FiExternalLink, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const NeuralBackground = dynamic(() => import('@/components/NeuralBackground'), { ssr: false });

interface Content {
  id: string;
  title: string;
  description: string;
  type: 'ebook' | 'video';
  url: string;
  createdAt: any;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  createdAt: any;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'users' | 'content'>('users');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const userList = await getAllUsers();
        const currentUser = userList.find(u => u.email === user?.email);
        if (!currentUser || currentUser.role !== 'admin') {
          router.push('/espace-client');
          return;
        }
        setUsers(userList);
        const contentList = await getAllContent();
        setContent(contentList);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkAdmin();
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040911]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040911] via-[#071018] to-[#0A1525] relative">
      <NeuralBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-primary/20 z-0"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              Dashboard Admin
            </h1>
            <div className="text-white">
              Admin: <span className="text-blue-400">{user?.email}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                activeTab === 'users'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <FiUsers />
              <span>Utilisateurs</span>
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                activeTab === 'content'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <FiBook />
              <span>Contenu</span>
            </button>
          </div>

          {activeTab === 'users' ? (
            <div className="grid gap-4">
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-gray-300">{user.email}</p>
                      <p className="text-sm text-gray-400">Rôle: {user.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {content.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-white">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                      <p className="text-sm text-gray-400">Type: {item.type}</p>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <FiExternalLink size={20} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
