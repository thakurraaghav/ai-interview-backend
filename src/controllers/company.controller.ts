import { Request, Response } from 'express';
import * as companyService from '../services/company.service.js';

export const getCompanyPrepData = async (req: Request, res: Response) => {
  try {
    const { companyName, role } = req.body;

    if (!companyName || !role) {
      return res.status(400).json({ error: "Missing companyName or role parameters." });
    }

    // Call your service layer logic
    const intel = await companyService.getCompanyIntel(companyName, role);

    // Return the JSON directly back to your frontend fetch call
    return res.status(200).json(intel);
  } catch (error: any) {
    console.error("Company Prep Controller Error:", error);
    return res.status(500).json({ error: "Failed to generate company intel profile data metrics." });
  }
};