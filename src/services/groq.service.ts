import Groq from "groq-sdk";
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateGroqResponse = async (
  userMessage: string, 
  history: any[]
): Promise<string> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: `You are a Senior Technical Interviewer at a top-tier tech firm. 
        Your goal is to assess the candidate's deep technical knowledge, problem-solving ability, and architectural thinking.
        
        GUIDELINES:
        1. Professional & Challenging: Be polite but rigorous. If the candidate gives a surface-level answer, ask for more depth.
        2. One Question at a Time: Never overwhelm the user. Ask one clear, targeted question.
        3. Adaptive: If they mention a specific technology (like React or Node.js), dive deeper into that specific area.
        4. Brief: Keep your responses concise (under 2-3 sentences) to maintain the flow of a real-life conversation.
        5. Contextual: Use the provided conversation history to avoid repeating questions and to build upon previous answers.` },
        ...history,
        { role: 'user', content: userMessage }
      ],
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    });

    return completion.choices[0].message.content || "";
  } catch (error) {
    console.error("Groq API Error:", error);
    throw error;
  }
};