
'use server';
/**
 * @fileOverview A Genkit flow for converting text to speech using OpenAI TTS API.
 *
 * - openaiTextToSpeech - Converts text to an audio data URI using OpenAI.
 * - OpenaiTextToSpeechInput - Input type for the openaiTextToSpeech function.
 * - OpenaiTextToSpeechOutput - Output type for the openaiTextToSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OpenaiTextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to synthesize.'),
  voice: z.string().optional().default('onyx').describe('The OpenAI TTS voice to use (e.g., alloy, echo, fable, onyx, nova, shimmer).'),
  model: z.string().optional().default('tts-1').describe('The OpenAI TTS model to use (e.g., tts-1, tts-1-hd).'),
});
export type OpenaiTextToSpeechInput = z.infer<typeof OpenaiTextToSpeechInputSchema>;

const OpenaiTextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().optional().describe("The synthesized audio as a data URI. Expected format: 'data:audio/mpeg;base64,<encoded_data>'."),
  error: z.string().optional().describe("Error message if synthesis failed."),
});
export type OpenaiTextToSpeechOutput = z.infer<typeof OpenaiTextToSpeechOutputSchema>;

export async function openaiTextToSpeech(input: OpenaiTextToSpeechInput): Promise<OpenaiTextToSpeechOutput> {
  return openaiTextToSpeechFlow(input);
}

const openaiTextToSpeechFlow = ai.defineFlow(
  {
    name: 'openaiTextToSpeechFlow',
    inputSchema: OpenaiTextToSpeechInputSchema,
    outputSchema: OpenaiTextToSpeechOutputSchema,
  },
  async ({ text, voice, model }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY environment variable is not set.');
      return { error: 'TTS configuration error: Missing OpenAI API key.' };
    }

    try {
      const response = await fetch(
        'https://api.openai.com/v1/audio/speech',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model || 'tts-1',
            input: text,
            voice: voice || 'onyx',
            response_format: 'mp3', // OpenAI supports mp3, opus, aac, flac
          }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.json().catch(() => response.text()); // Try to parse JSON, fallback to text
        console.error(`OpenAI TTS API error: ${response.status} ${response.statusText} - Body:`, errorBody);
        
        let detailedError = `OpenAI TTS API request failed: ${response.statusText} (Status: ${response.status})`;
        if (typeof errorBody === 'object' && errorBody?.error?.message) {
          detailedError += ` Details: ${errorBody.error.message}`;
        } else if (typeof errorBody === 'string') {
          detailedError += ` Details: ${errorBody.substring(0, 250)}${errorBody.length > 250 ? '...' : ''}`;
        }
        return { error: detailedError };
      }

      const audioArrayBuffer = await response.arrayBuffer();
      const audioBase64 = Buffer.from(audioArrayBuffer).toString('base64');
      
      // OpenAI returns MP3, so MIME type is audio/mpeg
      const audioDataUri = `data:audio/mpeg;base64,${audioBase64}`; 
      
      return { audioDataUri };
    } catch (error: any) {
      console.error('Error calling OpenAI TTS API:', error);
      return { error: error.message || 'An unexpected error occurred during OpenAI TTS synthesis.' };
    }
  }
);
