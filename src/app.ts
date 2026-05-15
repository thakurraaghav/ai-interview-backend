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


const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI!)
    .then(() => console.log("✨ Connected to the RecruitAI Vault (MongoDB)"))
    .catch((err) => console.error("Database connection error:", err));

app.use(helmet()); 
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/interview', interviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

app.listen(port, () => console.log(`🚀 AI Backend running at http://localhost:${port}`));