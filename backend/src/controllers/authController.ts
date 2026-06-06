import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'govjob-secret-key-2026';

function generateToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, qualification, state, interests, availableStudyTime, age } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name, email, password: hashedPassword,
        qualification, state, interests, availableStudyTime: parseInt(availableStudyTime) || 0,
        age: parseInt(age) || undefined,
      },
    });

    const token = generateToken(user.id);
    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, qualification: user.qualification, level: user.level, xpPoints: user.xpPoints },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(user.id);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, qualification: user.qualification, level: user.level, xpPoints: user.xpPoints },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { email, name, googleId, avatar } = req.body;
    let user = await prisma.user.findFirst({ where: { OR: [{ email }, { googleId }] } });

    if (!user) {
      user = await prisma.user.create({ data: { email, name, googleId, avatar } });
    } else if (googleId && !user.googleId) {
      user = await prisma.user.update({ where: { id: user.id }, data: { googleId, avatar } });
    }

    const token = generateToken(user.id);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, level: user.level, xpPoints: user.xpPoints },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Google login failed' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, avatar: true, qualification: true, state: true,
        interests: true, availableStudyTime: true, age: true,
        studyStreak: true, longestStreak: true, totalStudyHours: true,
        todayStudyMinutes: true, weeklyStudyMinutes: true, monthlyStudyMinutes: true,
        xpPoints: true, level: true, lastStudyDate: true, streakFreeze: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { name, qualification, state, interests, availableStudyTime, age } = req.body;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, qualification, state, interests, availableStudyTime: parseInt(availableStudyTime) || undefined, age: parseInt(age) || undefined },
    });
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
};
