
'use server';
/**
 * @fileOverview A Genkit flow for converting text to speech using Hugging Face Inference API.
 *
 * - textToSpeech - Converts text to an audio data URI.
 * - TextToSpeechInput - Input type for the textToSpeech function.
 * - TextToSpeechOutput - Output type for the textToSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to synthesize.'),
  language: z.enum(['eng', 'hin']).describe("Target language for synthesis ('eng' for English, 'hin' for Hindi)."),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe("The synthesized audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
  error: z.string().optional().describe("Error message if synthesis failed."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text, language }) => {
    const hfApiToken = process.env.HF_API_TOKEN;
    if (!hfApiToken) {
      console.error('HF_API_TOKEN environment variable is not set.');
      return { audioDataUri: '', error: 'TTS configuration error: Missing API token.' };
    }

    let modelId = '';
    if (language === 'hin') {
      modelId = 'facebook/mms-tts-hin'; // Using the user-specified model
    } else if (language === 'eng') {
      modelId = 'facebook/mms-tts-eng'; // Standard English model
    } else {
      return { audioDataUri: '', error: `Unsupported language for TTS: ${language}` };
    }

    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${modelId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hfApiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: text }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text(); 
        console.error(`Hugging Face TTS API error (${modelId}): ${response.status} ${response.statusText} - Body: ${errorBody}`);
        
        let detailedError = `TTS API request failed: ${response.statusText} (Status: ${response.status})`;
        if (errorBody) {
          detailedError += ` Details: ${errorBody.substring(0, 250)}${errorBody.length > 250 ? '...' : ''}`;
        }
        return { audioDataUri: '', error: detailedError };
      }

      const audioArrayBuffer = await response.arrayBuffer();
      const audioBase64 = Buffer.from(audioArrayBuffer).toString('base64');
      
      const audioDataUri = `data:audio/wav;base64,${audioBase64}`; 
      
      return { audioDataUri };
    } catch (error: any) {
      console.error('Error calling Hugging Face TTS API:', error);
      return { audioDataUri: '', error: error.message || 'An unexpected error occurred during TTS synthesis.' };
    }
  }
);

