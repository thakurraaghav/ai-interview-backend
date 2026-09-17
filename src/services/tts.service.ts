import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

//Generates WAV audio from text using Groq's Orpheus TTS model.

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
    console.error("TTS Error:", error);
    throw error;
  }
};