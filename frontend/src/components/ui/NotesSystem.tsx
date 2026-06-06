"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Search, Pin, Trash2, Sparkles, FileText, Tag, Clock, Edit3 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Note {
  id: number;
  title: string;
  content: string;
  subject: string;
  tags: string;
  color: string;
  isPinned: boolean;
  aiSummary: string;
  createdAt: string;
  updatedAt: string;
}

const COLORS = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'orange'];
const COLOR_MAP: Record<string, string> = {
  blue: 'border-l-blue-500 bg-blue-50/30 dark:bg-blue-900/10',
  green: 'border-l-green-500 bg-green-50/30 dark:bg-green-900/10',
  red: 'border-l-red-500 bg-red-50/30 dark:bg-red-900/10',
  yellow: 'border-l-yellow-500 bg-yellow-50/30 dark:bg-yellow-900/10',
  purple: 'border-l-purple-500 bg-purple-50/30 dark:bg-purple-900/10',
  pink: 'border-l-pink-500 bg-pink-50/30 dark:bg-pink-900/10',
  orange: 'border-l-orange-500 bg-orange-50/30 dark:bg-orange-900/10',
};
const SUBJECTS = ['All', 'General Studies', 'Quantitative Aptitude', 'Reasoning', 'English', 'Current Affairs', 'Science & Tech', 'Polity', 'Economy'];

const SAMPLE_NOTES: Note[] = [
  { id: 1, title: 'Indian Constitution - Key Articles', content: 'Article 14: Right to Equality\nArticle 19: Right to Freedom\nArticle 21: Right to Life\nArticle 32: Right to Constitutional Remedies', subject: 'Polity', tags: 'constitution,articles,upsc', color: 'blue', isPinned: true, aiSummary: 'Key constitutional articles summary', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, title: 'Quadratic Equations Formulas', content: 'Standard form: ax² + bx + c = 0\nDiscriminant: D = b² - 4ac\nRoots: x = (-b ± √D) / 2a\nSum of roots: -b/a\nProduct of roots: c/a', subject: 'Quantitative Aptitude', tags: 'math,algebra,formulas', color: 'green', isPinned: false, aiSummary: 'Quadratic equation formulas and properties', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 3, title: 'Important Government Schemes 2026', content: '1. PM-KISAN: Rs.6000/year to farmers\n2. Ayushman Bharat: Rs.5L health cover\n3. PM Awas Yojana: Housing for all\n4. Jal Jeevan Mission: Tap water to every household', subject: 'General Studies', tags: 'schemes,government,welfare', color: 'red', isPinned: true, aiSummary: 'Major government welfare schemes', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export default function NotesSystem() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>(SAMPLE_NOTES);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', subject: 'General Studies', tags: '', color: 'blue' });

  const filtered = notes.filter(n => {
    if (subjectFilter !== 'All' && n.subject !== subjectFilter) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const handleSave = () => {
    if (!newNote.title.trim()) return;
    const note: Note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      subject: newNote.subject,
      tags: newNote.tags,
      color: newNote.color,
      isPinned: editingNote?.isPinned || false,
      aiSummary: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (editingNote) {
      setNotes(notes.map(n => n.id === editingNote.id ? { ...note, id: editingNote.id, isPinned: editingNote.isPinned } : n));
    } else {
      setNotes([note, ...notes]);
    }
    setShowEditor(false);
    setEditingNote(null);
    setNewNote({ title: '', content: '', subject: 'General Studies', tags: '', color: 'blue' });

    if (user) {
      api.post('/notes', note).catch(() => {});
    }
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
    if (user) api.delete(`/notes/${id}`).catch(() => {});
  };

  const togglePin = (id: number) => {
    setNotes(notes.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  };

  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">Study Notes</h2>
              <p className="text-slate-500 text-sm">Create, organize, and manage your study notes</p>
            </div>
          </div>
          <button onClick={() => { setShowEditor(true); setEditingNote(null); setNewNote({ title: '', content: '', subject: 'General Studies', tags: '', color: 'blue' }); }} className="btn-primary text-sm flex items-center gap-1.5 py-2.5">
            <Plus className="h-4 w-4" /> New Note
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary outline-none text-sm" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {SUBJECTS.map(s => (<button key={s} onClick={() => setSubjectFilter(s)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${subjectFilter === s ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>{s}</button>))}
        </div>
      </div>

      {showEditor && (
        <motion.div initial={{ opacity: 0, y: -20 }} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-6">
          <input type="text" placeholder="Note title..." value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} className="w-full text-lg font-bold bg-transparent border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 outline-none" />
          <textarea placeholder="Start writing your note..." value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} className="w-full min-h-[200px] bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg p-4 outline-none text-sm mb-4 resize-none" />
          <div className="flex flex-wrap gap-4 mb-4">
            <select value={newNote.subject} onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })} className="text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              {SUBJECTS.filter(s => s !== 'All').map(s => (<option key={s} value={s}>{s}</option>))}
            </select>
            <input type="text" placeholder="Tags (comma separated)" value={newNote.tags} onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })} className="text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-1 min-w-[150px]" />
            <div className="flex gap-1 items-center">
              {COLORS.map(c => (<button key={c} onClick={() => setNewNote({ ...newNote, color: c })} className={`w-6 h-6 rounded-full border-2 ${newNote.color === c ? 'border-primary' : 'border-transparent'}`} style={{ backgroundColor: c === 'blue' ? '#3B82F6' : c === 'green' ? '#22C55E' : c === 'red' ? '#EF4444' : c === 'yellow' ? '#EAB308' : c === 'purple' ? '#A855F7' : c === 'pink' ? '#EC4899' : '#F97316' }} />))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary text-sm py-2.5">{editingNote ? 'Update' : 'Save'} Note</button>
            <button onClick={() => { setShowEditor(false); setEditingNote(null); }} className="text-sm py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sorted.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>No notes yet. Create your first note!</p>
          </div>
        ) : sorted.map((note, i) => (
          <motion.div key={note.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl border-l-4 ${COLOR_MAP[note.color] || 'border-l-blue-500'} p-4 hover:shadow-md transition-all`}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{note.subject}</span>
              <div className="flex gap-1">
                <button onClick={() => togglePin(note.id)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Pin className={`h-3.5 w-3.5 ${note.isPinned ? 'text-primary fill-primary' : 'text-slate-400'}`} /></button>
                <button onClick={() => deleteNote(note.id)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Trash2 className="h-3.5 w-3.5 text-red-400" /></button>
              </div>
            </div>
            <h3 className="font-bold text-sm mb-2">{note.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-3 whitespace-pre-line">{note.content}</p>
            {note.tags && <div className="flex gap-1 flex-wrap mb-2">{note.tags.split(',').map((t, i) => (<span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full text-slate-500">{t.trim()}</span>))}</div>}
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(note.updatedAt).toLocaleDateString()}</span>
              <button onClick={() => { setEditingNote(note); setNewNote({ title: note.title, content: note.content, subject: note.subject, tags: note.tags, color: note.color }); setShowEditor(true); }} className="flex items-center gap-1 text-primary hover:underline"><Edit3 className="h-3 w-3" /> Edit</button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
