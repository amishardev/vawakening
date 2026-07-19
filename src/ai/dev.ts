
import { config } from 'dotenv';
config();

// Import your Genkit flows here
// e.g., import '@/ai/flows/your-flow.ts';
import '@/ai/flows/explain-mythology.ts';
import '@/ai/flows/mental-health-companion.ts';
import '@/ai/flows/suggest-wellness-tips.ts';
import '@/ai/flows/generate-image-flow.ts';
import '@/ai/flows/text-to-speech-flow.ts'; // Hugging Face TTS

