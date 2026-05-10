import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateInterviewReport = async (history: { role: string; content: string }[]) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert Technical Interview Analyst. 
          Analyze the provided interview transcript and return a JSON object with scores (0-100) for these 5 categories:
          1. technical: Accuracy and depth of knowledge.
          2. communication: Clarity, flow, and jargon usage.
          3. logic: Problem-solving approach and handling edge cases.
          4. confidence: Certainty in answers and lack of filler words.
          5. conciseness: Ability to explain complex ideas without rambling.

          Output Format (JSON only):
          {
            "score": number (total average),
            "verdict": "A sharp, one-sentence evaluation.",
            "feedback": "A detailed paragraph with pros and cons.",
            "skills": {
              "technical": number,
              "communication": number,
              "logic": number,
              "confidence": number,
              "conciseness": number
            }
          }`
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