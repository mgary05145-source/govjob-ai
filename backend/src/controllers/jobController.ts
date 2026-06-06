import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JOB_CATEGORIES = [
  'UPSC', 'SSC', 'Banking', 'Railway', 'Defence', 'Police', 'Teaching',
  'State Govt', 'PSU', 'Central Govt'
];

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { category, search, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (category && category !== 'all') where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { organization: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit as string) }),
      prisma.job.count({ where }),
    ]);

    res.json({ jobs, total, page: parseInt(page as string), totalPages: Math.ceil(total / parseInt(limit as string)) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  res.json({ categories: JOB_CATEGORIES });
};

export const getRecommendedJobs = async (req: Request, res: Response) => {
  try {
    const { qualification, interests } = req.query;
    let jobs = await prisma.job.findMany({ where: { status: 'active' }, orderBy: { createdAt: 'desc' }, take: 20 });

    if (qualification) {
      const q = (qualification as string).toLowerCase();
      jobs = jobs.filter(j => j.eligibility?.toLowerCase().includes(q));
    }

    res.json({ recommendations: jobs.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};
