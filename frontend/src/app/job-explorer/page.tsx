"use client";

import React from 'react';
import JobList from '@/components/jobs/JobList';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';

export default function JobExplorerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      
      <main className="flex-1">
        <header className="bg-primary py-16 text-white overflow-hidden relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-20 -mt-20 blur-3xl"
          ></motion.div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Government Job Explorer
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-blue-100 text-lg md:text-xl max-w-2xl"
            >
              The most comprehensive hub for Central & State Government Job notifications in India.
            </motion.p>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-12">
          <JobList />
        </div>
      </main>

      <Footer />
    </div>
  );
}
