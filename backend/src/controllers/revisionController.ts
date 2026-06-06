import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateRevisionPlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { exam, examDate, planType } = req.body;

    const examDateObj = new Date(examDate);
    const now = new Date();
    const daysRemaining = Math.ceil((examDateObj.getTime() - now.getTime()) / (86400000));

    let planJson: any = {};

    if (planType === '7day') {
      planJson = {
        type: '7-Day Revision Plan',
        description: 'Intensive 7-day rapid revision before exam',
        dailyPlan: generate7DayPlan(exam),
        focusAreas: ['Weak subjects', 'High-weightage topics', 'Formula revision', 'Mock tests'],
      };
    } else if (planType === '30day') {
      planJson = {
        type: '30-Day Revision Plan',
        description: 'Comprehensive 30-day revision plan',
        weeklyPlan: Array.from({ length: 4 }, (_, i) => ({
          week: i + 1,
          focus: i === 0 ? 'Complete syllabus revision' : i === 1 ? 'Deep dive weak areas' : i === 2 ? 'Mock tests' : 'Final revision',
          dailyHours: 8 + i * 2,
        })),
      };
    } else if (planType === 'countdown') {
      const totalDays = Math.min(daysRemaining, 90);
      const phases = totalDays > 60 ? 3 : 2;
      planJson = {
        type: 'Exam Countdown Revision Plan',
        daysRemaining: totalDays,
        phases: Array.from({ length: phases }, (_, i) => ({
          phase: i + 1,
          days: Math.floor(totalDays / phases),
          focus: i === 0 ? 'Full syllabus coverage' : i === 1 ? 'Intensive practice & mocks' : 'Revision & strategy',
        })),
      };
    }

    const plan = await prisma.revisionPlan.create({
      data: { userId, planType: planType || '7day', planJson: planJson as any },
    });

    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate revision plan' });
  }
};

function generate7DayPlan(exam: string): any[] {
  const subjects = ['General Studies', 'Quantitative Aptitude', 'Reasoning', 'English', 'Current Affairs'];
  return subjects.slice(0, 7).map((subject, i) => ({
    day: i + 1,
    subject,
    morning: `${subject} - Complete revision (3 hrs)`,
    afternoon: `Practice MCQs - ${subject} (2 hrs)`,
    evening: `Review mistakes & weak areas (1 hr)`,
    night: `Current Affairs & GK (1 hr)`,
  }));
}

export const getRevisionPlans = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const plans = await prisma.revisionPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revision plans' });
  }
};
