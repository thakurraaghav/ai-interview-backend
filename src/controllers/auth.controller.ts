import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

export const register = async (req: Request, res: Response) => {
    try{
        const {name, email, password} = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message: "User already exists"});

        //2. Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        //3. Create the user
        const newUser = await User.create({name, email, password: hashedPassword});
        
        //4. Create a JWT Token (The Entry Pass)
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET!, {expiresIn: '7d'});

        res.cookie('token', token, getCookieOptions());
        res.status(201).json({user: {name: newUser.name, email: newUser.email}});
    } catch(error){
        res.status(500).json({message: "Something Went Wrong"});
    }
};

export const login = async(req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message: "User not found"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentails"});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!, {expiresIn: '7d'})
        res.cookie('token', token, getCookieOptions());
        res.status(200).json({user: {name: user.name, email: user.email}});
    } catch (error) {
        res.status(500).json({message: "Something went wrong"});
    }
}

export const status = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token', {
        ...getCookieOptions(),
        maxAge: 0
    });
    res.json({ message: "Logged out" });
}