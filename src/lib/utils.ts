import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to strip HTML tags
export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  // This regex removes HTML tags.
  // It looks for <, followed by any characters except >, then >.
  // The 'g' flag means global (replace all instances).
  // The 'm' flag means multiline.
  return html.replace(/<[^>]*>?/gm, '');
}
