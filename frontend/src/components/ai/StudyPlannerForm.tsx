"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Target, Clock, Sparkles, Loader2, CheckCircle2, BookOpen, BarChart3, Brain, Download, Share2, ArrowRight, GraduationCap } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const EXAMS = [
  'UPSC Civil Services', 'SSC CGL', 'SSC CHSL', 'IBPS PO', 'IBPS Clerk',
  'RRB NTPC', 'RRB ALP', 'NDA & NA', 'CDS', 'CTET', 'UGC NET',
  'State PCS', 'SSC GD Constable', 'AFCAT', 'Other'
];

const STUDY_PLANS = {
  '7-day': [
    { day: 1, focus: 'Foundation Assessment', tasks: ['Diagnostic test', 'Identify weak areas', 'Set goals'], hours: 3 },
    { day: 2, focus: 'Core Subject 1', tasks: ['Topic-wise study', 'Practice MCQs', 'Make notes'], hours: 4 },
    { day: 3, focus: 'Core Subject 2', tasks: ['Concept clarity', 'PYQ practice', 'Revision'], hours: 4 },
    { day: 4, focus: 'Current Affairs', tasks: ['Daily news revision', 'NCERT GK', 'Quiz'], hours: 3 },
    { day: 5, focus: 'Mixed Practice', tasks: ['Full-length test', 'Analyze mistakes', 'Weak area focus'], hours: 5 },
    { day: 6, focus: 'Revision', tasks: ['All subjects revision', 'Formula revision', 'Quick notes'], hours: 4 },
    { day: 7, focus: 'Mock Test & Analysis', tasks: ['Full mock test', 'Performance analysis', 'Next week planning'], hours: 5 },
  ],
  '30-day': [
    { week: 1, focus: 'Foundation & Basics', goal: 'Complete 25% syllabus', hours: 25, tests: 1 },
    { week: 2, focus: 'Syllabus Coverage', goal: 'Complete 50% syllabus', hours: 30, tests: 2 },
    { week: 3, focus: 'Deep Practice', goal: 'Complete 75% syllabus', hours: 35, tests: 3 },
    { week: 4, focus: 'Revision & Tests', goal: 'Complete 100% syllabus', hours: 40, tests: 4 },
  ],
};

const SYLLABUS_DATA: Record<string, string[]> = {
  'UPSC Civil Services': ['General Studies I-IV', 'CSAT', 'Optional Subject', 'Essay', 'Current Affairs'],
  'SSC CGL': ['Quantitative Aptitude', 'General Intelligence', 'English', 'General Awareness'],
  'IBPS PO': ['Reasoning', 'Quantitative Aptitude', 'English', 'General Awareness', 'Computer'],
  'RRB NTPC': ['Mathematics', 'General Awareness', 'General Intelligence'],
  'SSC CHSL': ['Quantitative Aptitude', 'General Intelligence', 'English', 'General Awareness'],
};

export default function StudyPlannerForm() {
  const { user } = useAuth();
  const [exam, setExam] = useState('');
  const [examDate, setExamDate] = useState('');
  const [dailyHours, setDailyHours] = useState('4');
  const [planType, setPlanType] = useState<'3month' | '6month' | '12month'>('6month');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'daily' | 'syllabus'>('plan');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam || !examDate) return;
    setIsLoading(true);

    try {
      const data = await api.post('/study/generate-plan', { exam, examDate, dailyHours: parseInt(dailyHours) });
      setResult(data);
    } catch {
      setResult(generateFallbackPlan(exam, examDate, parseInt(dailyHours)));
    }
    setIsLoading(false);
  };

  if (result) {
    const daysLeft = Math.ceil((new Date(examDate).getTime() - Date.now()) / 86400000);

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} className="space-y-6">
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium text-blue-100">AI-Generated Study Plan</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">{exam} Study Plan</h3>
          <p className="text-blue-100">
            {daysLeft > 0 ? `${daysLeft} days until exam` : 'Exam preparation ongoing'} &middot; Plan type: {planType}
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {['plan', 'daily', 'syllabus'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600'
            }`}>
              {tab === 'plan' ? '📊' : tab === 'daily' ? '📅' : '📚'} {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'plan' && (
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(result.highLevelPlan || {}).map(([key, milestones]: any) => (
              <div key={key} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" /> {key.replace('month', ' Month')}
                </h4>
                <ul className="space-y-2">
                  {milestones.map((m: string, i: number) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-[10px] text-primary font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'daily' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <h4 className="font-bold text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Daily Schedule ({dailyHours} hours/day)</h4>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {(result.dailyTasks || STUDY_PLANS['7-day']).slice(0, 7).map((task: any, i: number) => (
                <div key={i} className="p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">D{task.day || (i + 1)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{task.focusArea || `Day ${task.day || (i + 1)}`}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(task.tasks || []).map((t: string, j: number) => (
                        <span key={j} className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">{t}</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-accent flex-shrink-0">{task.hours || task.hours}h</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'syllabus' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <h4 className="font-bold text-sm mb-4 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> Syllabus Coverage Plan</h4>
            <div className="space-y-4">
              {(SYLLABUS_DATA[exam] || result.syllabus?.subjects || ['General Studies', 'Quantitative Aptitude', 'Reasoning', 'English', 'Current Affairs']).map((subject: string, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{subject}</span>
                    <span className="text-xs text-slate-400">{60 - i * 10}% complete</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${60 - i * 10}%` }}></div>
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">Week {i + 1}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">Priority: {i === 0 ? 'High' : i === 1 ? 'High' : 'Medium'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button onClick={() => { setResult(null); }} className="text-sm px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all">
            Generate New Plan
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-xs font-bold text-primary mb-4">
            <Sparkles className="h-3.5 w-3.5" /> AI- Powered
          </div>
          <h2 className="text-3xl font-bold mb-3">AI Study Planner</h2>
          <p className="text-slate-600 dark:text-slate-400">Select your target exam and date, and let AI generate a personalized study plan.</p>
        </div>

        <motion.form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> Select Target Exam</label>
              <select required value={exam} onChange={(e) => setExam(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary outline-none text-sm">
                <option value="">Choose your exam</option>
                {EXAMS.map(e => (<option key={e} value={e}>{e}</option>))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Exam Date</label>
              <input type="date" required value={examDate} onChange={(e) => setExamDate(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary outline-none text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Daily Study Hours</label>
              <input type="number" min="1" max="16" value={dailyHours} onChange={(e) => setDailyHours(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary outline-none text-sm" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold">Plan Duration</label>
              <div className="flex gap-3">
                {(['3month', '6month', '12month'] as const).map(p => (
                  <button key={p} type="button" onClick={() => setPlanType(p)} className={`flex-1 p-3 rounded-xl text-sm font-bold border-2 transition-all ${planType === p ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                    {p.replace('month', ' Months')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" disabled={!exam || !examDate || isLoading} className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-yellow-300 fill-yellow-300" />}
            {isLoading ? 'Generating Your Study Plan...' : 'Generate AI Study Plan'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function generateFallbackPlan(exam: string, examDate: string, dailyHours: number) {
  const daysRemaining = Math.ceil((new Date(examDate).getTime() - Date.now()) / 86400000);
  const monthsRemaining = Math.ceil(daysRemaining / 30);

  return {
    exam,
    examDate,
    daysRemaining,
    highLevelPlan: {
      '3month': monthsRemaining >= 3
        ? [`Month 1: Foundation & Basics`, `Month 2: Syllabus Coverage (50%)`, `Month 3: Revision & Tests`]
        : ['Time remaining insufficient for 3-month plan'],
      '6month': monthsRemaining >= 6
        ? [`Month 1-2: Complete NCERTs & Basics`, `Month 3-4: Subject Deep Dive`, `Month 5: Mock Tests & Analysis`, `Month 6: Final Revision`]
        : ['Time remaining insufficient for 6-month plan'],
      '12month': monthsRemaining >= 12
        ? [`Months 1-3: Build Strong Foundation`, `Months 4-6: Complete Syllabus`, `Months 7-9: Intensive Practice`, `Months 10-12: Revision & Mocks`]
        : ['Time remaining insufficient for 12-month plan'],
    },
    dailyTasks: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      focusArea: ['General Studies', 'Quantitative Aptitude', 'Reasoning', 'English', 'Current Affairs', 'Revision', 'Practice Test'][i],
      tasks: ['Study core concepts - 2 hrs', 'Practice questions - 1 hr', 'Revision of previous day - 30 mins'],
      hours: dailyHours,
    })),
    weeklyTargets: Array.from({ length: 4 }, (_, i) => ({
      week: i + 1,
      goal: `Complete ${['Foundation', 'Syllabus Coverage', 'Deep Practice', 'Revision'][i]} Phase`,
      hours: dailyHours * 7,
      mockTests: i >= 1 ? 1 : 0,
    })),
    milestones: [
      `Day ${Math.floor(daysRemaining * 0.25)}: 25% syllabus complete`,
      `Day ${Math.floor(daysRemaining * 0.5)}: 50% syllabus complete`,
      `Day ${Math.floor(daysRemaining * 0.75)}: 75% syllabus complete`,
      `Day ${daysRemaining}: Exam day - You're ready!`,
    ],
  };
}
