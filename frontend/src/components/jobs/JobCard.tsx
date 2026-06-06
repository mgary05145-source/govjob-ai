"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, GraduationCap, IndianRupee, Calendar, ExternalLink, ChevronDown, ChevronUp, Users, Clock, Award } from 'lucide-react';

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
  importantDates?: string;
}

const categoryColors: Record<string, string> = {
  UPSC: 'bg-violet-100 text-violet-700 border-violet-200',
  SSC: 'bg-blue-100 text-blue-700 border-blue-200',
  Banking: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Railway: 'bg-amber-100 text-amber-700 border-amber-200',
  Defence: 'bg-red-100 text-red-700 border-red-200',
  Police: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Teaching: 'bg-pink-100 text-pink-700 border-pink-200',
  'State Govt': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  PSU: 'bg-orange-100 text-orange-700 border-orange-200',
  'Central Govt': 'bg-teal-100 text-teal-700 border-teal-200',
};

export default function JobCard({ job }: { job: Job }) {
  const [expanded, setExpanded] = useState(false);
  const colorClass = categoryColors[job.category] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <motion.div
      layout
      className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <div className="p-5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorClass}`}>{job.category}</span>
              {job.vacancies && (
                <span className="text-[10px] font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Users className="h-3 w-3" /> {job.vacancies}
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{job.title}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{job.organization}</span>
            </p>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0">
            {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5 text-primary" /> {job.eligibility?.substring(0, 50)}...</span>
          <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5 text-accent" /> {job.salary}</span>
          {job.lastDate && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-red-500" /> Last: {new Date(job.lastDate).toLocaleDateString()}</span>}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t border-slate-100 dark:border-slate-700 mt-4 pt-4 space-y-3">
                <p className="text-sm text-slate-700 dark:text-slate-300">{job.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  {job.ageLimit && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Age Limit</p>
                      <p className="text-sm font-medium"><Clock className="h-3.5 w-3.5 inline text-primary mr-1" />{job.ageLimit}</p>
                    </div>
                  )}
                  {job.selectionProcess && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Selection Process</p>
                      <p className="text-sm font-medium"><Award className="h-3.5 w-3.5 inline text-accent mr-1" />{job.selectionProcess}</p>
                    </div>
                  )}
                </div>

                {job.examPattern && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Exam Pattern</p>
                    <p className="text-sm">{job.examPattern}</p>
                  </div>
                )}

                {job.cutoffs && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-3 rounded-lg">
                    <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Expected Cutoffs</p>
                    <p className="text-sm text-amber-800 dark:text-amber-200">{job.cutoffs}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" /> Apply Now
                  </a>
                  {job.officialWebsite && (
                    <a href={job.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 py-2 px-4 rounded-lg hover:bg-slate-50 flex items-center gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" /> Official Website
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
