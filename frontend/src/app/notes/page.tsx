"use client";

import React from 'react';
import NotesSystem from '@/components/ui/NotesSystem';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 container mx-auto py-12 px-4">
        <NotesSystem />
      </main>
      <Footer />
    </div>
  );
}