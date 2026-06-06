"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, GraduationCap, MapPin, Clock, User, Loader2, CheckCircle2, IndianRupee, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

export default function RecommendationForm() {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [qualification, setQualification] = useState('');
  const [interest, setInterest] = useState('');
  const [age, setAge] = useState('');
  const [state, setState] = useState('');
  const [availableTime, setAvailableTime] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');

    const mockResults = [
      {
        role: getDefaultRecommendation(qualification, interest).role,
        reason: getDefaultRecommendation(qualification, interest).reason,
        salary: getDefaultRecommendation(qualification, interest).salary,
        roadmap: getDefaultRecommendation(qualification, interest).roadmap,
      },
    ];

    try {
      const data = await api.post('/ai/recommendations', { qualification, interests: interest, age: parseInt(age) || 0, state, availableTime: parseInt(availableTime) || 0 });
      setResult(data.recommendations || mockResults);
    } catch {
      setResult(mockResults);
    }

    setTimeout(() => setStep('result'), 500);
  };

  if (step === 'result') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} className="bg-white dark:bg-slate-800 border-2 border-primary/20 rounded-2xl p-8 max-w-4xl mx-auto shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg"><CheckCircle2 className="h-6 w-6 text-green-600" /></div>
          <div>
            <h3 className="text-2xl font-bold">Your AI Career Roadmap</h3>
            <p className="text-slate-500">Based on your profile, here are the best government job matches for you</p>
          </div>
        </div>

        <div className="space-y-4">
          {result?.map((rec: any, i: number) => (
            <div key={i} className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-bold text-primary">{rec.role}</h4>
                  <p className="text-sm text-slate-500 mt-1">{rec.reason}</p>
                </div>
                {rec.salary && <span className="text-sm font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" /> {rec.salary}</span>}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Preparation Path</p>
                <div className="flex flex-wrap gap-2">
                  {rec.roadmap?.map((step: string, j: number) => (
                    <span key={j} className="text-xs bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">{step}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => { setStep('form'); setResult(null); }} className="mt-6 text-primary font-semibold text-sm hover:underline flex items-center gap-1">
          <ArrowRight className="h-4 w-4" /> Try different options
        </button>
      </motion.div>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-xs font-bold text-primary mb-4">
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered
          </div>
          <h2 className="text-3xl font-bold mb-3">Find Your Perfect Government Job</h2>
          <p className="text-slate-600 dark:text-slate-400">Our AI engine analyzes your profile to recommend the most suitable career paths.</p>
        </div>

        <motion.form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> Education Qualification</label>
              <select required value={qualification} onChange={(e) => setQualification(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary outline-none text-sm">
                <option value="">Select</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="Graduate">Graduate (B.A/B.Sc/B.Com)</option>
                <option value="Graduate Engineering">Graduate (B.E/B.Tech)</option>
                <option value="Post Graduate">Post Graduate</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Interest Area</label>
              <select required value={interest} onChange={(e) => setInterest(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary outline-none text-sm">
                <option value="">Select</option>
                <option value="Administration">Administration (IAS/IPS/IFS)</option>
                <option value="Banking">Banking & Finance</option>
                <option value="Defence">Defence (Army/Navy/Air Force)</option>
                <option value="Teaching">Teaching & Education</option>
                <option value="Police">Police & Security</option>
                <option value="Railway">Railways</option>
                <option value="Engineering">Engineering & Technical</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Your Age</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 22" className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary outline-none text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Your State</label>
              <select value={state} onChange={(e) => setState(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary outline-none text-sm">
                <option value="">Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Bihar">Bihar</option>
                <option value="Delhi">Delhi</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Available Study Time (hours per day)</label>
              <select value={availableTime} onChange={(e) => setAvailableTime(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary outline-none text-sm">
                <option value="">Select</option>
                <option value="1-2">1-2 hours (Working Professional)</option>
                <option value="3-4">3-4 hours (Part-time)</option>
                <option value="5-6">5-6 hours (Dedicated)</option>
                <option value="7+">7+ hours (Full-time Preparation)</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={!qualification || !interest} className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 disabled:opacity-50">
            <Sparkles className="h-5 w-5 text-yellow-300 fill-yellow-300" />
            Get AI Recommendations
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function getDefaultRecommendation(q: string, interest: string): { role: string; reason: string; salary: string; roadmap: string[] } {
  const ql = q.toLowerCase();
  const il = interest.toLowerCase();

  if (il.includes('admin')) return { role: 'UPSC Civil Services', reason: 'Perfect for graduates with administrative aspirations. Top career in government.', salary: '₹56,100 - ₹2,50,000', roadmap: ['NCERTs (6-12)', 'Standard References', 'Answer Writing', 'Mock Interviews'] };
  if (il.includes('bank')) return { role: 'IBPS PO / Clerk', reason: 'Excellent career in banking sector with fast growth.', salary: '₹52,000 - ₹55,000', roadmap: ['Quantitative Aptitude', 'Reasoning', 'English', 'Banking Awareness'] };
  if (il.includes('defence')) return { role: 'NDA / CDS / AFCAT', reason: 'Serve the nation with pride in defence forces.', salary: '₹56,100 - ₹2,50,000', roadmap: ['Mathematics', 'English', 'GK', 'SSB Preparation'] };
  if (il.includes('teach')) return { role: 'UGC NET / CTET', reason: 'Gateway to teaching profession in India.', salary: '₹37,400 - ₹67,000', roadmap: ['Subject Specialization', 'Teaching Aptitude', 'Pedagogy'] };
  if (il.includes('police')) return { role: 'SSC GD / State Police', reason: 'Law enforcement career with authority and respect.', salary: '₹21,700 - ₹69,100', roadmap: ['Physical Training', 'GK', 'Reasoning', 'Current Affairs'] };
  if (il.includes('railway')) return { role: 'RRB NTPC / ALP', reason: 'Stable career in Indian Railways with great perks.', salary: '₹19,900 - ₹35,400', roadmap: ['Mathematics', 'Reasoning', 'General Awareness'] };
  if (il.includes('engineer')) return { role: 'PSU Recruitment (GATE)', reason: 'High-salary PSU jobs through GATE score.', salary: '₹60,000 - ₹2,00,000', roadmap: ['GATE Preparation', 'Technical Subjects', 'Interview'] };
  if (ql.includes('12th')) return { role: 'SSC CHSL / RRB NTPC', reason: 'Best entry-level government jobs for 12th pass.', salary: '₹19,900 - ₹63,200', roadmap: ['Quantitative Aptitude', 'English', 'Reasoning', 'GK'] };
  if (ql.includes('10th')) return { role: 'SSC GD / RRB Group D', reason: 'Great opportunities for 10th pass in security and railways.', salary: '₹18,000 - ₹69,100', roadmap: ['General Awareness', 'Mathematics', 'Reasoning', 'Physical Fitness'] };
  return { role: 'SSC CGL', reason: 'Wide range of Group B & C government posts for graduates.', salary: '₹25,500 - ₹1,51,100', roadmap: ['Quant + Reasoning', 'English + GK', 'Computer Proficiency'] };
}
