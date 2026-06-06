"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Award, Target, Flame, Star, Medal, TrendingUp, Crown, Sparkles, Lock } from 'lucide-react';

interface Badge {
  badge: string;
  desc: string;
  xp: number;
  icon: string;
}

interface Achievement {
  badge: string;
  description: string;
  xpRewarded: number;
  unlockedAt: string;
}

const ALL_BADGES: Badge[] = [
  { badge: 'First Study', desc: 'Complete your first study session', xp: 10, icon: '🎯' },
  { badge: '3-Day Streak', desc: 'Studied 3 days in a row', xp: 30, icon: '🔥' },
  { badge: '7-Day Streak', desc: 'Studied 7 days in a row', xp: 100, icon: '🔥' },
  { badge: '15-Day Streak', desc: 'Half month of consistency', xp: 250, icon: '💪' },
  { badge: '30-Day Streak', desc: 'One month of non-stop learning', xp: 500, icon: '🏆' },
  { badge: 'Quiz Master', desc: 'Score 90%+ in any mock test', xp: 200, icon: '📝' },
  { badge: 'Note Taker', desc: 'Create 10 study notes', xp: 100, icon: '📓' },
  { badge: 'Speed Demon', desc: 'Complete a test in half the time', xp: 150, icon: '⚡' },
  { badge: '10 Hours Club', desc: 'Study 10 hours in a single day', xp: 300, icon: '⭐' },
  { badge: 'Syllabus Champion', desc: 'Complete 100% syllabus', xp: 500, icon: '📚' },
  { badge: 'Streak Legend', desc: 'Reached 100-day streak', xp: 2000, icon: '👑' },
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { badge: 'First Study', description: 'Complete your first study session', xpRewarded: 10, unlockedAt: new Date().toISOString() },
  { badge: '3-Day Streak', description: 'Studied 3 days in a row', xpRewarded: 30, unlockedAt: new Date().toISOString() },
];

const LEVELS = [
  { level: 1, xp: 0, title: 'Beginner' },
  { level: 2, xp: 100, title: 'Learner' },
  { level: 3, xp: 300, title: 'Dedicated' },
  { level: 4, xp: 600, title: 'Scholar' },
  { level: 5, xp: 1000, title: 'Expert' },
  { level: 6, xp: 2000, title: 'Master' },
  { level: 7, xp: 4000, title: 'Grandmaster' },
  { level: 8, xp: 7000, title: 'Legend' },
  { level: 9, xp: 11000, title: 'Champion' },
  { level: 10, xp: 16000, title: 'GovJob Guru' },
];

const LEADERBOARD = [
  { rank: 1, name: 'Priya Sharma', xp: 12450, level: 8, streak: 45 },
  { rank: 2, name: 'Rahul Verma', xp: 10920, level: 7, streak: 38 },
  { rank: 3, name: 'Ananya Gupta', xp: 9800, level: 7, streak: 32 },
  { rank: 4, name: 'Vikram Singh', xp: 8650, level: 6, streak: 28 },
  { rank: 5, name: 'Neha Patel', xp: 7400, level: 6, streak: 25 },
  { rank: 6, name: 'Amit Kumar', xp: 6200, level: 5, streak: 20 },
  { rank: 7, name: 'Sneha Reddy', xp: 5100, level: 5, streak: 18 },
  { rank: 8, name: 'Ravi Joshi', xp: 4200, level: 4, streak: 15 },
  { rank: 9, name: 'Divya Nair', xp: 3500, level: 4, streak: 12 },
  { rank: 10, name: 'Karan Mehta', xp: 2800, level: 3, streak: 10 },
];

export default function GamificationSystem() {
  const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard'>('badges');

  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <div>
            <h2 className="text-2xl font-bold">Gamification & Achievements</h2>
            <p className="text-slate-500 text-sm">Earn XP, unlock badges, and compete with peers</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 via-white to-orange-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-yellow-200 dark:border-yellow-700/30 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500">You are at</p>
              <h3 className="text-xl font-bold">Level 3 - Dedicated Learner</h3>
              <p className="text-sm text-slate-500 mt-1">1,250 XP earned</p>
            </div>
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <Crown className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="h-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" style={{ width: '42%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>300 XP to Level 4</span>
            <span>Next: Scholar</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('badges')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'badges' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600'}`}>
          <Award className="h-4 w-4 inline mr-1" /> Badges
        </button>
        <button onClick={() => setActiveTab('leaderboard')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'leaderboard' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600'}`}>
          <Medal className="h-4 w-4 inline mr-1" /> Leaderboard
        </button>
      </div>

      {activeTab === 'badges' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ALL_BADGES.map((badge, i) => {
            const unlocked = MOCK_ACHIEVEMENTS.find(a => a.badge === badge.badge);
            return (
              <motion.div key={badge.badge} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`relative p-4 rounded-xl border-2 text-center transition-all ${
                unlocked ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50'
              }`}>
                {!unlocked && <Lock className="absolute top-2 right-2 h-3.5 w-3.5 text-slate-300" />}
                <span className="text-3xl block mb-2">{badge.icon}</span>
                <p className="text-xs font-bold mb-1">{badge.badge}</p>
                <p className="text-[10px] text-slate-500">{badge.desc}</p>
                <p className="text-[10px] text-primary font-bold mt-1">{badge.xp} XP</p>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-sm font-bold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Top Aspirants This Month</p>
          </div>
          {LEADERBOARD.map((entry, i) => (
            <div key={entry.rank} className={`flex items-center gap-4 px-5 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
              i === 0 ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-slate-300 text-white' : i === 2 ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
              }`}>
                {entry.rank}
                {i === 0 && <Crown className="absolute -top-1 -right-1 h-3.5 w-3.5 text-yellow-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{entry.name}</p>
                <p className="text-xs text-slate-500">Level {entry.level} &middot; {entry.streak}-day streak</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{entry.xp.toLocaleString()} XP</p>
                <p className="text-[10px] text-slate-400">points</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
