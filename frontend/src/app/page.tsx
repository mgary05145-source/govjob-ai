"use client";

import React from 'react';
import { Sparkles, Zap, Brain, Target, Trophy, BookOpen, Clock, Shield, Users, TrendingUp, GraduationCap, ArrowRight, Star, CheckCircle2, ChevronRight } from 'lucide-react';
import JobList from '@/components/jobs/JobList';
import RecommendationForm from '@/components/ai/RecommendationForm';
import StudyDashboard from '@/components/ui/StudyDashboard';
import StudyPlannerForm from '@/components/ai/StudyPlannerForm';
import PomodoroTimer from '@/components/ui/PomodoroTimer';
import CurrentAffairsHub from '@/components/ui/CurrentAffairsHub';
import NotesSystem from '@/components/ui/NotesSystem';
import MockTestPlatform from '@/components/ui/MockTestPlatform';
import GamificationSystem from '@/components/ui/GamificationSystem';
import AiCoach from '@/components/ai/AiCoach';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';

const FEATURES = [
  { icon: 'Brain', title: 'AI Career Engine', desc: 'Get personalized job recommendations based on your profile', color: 'from-violet-500 to-purple-600' },
  { icon: 'Target', title: 'Smart Study Plans', desc: 'AI-generated day-by-day study plans for your target exam', color: 'from-blue-500 to-cyan-600' },
  { icon: 'BookOpen', title: 'Complete Syllabus', desc: 'Topic-wise syllabus with progress tracking', color: 'from-emerald-500 to-green-600' },
  { icon: 'Zap', title: 'Mock Tests', desc: 'Full-length, sectional & previous year papers with analysis', color: 'from-orange-500 to-red-600' },
  { icon: 'Clock', title: 'Pomodoro Timer', desc: 'Focus with customizable study timers', color: 'from-pink-500 to-rose-600' },
  { icon: 'Trophy', title: 'Gamification', desc: 'Earn XP, unlock badges, compete on leaderboards', color: 'from-yellow-500 to-amber-600' },
  { icon: 'Shield', title: 'Streak Tracker', desc: 'Maintain daily consistency and build habits', color: 'from-teal-500 to-emerald-600' },
  { icon: 'Users', title: '24/7 AI Mentor', desc: 'Get instant help from GovJob Guru AI coach', color: 'from-indigo-500 to-blue-600' },
];

const STATS = [
  { value: '10Cr+', label: 'Aspirants' },
  { value: '50+', label: 'Exam Patterns' },
  { value: '5000+', label: 'Mock Tests' },
  { value: '24/7', label: 'AI Support' },
];

const EXAMS = [
  { name: 'UPSC CSE', color: 'text-violet-600', bg: 'bg-violet-100' },
  { name: 'SSC CGL', color: 'text-blue-600', bg: 'bg-blue-100' },
  { name: 'IBPS PO', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { name: 'RRB NTPC', color: 'text-amber-600', bg: 'bg-amber-100' },
  { name: 'NDA/CDS', color: 'text-red-600', bg: 'bg-red-100' },
  { name: 'State PCS', color: 'text-cyan-600', bg: 'bg-cyan-100' },
];

const iconMap: Record<string, React.ElementType> = { Brain, Target, BookOpen, Zap, Clock, Trophy, Shield, Users };

function FeatureIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name];
  return Icon ? <Icon className={className} /> : null;
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <AiCoach />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 py-20">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold text-white mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                AI-Powered GovJob Preparation Platform
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6">
                Crack Every{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent">
                  Government Exam
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                India&apos;s most advanced AI platform for government job preparation. Personalized study plans, mock tests, real-time analytics, and 24/7 AI mentorship for UPSC, SSC, Banking, Railways, and more.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-4">
                <a href="/signup" className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-10 rounded-xl text-lg shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all flex items-center gap-2">
                  Start Free <ArrowRight className="h-5 w-5" />
                </a>
                <a href="#features" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-4 px-10 rounded-xl text-lg border border-white/20 transition-all">
                  Explore Features
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                {STATS.map((stat, i) => (
                  <div key={i} className="text-center p-4">
                    <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{stat.value}</p>
                    <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Exams */}
        <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Covering All Major Government Exams</p>
            <div className="flex flex-wrap justify-center gap-4">
              {EXAMS.map((exam, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`flex items-center gap-2 px-4 py-2 rounded-full ${exam.bg} ${exam.color}`}>
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-bold">{exam.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Everything You Need to <span className="gradient-text">Succeed</span></h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">AI-powered tools and resources designed to maximize your government exam preparation.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((feature, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all group">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                    <FeatureIcon name={feature.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Modules */}
        <div className="container mx-auto px-4 space-y-12 py-16">
          <JobList />
          <CurrentAffairsHub />
          <RecommendationForm />
          <StudyPlannerForm />
          <MockTestPlatform />
          <StudyDashboard />
          <PomodoroTimer />
          <NotesSystem />
          <GamificationSystem />
        </div>

        {/* CTA */}
        <section className="py-24 bg-gradient-to-r from-primary to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Government Job Journey?</h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">Join 10 Crore+ aspirants preparing with GovJob India AI. Your dream government job is just a click away.</p>
              <a href="/signup" className="inline-flex items-center gap-2 bg-white text-primary font-bold py-4 px-10 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all">
                Start Free <ChevronRight className="h-5 w-5" />
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
