import { db, storage } from '@/config/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'pdf';
  url: string;
  createdAt: Date;
}

// Collection references
const RESOURCES_COLLECTION = 'resources';

// Upload a PDF file to Firebase Storage
export async function uploadPDF(file: File, metadata: Omit<Resource, 'id' | 'url' | 'createdAt'>) {
  try {
    // Create a storage reference
    const storageRef = ref(storage, `pdfs/${Date.now()}_${file.name}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const url = await getDownloadURL(snapshot.ref);
    
    // Add document to Firestore
    const docRef = await addDoc(collection(db, RESOURCES_COLLECTION), {
      ...metadata,
      url,
      type: 'pdf',
      createdAt: new Date()
    });
    
    return { id: docRef.id, url };
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
}

// Add a Loom video
export async function addLoomVideo(metadata: Omit<Resource, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, RESOURCES_COLLECTION), {
      ...metadata,
      type: 'video',
      createdAt: new Date()
    });
    
    return { id: docRef.id };
  } catch (error) {
    console.error('Error adding Loom video:', error);
    throw error;
  }
}

// Get all resources
export async function getResources(): Promise<Resource[]> {
  try {
    const q = query(collection(db, RESOURCES_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Resource));
  } catch (error) {
    console.error('Error getting resources:', error);
    throw error;
  }
}
