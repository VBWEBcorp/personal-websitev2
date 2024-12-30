import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

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

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

interface Content {
  title: string;
  description: string;
  type: 'ebook' | 'video';
  url: string;
}

const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Vérifier si le document utilisateur existe
    const userDocs = await getDocs(
      query(collection(db, 'users'), where('email', '==', email))
    );
    
    let userData;
    
    // Si le document n'existe pas, le créer
    if (userDocs.empty) {
      const isAdmin = email === 'contact@vbweb.fr';
      const newUserData = {
        email,
        firstName: isAdmin ? 'Admin' : '',
        lastName: isAdmin ? 'VBWeb' : '',
        phone: '',
        role: isAdmin ? 'admin' : 'user',
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, 'users'), newUserData);
      userData = newUserData;
    } else {
      userData = userDocs.docs[0].data();
    }

    return { 
      user: userCredential.user,
      isAdmin: userData.role === 'admin',
      error: null 
    };
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.code === 'auth/invalid-credential') {
      return { 
        user: null,
        isAdmin: false,
        error: 'Email ou mot de passe incorrect' 
      };
    }
    return { 
      user: null,
      isAdmin: false,
      error: 'Erreur de connexion: ' + error.message 
    };
  }
};

const signUp = async (email: string, password: string, userData: UserData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Définir le rôle admin pour contact@vbweb.fr
    const role = email === 'contact@vbweb.fr' ? 'admin' : 'user';
    await addDoc(collection(db, 'users'), {
      email,
      ...userData,
      role,
      createdAt: serverTimestamp(),
    });
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Signup error:', error);
    if (error.code === 'auth/email-already-in-use') {
      return { user: null, error: 'Un compte existe déjà avec cet email' };
    } else if (error.code === 'auth/invalid-email') {
      return { user: null, error: 'L\'adresse email n\'est pas valide' };
    } else if (error.code === 'auth/weak-password') {
      return { user: null, error: 'Le mot de passe doit contenir au moins 6 caractères' };
    }
    return { user: null, error: 'Erreur lors de l\'inscription: ' + error.message };
  }
};

const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: 'Erreur lors de la déconnexion' };
  }
};

const sendPasswordResetEmail = async (email: string) => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    console.error('Firebase password reset error:', error);
    if (error.code === 'auth/user-not-found') {
      return { error: 'Aucun compte n\'existe avec cet email' };
    } else if (error.code === 'auth/invalid-email') {
      return { error: 'L\'adresse email n\'est pas valide' };
    } else if (error.code === 'auth/network-request-failed') {
      return { error: 'Erreur de connexion. Vérifiez votre connexion internet' };
    }
    return { error: 'Erreur lors de l\'envoi de l\'email de réinitialisation: ' + error.message };
  }
};

const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return [];
  }
};

const addContent = async (content: Content) => {
  try {
    await addDoc(collection(db, 'content'), {
      ...content,
      createdAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: 'Erreur lors de l\'ajout du contenu' };
  }
};

const getAllContent = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'content'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu:', error);
    return [];
  }
};

const deleteContent = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'content', id));
    return { error: null };
  } catch (error) {
    return { error: 'Erreur lors de la suppression du contenu' };
  }
};

export {
  auth,
  db,
  signIn,
  signUp,
  signOut,
  sendPasswordResetEmail,
  getAllUsers,
  addContent,
  getAllContent,
  deleteContent,
};
