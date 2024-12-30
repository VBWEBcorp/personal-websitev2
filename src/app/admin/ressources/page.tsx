import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Gestion des Ressources | Admin',
  description: 'Gérez vos ressources : vidéos Loom et e-books',
};

export default function AdminResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des Ressources</h1>

      {/* Upload de Vidéo */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ajouter une Vidéo Loom</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre de la vidéo</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Entrez le titre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL Loom</label>
            <input
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://www.loom.com/share/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              placeholder="Décrivez le contenu de la vidéo"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ajouter la vidéo
          </button>
        </form>
      </section>

      {/* Upload de PDF */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Ajouter un E-book PDF</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre de l'e-book</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Entrez le titre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fichier PDF</label>
            <input
              type="file"
              accept=".pdf"
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              placeholder="Décrivez le contenu de l'e-book"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Ajouter l'e-book
          </button>
        </form>
      </section>
    </div>
  );
}
