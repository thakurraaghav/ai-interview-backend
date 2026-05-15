import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import * as resumeService from '../services/resume.service.js';
import User from "../models/User.js";

export const handleResumeAnalysis = async (req: AuthRequest, res: Response) => {
    try {
        if(!req.file){
            return res.status(400).json({error: "No resume file uploaded"});
        }

        const {role} = req.body; // Passed from frontend (e.g., 'Fullstack Developer')
        const userId = req.user?.id; // from protect middleware

        // 1. Get AI Analysis
        const analysis = await resumeService.analyzeResumeContent(req.file.buffer, role);

        // 2. Prepare metadata for history
        const resumeEntry = {
            id: Date.now().toString(),
            score: analysis.score,
            feedback: analysis.feedback,
            role: role || "Fullstack Developer",
            fileName: req.file.originalname,
            date: new Date()
         };

        // 3. Save to User History
        const result = await User.findByIdAndUpdate(
            userId,
            { $push: { resumes: resumeEntry } },
            { returnDocument: 'after', runValidators: true } // 💡 Changed 'new: true' to 'returnDocument: after'
            );

        if (!result) {
      console.error("❌ User not found in DB during resume save");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Resume successfully pushed to MongoDB for:", result.name);
    res.json(resumeEntry);

    } catch(error){
        console.error("❌ MongoDB Save Error:", error);
    res.status(500).json({ error: "Database save failed" });
    }
};