const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const adminEmail = 'admin@vbweb.fr';
const adminPassword = 'VBWeb2024@';

async function createAdminUser() {
  try {
    // Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;

    // Ajouter les informations admin dans Firestore
    await setDoc(doc(db, 'users', user.uid), {
      firstName: 'Admin',
      lastName: 'VBWeb',
      email: adminEmail,
      phone: '',
      role: 'admin',
      createdAt: new Date(),
    });

    console.log('Compte admin créé avec succès !');
    console.log('Email:', adminEmail);
    console.log('Mot de passe:', adminPassword);
  } catch (error) {
    console.error('Erreur lors de la création du compte admin:', error.message);
  }
}

createAdminUser();
