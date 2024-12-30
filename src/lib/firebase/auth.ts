import { auth, db } from '@/config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Email de l'administrateur
export const ADMIN_EMAIL = 'vic.beasse@gmail.com';

// Initialiser le profil admin s'il n'existe pas
async function initializeAdmin() {
  const adminDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
  if (!adminDoc.exists()) {
    await setDoc(doc(db, 'users', auth.currentUser!.uid), {
      uid: auth.currentUser!.uid,
      email: ADMIN_EMAIL,
      role: 'admin'
    });
  }
}

// Interface pour le profil utilisateur
export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

// Fonction pour initialiser l'admin
export async function initializeAdminProfile() {
  try {
    const adminDoc = await getDoc(doc(db, 'users', ADMIN_EMAIL));
    if (!adminDoc.exists()) {
      await setDoc(doc(db, 'users', ADMIN_EMAIL), {
        uid: ADMIN_EMAIL,
        email: ADMIN_EMAIL,
        role: 'admin'
      });
      console.log('Admin initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
}

// Register a new user
export async function registerUser(email: string, password: string, name: string): Promise<UserProfile> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      role: 'user', // Default role for new users
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    return userProfile;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// Sign in user
export async function signIn(email: string, password: string): Promise<UserProfile> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    // Si c'est l'admin et qu'il n'a pas de profil, l'initialiser
    if (email === ADMIN_EMAIL && !userDoc.exists()) {
      const adminProfile: UserProfile = {
        uid: user.uid,
        email: ADMIN_EMAIL,
        role: 'admin'
      };
      await setDoc(doc(db, 'users', user.uid), adminProfile);
      return adminProfile;
    }

    // Si le profil existe, le retourner
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }

    // Si le profil n'existe pas (pour un utilisateur normal), le créer
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      role: 'user'
    };
    await setDoc(doc(db, 'users', user.uid), userProfile);
    return userProfile;

  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

// Sign out user
export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Get current user profile
export async function getCurrentUser(): Promise<UserProfile | null> {
  const user = auth.currentUser;
  if (!user) return null;

  // Si c'est l'admin, initialiser son profil
  if (user.email === ADMIN_EMAIL) {
    await initializeAdmin();
  }

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      role: user.email === ADMIN_EMAIL ? 'admin' : 'user'
    };
    await setDoc(doc(db, 'users', user.uid), userProfile);
    return userProfile;
  }

  return userDoc.data() as UserProfile;
}

// Create a new user
export async function createUser(email: string, password: string): Promise<UserProfile> {
  if (email === ADMIN_EMAIL) {
    throw new Error('Cet email ne peut pas être utilisé pour créer un compte');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      role: 'user'
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    return userProfile;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Listen to auth state changes
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Create admin account
export const createAdminAccount = async () => {
  try {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return { success: false, error: 'Variables d\'environnement manquantes' };
    }

    await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Erreur inconnue' };
  }
};
