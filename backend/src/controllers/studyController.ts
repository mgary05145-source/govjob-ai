import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const examSyllabus: Record<string, any> = {
  'UPSC Civil Services': {
    subjects: ['General Studies I', 'General Studies II', 'General Studies III', 'General Studies IV', 'Optional Subject', 'CSAT', 'Essay'],
    topics: {
      'General Studies I': ['Indian Heritage & Culture', 'History of India', 'Geography', 'Society'],
      'General Studies II': ['Polity', 'Constitution', 'Governance', 'Social Justice', 'International Relations'],
      'General Studies III': ['Economy', 'Science & Tech', 'Environment', 'Security', 'Disaster Management'],
      'General Studies IV': ['Ethics', 'Integrity', 'Aptitude', 'Case Studies'],
      'CSAT': ['Comprehension', 'Interpersonal Skills', 'Logical Reasoning', 'Decision Making', 'Numeracy'],
    }
  },
  'SSC CGL': {
    subjects: ['General Intelligence & Reasoning', 'General Awareness', 'Quantitative Aptitude', 'English Comprehension'],
    topics: {
      'General Intelligence & Reasoning': ['Analogies', 'Coding-Decoding', 'Blood Relations', 'Direction Test', 'Arithmetic Reasoning'],
      'General Awareness': ['History', 'Geography', 'Polity', 'Economy', 'Science', 'Current Affairs'],
      'Quantitative Aptitude': ['Number System', 'Algebra', 'Geometry', 'Trigonometry', 'Statistics', 'Data Interpretation'],
      'English Comprehension': ['Grammar', 'Vocabulary', 'Comprehension', 'Cloze Test', 'Parajumbles'],
    }
  },
  'IBPS PO': {
    subjects: ['Reasoning', 'Quantitative Aptitude', 'English', 'General Awareness', 'Computer Knowledge'],
    topics: {
      'Reasoning': ['Puzzles', 'Seating Arrangement', 'Inequalities', 'Data Sufficiency', 'Syllogism'],
      'Quantitative Aptitude': ['Data Interpretation', 'Arithmetic', 'Number Series', 'Simplification', 'Quadratic Equations'],
      'English': ['Reading Comprehension', 'Cloze Test', 'Phrase Replacement', 'Error Spotting', 'Vocabulary'],
      'General Awareness': ['Banking Awareness', 'Current Affairs', 'Static GK', 'Financial Awareness'],
    }
  },
  'RRB NTPC': {
    subjects: ['General Awareness', 'Mathematics', 'General Intelligence & Reasoning'],
    topics: {
      'General Awareness': ['Current Affairs', 'Science & Tech', 'Indian History', 'Geography', 'Indian Polity'],
      'Mathematics': ['Number System', 'Algebra', 'Geometry', 'Mensuration', 'Statistics', 'Data Interpretation'],
      'General Intelligence & Reasoning': ['Analogies', 'Coding-Decoding', 'Puzzles', 'Figure Series', 'Decision Making'],
    }
  }
};

export const createStudyPlan = async (req: Request, res: Response) => {
  try {
    const { exam, examDate } = req.body;
    if (!exam || !examDate) return res.status(400).json({ error: 'Exam and exam date are required' });

    const examDateObj = new Date(examDate);
    const now = new Date();
    const daysRemaining = Math.ceil((examDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const monthsRemaining = Math.ceil(daysRemaining / 30);

    const syllabus = examSyllabus[exam] || {
      subjects: ['General Studies', 'Quantitative Aptitude', 'Reasoning', 'English', 'Current Affairs'],
      topics: {}
    };

    const planJson = {
      exam,
      examDate,
      daysRemaining,
      monthsRemaining,
      highLevelPlan: {
        '3month': monthsRemaining >= 3 ? generateMilestones(exam, 3) : ['Time not sufficient for 3-month plan'],
        '6month': monthsRemaining >= 6 ? generateMilestones(exam, 6) : ['Time not sufficient for 6-month plan'],
        '12month': monthsRemaining >= 12 ? generateMilestones(exam, 12) : ['Time not sufficient for 12-month plan'],
      },
      dailyTasks: generateDailyTasks(exam, syllabus, daysRemaining),
      weeklyTargets: generateWeeklyTargets(exam, syllabus, monthsRemaining),
      milestones: generateMilestones(exam, monthsRemaining),
      syllabus: syllabus,
      studySchedule: generateStudySchedule(exam, syllabus, daysRemaining),
    };

    const userId = (req as any).user?.userId;
    if (userId) {
      await prisma.studyPlan.create({
        data: { userId, exam, examDate: examDateObj, planJson: JSON.stringify(planJson) },
      });
    }

    res.json(planJson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
};

function generateMilestones(exam: string, months: number): string[] {
  const milestones: string[] = [];
  const interval = Math.max(1, Math.floor(months / 4));
  for (let i = 1; i <= months; i += interval) {
    milestones.push(`Month ${i}: Complete ${getSubjectForMonth(exam, i)} - Target: ${80 + Math.floor(Math.random() * 15)}% syllabus`);
  }
  return milestones;
}

function getSubjectForMonth(exam: string, month: number): string {
  const subjects = examSyllabus[exam]?.subjects || ['General Studies', 'Quantitative Aptitude', 'Reasoning', 'English'];
  return subjects[(month - 1) % subjects.length];
}

function generateDailyTasks(exam: string, syllabus: any, daysRemaining: number): any[] {
  const tasks = [];
  const subjects = syllabus.subjects || ['General Studies', 'Quantitative Aptitude', 'Reasoning', 'English'];
  const totalDays = Math.min(7, Math.ceil(daysRemaining / 4));

  for (let day = 1; day <= totalDays; day++) {
    const subject = subjects[(day - 1) % subjects.length];
    const topics = syllabus.topics?.[subject] || ['Introduction & Basics', 'Key Concepts', 'Practice Questions'];
    tasks.push({
      day,
      focusArea: subject,
      tasks: [
        `Study ${topics[0] || subject} - 2 hours`,
        `Practice MCQs - 1 hour`,
        `Revision of previous day - 30 mins`,
        `Current Affairs reading - 30 mins`,
      ],
      hours: 4,
    });
  }
  return tasks;
}

function generateWeeklyTargets(exam: string, syllabus: any, monthsRemaining: number): any[] {
  const weeks = Math.min(4, Math.ceil(monthsRemaining * 4));
  const targets = [];
  const subjects = syllabus.subjects || ['General Studies', 'Quantitative Aptitude', 'Reasoning', 'English'];
  for (let week = 1; week <= weeks; week++) {
    const subject = subjects[(week - 1) % subjects.length];
    targets.push({
      week,
      goal: `Complete ${subject} - Minimum ${70 + Math.floor(Math.random() * 20)}% syllabus coverage`,
      hours: week * 20,
      mockTests: week % 2 === 0 ? 1 : 0,
    });
  }
  return targets;
}

function generateStudySchedule(exam: string, syllabus: any, daysRemaining: number): any[] {
  const schedule = [];
  const subjects = syllabus.subjects || ['General Studies', 'Quantitative Aptitude', 'Reasoning', 'English', 'Current Affairs'];
  const phases = Math.min(4, Math.ceil(daysRemaining / 90));
  const phaseNames = ['Foundation', 'Intensive', 'Practice', 'Revision'];

  for (let i = 0; i < phases; i++) {
    schedule.push({
      phase: phaseNames[i] || `Phase ${i + 1}`,
      duration: `${Math.ceil(daysRemaining / (phases * 30))} months`,
      focus: i === 0 ? 'Concept Building' : i === 1 ? 'Deep Dive' : i === 2 ? 'Mock Tests' : 'Revision & Strategy',
      dailyHours: 6 + i * 2,
      subjects: subjects.map((s: string) => ({ name: s, hoursPerWeek: 10 - i })),
    });
  }
  return schedule;
}

export const getStudyPlans = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const plans = await prisma.studyPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
};
