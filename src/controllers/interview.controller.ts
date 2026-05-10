import { Request, Response } from 'express';
import { Readable } from 'stream'; // 1. Add this import
import { generateGroqResponse } from '../services/groq.service.js';
import { getOrpheusAudioStream } from '../services/tts.service.js';

export const chatWithAI = async (req: Request, res: Response) => {
  const { userMessage, history = [] } = req.body;

  try {
    let fullText = "";
    await generateGroqResponse(userMessage, history, (chunk) => {
      fullText += chunk;
    });

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Transfer-Encoding', 'chunked');

    const audioStream = await getOrpheusAudioStream(fullText);

    // 2. The Fix: Convert Web Stream to Node.js Readable Stream
    // This ensures .pipe() exists and works with Express
    const nodeStream = Readable.fromWeb(audioStream as any);

    nodeStream.pipe(res);

  } catch (error) {
    console.error("Voice Stream Error:", error);
    if (!res.headersSent) res.status(500).json({ error: "Voice streaming failed" });
  }
};