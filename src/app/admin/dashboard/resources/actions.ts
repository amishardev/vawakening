
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';
import type { ResourceDocument } from '@/types/resource';

const resourcesCollection = collection(firestore, 'resources');

function toResourceDocument(id: string, data: Record<string, any>): ResourceDocument {
  return {
    id,
    name: data.name,
    short_description: data.short_description || undefined,
    link: data.link,
    thumbnail_url: data.thumbnail_url || undefined,
    type: data.type,
    tags: data.tags || null,
    created_at: data.created_at,
    updated_at: data.updated_at,
    dataAiHint: data.dataAiHint || undefined,
  };
}

export async function addResourceAction(formData: FormData): Promise<{ error?: string; id?: string }> {
  const name = formData.get('name') as string;
  const short_description = formData.get('short_description') as string | null;
  const link = formData.get('link') as string;
  const thumbnail_url = formData.get('thumbnail_url') as string | null;
  const type = formData.get('type') as ResourceDocument['type'];
  const tags = formData.get('tags') as string | null;

  if (!name || !link || !type) {
    return { error: 'Name, link, and type are required.' };
  }

  try {
    const now = new Date().toISOString();
    const newResourceData = {
      name,
      short_description: short_description || null,
      link,
      thumbnail_url: thumbnail_url || null,
      type,
      tags: tags || null,
      created_at: now,
      updated_at: now,
    };

    const docRef = await addDoc(resourcesCollection, newResourceData);
    return { id: docRef.id };
  } catch (error: any) {
    console.error('Error adding resource:', error);
    return { error: error.message || 'Failed to create resource.' };
  }
}

export async function updateResourceAction(id: string, formData: FormData): Promise<{ error?: string }> {
  const name = formData.get('name') as string;
  const short_description = formData.get('short_description') as string | null;
  const link = formData.get('link') as string;
  const thumbnail_url = formData.get('thumbnail_url') as string | null;
  const type = formData.get('type') as ResourceDocument['type'];
  const tags = formData.get('tags') as string | null;

  if (!name || !link || !type) {
    return { error: 'Name, link, and type are required.' };
  }

  try {
    const updatedData = {
      name,
      short_description: short_description || null,
      link,
      thumbnail_url: thumbnail_url || null,
      type,
      tags: tags || null,
      updated_at: new Date().toISOString(),
    };

    await updateDoc(doc(firestore, 'resources', id), updatedData);
    return {};
  } catch (error: any) {
    console.error('Error updating resource:', error);
    return { error: error.message || 'Failed to update resource.' };
  }
}

export async function deleteResourceAction(id: string): Promise<{ error?: string }> {
  try {
    await deleteDoc(doc(firestore, 'resources', id));
    return {};
  } catch (error: any) {
    console.error('Error deleting resource:', error);
    return { error: error.message || 'Failed to delete resource.' };
  }
}

export async function getResourcesForAdmin(): Promise<ResourceDocument[]> {
  try {
    const snapshot = await getDocs(query(resourcesCollection, orderBy('created_at', 'desc')));
    return snapshot.docs.map((d) => toResourceDocument(d.id, d.data()));
  } catch (error) {
    console.error('Error fetching resources for admin:', error);
    return [];
  }
}

export async function getResourceById(id: string): Promise<ResourceDocument | null> {
  try {
    const snapshot = await getDoc(doc(firestore, 'resources', id));
    if (!snapshot.exists()) return null;
    return toResourceDocument(snapshot.id, snapshot.data());
  } catch (error) {
    console.error(`Error fetching resource by id ${id}:`, error);
    return null;
  }
}

export async function getPublishedResources(): Promise<ResourceDocument[]> {
  return getResourcesForAdmin();
}
