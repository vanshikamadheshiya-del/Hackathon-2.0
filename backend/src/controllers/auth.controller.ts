import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

export const register = async (req: Request, res: Response) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(409).json({
            message: "User already exists with this email",
          });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });
        
        await user.save();
    
        return res.status(201).json({
          message: "User registered successfully",
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
          },
        });
      } catch (error) {
        return res.status(500).json({
          message: "Error in user registration",
          error: (error as Error).message,
        });
      }
};

export const logout = (req: Request, res: Response): void => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout error' });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out successfully' });
    });
};

export const currentUser = async (req: Request, res: Response) => {
    const user = req.user as IUser | undefined;

    if (!user) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    const foundUser = await User.findById(user._id).select('-password');

    if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: foundUser });
};
