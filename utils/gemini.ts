import { GoogleGenAI } from "@google/genai";
import type { Song } from '../types';

/**
 * Calls the Gemini API to estimate the BPM of a song based on its metadata.
 * @param song The song object containing metadata like title, artist, and instruments.
 * @returns A promise that resolves to the estimated BPM as a number, or null if the API call fails or returns invalid data.
 */
export const getBpmFromGemini = async (song: Song): Promise<number | null> => {
  // Prevent API calls for songs with no real data, which are just for demonstration.
  if (song.tracks.every(t => !t.path)) {
    return song.bpm;
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const instrumentList = song.tracks.map(t => t.instrument).join(', ');
    const prompt = `
      Analyze the following Brazilian Maracatu song information and return your best estimate for its Beats Per Minute (BPM) as a single integer.
      - Song Title: "${song.name}"
      - Artist: "${song.artist}"
      - Instruments: ${instrumentList}
      
      Based on the style (Maracatu de Baque Virado), artist, and instrumentation, what is the likely BPM?
      
      Return only the integer number. For example: 125
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text.trim();
    const bpm = parseInt(text, 10);

    // Basic validation to ensure the BPM is within a reasonable range.
    if (!isNaN(bpm) && bpm > 40 && bpm < 240) {
      console.log(`Gemini estimated BPM for "${song.name}": ${bpm}`);
      return bpm;
    } else {
      console.warn(`Gemini returned an invalid BPM format: "${text}". Falling back to default BPM of ${song.bpm}.`);
      return null;
    }
  } catch (error) {
    console.error("Error calling Gemini API for BPM estimation:", error);
    // Fallback to the default BPM on API error.
    return null;
  }
};
