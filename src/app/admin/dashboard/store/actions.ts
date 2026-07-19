
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
import type { StoreProductDocument, StockNotificationRequest } from '@/types/store';

const storeProductsCollection = collection(firestore, 'store_products');
const stockNotificationsCollection = collection(firestore, 'product_stock_notifications');

function toStoreProductDocument(id: string, data: Record<string, any>): StoreProductDocument {
  return {
    id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    name: data.name,
    description: data.description ?? null,
    price: data.price,
    thumbnail_url: data.thumbnail_url ?? null,
    in_stock: data.in_stock,
    data_ai_hint: data.data_ai_hint ?? null,
  };
}

export async function addStoreProductAction(formData: FormData): Promise<{ error?: string; id?: string }> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string | null;
  const priceString = formData.get('price') as string;
  const thumbnail_url = formData.get('thumbnail_url') as string | null;
  const in_stock = formData.get('in_stock') === 'on';
  const data_ai_hint = formData.get('data_ai_hint') as string | null;

  if (!name || !priceString) {
    return { error: 'Product name and price are required.' };
  }

  const price = parseFloat(priceString);
  if (isNaN(price) || price < 0) {
    return { error: 'Invalid price format.' };
  }

  try {
    const now = new Date().toISOString();
    const newProductData = {
      name,
      description: description || null,
      price,
      thumbnail_url: thumbnail_url || null,
      in_stock,
      data_ai_hint: data_ai_hint || null,
      created_at: now,
      updated_at: now,
    };

    const docRef = await addDoc(storeProductsCollection, newProductData);
    return { id: docRef.id };
  } catch (error: any) {
    console.error('Error adding store product:', error);
    return { error: error.message || 'Failed to create store product.' };
  }
}

export async function updateStoreProductAction(id: string, formData: FormData): Promise<{ error?: string }> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string | null;
  const priceString = formData.get('price') as string;
  const thumbnail_url = formData.get('thumbnail_url') as string | null;
  const in_stock = formData.get('in_stock') === 'on';
  const data_ai_hint = formData.get('data_ai_hint') as string | null;

  if (!name || !priceString) {
    return { error: 'Product name and price are required.' };
  }
  const price = parseFloat(priceString);
  if (isNaN(price) || price < 0) {
    return { error: 'Invalid price format.' };
  }

  try {
    const updatedData = {
      name,
      description: description || null,
      price,
      thumbnail_url: thumbnail_url || null,
      in_stock,
      data_ai_hint: data_ai_hint || null,
      updated_at: new Date().toISOString(),
    };

    await updateDoc(doc(firestore, 'store_products', id), updatedData);
    return {};
  } catch (error: any) {
    console.error('Error updating store product:', error);
    return { error: error.message || 'Failed to update store product.' };
  }
}

export async function deleteStoreProductAction(id: string): Promise<{ error?: string }> {
  try {
    await deleteDoc(doc(firestore, 'store_products', id));
    return {};
  } catch (error: any) {
    console.error('Error deleting store product:', error);
    return { error: error.message || 'Failed to delete store product.' };
  }
}

export async function toggleStoreProductStockAction(id: string, currentState: boolean): Promise<{ success?: boolean; newState?: boolean; error?: string }> {
  try {
    const newState = !currentState;
    await updateDoc(doc(firestore, 'store_products', id), {
      in_stock: newState,
      updated_at: new Date().toISOString(),
    });
    return { success: true, newState };
  } catch (error: any) {
    console.error('Error toggling stock status:', error);
    return { error: error.message || 'Failed to toggle stock status.' };
  }
}

export async function getStoreProductsForAdmin(): Promise<StoreProductDocument[]> {
  try {
    const snapshot = await getDocs(query(storeProductsCollection, orderBy('created_at', 'desc')));
    return snapshot.docs.map((d) => toStoreProductDocument(d.id, d.data()));
  } catch (error) {
    console.error('Error fetching store products for admin:', error);
    return [];
  }
}

export async function getStoreProductById(id: string): Promise<StoreProductDocument | null> {
  try {
    const snapshot = await getDoc(doc(firestore, 'store_products', id));
    if (!snapshot.exists()) return null;
    return toStoreProductDocument(snapshot.id, snapshot.data());
  } catch (error) {
    console.error(`Error fetching store product by id ${id}:`, error);
    return null;
  }
}

export async function getPublishedStoreProducts(): Promise<StoreProductDocument[]> {
  return getStoreProductsForAdmin();
}

// Action for "Notify Me"
export async function addStockNotificationRequestAction(productId: string, email: string): Promise<{ success?: boolean; error?: string, message?: string }> {
  if (!productId || !email) {
    return { error: 'Product ID and email are required.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Invalid email format.' };
  }

  try {
    const existingQuery = query(
      stockNotificationsCollection,
      where('product_id', '==', productId),
      where('user_email', '==', email),
      limit(1)
    );
    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
      return { success: true, message: "You're already on the notification list for this product." };
    }

    const newRequest: Omit<StockNotificationRequest, 'id'> = {
      product_id: productId,
      user_email: email,
      created_at: new Date().toISOString(),
    };
    await addDoc(stockNotificationsCollection, newRequest);

    return { success: true, message: "We'll notify you when this product is back in stock!" };
  } catch (error: any) {
    console.error('Error inserting stock notification request:', error);
    return { error: error.message || 'Failed to submit notification request.' };
  }
}
