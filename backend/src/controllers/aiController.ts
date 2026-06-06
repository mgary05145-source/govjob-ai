import { Request, Response } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const askMentor = async (req: Request, res: Response) => {
  const { query, context } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    const systemPrompt = `You are "GovJob Guru", the official AI mentor for GovJob India AI platform. 
You help students prepare for Indian government exams (UPSC, SSC, Banking, Railways, Defence, etc.).
Be encouraging, precise, and actionable. Format responses in markdown.
Keep responses under 200 words unless asked for detail.
Students may ask about: study strategies, subject doubts, exam tips, career advice, time management, and motivation.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...(context?.history || []),
        { role: "user", content: query },
      ],
      max_tokens: 1000,
    });

    res.json({ answer: response.choices[0].message.content });
  } catch (error) {
    // Fallback response when AI fails
    const fallbackResponses: Record<string, string> = {
      'study plan': "Here's a recommended study plan: Dedicate 6-8 hours daily. Morning: 2 hrs for current affairs & GK. Mid-day: 3 hrs for your core subject. Evening: 2 hrs for practice tests. Night: 1 hr revision of the day's work.",
      'syllabus': "Focus on the exam syllabus first. Break it into weekly targets. For UPSC: start with NCERTs (6th-12th), then move to standard references. For SSC/Banking: focus on quant, reasoning, English, and GK equally.",
      'motivation': "Remember why you started! Every hour of study brings you closer to your goal. Government jobs offer stability, respect, and the chance to serve the nation. Stay consistent - small daily efforts lead to big results!",
      'default': "Great question! Focus on understanding concepts rather than memorization. Practice previous year papers, take mock tests regularly, and revise consistently. Use the Pomodoro technique for better focus. You've got this!"
    };

    const queryLower = query.toLowerCase();
    let answer = fallbackResponses.default;
    for (const [key, value] of Object.entries(fallbackResponses)) {
      if (queryLower.includes(key)) { answer = value; break; }
    }
    res.json({ answer });
  }
};

export const recommendCareer = async (req: Request, res: Response) => {
  try {
    const { qualification, interests, age, state, availableTime } = req.body;

    const recommendations = [];
    const q = (qualification || '').toLowerCase();
    const interest = (interests || '').toLowerCase();

    if (q.includes('graduate') || q.includes('post')) {
      if (interest.includes('admin') || interest.includes('upsc')) {
        recommendations.push({ role: 'UPSC Civil Services', reason: 'Perfect for graduates with administrative aspirations', roadmap: ['NCERTs (6-12)', 'Standard references', 'Answer writing practice', 'Mock interviews'], salary: '₹56,100 - ₹2,50,000' });
      }
      if (interest.includes('bank')) {
        recommendations.push({ role: 'IBPS PO / Clerk', reason: 'Excellent banking career with growth opportunities', roadmap: ['Quantitative Aptitude', 'Reasoning', 'English', 'Banking Awareness'], salary: '₹52,000 - ₹55,000' });
      }
      recommendations.push({ role: 'SSC CGL', reason: 'Wide range of Group B & C posts in government', roadmap: ['Quant + Reasoning', 'English + GK', 'Computer Proficiency'], salary: '₹25,500 - ₹1,51,100' });
    }

    if (q.includes('12th')) {
      recommendations.push({ role: 'SSC CHSL', reason: 'Entry into central government for 12th pass', roadmap: ['Quantitative Aptitude', 'English', 'General Intelligence', 'GK'], salary: '₹19,900 - ₹63,200' });
      recommendations.push({ role: 'RRB NTPC', reason: 'Railway jobs with great perks and stability', roadmap: ['Math', 'Reasoning', 'General Awareness'], salary: '₹19,900 - ₹35,400' });
    }

    if (interest.includes('defence') || interest.includes('army')) {
      recommendations.push({ role: 'NDA / CDS / AFCAT', reason: 'Serve the nation with pride and adventure', roadmap: ['Math', 'English', 'GK', 'SSB Interview'], salary: '₹56,100 - ₹2,50,000' });
    }

    if (interest.includes('teach') || interest.includes('professor')) {
      recommendations.push({ role: 'UGC NET / CTET', reason: 'Gateway to teaching profession in India', roadmap: ['Subject specialization', 'Teaching aptitude', 'Pedagogy'], salary: '₹37,400 - ₹67,000' });
    }

    if (interest.includes('police') || interest.includes('constable')) {
      recommendations.push({ role: 'State Police / CAPF', reason: 'Law enforcement with respect and authority', roadmap: ['Physical training', 'GK', 'Current affairs', 'Reasoning'], salary: '₹29,200 - ₹92,300' });
    }

    if (recommendations.length === 0) {
      recommendations.push({ role: 'Government Job Explorer', reason: 'Multiple opportunities based on your profile', roadmap: ['Identify your interest', 'Check eligibility', 'Start preparation'], salary: 'Varies by role' });
    }

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};

export const detectWeakness = async (req: Request, res: Response) => {
  try {
    const { testResults, studyHistory } = req.body;

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
      const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
      if (avgScore < 50) {
        weakAreas.push({
          subject,
          score: Math.round(avgScore),
          severity: avgScore < 30 ? 'critical' : 'needs_improvement',
          suggestions: `Focus on ${subject}. Start with basic concepts, practice daily, and take topic-wise tests.`,
          practiceQuestions: generatePracticeQuestions(subject, 5),
        });
      }
    }

    res.json({ weakAreas, summary: weakAreas.length > 0 ? `You need to focus on ${weakAreas.length} subject(s)` : 'Great job! Keep maintaining your performance.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze weaknesses' });
  }
};

function generatePracticeQuestions(subject: string, count: number) {
  const questions = [];
  const subjects = ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness', 'General Studies'];
  const pickSubject = subjects.find(s => subject.toLowerCase().includes(s.toLowerCase())) || subjects[0];

  for (let i = 0; i < count; i++) {
    questions.push({
      id: i + 1,
      subject: pickSubject,
      question: `Practice question ${i + 1} for ${pickSubject} - Focus on your weak areas`,
      difficulty: i < 2 ? 'easy' : 'medium',
    });
  }
  return questions;
}
