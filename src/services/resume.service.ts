import Groq from "groq-sdk";
import dotenv from 'dotenv';
import pdf from 'pdf-parse';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const analyzeResumeContent = async (fileBuffer: Buffer, role: string) => {
  try {
    // This will now work without the "not callable" error
    const data = await pdf(fileBuffer); 
    const resumeText = data.text;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert ATS and Senior Technical Recruiter. Analyze the resume for a ${role} position. 
          Return ONLY a JSON object: { "score": number, "feedback": "string" }`
        },
        { role: "user", content: `Resume text: ${resumeText}` }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Resume Service Error:", error);
    throw new Error("Failed to analyze resume.");
  }
};