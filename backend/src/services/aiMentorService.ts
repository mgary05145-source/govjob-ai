import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getAiMentorResponse = async (query: string, userProfile?: any) => {
  const systemPrompt = `You are "GovJob Guru", the official AI mentor for GovJob India AI platform.
Help students preparing for Indian government exams (UPSC, SSC, Banking, Railways, Defence, Teaching, etc.).
Be professional, encouraging, and provide specific, actionable advice.
Format response in markdown. Keep concise.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      max_tokens: 1000,
    });
    return response.choices[0].message.content;
  } catch {
    return getFallbackResponse(query);
  }
};

function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('strategy') || q.includes('plan')) {
    return "**Effective Study Strategy:**\n\n1. **Morning (2 hrs):** Current Affairs + GK\n2. **Mid-day (3 hrs):** Core subject (rotate daily)\n3. **Evening (2 hrs):** Practice questions + mock tests\n4. **Night (1 hr):** Revision of the day's work\n\n**Pro tip:** Use the Pomodoro technique (25 min study + 5 min break) for better focus. Take topic-wise tests every weekend.";
  }
  if (q.includes('motivat') || q.includes('tired') || q.includes('give up')) {
    return "🌟 **Stay Motivated!**\n\nRemember why you started. Government jobs offer:\n- Job security & stability\n- Respect in society\n- Work-life balance\n- Pension & benefits\n- Chance to serve the nation\n\n**Every hour of study brings you closer!** Take a short break, breathe, and get back to it. You CAN do this! 💪";
  }
  if (q.includes('syllabus') || q.includes('subject')) {
    return "**Syllabus Coverage Tips:**\n\n- Start with NCERTs for foundational clarity\n- Use standard reference books for depth\n- Make short notes for quick revision\n- Practice previous year questions topic-wise\n- Use our **Syllabus Tracker** to monitor your progress\n\nFocus on high-weightage topics first. Check our exam-specific syllabus section!";
  }
  if (q.includes('mock') || q.includes('test') || q.includes('practice')) {
    return "**Mock Test Strategy:**\n\n1. Take a full-length test every Sunday\n2. Analyze mistakes thoroughly\n3. Focus on weak areas identified\n4. Practice sectional tests for targeted improvement\n5. Track your score trend over time\n\nOur platform has 100+ mock tests. Start with topic tests, then move to full-length papers!";
  }
  return "Great question! Here are some quick tips:\n\n- **Consistency > Intensity**: Study 4-5 hours daily rather than 10 hours once a week\n- **Revision is key**: Spend 20% of your time revising\n- **Mock tests**: Take at least 1 test per week\n- **Current Affairs**: Read newspapers daily for 30 mins\n- **Health matters**: Sleep 7-8 hours, exercise, eat well\n\nNeed specific help? Ask me about study plans, subject tips, exam strategies, or career guidance!";
}
