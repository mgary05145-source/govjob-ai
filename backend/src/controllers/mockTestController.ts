import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_QUESTIONS: Record<string, any[]> = {
  'General Awareness': [
    { question: 'Who is the current Chief Election Commissioner of India?', options: ['Rajiv Kumar', 'Sushil Chandra', 'Sunil Arora', 'Gyanesh Kumar'], answer: 0, subject: 'General Awareness' },
    { question: 'Which article of the Indian Constitution deals with the Right to Equality?', options: ['Article 14', 'Article 19', 'Article 21', 'Article 32'], answer: 0, subject: 'General Awareness' },
    { question: 'What is the currency of Japan?', options: ['Yuan', 'Yen', 'Won', 'Dollar'], answer: 1, subject: 'General Awareness' },
    { question: 'Who wrote "The Discovery of India"?', options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'B.R. Ambedkar', 'Rabindranath Tagore'], answer: 1, subject: 'General Awareness' },
    { question: 'Which is the largest planet in our solar system?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], answer: 2, subject: 'General Awareness' },
    { question: 'The chemical formula of water is?', options: ['H2O', 'CO2', 'NaCl', 'H2SO4'], answer: 0, subject: 'General Awareness' },
    { question: 'Who is known as the "Father of Indian Constitution"?', options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'B.R. Ambedkar', 'Sardar Patel'], answer: 2, subject: 'General Awareness' },
    { question: 'Which country hosted the 2024 Olympics?', options: ['Tokyo', 'Paris', 'London', 'Beijing'], answer: 1, subject: 'General Awareness' },
    { question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], answer: 2, subject: 'General Awareness' },
    { question: 'Which is the longest river in India?', options: ['Ganga', 'Yamuna', 'Godavari', 'Brahmaputra'], answer: 0, subject: 'General Awareness' },
  ],
  'Quantitative Aptitude': [
    { question: 'What is 15% of 200?', options: ['25', '30', '35', '20'], answer: 1, subject: 'Quantitative Aptitude' },
    { question: 'If a train travels 360 km in 6 hours, what is its speed?', options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'], answer: 1, subject: 'Quantitative Aptitude' },
    { question: 'What is the square root of 144?', options: ['10', '11', '12', '13'], answer: 2, subject: 'Quantitative Aptitude' },
    { question: 'A shopkeeper sells an item at 20% profit. If cost price is Rs.500, what is selling price?', options: ['550', '600', '650', '700'], answer: 1, subject: 'Quantitative Aptitude' },
    { question: 'What is the LCM of 12 and 18?', options: ['24', '36', '48', '72'], answer: 1, subject: 'Quantitative Aptitude' },
    { question: 'If 3x + 5 = 20, what is x?', options: ['3', '4', '5', '6'], answer: 2, subject: 'Quantitative Aptitude' },
    { question: 'What is the area of a circle with radius 7 cm? (π = 22/7)', options: ['144 cm²', '154 cm²', '164 cm²', '174 cm²'], answer: 1, subject: 'Quantitative Aptitude' },
    { question: 'A sum of Rs.1000 becomes Rs.1100 in 2 years. What is simple interest rate?', options: ['3%', '5%', '7%', '10%'], answer: 1, subject: 'Quantitative Aptitude' },
    { question: 'What is the average of 10, 20, 30, 40, 50?', options: ['25', '30', '35', '40'], answer: 1, subject: 'Quantitative Aptitude' },
    { question: 'If a:b = 2:3 and b:c = 4:5, find a:c', options: ['8:15', '15:8', '2:5', '5:2'], answer: 0, subject: 'Quantitative Aptitude' },
  ],
  'Reasoning': [
    { question: 'Find the next number: 2, 6, 18, 54, ?', options: ['108', '162', '216', '270'], answer: 1, subject: 'Reasoning' },
    { question: 'If ROSE is coded as 6841, how is SOUR coded?', options: ['6418', '6841', '4186', '1468'], answer: 0, subject: 'Reasoning' },
    { question: 'Find the odd one out: Apple, Mango, Potato, Orange', options: ['Apple', 'Mango', 'Potato', 'Orange'], answer: 2, subject: 'Reasoning' },
    { question: 'A is the father of B. B is the sister of C. C is the mother of D. How is A related to D?', options: ['Grandfather', 'Father', 'Uncle', 'Brother'], answer: 0, subject: 'Reasoning' },
    { question: 'Complete the series: AB, DEF, HIJK, ?', options: ['MNOPQ', 'LMNOP', 'NOPQR', 'OPQRS'], answer: 2, subject: 'Reasoning' },
    { question: 'If Monday is coded as 1, what is 5?', options: ['Friday', 'Thursday', 'Wednesday', 'Saturday'], answer: 0, subject: 'Reasoning' },
    { question: 'Which one is different? 121, 144, 169, 180', options: ['121', '144', '169', '180'], answer: 3, subject: 'Reasoning' },
    { question: 'Statement: All cats are dogs. Some dogs are birds. Conclusion: Some cats are birds.', options: ['True', 'False', 'Uncertain', 'None'], answer: 1, subject: 'Reasoning' },
    { question: 'What comes next? Z, X, V, T, ?', options: ['R', 'S', 'Q', 'P'], answer: 0, subject: 'Reasoning' },
    { question: 'In a row of 40 students, A is 15th from left. What is his rank from right?', options: ['25', '26', '24', '15'], answer: 1, subject: 'Reasoning' },
  ],
  'English': [
    { question: 'Choose the correct spelling:', options: ['Accommodation', 'Acommodation', 'Accomodation', 'Acomodation'], answer: 0, subject: 'English' },
    { question: 'What is the synonym of "Abundant"?', options: ['Scarce', 'Plentiful', 'Limited', 'Rare'], answer: 1, subject: 'English' },
    { question: 'Fill in the blank: He _____ to school every day.', options: ['go', 'goes', 'going', 'gone'], answer: 1, subject: 'English' },
    { question: 'Identify the antonym of "Generous":', options: ['Kind', 'Selfish', 'Helpful', 'Charitable'], answer: 1, subject: 'English' },
    { question: 'Change to passive voice: "She writes a letter."', options: ['A letter is written by her', 'A letter was written by her', 'A letter has been written', 'A letter had been written'], answer: 0, subject: 'English' },
    { question: 'What is the meaning of the idiom "Break the ice"?', options: ['Break something', 'Start a conversation', 'Cold weather', 'Destroy ice'], answer: 1, subject: 'English' },
    { question: 'Choose the correct article: _____ sun rises in the east.', options: ['A', 'An', 'The', 'None'], answer: 2, subject: 'English' },
    { question: 'What type of word is "beautifully"?', options: ['Adjective', 'Adverb', 'Verb', 'Noun'], answer: 1, subject: 'English' },
    { question: 'Correct the sentence: "Me and my friend went to the park."', options: ['My friend and I went to the park', 'Me and my friend went to park', 'I and my friend went to the park', 'My friend and me went to the park'], answer: 0, subject: 'English' },
    { question: 'Which is a compound word?', options: ['Sunshine', 'Happiness', 'Beautiful', 'Quickly'], answer: 0, subject: 'English' },
  ],
};

export const getTests = async (req: Request, res: Response) => {
  try {
    const { category, subject } = req.query;
    const where: any = {};
    if (category && category !== 'all') where.category = category;
    if (subject && subject !== 'all') where.subject = subject;

    const tests = await prisma.mockTest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
};

export const getTestById = async (req: Request, res: Response) => {
  try {
    const test = await prisma.mockTest.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch test' });
  }
};

export const submitTest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { answers, timeTaken } = req.body;
    const test = await prisma.mockTest.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!test) return res.status(404).json({ error: 'Test not found' });

    const questions = test.questions as any[];
    let correct = 0;
    const subjectWise: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q, i) => {
      const sub = q.subject || 'General';
      if (!subjectWise[sub]) subjectWise[sub] = { total: 0, correct: 0 };
      subjectWise[sub].total++;
      if (answers[i] !== undefined && answers[i] === q.answer) {
        correct++;
        subjectWise[sub].correct++;
      }
    });

    const score = correct * (test.totalMarks / test.totalQuestions);
    const incorrect = questions.length - correct - (answers.filter((a: any) => a === undefined || a === null).length);
    const unanswered = questions.length - correct - incorrect;

    const result = await prisma.testResult.create({
      data: {
        userId, testId: test.id, score: Math.round(score), totalMarks: test.totalMarks,
        correctAnswers: correct, incorrectAnswers: incorrect, unanswered,
        timeTaken: timeTaken || test.duration,
        subjectWiseScores: subjectWise as any, answers,
      },
    });

    const weakAreas = Object.entries(subjectWise)
      .filter(([, data]) => data.total > 0 && (data.correct / data.total) < 0.5)
      .map(([subject, data]) => ({
        userId, subject,
        score: Math.round((data.correct / data.total) * 100),
        suggestions: `Focus on improving ${subject}. Practice more questions.`,
      }));

    for (const wa of weakAreas) {
      await prisma.weakArea.upsert({
        where: { id: 0 },
        update: { score: wa.score, suggestions: wa.suggestions },
        create: wa,
      });
    }

    const xpEarned = correct * 5;
    await prisma.user.update({
      where: { id: userId },
      data: { xpPoints: { increment: xpEarned } },
    });

    res.json({ result, subjectWise, xpEarned, weakAreas });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit test' });
  }
};

export const getResults = async (req: Request, res: Response) => {
  try {
    const result = await prisma.testResult.findUnique({
      where: { id: parseInt(req.params.resultId) },
    });
    if (!result) return res.status(404).json({ error: 'Result not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch result' });
  }
};
