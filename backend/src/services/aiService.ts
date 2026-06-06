import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateStudyPlan = async (exam: string, examDate: string) => {
  const prompt = `Create a comprehensive day-by-day study plan for the ${exam} exam scheduled for ${examDate}.
Return as JSON with keys: highLevelPlan (3month, 6month, 12month arrays), dailyTasks (7 days with day, tasks array, focusArea, hours), weeklyTargets (4 weeks with week, goal, hours, mockTests), milestones array.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert government exam coach in India. Return valid JSON only." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });
    return JSON.parse(response.choices[0].message.content || '{}');
  } catch {
    return getFallbackPlan(exam, examDate);
  }
};

function getFallbackPlan(exam: string, examDate: string) {
  const daysRemaining = Math.ceil((new Date(examDate).getTime() - Date.now()) / 86400000);
  return {
    highLevelPlan: {
      '3month': ['Complete basic syllabus', 'Start practice tests', 'Begin revision'],
      '6month': ['Deep dive into subjects', 'Intensive practice', 'Full syllabus coverage'],
      '12month': ['Start from basics', 'Build strong foundation', 'Advanced practice'],
    },
    dailyTasks: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      focusArea: ['General Studies', 'Quantitative Aptitude', 'Reasoning', 'English', 'Current Affairs', 'Revision', 'Mock Test'][i],
      tasks: ['Study core concepts - 2 hrs', 'Practice questions - 1 hr', 'Revision - 30 mins', 'Current Affairs - 30 mins'],
      hours: 4,
    })),
    weeklyTargets: Array.from({ length: 4 }, (_, i) => ({
      week: i + 1,
      goal: `Complete ${['Foundation', 'Syllabus coverage', 'Practice phase', 'Revision'][i]} - Week ${i + 1}`,
      hours: 20 + i * 5,
      mockTests: i >= 1 ? 1 : 0,
    })),
    milestones: [`Day 30: Complete 25% syllabus`, `Day 60: Complete 50% syllabus`, `Day 90: Complete 75% syllabus`, `Day ${daysRemaining}: Final revision`],
  };
}
