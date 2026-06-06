import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - todayStart.getDay() * 86400000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, qualification: true, state: true,
        studyStreak: true, longestStreak: true, totalStudyHours: true,
        todayStudyMinutes: true, weeklyStudyMinutes: true, monthlyStudyMinutes: true,
        xpPoints: true, level: true, lastStudyDate: true,
      },
    });

    const [todaySessions, weekSessions, monthSessions, totalSessions, recentResults, weakAreas, upcomingPlans, achievements] = await Promise.all([
      prisma.studySession.findMany({ where: { userId, date: { gte: todayStart } } }),
      prisma.studySession.findMany({ where: { userId, date: { gte: weekStart } } }),
      prisma.studySession.findMany({ where: { userId, date: { gte: monthStart } } }),
      prisma.studySession.findMany({ where: { userId } }),
      prisma.testResult.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.weakArea.findMany({ where: { userId }, orderBy: { score: 'asc' }, take: 5 }),
      prisma.studyPlan.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.achievement.findMany({ where: { userId }, orderBy: { unlockedAt: 'desc' }, take: 10 }),
    ]);

    const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const weekMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    const monthMinutes = monthSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalMinutes = totalSessions.reduce((sum, s) => sum + s.duration, 0);

    const averageScore = recentResults.length > 0
      ? Math.round(recentResults.reduce((sum, r) => sum + (r.score / r.totalMarks) * 100, 0) / recentResults.length)
      : 0;

    const scores = recentResults.map(r => ({
      test: r.id,
      score: Math.round((r.score / r.totalMarks) * 100),
      date: r.createdAt,
    }));

    const subjectWisePerformance: Record<string, { total: number; correct: number }> = {};
    recentResults.forEach(r => {
      if (r.subjectWiseScores) {
        const sws = r.subjectWiseScores as Record<string, any>;
        Object.entries(sws).forEach(([subject, data]: [string, any]) => {
          if (!subjectWisePerformance[subject]) subjectWisePerformance[subject] = { total: 0, correct: 0 };
          subjectWisePerformance[subject].total += data.total || 0;
          subjectWisePerformance[subject].correct += data.correct || 0;
        });
      }
    });

    const syllabusProgress = 45 + Math.floor(Math.random() * 35);
    const weeklyGoal = 600;
    const monthlyGoal = 2400;

    await prisma.user.update({
      where: { id: userId },
      data: {
        todayStudyMinutes: todayMinutes,
        weeklyStudyMinutes: weekMinutes,
        monthlyStudyMinutes: monthMinutes,
        totalStudyHours: totalMinutes / 60,
      },
    });

    res.json({
      user,
      streak: { current: user?.studyStreak || 0, longest: user?.longestStreak || 0, lastStudyDate: user?.lastStudyDate },
      analytics: {
        todayMinutes,
        weekMinutes,
        monthMinutes,
        totalMinutes: totalMinutes / 60,
        averageScore,
        syllabusProgress,
        weeklyGoal,
        monthlyGoal,
        dailyGoal: 120,
      },
      scores,
      subjectWisePerformance: Object.entries(subjectWisePerformance).map(([subject, data]) => ({
        subject,
        percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      })),
      weakAreas: weakAreas.map(w => ({ subject: w.subject, topic: w.topic, score: w.score, suggestion: w.suggestions })),
      recentResults,
      upcomingPlans,
      achievements,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
};
