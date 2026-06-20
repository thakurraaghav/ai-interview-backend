import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const response = await groq.audio.speech.create({
    model: "canopylabs/orpheus-v1-english",
    input: "Hello world",
    voice: "hannah",
    response_format: "wav",
  });
  console.log("Response type:", typeof response);
  console.log("Is Buffer?", Buffer.isBuffer(response));
  console.log("Response body:", (response as any).body);
  console.log("Response length:", (response as any).byteLength);
}
main().catch(console.error);
