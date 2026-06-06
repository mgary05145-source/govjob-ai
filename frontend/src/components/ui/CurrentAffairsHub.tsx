"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Search, Calendar, Bookmark, ExternalLink, Tag, Loader2, Filter } from 'lucide-react';
import { api } from '@/lib/api';

interface Affair {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  source: string;
  url?: string;
  tags?: string;
}

const SAMPLE_AFFAIRS: Affair[] = [
  { id: 1, title: 'India Launches New Space Mission for Lunar Exploration', description: 'ISRO successfully launched its latest lunar mission aimed at studying the Moon\'s south pole region with advanced scientific instruments.', category: 'Science & Tech', date: new Date().toISOString(), source: 'ISRO', tags: 'space,isro,moon,science' },
  { id: 2, title: 'Union Budget 2026: Focus on Infrastructure & Digital India', description: 'Major allocations for infrastructure development, digital transformation, and education sector reforms in the Union Budget 2026.', category: 'Economy', date: new Date().toISOString(), source: 'Ministry of Finance', tags: 'budget,economy,infrastructure' },
  { id: 3, title: 'SSC CHSL 2026 Notification Released with 45,000+ Vacancies', description: 'Staff Selection Commission releases notification for Combined Higher Secondary Level Examination 2026.', category: 'Jobs', date: new Date().toISOString(), source: 'SSC', tags: 'ssc,chsl,jobs,government' },
  { id: 4, title: 'India Wins 5 Gold Medals at Asian Games 2026', description: 'Indian athletes achieve best-ever performance in shooting, athletics, and wrestling at the Asian Games.', category: 'Sports', date: new Date().toISOString(), source: 'Sports Ministry', tags: 'sports,asian games,medals' },
  { id: 5, title: 'New Education Policy: All States Now On Board', description: 'All states have adopted the National Education Policy 2020 framework with state-specific modifications.', category: 'Education', date: new Date().toISOString(), source: 'MHRD', tags: 'education,nep,policy' },
  { id: 6, title: 'India Becomes 3rd Largest Economy in PPP Terms', description: 'World Bank report confirms India has overtaken Japan in purchasing power parity rankings.', category: 'Economy', date: new Date().toISOString(), source: 'World Bank', tags: 'economy,india,world bank' },
  { id: 7, title: 'Supreme Court Landmark Judgment on Data Privacy', description: 'Strengthened data privacy protections for citizens under Article 21 of the Constitution.', category: 'Polity', date: new Date().toISOString(), source: 'Supreme Court', tags: 'supreme court,privacy,judgment' },
  { id: 8, title: 'India\'s Renewable Energy Capacity Crosses 200 GW', description: 'Historic milestone with solar and wind energy leading the renewable energy push.', category: 'Environment', date: new Date().toISOString(), source: 'MNRE', tags: 'renewable energy,solar,environment' },
];

const CATEGORIES = ['All', 'Economy', 'Science & Tech', 'Polity', 'Education', 'Environment', 'Sports', 'Jobs', 'Defence'];

export default function CurrentAffairsHub() {
  const [items, setItems] = useState<Affair[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());

  useEffect(() => {
    setLoading(true);
    api.get('/current-affairs')
      .then(data => setItems(data.items || SAMPLE_AFFAIRS))
      .catch(() => setItems(SAMPLE_AFFAIRS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(item => {
    const matchCat = category === 'All' || item.category === category;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleBookmark = (id: number) => {
    setBookmarked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Newspaper className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Current Affairs Hub</h2>
            <p className="text-slate-500 text-sm">Stay updated with daily news relevant to government exams</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search current affairs..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary outline-none text-sm transition-all" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${category === cat ? 'bg-primary text-white shadow-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.category}</span>
                <button onClick={() => toggleBookmark(item.id)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                  <Bookmark className={`h-4 w-4 ${bookmarked.has(item.id) ? 'text-primary fill-primary' : 'text-slate-400'}`} />
                </button>
              </div>
              <h3 className="font-bold text-sm mb-2 leading-snug">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {item.source}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
