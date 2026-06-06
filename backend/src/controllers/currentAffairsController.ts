import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_AFFAIRS = [
  { title: 'India Launches New Space Mission for Lunar Exploration', description: 'ISRO successfully launched its latest lunar mission aimed at studying the Moon\'s south pole region. The mission carries advanced scientific instruments for mineral mapping.', category: 'Science & Tech', date: new Date('2026-06-05'), source: 'ISRO', tags: 'space,isro,moon,science' },
  { title: 'Union Budget 2026 Highlights: Focus on Infrastructure and Digital India', description: 'The Government presented the Union Budget 2026 with major allocations for infrastructure development, digital transformation, and education sector reforms.', category: 'Economy', date: new Date('2026-06-04'), source: 'Ministry of Finance', tags: 'budget,economy,infrastructure' },
  { title: 'India Wins 5 Gold Medals at Asian Games 2026', description: 'Indian athletes brought home 5 gold medals in shooting, athletics, and wrestling, marking the country\'s best performance in the Asian Games history.', category: 'Sports', date: new Date('2026-06-03'), source: 'Sports Ministry', tags: 'sports,asian games,medals' },
  { title: 'New Education Policy Implementation: All States On Board', description: 'The Ministry of Education confirmed that all states have now adopted the National Education Policy 2020 framework with state-specific modifications.', category: 'Education', date: new Date('2026-06-02'), source: 'MHRD', tags: 'education,nep,policy' },
  { title: 'India Becomes 3rd Largest Economy in Purchasing Power Parity', description: 'According to the World Bank report, India has overtaken Japan to become the third largest economy in terms of PPP.', category: 'Economy', date: new Date('2026-06-01'), source: 'World Bank', tags: 'economy,india,world bank' },
  { title: 'Supreme Court Landmark Judgment on Data Privacy', description: 'The Supreme Court delivered a landmark judgment strengthening data privacy protections for citizens under Article 21.', category: 'Polity', date: new Date('2026-05-30'), source: 'Supreme Court', tags: 'supreme court,privacy,judgment' },
  { title: 'India\'s Renewable Energy Capacity Crosses 200 GW Milestone', description: 'India achieved a historic milestone in renewable energy with total installed capacity crossing 200 GW, led by solar and wind energy.', category: 'Environment', date: new Date('2026-05-28'), source: 'MNRE', tags: 'renewable energy,solar,environment' },
  { title: 'CISF Raising Day Celebrated with Parade at New Delhi', description: 'The Central Industrial Security Force celebrated its 57th Raising Day with a grand parade showcasing its capabilities.', category: 'Defence', date: new Date('2026-05-25'), source: 'CISF', tags: 'defence,cisf,security' },
  { title: 'India\'s GDP Growth Rate Pegged at 7.2% for FY26', description: 'The National Statistical Office revised India\'s GDP growth estimate for the current fiscal year to 7.2%, making it the fastest-growing major economy.', category: 'Economy', date: new Date('2026-05-22'), source: 'NSO', tags: 'gdp,economy,growth' },
  { title: 'World Environment Day 2026: India Pledges Net Zero by 2070', description: 'On World Environment Day, India reaffirmed its commitment to achieving net-zero emissions by 2070 with a comprehensive action plan.', category: 'Environment', date: new Date('2026-06-05'), source: 'UNEP', tags: 'environment,climate change,net zero' },
  { title: 'SSC CHSL 2026 Notification Released', description: 'Staff Selection Commission has released the notification for Combined Higher Secondary Level Examination 2026 with 45,000+ vacancies.', category: 'Jobs', date: new Date('2026-06-03'), source: 'SSC', tags: 'ssc,chsl,jobs,government' },
  { title: 'UPSC Announces Civil Services 2026 Exam Schedule', description: 'UPSC released the annual calendar for Civil Services Examination 2026 with preliminary exam scheduled for June 2026.', category: 'Jobs', date: new Date('2026-05-20'), source: 'UPSC', tags: 'upsc,civil services,exam' },
];

export const getCurrentAffairs = async (req: Request, res: Response) => {
  try {
    const { category, search, page = '1', limit = '20' } = req.query;

    let items = await prisma.currentAffair.findMany({
      orderBy: { date: 'desc' },
      take: parseInt(limit as string),
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
    });

    if (items.length === 0) {
      for (const aff of SAMPLE_AFFAIRS) {
        await prisma.currentAffair.create({ data: aff });
      }
      items = await prisma.currentAffair.findMany({
        orderBy: { date: 'desc' },
        take: parseInt(limit as string),
      });
    }

    if (category && category !== 'all') items = items.filter(i => i.category === category);
    if (search) {
      const s = (search as string).toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(s) || i.description?.toLowerCase().includes(s));
    }

    const categories = await prisma.currentAffair.groupBy({ by: ['category'], _count: true });

    res.json({ items, categories: categories.map(c => ({ name: c.category, count: c._count })) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current affairs' });
  }
};

export const getCurrentAffairById = async (req: Request, res: Response) => {
  try {
    const item = await prisma.currentAffair.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
};
