"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Briefcase, Loader2 } from 'lucide-react';
import JobCard from './JobCard';
import jobsData from '@/lib/data/jobs.json';

interface Job {
  id: number;
  title: string;
  organization: string;
  category: string;
  description: string;
  eligibility: string;
  ageLimit?: string;
  salary: string;
  selectionProcess?: string;
  examPattern?: string;
  vacancies?: string;
  officialWebsite?: string;
  applyLink?: string;
  examDate?: string;
  lastDate?: string;
  cutoffs?: string;
  previousYearTrends?: string;
}

const categories = ['All', 'UPSC', 'SSC', 'Banking', 'Railway', 'Defence', 'Police', 'Teaching', 'State Govt', 'PSU', 'Central Govt'];

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setJobs(jobsData as Job[]);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const filtered = jobs.filter(j => {
    const matchCategory = category === 'All' || j.category === category;
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.organization.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Government Job Explorer</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400">Find the latest government job notifications, eligibility, and application details.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary outline-none text-sm transition-all"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No jobs found matching your criteria</p>
          <button onClick={() => { setCategory('All'); setSearch(''); }} className="text-primary text-sm mt-2 hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <JobCard job={{ ...job, examDate: job.examDate || undefined, lastDate: job.lastDate || undefined }} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
