"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StudyDashboard from '@/components/ui/StudyDashboard';
import GamificationSystem from '@/components/ui/GamificationSystem';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 text-center md:text-left">Welcome Back, {user.name}!</h1>
          <p className="text-slate-500 text-center md:text-left mt-1">Ready for today's study session?</p>
        </div>
        
        <div className="space-y-12">
          <StudyDashboard />
          <GamificationSystem />
        </div>
      </main>

      <Footer />
    </div>
  );
}