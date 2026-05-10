import { Router, Response } from 'express';
import { Readable } from 'stream';
import { getOrpheusAudioStream } from '../services/tts.service.js';
import { generateInterviewReport } from '../services/report.service.js';
import User from '../models/User.js';
import { protect, AuthRequest } from '../middleware/auth.middleware.js';
import Groq from "groq-sdk";

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY!});

router.post('/chat', async (req, res) => {
  const { userMessage, history } = req.body;

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
        { role: "user", content: userMessage }
      ],
      model: "llama-3.3-70b-versatile",
    });

    const aiText = completion.choices[0].message.content || "";
    const audioStream = await getOrpheusAudioStream(aiText, 'hannah');

    if (!audioStream) throw new Error("Audio stream failed");

    res.set({
      'Content-Type': 'audio/wav',
      'X-AI-Text': encodeURIComponent(aiText),
      'Transfer-Encoding': 'chunked'
    });

    Readable.fromWeb(audioStream as any).pipe(res);
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "AI Chat failed" });
  }
});

router.post('/report', protect, async (req: AuthRequest, res: Response) => {
  const { history } = req.body;
  const userId = req.user?.id;

  try {
    const report = await generateInterviewReport(history);
    const reportWithMetadata = { ...report, date: new Date(), id: Date.now().toString() };
    await User.findByIdAndUpdate(userId, { $push: { interviews: reportWithMetadata } });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Report failed" });
  }
});

/**
 * @route   DELETE /api/interview/:id
 * @desc    Remove a specific interview session
 */

router.delete('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const interviewId = req.params.id; // This comes from the URL

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        // 💡 This tells Mongo: "Look inside interviews and remove the one where id matches"
        $pull: { interviews: { id: interviewId } }
      },
      { new: true } // Return the updated user so we can verify it worked
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;