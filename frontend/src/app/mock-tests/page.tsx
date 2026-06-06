"use client";

import React from 'react';
import MockTestPlatform from '@/components/ui/MockTestPlatform';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';

export default function MockTestsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1">
        <header className="bg-slate-900 py-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Mock Test Center
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-lg md:text-xl max-w-2xl"
            >
              All-India live test series, previous year papers, and chapter-wise practice tests.
            </motion.p>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <MockTestPlatform />
        </div>
      </main>

      <Footer />
    </div>
  );
}
