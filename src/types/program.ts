
// Represents the structure of a program document as stored in Firestore
export interface ProgramDocument {
  id: string; // Firestore document ID
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  title: string;
  description?: string; // Short description
  long_description?: string; // Detailed description
  thumbnail_url?: string;
  learn_more_url?: string; // Link for "Learn More" / "Get Involved"
  category: string; // e.g., "Meditation + Mental Health"
  icon_name?: string; // Name of Lucide icon or 'OmSymbol'
  tags?: string | null; // Comma-separated string
  data_ai_hint?: string; // For thumbnail images
}

// For client-side display, tags are transformed into string[]
export interface ProgramDisplay extends Omit<ProgramDocument, 'tags' | 'created_at'> {
  created_at: string; // Keep original created_at if needed
  displayDate: string; // Formatted date string for display
  tags: string[]; // Transformed from comma-separated string
  image: string; // Represents thumbnail_url or a fallback
}
