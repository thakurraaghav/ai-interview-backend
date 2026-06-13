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


const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI!)
    .then(() => console.log("🔑 Connected to the MongoDB"))
    .catch((err) => console.error("Database connection error:", err));

app.use(helmet()); 
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
    origin: [
        'https://recruitaifrontend.netlify.app', // ✨ Replace with your actual Netlify production URL
        'http://localhost:5173',               // Keep this so your local frontend development continues to work
        'http://localhost:3000'
    ], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-AI-Text'], 
    exposedHeaders: ['X-AI-Text'], // 🚀 CRITICAL: This allows the browser to read the text response headers in production
    credentials: true
}));


// Routes
app.use('/api/interview', interviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/company', companyRoutes);

app.listen(port, () => console.log(`🚀 AI Backend running at http://localhost:${port}`));