import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROGROQ_API_KEY });

export const getCompanyIntel = async (companyName: string, role: string) => {
  const systemPrompt = `You are an elite corporate talent acquisition specialist. Provide explicit, accurate interview preparation data for a target company and a targeted role. 
  Your entire response MUST be a single, valid JSON object following this exact schema structure precisely. Do not include markdown formatting or extra text outside the JSON object:
  {
    "overview": "A concise executive single summary paragraph detailing what this specific company prioritizes in their evaluations for this role.",
    "rounds": [
      { "name": "Round 1 Name", "focus": "Core testing vectors, topics, or expectations for this round." },
      { "name": "Round 2 Name", "focus": "Core testing vectors, topics, or expectations for this round." },
      { "name": "Round 3 Name", "focus": "Core testing vectors, topics, or expectations for this round." }
    ],
    "values": ["Culture Flag 1", "Culture Flag 2", "Culture Flag 3"],
    "focalPoints": ["High Priority Technical/Domain Topic 1", "High Priority Technical/Domain Topic 2", "High Priority Technical/Domain Topic 3"]
  }`;

  const userPrompt = `Target Company: ${companyName}\nTarget Position: ${role}`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    model: "llama-3.3-70b-versatile", // Or whichever model you are using across your app
    temperature: 0.3, // Low temperature keeps the JSON structure strictly formatted
  });

  const responseText = completion.choices[0]?.message?.content || "{}";
  
  // Parse the raw text string from Groq into an actual JavaScript Object
  return JSON.parse(responseText);
};