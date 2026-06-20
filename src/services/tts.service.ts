import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';
import { Readable } from 'stream';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Returns a live stream of audio data from Orpheus
 */
export const getOrpheusAudioBuffer = async (text: string, voice: string = 'hannah'): Promise<Buffer> => {
  try {
    const response = await groq.audio.speech.create({
      model: "canopylabs/orpheus-v1-english",
      input: text,
      voice: voice,
      response_format: "wav",
    });

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer); 
  } catch (error) {
    console.error("TTS Stream Error:", error);
    throw error;
  }
};