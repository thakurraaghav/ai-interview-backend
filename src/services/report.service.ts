import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateInterviewReport = async (history: { role: string; content: string }[], role: string) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert Senior Technical Recruiter specializing in ${role} roles.
          
          TASK:
          1. Analyze the overall performance.
          2. Critique every user response individually.
          
          OUTPUT JSON FORMAT:
          {
            "score": number (0-100),
            "verdict": "One short, punchy sentence.",
            "feedback": "A detailed paragraph on performance.",
            "skills": {
              "technical": number,
              "communication": number,
              "logic": number,
              "confidence": number,
              "conciseness": number
            },
            "transcript": [
               { 
                 "role": "assistant" | "user", 
                 "content": "string", 
                 "critique": "A short 1-sentence tip or praise. ONLY provide this for 'user' roles. Leave null for 'assistant'." 
               }
            ]
          }

          INSTRUCTIONS FOR CRITIQUE:
          - If the user was vague, suggest being more specific.
          - If they used filler words, point it out.
          - If they gave a great technical answer, praise the specific concept they mentioned.`
        },
        {
          role: "user",
          content: `Analyze my performance and generate the report for this transcript: ${JSON.stringify(history)}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      // 💡 This is the secret sauce: forcing the AI to speak in JSON
      response_format: { type: "json_object" }, // Ensures Groq returns valid JSON
      temperature: 0.2, // Low temperature for consistent grading
    });

    const reportText = chatCompletion.choices[0].message.content;
    return JSON.parse(reportText || "{}");
  } catch (error) {
    console.error("Report Service Error:", error);
    throw new Error("Failed to analyze interview.");
  }
};