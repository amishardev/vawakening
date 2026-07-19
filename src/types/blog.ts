
// Represents the structure of a blog post document as stored in Firestore
export interface BlogPostDocument {
  id: string; // Firestore document ID
  title: string;
  slug: string; // Will be the same as ID
  content: string; // Main HTML content of the blog post
  thumbnailUrl?: string; // URL from GitHub raw link
  author: string;
  tags: string | null; // Stored as a comma-separated string in a 'text' column, or null
  created_at: string; // ISO date string (e.g., "2023-10-26T10:00:00.000Z")
  updated_at: string; // ISO date string
  excerpt?: string;
  dataAiHint?: string; // For placeholder images, if any are used elsewhere
}

// For client-side display, tags are transformed into string[]
export interface BlogPostDisplay extends Omit<BlogPostDocument, 'tags' | 'created_at'> {
  date: string; // Formatted date string for display, derived from created_at
  tags: string[]; // Transformed from comma-separated string to array for display
  image: string; // Represents thumbnailUrl or a fallback
  created_at: string; // Keep original created_at if needed for other logic
}
