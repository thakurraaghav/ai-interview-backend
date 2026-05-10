import Groq from "groq-sdk";
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateGroqResponse = async (
  userMessage: string, 
  history: any[], 
  onChunk: (content: string) => void
) => {
  try {
    const stream = await groq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'You are a Senior Technical Interviewer. Ask one concise React question. No markdown.' 
        },
        ...history,
        { role: 'user', content: userMessage }
      ],
      // Use the new model name here
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error("Groq API Error:", error);
    throw error; // Let the controller handle the final 500 error
  }
};