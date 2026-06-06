"use client";

import React from 'react';
import NotesSystem from '@/components/ui/NotesSystem';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';

export default function NotesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Study Notes</h1>
            <p className="text-slate-500 mt-1">Organize your preparation materials with AI-powered tagging.</p>
          </div>
          <button className="btn-primary px-6 py-2.5 shadow-lg shadow-primary/20">New Note</button>
        </div>
        
        <NotesSystem />
      </main>

      <Footer />
    </div>
  );
}
