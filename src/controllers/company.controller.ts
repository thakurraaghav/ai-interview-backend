import { Request, Response } from 'express';
import { getCompanyIntel } from '../services/company.service.js';

export const getCompanyPrepData = async (req: Request, res: Response) => {
  try {
    const { companyName, role } = req.body;

    if (!companyName || !role) {
      return res.status(400).json({ error: "Missing companyName or role parameters." });
    }

    const intel = await getCompanyIntel(companyName, role);

    return res.status(200).json(intel);
  } catch (error: any) {
    console.error("Company Prep Controller Error:", error);
    return res.status(500).json({ error: "Failed to generate company intel profile data metrics." });
  }
};