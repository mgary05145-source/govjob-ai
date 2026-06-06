import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStreak = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { studyStreak: true, longestStreak: true, lastStudyDate: true, streakFreeze: true },
    });

    const history = await prisma.streakHistory.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 60,
    });

    res.json({ ...user, history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch streak' });
  }
};

export const updateStreak = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { minutes } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await prisma.streakHistory.upsert({
      where: { userId_date: { userId, date: today } },
      update: { studied: true, minutes: (minutes || 0) + (await getExistingMinutes(userId, today)) },
      create: { userId, date: today, studied: true, minutes: minutes || 0 },
    });

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastStreak = user.lastStudyDate;

    let newStreak = 1;
    if (lastStreak) {
      const lastDate = new Date(lastStreak);
      lastDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (86400000));

      if (diffDays === 1) {
        newStreak = (user.studyStreak || 0) + 1;
      } else if (diffDays === 0) {
        newStreak = user.studyStreak || 0;
      } else if (diffDays === 2 && (user.streakFreeze || 0) > 0) {
        newStreak = (user.studyStreak || 0) + 1;
        await prisma.user.update({ where: { id: userId }, data: { streakFreeze: { decrement: 1 } } });
      } else {
        newStreak = 1;
      }
    }

    const newLongest = Math.max(newStreak, user.longestStreak || 0);

    const weekStart = new Date(today.getTime() - today.getDay() * 86400000);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const [weekSessions, monthSessions] = await Promise.all([
      prisma.studySession.findMany({ where: { userId, date: { gte: weekStart } } }),
      prisma.studySession.findMany({ where: { userId, date: { gte: monthStart } } }),
    ]);

    await prisma.user.update({
      where: { id: userId },
      data: {
        studyStreak: newStreak,
        longestStreak: newLongest,
        lastStudyDate: today,
        weeklyStudyMinutes: weekSessions.reduce((s, d) => s + d.duration, 0),
        monthlyStudyMinutes: monthSessions.reduce((s, d) => s + d.duration, 0),
        xpPoints: { increment: 10 },
      },
    });

    const badges = await checkAndAwardBadges(userId, newStreak, newLongest);

    res.json({ streak: newStreak, longest: newLongest, badges });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update streak' });
  }
};

async function getExistingMinutes(userId: number, date: Date): Promise<number> {
  const existing = await prisma.streakHistory.findUnique({
    where: { userId_date: { userId, date } },
  });
  return existing?.minutes || 0;
}

async function checkAndAwardBadges(userId: number, streak: number, longest: number): Promise<any[]> {
  const badges: any[] = [];
  const existing = await prisma.achievement.findMany({ where: { userId }, select: { badge: true } });
  const existingBadges = new Set(existing.map(a => a.badge));

  const badgeMilestones = [
    { condition: streak >= 3, badge: '3-Day Streak', desc: 'Studied 3 days in a row', xp: 30 },
    { condition: streak >= 7, badge: '7-Day Streak', desc: 'Studied 7 days in a row', xp: 100 },
    { condition: streak >= 15, badge: '15-Day Streak', desc: 'Half month of consistency', xp: 250 },
    { condition: streak >= 30, badge: '30-Day Streak', desc: 'One month of non-stop learning', xp: 500 },
    { condition: longest >= 7, badge: '7-Day Champion', desc: 'Reached 7-day longest streak', xp: 100 },
    { condition: longest >= 30, badge: 'Monthly Warrior', desc: 'Reached 30-day longest streak', xp: 500 },
    { condition: longest >= 100, badge: 'Streak Legend', desc: 'Reached 100-day longest streak', xp: 2000 },
  ];

  for (const m of badgeMilestones) {
    if (m.condition && !existingBadges.has(m.badge)) {
      await prisma.achievement.create({
        data: { userId, badge: m.badge, description: m.desc, xpRewarded: m.xp },
      });
      await prisma.user.update({ where: { id: userId }, data: { xpPoints: { increment: m.xp } } });
      badges.push(m);
    }
  }

  return badges;
}
