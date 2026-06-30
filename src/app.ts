import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import interviewRoutes from './routes/interview.routes.js';
import mongoose from 'mongoose'; 
import authRoutes from './routes/auth.routes.js'
import resumeRoutes from './routes/resume.routes.js'
import companyRoutes from './routes/company.routes.js'
import { errorHandler } from './middleware/errorHandler.js';

import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI!)
    .then(() => console.log("🔑 Connected to the MongoDB"))
    .catch((err) => console.error("Database connection error:", err));

app.use(helmet()); 
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window`
	standardHeaders: true,
	legacyHeaders: false,
});
app.use('/api/', apiLimiter);

app.use(cors({
    origin: [
        'https://recruitaifrontend.netlify.app', 
        'http://localhost:5173',               
        'http://localhost:3000',
        'https://ai-interview-frontend-two.vercel.app',
        /\.vercel\.app$/
    ], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-AI-Text'], 
    exposedHeaders: ['X-AI-Text'], 
    credentials: true
}));

// Routes
app.use('/api/interview', interviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/company', companyRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(port, () => console.log(`🚀 AI Backend running at http://localhost:${port}`));