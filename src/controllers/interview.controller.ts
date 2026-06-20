import { Request, Response, NextFunction } from 'express';
import { getOrpheusAudioBuffer } from '../services/tts.service.js';
import { generateInterviewReport } from '../services/report.service.js';
import User from '../models/User.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { generateGroqResponse } from '../services/groq.service.js';

export const chatWithAI = async (req: Request, res: Response, next: NextFunction) => {
  const { userMessage, history } = req.body;

  try {
    const aiText = await generateGroqResponse(userMessage, history);
    const audioBuffer = await getOrpheusAudioBuffer(aiText, 'hannah');

    if (!audioBuffer) throw new Error("Audio buffer failed");

    res.json({
      text: aiText,
      audioBase64: audioBuffer.toString('base64')
    });
  } catch (error) {
    next(error);
  }
};

export const generateReport = async (req: AuthRequest, res: Response): Promise<void | Response> => {
  const { history, role } = req.body;
  const userId = req.user?.id;

  // 💡 Security check: Don't waste AI tokens or DB space on empty sessions
  if (!history || history.length < 3) {
    return res.status(400).json({ 
      error: "Session too short. No analysis generated." 
    });
  }

  try {
    const report = await generateInterviewReport(history, role);
    const reportWithMetadata = { ...report, transcript: report.transcript, role: role,  date: new Date(), id: Date.now().toString() };
    await User.findByIdAndUpdate(userId, { $push: { interviews: reportWithMetadata } });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Report failed" });
  }
};

export const deleteSession = async (req: AuthRequest, res: Response): Promise<void | Response> => {
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
};