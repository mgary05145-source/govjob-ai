import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAchievements = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xpPoints: true, level: true, studyStreak: true, longestStreak: true },
    });

    const achievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' },
    });

    const allBadges = [
      { badge: 'First Study', desc: 'Complete your first study session', xp: 10, icon: '🎯' },
      { badge: '3-Day Streak', desc: 'Studied 3 days in a row', xp: 30, icon: '🔥' },
      { badge: '7-Day Streak', desc: 'Studied 7 days in a row', xp: 100, icon: '🔥' },
      { badge: '15-Day Streak', desc: 'Half month of consistency', xp: 250, icon: '💪' },
      { badge: '30-Day Streak', desc: 'One month of non-stop learning', xp: 500, icon: '🏆' },
      { badge: 'Quiz Master', desc: 'Score 90%+ in any mock test', xp: 200, icon: '📝' },
      { badge: 'Note Taker', desc: 'Create 10 study notes', xp: 100, icon: '📓' },
      { badge: 'Early Bird', desc: 'Study before 6 AM', xp: 50, icon: '🌅' },
      { badge: 'Night Owl', desc: 'Study after 11 PM', xp: 50, icon: '🦉' },
      { badge: 'Speed Demon', desc: 'Complete a test in half the time', xp: 150, icon: '⚡' },
      { badge: '10 Hours Club', desc: 'Study 10 hours in a single day', xp: 300, icon: '⭐' },
      { badge: 'Syllabus Champion', desc: 'Complete 100% syllabus', xp: 500, icon: '📚' },
      { badge: '7-Day Champion', desc: 'Reached 7-day longest streak', xp: 100, icon: '🥉' },
      { badge: 'Monthly Warrior', desc: 'Reached 30-day longest streak', xp: 500, icon: '🥈' },
      { badge: 'Streak Legend', desc: 'Reached 100-day longest streak', xp: 2000, icon: '🥇' },
    ];

    const locked = allBadges.filter(b => !achievements.find(a => a.badge === b.badge));
    const nextBadge = locked.length > 0 ? locked[0] : null;
    const xpToNextLevel = (user?.level || 1) * 100;
    const currentLevelXp = (user?.xpPoints || 0) - ((user?.level || 1) - 1) * 100;

    res.json({
      user: { xp: user?.xpPoints || 0, level: user?.level || 1, streak: user?.studyStreak || 0 },
      achievements,
      locked,
      nextBadge,
      progress: { currentXp: currentLevelXp, requiredXp: xpToNextLevel, percentage: Math.min(100, Math.round((currentLevelXp / xpToNextLevel) * 100)) },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
};

export const getLeaderboard = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, xpPoints: true, level: true, studyStreak: true },
      orderBy: { xpPoints: 'desc' },
      take: 100,
    });

    const ranked = users.map((u, i) => ({
      rank: i + 1,
      name: u.name || 'Anonymous',
      xp: u.xpPoints,
      level: u.level,
      streak: u.studyStreak,
    }));

    res.json({ leaderboard: ranked });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};
