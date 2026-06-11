"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, Target, TrendingUp, BookOpen, CheckCircle2, AlertCircle, Brain, BarChart3, Loader2, Zap, Award, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface DashboardData {
  user?: any;
  streak?: { current: number; longest: number; lastStudyDate: string };
  analytics?: { todayMinutes: number; weekMinutes: number; monthMinutes: number; totalMinutes: number; averageScore: number; syllabusProgress: number; weeklyGoal: number; monthlyGoal: number; dailyGoal: number };
  scores?: { test: number; score: number; date: string }[];
  subjectWisePerformance?: { subject: string; percentage: number }[];
  weakAreas?: { subject: string; topic: string; score: number; suggestion: string }[];
  recentResults?: any[];
}

export default function StudyDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { setLoading(false); return; }

    api.get('/dashboard')
      .then(setData)
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <section className="py-12">
        <div className="bg-gradient-to-r from-primary/5 via-white to-accent/5 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          <Brain className="h-16 w-16 text-primary/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Your Smart Study Dashboard</h3>
          <p className="text-slate-500 mb-6">Sign in to unlock personalized study analytics, streaks, and insights.</p>
          <a href="/login" className="btn-primary inline-block">Sign In to View Dashboard</a>
        </div>
      </section>
    );
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const d = data || getMockDashboard();
  const a = d.analytics || { todayMinutes: 0, weekMinutes: 0, monthMinutes: 0, totalMinutes: 0, averageScore: 0, syllabusProgress: 45, weeklyGoal: 600, monthlyGoal: 2400, dailyGoal: 120 };
  const s = d.streak || { current: 0, longest: 0 };

  const stats = [
    { label: 'Today', value: `${Math.floor(a.todayMinutes / 60)}h ${a.todayMinutes % 60}m`, icon: 'Clock', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', progress: Math.min(100, (a.todayMinutes / a.dailyGoal) * 100) },
    { label: 'Weekly Goal', value: `${Math.floor(a.weekMinutes / 60)}h ${a.weekMinutes % 60}m`, icon: 'Target', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', progress: Math.min(100, (a.weekMinutes / a.weeklyGoal) * 100) },
    { label: 'Monthly Goal', value: `${Math.floor(a.monthMinutes / 60)}h ${a.monthMinutes % 60}m`, icon: 'TrendingUp', color: 'text-violet-600', bg: 'bg-violet-100 dark:bg-violet-900/30', progress: Math.min(100, (a.monthMinutes / a.monthlyGoal) * 100) },
    { label: 'Avg. Score', value: `${a.averageScore}%`, icon: 'BarChart3', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Current Streak', value: `${s.current} days`, icon: 'Flame', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { label: 'Syllabus', value: `${a.syllabusProgress}%`, icon: 'BookOpen', color: 'text-cyan-600', bg: 'bg-cyan-100 dark:bg-cyan-900/30', progress: a.syllabusProgress },
  ];
  const statIcons: Record<string, React.ElementType> = { Clock: Clock, Target: Target, TrendingUp: TrendingUp, BarChart3: BarChart3, Flame: Flame, BookOpen: BookOpen };

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Study Dashboard</h2>
          <p className="text-slate-500 text-sm">Track your preparation progress at a glance</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
          <Zap className="h-4 w-4 text-primary fill-primary" />
          <span className="text-sm font-bold text-primary">{user?.xpPoints || 0} XP</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>{React.createElement(statIcons[stat.icon as keyof typeof statIcons] || 'div', { className: `h-4 w-4 ${stat.color}` })}</div>
            </div>
            <p className="text-2xl font-extrabold mb-1">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
            {stat.progress !== undefined && (
              <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${stat.progress}%` }}></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Subject Performance</h3>
          {(d.subjectWisePerformance || []).length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">Complete mock tests to see performance</div>
          ) : (
            <div className="space-y-3">
              {(d.subjectWisePerformance || []).map((subj: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{subj.subject}</span>
                    <span className="font-bold">{subj.percentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${subj.percentage >= 60 ? 'bg-green-500' : subj.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${subj.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2"><AlertCircle className="h-4 w-4 text-amber-500" /> Weak Areas to Focus</h3>
          {(d.weakAreas || []).length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">No weak areas detected yet. Take a mock test!</div>
          ) : (
            <div className="space-y-3">
              {(d.weakAreas || []).slice(0, 4).map((w: any, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-red-600 dark:text-red-300">{w.score}%</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{w.subject}</p>
                    <p className="text-xs text-slate-500">{w.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function getMockDashboard(): DashboardData {
  return {
    streak: { current: 5, longest: 12, lastStudyDate: new Date().toISOString() },
    analytics: {
      todayMinutes: 85, weekMinutes: 420, monthMinutes: 1680, totalMinutes: 120,
      averageScore: 68, syllabusProgress: 45, weeklyGoal: 600, monthlyGoal: 2400, dailyGoal: 120,
    },
    scores: [{ test: 1, score: 72, date: new Date().toISOString() }],
    subjectWisePerformance: [
      { subject: 'General Awareness', percentage: 65 },
      { subject: 'Quantitative Aptitude', percentage: 58 },
      { subject: 'Reasoning', percentage: 72 },
      { subject: 'English', percentage: 80 },
    ],
    weakAreas: [
      { subject: 'Quantitative Aptitude', topic: 'Data Interpretation', score: 42, suggestion: 'Practice DI questions daily. Focus on percentage and ratio concepts.' },
      { subject: 'General Awareness', topic: 'Science & Tech', score: 48, suggestion: 'Read daily science news and monthly Science & Tech magazine.' },
    ],
  };
}
