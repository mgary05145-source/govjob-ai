import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SYLLABUS_DATA: Record<string, any[]> = {
  'UPSC Civil Services': [
    { exam: 'UPSC Civil Services', subject: 'General Studies I', topic: 'Indian Heritage & Culture', subtopics: 'Indian architecture, sculpture, painting, music, dance, theatre, literature', weightage: 15, difficulty: 'hard' },
    { exam: 'UPSC Civil Services', subject: 'General Studies I', topic: 'History of India', subtopics: 'Ancient, Medieval, Modern India, Freedom struggle, Post-independence', weightage: 25, difficulty: 'hard' },
    { exam: 'UPSC Civil Services', subject: 'General Studies I', topic: 'Geography', subtopics: 'Physical, social, economic geography, World & India geography, mapping', weightage: 25, difficulty: 'medium' },
    { exam: 'UPSC Civil Services', subject: 'General Studies I', topic: 'Indian Society', subtopics: 'Demographics, communalism, regionalism, secularism, urbanization', weightage: 15, difficulty: 'medium' },
    { exam: 'UPSC Civil Services', subject: 'General Studies II', topic: 'Indian Polity', subtopics: 'Constitution, Parliament, Judiciary, Executive, Federalism, Rights', weightage: 25, difficulty: 'medium' },
    { exam: 'UPSC Civil Services', subject: 'General Studies II', topic: 'Governance', subtopics: 'Policies, schemes, transparency, accountability, e-governance', weightage: 20, difficulty: 'medium' },
    { exam: 'UPSC Civil Services', subject: 'General Studies II', topic: 'International Relations', subtopics: 'India\'s foreign policy, bilateral relations, international organizations', weightage: 20, difficulty: 'hard' },
    { exam: 'UPSC Civil Services', subject: 'General Studies II', topic: 'Social Justice', subtopics: 'Education, health, poverty, welfare schemes, vulnerable sections', weightage: 15, difficulty: 'medium' },
    { exam: 'UPSC Civil Services', subject: 'General Studies III', topic: 'Indian Economy', subtopics: 'Planning, budgeting, growth, development, inflation, fiscal policy', weightage: 25, difficulty: 'hard' },
    { exam: 'UPSC Civil Services', subject: 'General Studies III', topic: 'Science & Technology', subtopics: 'Space, IT, biotech, nanotechnology, AI, innovation', weightage: 15, difficulty: 'hard' },
    { exam: 'UPSC Civil Services', subject: 'General Studies III', topic: 'Environment', subtopics: 'Ecology, biodiversity, climate change, conservation, pollution', weightage: 20, difficulty: 'medium' },
    { exam: 'UPSC Civil Services', subject: 'General Studies III', topic: 'Security', subtopics: 'Internal security, border management, cyber security, terrorism', weightage: 15, difficulty: 'medium' },
    { exam: 'UPSC Civil Services', subject: 'General Studies IV', topic: 'Ethics', subtopics: 'Ethical theories, moral philosophy, integrity, impartiality', weightage: 30, difficulty: 'hard' },
    { exam: 'UPSC Civil Services', subject: 'General Studies IV', topic: 'Case Studies', subtopics: 'Administrative ethics, probity, decision making, dilemmas', weightage: 40, difficulty: 'hard' },
  ],
  'SSC CGL': [
    { exam: 'SSC CGL', subject: 'General Intelligence & Reasoning', topic: 'Analogies & Classification', subtopics: 'Word analogy, number analogy, semantic classification, symbolic classification', weightage: 15, difficulty: 'easy' },
    { exam: 'SSC CGL', subject: 'General Intelligence & Reasoning', topic: 'Coding-Decoding', subtopics: 'Letter coding, number coding, substitution coding, matrix coding', weightage: 12, difficulty: 'medium' },
    { exam: 'SSC CGL', subject: 'General Intelligence & Reasoning', topic: 'Blood Relations', subtopics: 'Family tree, relationship puzzles, coded relations', weightage: 10, difficulty: 'medium' },
    { exam: 'SSC CGL', subject: 'General Awareness', topic: 'Indian History', subtopics: 'Ancient, Medieval, Modern India, important dates and events', weightage: 20, difficulty: 'medium' },
    { exam: 'SSC CGL', subject: 'General Awareness', topic: 'Indian Geography', subtopics: 'Physical, political, economic geography, rivers, mountains', weightage: 15, difficulty: 'easy' },
    { exam: 'SSC CGL', subject: 'General Awareness', topic: 'Indian Polity', subtopics: 'Constitution, governance, rights, duties, constitutional bodies', weightage: 20, difficulty: 'medium' },
    { exam: 'SSC CGL', subject: 'Quantitative Aptitude', topic: 'Number System', subtopics: 'LCM, HCF, surds, indices, decimals, fractions, simplification', weightage: 15, difficulty: 'medium' },
    { exam: 'SSC CGL', subject: 'Quantitative Aptitude', topic: 'Algebra', subtopics: 'Equations, polynomials, factorization, inequalities, functions', weightage: 15, difficulty: 'hard' },
    { exam: 'SSC CGL', subject: 'Quantitative Aptitude', topic: 'Geometry', subtopics: 'Lines, angles, triangles, circles, polygons, coordinate geometry', weightage: 15, difficulty: 'hard' },
    { exam: 'SSC CGL', subject: 'English Comprehension', topic: 'Grammar', subtopics: 'Tenses, articles, prepositions, conjunctions, voice, narration', weightage: 25, difficulty: 'medium' },
    { exam: 'SSC CGL', subject: 'English Comprehension', topic: 'Vocabulary', subtopics: 'Synonyms, antonyms, one-word substitution, idioms, phrases', weightage: 20, difficulty: 'medium' },
  ],
  'IBPS PO': [
    { exam: 'IBPS PO', subject: 'Reasoning', topic: 'Puzzles & Seating', subtopics: 'Linear, circular, complex puzzles, floor-based, scheduling', weightage: 25, difficulty: 'hard' },
    { exam: 'IBPS PO', subject: 'Reasoning', topic: 'Data Sufficiency', subtopics: 'Yes/no type, quantitative comparison, data analysis', weightage: 10, difficulty: 'medium' },
    { exam: 'IBPS PO', subject: 'Quantitative Aptitude', topic: 'Data Interpretation', subtopics: 'Tables, bar graphs, line graphs, pie charts, caselets', weightage: 25, difficulty: 'hard' },
    { exam: 'IBPS PO', subject: 'Quantitative Aptitude', topic: 'Arithmetic', subtopics: 'Percentage, profit-loss, CI-SI, time-work, speed-distance', weightage: 20, difficulty: 'medium' },
    { exam: 'IBPS PO', subject: 'English', topic: 'Reading Comprehension', subtopics: 'Passage reading, inference, vocabulary, theme detection', weightage: 25, difficulty: 'medium' },
    { exam: 'IBPS PO', subject: 'General Awareness', topic: 'Banking Awareness', subtopics: 'RBI functions, monetary policy, banking terms, financial institutions', weightage: 40, difficulty: 'medium' },
  ],
  'RRB NTPC': [
    { exam: 'RRB NTPC', subject: 'General Awareness', topic: 'Indian Railways', subtopics: 'Railway history, zones, headquarters, trains, projects, PSUs', weightage: 20, difficulty: 'easy' },
    { exam: 'RRB NTPC', subject: 'General Awareness', topic: 'Current Affairs', subtopics: 'National, international, sports, awards, science, economy', weightage: 25, difficulty: 'medium' },
    { exam: 'RRB NTPC', subject: 'Mathematics', topic: 'Number System', subtopics: 'LCM, HCF, simplification, surds, approximation', weightage: 20, difficulty: 'easy' },
    { exam: 'RRB NTPC', subject: 'Mathematics', topic: 'Geometry', subtopics: 'Lines, angles, triangles, circles, coordinate geometry', weightage: 15, difficulty: 'medium' },
    { exam: 'RRB NTPC', subject: 'General Intelligence', topic: 'Analogies', subtopics: 'Word, number, figure analogies, classification', weightage: 15, difficulty: 'easy' },
  ],
};

export const getSyllabus = async (req: Request, res: Response) => {
  try {
    const { exam } = req.params;
    let syllabusList = await prisma.syllabus.findMany({
      where: { exam },
      orderBy: { orderIndex: 'asc' },
    });

    if (syllabusList.length === 0) {
      const syllabusData = SYLLABUS_DATA[exam];
      if (syllabusData) {
        for (const item of syllabusData) {
          await prisma.syllabus.create({ data: { ...item, orderIndex: syllabusData.indexOf(item) } });
        }
        syllabusList = await prisma.syllabus.findMany({
          where: { exam },
          orderBy: { orderIndex: 'asc' },
        });
      }
    }

    const grouped: Record<string, any[]> = {};
    syllabusList.forEach(item => {
      if (!grouped[item.subject]) grouped[item.subject] = [];
      grouped[item.subject].push(item);
    });

    const subjects = Object.entries(grouped).map(([subject, topics]) => ({
      subject,
      topics,
      totalTopics: topics.length,
      completedTopics: 0,
      completionPercentage: 0,
    }));

    res.json({ exam, subjects, totalTopics: syllabusList.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch syllabus' });
  }
};

export const updateProgress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { exam, subject, topic, completed } = req.body;

    const syllabus = await prisma.syllabus.findFirst({
      where: { exam, subject, topic },
    });

    if (syllabus) {
      await prisma.weakArea.upsert({
        where: { id: 0 },
        update: {},
        create: { userId, subject, topic, score: completed ? 100 : 0 },
      });
    }

    res.json({ message: 'Progress updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
};
