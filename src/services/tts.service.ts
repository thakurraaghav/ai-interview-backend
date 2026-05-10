import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';
import { Readable } from 'stream';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Returns a live stream of audio data from Orpheus
 */
export const getOrpheusAudioStream = async (text: string, voice: string = 'hannah') => {
  try {
    const response = await groq.audio.speech.create({
      model: "canopylabs/orpheus-v1-english",
      input: text,
      voice: voice,
      response_format: "wav",
    });

    // We get the body as a readable stream
    // This allows us to start sending data immediately
    return response.body; 
  } catch (error) {
    console.error("TTS Stream Error:", error);
    throw error;
  }
};