
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
import type { ProgramDocument } from '@/types/program';

const programsCollection = collection(firestore, 'programs');

function toProgramDocument(id: string, data: Record<string, any>): ProgramDocument {
  return {
    id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    title: data.title,
    description: data.description || undefined,
    long_description: data.long_description || undefined,
    thumbnail_url: data.thumbnail_url || undefined,
    learn_more_url: data.learn_more_url || undefined,
    category: data.category,
    icon_name: data.icon_name || undefined,
    tags: data.tags || null,
    data_ai_hint: data.data_ai_hint || undefined,
  };
}

export async function addProgramAction(formData: FormData): Promise<{ error?: string; id?: string }> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string | null;
  const long_description = formData.get('long_description') as string | null;
  const thumbnail_url = formData.get('thumbnail_url') as string | null;
  const learn_more_url = formData.get('learn_more_url') as string | null;
  const category = formData.get('category') as string;
  const icon_name = formData.get('icon_name') as string | null;
  const tags = formData.get('tags') as string | null;
  const data_ai_hint = formData.get('data_ai_hint') as string | null;

  if (!title || !category) {
    return { error: 'Title and category are required.' };
  }

  try {
    const now = new Date().toISOString();
    const newProgramData = {
      title,
      description: description || null,
      long_description: long_description || null,
      thumbnail_url: thumbnail_url || null,
      learn_more_url: learn_more_url || null,
      category,
      icon_name: icon_name || null,
      tags: tags || null,
      data_ai_hint: data_ai_hint || null,
      created_at: now,
      updated_at: now,
    };

    const docRef = await addDoc(programsCollection, newProgramData);
    return { id: docRef.id };
  } catch (error: any) {
    console.error('Error adding program:', error);
    return { error: error.message || 'Failed to create program.' };
  }
}

export async function updateProgramAction(id: string, formData: FormData): Promise<{ error?: string }> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string | null;
  const long_description = formData.get('long_description') as string | null;
  const thumbnail_url = formData.get('thumbnail_url') as string | null;
  const learn_more_url = formData.get('learn_more_url') as string | null;
  const category = formData.get('category') as string;
  const icon_name = formData.get('icon_name') as string | null;
  const tags = formData.get('tags') as string | null;
  const data_ai_hint = formData.get('data_ai_hint') as string | null;

  if (!title || !category) {
    return { error: 'Title and category are required.' };
  }

  try {
    const updatedData = {
      title,
      description: description || null,
      long_description: long_description || null,
      thumbnail_url: thumbnail_url || null,
      learn_more_url: learn_more_url || null,
      category,
      icon_name: icon_name || null,
      tags: tags || null,
      data_ai_hint: data_ai_hint || null,
      updated_at: new Date().toISOString(),
    };

    await updateDoc(doc(firestore, 'programs', id), updatedData);
    return {};
  } catch (error: any) {
    console.error('Error updating program:', error);
    return { error: error.message || 'Failed to update program.' };
  }
}

export async function deleteProgramAction(id: string): Promise<{ error?: string }> {
  try {
    await deleteDoc(doc(firestore, 'programs', id));
    return {};
  } catch (error: any) {
    console.error('Error deleting program:', error);
    return { error: error.message || 'Failed to delete program.' };
  }
}

export async function getProgramsForAdmin(): Promise<ProgramDocument[]> {
  try {
    const snapshot = await getDocs(query(programsCollection, orderBy('created_at', 'desc')));
    return snapshot.docs.map((d) => toProgramDocument(d.id, d.data()));
  } catch (error) {
    console.error('Error fetching programs for admin:', error);
    return [];
  }
}

export async function getProgramById(id: string): Promise<ProgramDocument | null> {
  try {
    const snapshot = await getDoc(doc(firestore, 'programs', id));
    if (!snapshot.exists()) return null;
    return toProgramDocument(snapshot.id, snapshot.data());
  } catch (error) {
    console.error(`Error fetching program by id ${id}:`, error);
    return null;
  }
}

export async function getPublishedPrograms(): Promise<ProgramDocument[]> {
  return getProgramsForAdmin();
}
