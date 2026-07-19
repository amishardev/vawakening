
// Represents the structure of a resource document as stored in Firestore
export interface ResourceDocument {
  id: string; // Firestore document ID
  name: string; // Title of the resource
  short_description?: string;
  link: string; // URL to the external resource
  thumbnail_url?: string;
  type: 'Article' | 'Video' | 'Podcast' | string; // Type of resource
  tags?: string | null; // Stored as a comma-separated string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  dataAiHint?: string; // For placeholder images on public pages
}

// For client-side display, tags are transformed into string[]
export interface ResourceDisplay extends Omit<ResourceDocument, 'tags' | 'created_at'> {
  created_at: string; // Keep original created_at if needed
  displayDate: string; // Formatted date string for display
  tags: string[]; // Transformed from comma-separated string
  image: string; // Represents thumbnail_url or a fallback
}
