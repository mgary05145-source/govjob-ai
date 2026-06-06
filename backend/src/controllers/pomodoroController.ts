import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { duration, type, subject, focusScore } = req.body;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const session = await prisma.studySession.create({
      data: { userId, duration: parseInt(duration), type: type || 'pomodoro', subject, focusScore: parseInt(focusScore) || 0 },
    });

    const todaySessions = await prisma.studySession.findMany({
      where: { userId, date: { gte: todayStart } },
    });
    const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

    const weekStart = new Date(todayStart.getTime() - todayStart.getDay() * 86400000);
    const weekSessions = await prisma.studySession.findMany({
      where: { userId, date: { gte: weekStart } },
    });
    const weekMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthSessions = await prisma.studySession.findMany({
      where: { userId, date: { gte: monthStart } },
    });
    const monthMinutes = monthSessions.reduce((sum, s) => sum + s.duration, 0);

    let xpEarned = Math.floor(duration / 5);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const newXp = (user.xpPoints || 0) + xpEarned;
      const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
      await prisma.user.update({
        where: { id: userId },
        data: {
          xpPoints: newXp,
          level: newLevel,
          todayStudyMinutes: todayMinutes,
          weeklyStudyMinutes: weekMinutes,
          monthlyStudyMinutes: monthMinutes,
          totalStudyHours: { increment: duration / 3600 },
        },
      });
    }

    res.json({ session, todayMinutes, weekMinutes, monthMinutes, xpEarned });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log session' });
  }
};

export const getSessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { days = 7 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days as string));

    const sessions = await prisma.studySession.findMany({
      where: { userId, date: { gte: since } },
      orderBy: { date: 'desc' },
    });

    const dailyBreakdown: Record<string, number> = {};
    sessions.forEach(s => {
      const key = s.date.toISOString().split('T')[0];
      dailyBreakdown[key] = (dailyBreakdown[key] || 0) + s.duration;
    });

    res.json({ sessions, totalMinutes: sessions.reduce((s, d) => s + d.duration, 0), dailyBreakdown });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};
