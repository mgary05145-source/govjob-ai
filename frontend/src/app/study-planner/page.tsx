import React from 'react';
import StudyPlannerForm from '@/components/ai/StudyPlannerForm';

export default function StudyPlannerPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b py-8 shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900">AI Study Planner</h1>
          <p className="text-slate-500 mt-2">Generate your personalized exam roadmap in seconds</p>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <StudyPlannerForm />
        </div>
      </main>
    </div>
  );
}
