
// Represents the structure of a store product document as stored in Firestore
export interface StoreProductDocument {
  id: string; // Firestore document ID
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  name: string;
  description?: string | null;
  price: number;
  thumbnail_url?: string | null;
  in_stock: boolean;
  data_ai_hint?: string | null; // For placeholder images on public pages
}

// For client-side display
export interface StoreProductDisplay extends Omit<StoreProductDocument, 'created_at' | 'updated_at'> {
  created_at: string; // Keep original
  updated_at: string; // Keep original
  displayPrice: string; // Formatted price string for display (e.g., "$19.99")
  image: string; // Represents thumbnail_url or a fallback
}

// For "Notify Me" feature
export interface StockNotificationRequest {
    id?: string;
    product_id: string;
    user_email: string;
    created_at?: string;
}
