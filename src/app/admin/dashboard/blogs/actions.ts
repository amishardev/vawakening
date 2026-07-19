
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
  where,
  limit,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';
import type { BlogPostDocument } from '@/types/blog';
import { stripHtml } from '@/lib/utils';

const blogsCollection = collection(firestore, 'blogs');

function toBlogPostDocument(id: string, data: Record<string, any>): BlogPostDocument {
  return {
    id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    thumbnailUrl: data.thumbnailUrl || undefined,
    author: data.author,
    tags: data.tags || null,
    created_at: data.created_at,
    updated_at: data.updated_at,
    excerpt: data.excerpt,
    dataAiHint: data.dataAiHint,
  };
}

export async function addBlogPostAction(formData: FormData): Promise<{ error?: string; id?: string }> {
  const author = 'Admin';

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const thumbnailUrl = formData.get('thumbnailUrl') as string | null;
  const tags = formData.get('tags') as string | null;

  if (!title || !content) {
    return { error: 'Title and content are required.' };
  }

  try {
    const now = new Date().toISOString();
    const plainTextContent = stripHtml(content);
    const newPostData = {
      title,
      content,
      author,
      thumbnailUrl: thumbnailUrl || null,
      tags: tags || null,
      excerpt: plainTextContent.substring(0, 200) + (plainTextContent.length > 200 ? '...' : ''),
      created_at: now,
      updated_at: now,
      slug: '',
    };

    const docRef = await addDoc(blogsCollection, newPostData);
    await updateDoc(docRef, { slug: docRef.id });

    return { id: docRef.id };
  } catch (error: any) {
    console.error('Error adding blog post:', error);
    return { error: error.message || 'Failed to create blog post.' };
  }
}

export async function updateBlogPostAction(id: string, formData: FormData): Promise<{ error?: string }> {
  const author = 'Admin';

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const thumbnailUrl = formData.get('thumbnailUrl') as string | null;
  const tags = formData.get('tags') as string | null;

  if (!title || !content) {
    return { error: 'Title and content are required.' };
  }

  try {
    const plainTextContent = stripHtml(content);
    const updatedData = {
      title,
      content,
      author,
      thumbnailUrl: thumbnailUrl || null,
      tags: tags || null,
      excerpt: plainTextContent.substring(0, 200) + (plainTextContent.length > 200 ? '...' : ''),
      updated_at: new Date().toISOString(),
    };

    await updateDoc(doc(firestore, 'blogs', id), updatedData);
    return {};
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return { error: error.message || 'Failed to update blog post.' };
  }
}

export async function deleteBlogPostAction(id: string): Promise<{ error?: string }> {
  try {
    await deleteDoc(doc(firestore, 'blogs', id));
    return {};
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return { error: error.message || 'Failed to delete blog post.' };
  }
}

export async function getBlogPostsForAdmin(): Promise<BlogPostDocument[]> {
  try {
    const snapshot = await getDocs(query(blogsCollection, orderBy('created_at', 'desc')));
    return snapshot.docs.map((d) => toBlogPostDocument(d.id, d.data()));
  } catch (error) {
    console.error('Error fetching posts for admin:', error);
    return [];
  }
}

export async function getBlogPostById(id: string): Promise<BlogPostDocument | null> {
  try {
    const snapshot = await getDoc(doc(firestore, 'blogs', id));
    if (!snapshot.exists()) return null;
    return toBlogPostDocument(snapshot.id, snapshot.data());
  } catch (error) {
    console.error(`Error fetching post by id ${id}:`, error);
    return null;
  }
}

export async function getPublishedBlogPosts(): Promise<BlogPostDocument[]> {
  try {
    const snapshot = await getDocs(query(blogsCollection, orderBy('created_at', 'desc')));
    return snapshot.docs.map((d) => toBlogPostDocument(d.id, d.data()));
  } catch (error) {
    console.error('Error fetching published blog posts:', error);
    return [];
  }
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPostDocument | null> {
  try {
    const snapshot = await getDocs(query(blogsCollection, where('slug', '==', slug), limit(1)));
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return toBlogPostDocument(d.id, d.data());
  } catch (error) {
    console.error(`Error fetching post by slug ${slug}:`, error);
    return null;
  }
}

export async function getFeaturedBlogPosts(count: number): Promise<BlogPostDocument[]> {
  try {
    const snapshot = await getDocs(query(blogsCollection, orderBy('created_at', 'desc'), limit(count)));
    return snapshot.docs.map((d) => toBlogPostDocument(d.id, d.data()));
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    return [];
  }
}
