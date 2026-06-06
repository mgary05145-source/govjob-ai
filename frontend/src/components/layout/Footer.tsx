"use client";

import React from 'react';
import Link from 'next/link';
import { Zap, Mail, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-1.5 rounded-lg"><Zap className="h-5 w-5 text-white fill-white" /></div>
              <span className="font-bold"><span className="text-primary">GovJob</span> India AI</span>
            </div>
            <p className="text-sm text-slate-500 mb-4">India's ultimate AI-powered government job preparation platform. Empowering 10 Crore+ students.</p>
            <div className="flex gap-3">
              <a href="mailto:support@govjobindia.ai" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10"><Mail className="h-4 w-4 text-slate-600" /></a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10"><Twitter className="h-4 w-4 text-slate-600" /></a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10"><Github className="h-4 w-4 text-slate-600" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-slate-900 dark:text-white">Exams</h4>
            <ul className="space-y-2">
              <li><Link href="/job-explorer?category=UPSC" className="text-sm text-slate-500 hover:text-primary">UPSC</Link></li>
              <li><Link href="/job-explorer?category=SSC" className="text-sm text-slate-500 hover:text-primary">SSC</Link></li>
              <li><Link href="/job-explorer?category=Banking" className="text-sm text-slate-500 hover:text-primary">Banking</Link></li>
              <li><Link href="/job-explorer?category=Railway" className="text-sm text-slate-500 hover:text-primary">Railway</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-slate-900 dark:text-white">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/study-planner" className="text-sm text-slate-500 hover:text-primary">Study Planner</Link></li>
              <li><Link href="/mock-tests" className="text-sm text-slate-500 hover:text-primary">Mock Tests</Link></li>
              <li><Link href="/notes" className="text-sm text-slate-500 hover:text-primary">Notes</Link></li>
              <li><Link href="/dashboard" className="text-sm text-slate-500 hover:text-primary">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-slate-900 dark:text-white">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">About</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">Terms of Service</a></li>
              <li><a href="mailto:support@govjobindia.ai" className="text-sm text-slate-500 hover:text-primary">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-8 text-center">
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} GovJob India AI. All rights reserved. Made with ❤️ for 10 Crore+ aspirants.</p>
        </div>
      </div>
    </footer>
  );
}
