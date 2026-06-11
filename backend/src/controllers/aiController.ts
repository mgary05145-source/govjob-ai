import { Request, Response } from 'express';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGemini(prompt: string): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1000 }
        })
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate response';
  } catch {
    return 'AI service temporarily unavailable. Please try again.';
  }
}

export const askMentor = async (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    const prompt = `You are GovJob Guru, an AI mentor for Indian government exam preparation (UPSC, SSC, Banking, Railways). 
Answer this student query in under 200 words, be encouraging and precise:
${query}`;

    const answer = await callGemini(prompt);
    res.json({ answer });
  } catch {
    res.json({ answer: 'Focus on daily practice, take mock tests, and revise consistently. You got this!' });
  }
};

export const generateStudyPlan = async (req: Request, res: Response) => {
  const { exam, examDate, dailyHours } = req.body;

  try {
    const prompt = `Create a detailed study plan for ${exam} exam on ${examDate} with ${dailyHours} hours daily study time.
Include: weekly milestones, subject-wise time allocation, and key topics.
Format as JSON with keys: highLevelPlan, dailyTasks, weeklyTargets.`;

    const text = await callGemini(prompt);
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      res.json(JSON.parse(clean));
    } catch {
      res.json({
        highLevelPlan: {
          '3month': [`Month 1: Foundation`, `Month 2: Practice`, `Month 3: Revision`],
          '6month': [`Month 1-2: Basics`, `Month 3-4: Deep Study`, `Month 5-6: Tests`],
        },
        dailyTasks: Array.from({ length: 7 }, (_, i) => ({
          day: i + 1,
          focusArea: ['GK', 'Quant', 'Reasoning', 'English', 'Current Affairs', 'Revision', 'Mock Test'][i],
          tasks: ['Study 2 hrs', 'Practice 1 hr', 'Revise 30 mins'],
          hours: dailyHours,
        })),
      });
    }
  } catch {
    res.status(500).json({ error: 'Failed to generate plan' });
  }
};

export const recommendCareer = async (req: Request, res: Response) => {
  try {
    const { qualification, interests, age, state } = req.body;
    const recommendations = [];
    const q = (qualification || '').toLowerCase();
    const interest = (interests || '').toLowerCase();

    if (q.includes('graduate') || q.includes('post')) {
      if (interest.includes('admin') || interest.includes('upsc')) {
        recommendations.push({ role: 'UPSC Civil Services', reason: 'Perfect for graduates', roadmap: ['NCERTs', 'Standard references', 'Mock tests'], salary: '₹56,100 - ₹2,50,000' });
      }
      recommendations.push({ role: 'SSC CGL', reason: 'Wide range of government posts', roadmap: ['Quant', 'Reasoning', 'English', 'GK'], salary: '₹25,500 - ₹1,51,100' });
      recommendations.push({ role: 'IBPS PO', reason: 'Banking career with growth', roadmap: ['Quant', 'Reasoning', 'English'], salary: '₹52,000 - ₹55,000' });
    }
    if (q.includes('12th')) {
      recommendations.push({ role: 'SSC CHSL', reason: 'Central government for 12th pass', roadmap: ['Quant', 'English', 'GK'], salary: '₹19,900 - ₹63,200' });
      recommendations.push({ role: 'RRB NTPC', reason: 'Railway jobs with great perks', roadmap: ['Math', 'Reasoning', 'GK'], salary: '₹19,900 - ₹35,400' });
    }
    if (recommendations.length === 0) {
      recommendations.push({ role: 'SSC CGL', reason: 'Best starting point', roadmap: ['Quant', 'English', 'GK'], salary: '₹25,500+' });
    }

    res.json({ recommendations });
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
};

export const detectWeakness = async (req: Request, res: Response) => {
  try {
    const { testResults } = req.body;
    const weakAreas = [];
    const subjectScores: Record<string, number[]> = {};

    if (testResults) {
      testResults.forEach((r: any) => {
        if (r.subjectWiseScores) {
          Object.entries(r.subjectWiseScores).forEach(([subject, data]: [string, any]) => {
            if (!subjectScores[subject]) subjectScores[subject] = [];
            subjectScores[subject].push(data.correct / data.total * 100);
          });
        }
      });
    }

    for (const [subject, scores] of Object.entries(subjectScores)) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg < 50) {
        weakAreas.push({ subject, score: Math.round(avg), suggestions: `Focus on ${subject} basics and practice daily.` });
      }
    }

    res.json({ weakAreas, summary: weakAreas.length > 0 ? `Focus on ${weakAreas.length} subject(s)` : 'Great performance!' });
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
};