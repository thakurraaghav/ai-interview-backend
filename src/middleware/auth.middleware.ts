import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// We extend the Request type to include the user object
export interface AuthRequest extends Request {
  user?: { id: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Get token from cookies
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    
    // 3. Add user ID to the request object so the route knows who is calling
    req.user = { id: decoded.id };
    
    next(); // Move to the next function (the route)
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};