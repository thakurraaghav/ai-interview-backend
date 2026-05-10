import mongoose from 'mongoose';

// 1. Define the internal structure of an interview
const InterviewSchema = new mongoose.Schema({
  id: { type: String, required: true },
  score: Number,
  verdict: String,
  feedback: String,
  transcript: [{
    role: String, // 'user' or 'assistant'
    content: String,
    critique: String // 💡 This is where the AI will put its "inline comment"
  }],
  skills: { // 👈 Ensure this is here
    technical: Number,
    communication: Number,
    logic: Number,
    confidence: Number,
    conciseness: Number
  },
  date: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // 2. Use the specific schema here instead of generic Object
    interviews: [InterviewSchema] 
});

export default mongoose.model('User', UserSchema);