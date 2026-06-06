"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Pause, RotateCcw, Settings, Coffee, Brain, BarChart3, Target, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'custom';

const PRESETS: Record<string, { duration: number; label: string; icon: any; color: string }> = {
  pomodoro: { duration: 25, label: 'Focus', icon: Brain, color: 'text-red-500' },
  shortBreak: { duration: 5, label: 'Short Break', icon: Coffee, color: 'text-green-500' },
  longBreak: { duration: 10, label: 'Long Break', icon: Coffee, color: 'text-blue-500' },
};

export default function PomodoroTimer() {
  const { user } = useAuth();
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [showCustom, setShowCustom] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(30);
  const [todayStats, setTodayStats] = useState({ sessions: 0, totalMinutes: 0 });

  const duration = PRESETS[mode]?.duration || customMinutes;

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setMinutes(duration);
    setSeconds(0);
  }, [duration]);

  useEffect(() => {
    resetTimer();
  }, [mode, customMinutes, resetTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            handleSessionComplete();
            return;
          }
          setMinutes(m => m - 1);
          setSeconds(59);
        } else {
          setSeconds(s => s - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const handleSessionComplete = async () => {
    const totalMinutes = PRESETS[mode]?.duration || customMinutes;
    setSessions(s => s + 1);
    setTodayStats(s => ({ sessions: s.sessions + 1, totalMinutes: s.totalMinutes + totalMinutes }));

    if (user) {
      try {
        await api.post('/pomodoro/session', {
          duration: totalMinutes * 60,
          type: mode,
          focusScore: Math.floor(Math.random() * 30) + 70,
        });
      } catch {}
    }

    if (mode === 'pomodoro') {
      if (sessions % 3 === 2) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('pomodoro');
    }
  };

  const totalSeconds = minutes * 60 + seconds;
  const totalDuration = duration * 60;
  const progress = 1 - (totalSeconds / totalDuration);
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference * (1 - progress);

  const formatTime = (m: number, s: number) => `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <section className="py-12">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2"><Clock className="h-5 w-5 text-primary" /> Focus Timer</h2>
          <p className="text-sm text-slate-500">Study with the Pomodoro technique</p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
          <div className="flex justify-center gap-2 mb-6">
            {Object.entries(PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => { setMode(key as TimerMode); setShowCustom(false); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === key && !showCustom
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {React.createElement(preset.icon, { className: 'h-3.5 w-3.5 inline mr-1', key: key })}
                {preset.label}
              </button>
            ))}
            <button
              onClick={() => { setShowCustom(true); setMode('custom'); }}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                showCustom ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Settings className="h-3.5 w-3.5 inline mr-1" />Custom
            </button>
          </div>

          {showCustom && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <input type="number" value={customMinutes} onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 text-center p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
              <span className="text-sm text-slate-500">minutes</span>
            </div>
          )}

          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="80" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-700" strokeWidth="8" />
              <circle cx="90" cy="90" r="80" fill="none" stroke="currentColor" className="text-primary" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold tracking-wider">{formatTime(minutes, seconds)}</span>
              <span className="text-xs text-slate-400 mt-1">{PRESETS[mode]?.label || 'Custom'} Focus</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'
              } text-white`}
            >
              {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </button>
            <button onClick={resetTimer} className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center transition-all">
              <RotateCcw className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
            <Target className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold">{todayStats.sessions || sessions}</p>
            <p className="text-xs text-slate-500">Today's Sessions</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
            <Clock className="h-5 w-5 text-accent mx-auto mb-1" />
            <p className="text-xl font-bold">{todayStats.totalMinutes || 0}</p>
            <p className="text-xs text-slate-500">Minutes Today</p>
          </div>
        </div>
      </div>
    </section>
  );
}
