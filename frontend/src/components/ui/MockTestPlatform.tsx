"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, BarChart3, CheckCircle2, XCircle, AlertTriangle, Play, RotateCcw, ChevronRight, Loader2, Award, BookOpen, Brain, Target } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: number;
  subject: string;
}

interface Test {
  id: number;
  title: string;
  subject: string;
  category: string;
  duration: number;
  totalMarks: number;
  totalQuestions: number;
  questions: Question[];
  isSectional: boolean;
  isPreviousYear: boolean;
  difficulty: string;
}

const SAMPLE_TESTS: Test[] = [
  { id: 1, title: 'UPSC Prelims Full Mock Test 1', subject: 'General Studies', category: 'UPSC', duration: 120, totalMarks: 200, totalQuestions: 100, questions: [], isSectional: false, isPreviousYear: false, difficulty: 'hard' },
  { id: 2, title: 'SSC CGL Tier I Mock Test 1', subject: 'General', category: 'SSC', duration: 60, totalMarks: 200, totalQuestions: 100, questions: [], isSectional: false, isPreviousYear: false, difficulty: 'medium' },
  { id: 3, title: 'IBPS PO Prelims Mock Test 1', subject: 'General', category: 'Banking', duration: 60, totalMarks: 100, totalQuestions: 100, questions: [], isSectional: false, isPreviousYear: false, difficulty: 'medium' },
  { id: 4, title: 'Quantitative Aptitude Sectional Test', subject: 'Quantitative Aptitude', category: 'SSC', duration: 45, totalMarks: 50, totalQuestions: 25, questions: [], isSectional: true, isPreviousYear: false, difficulty: 'medium' },
  { id: 5, title: 'Reasoning Ability Sectional Test', subject: 'Reasoning', category: 'Banking', duration: 45, totalMarks: 50, totalQuestions: 25, questions: [], isSectional: true, isPreviousYear: false, difficulty: 'medium' },
  { id: 6, title: 'General Awareness Sectional Test', subject: 'General Awareness', category: 'UPSC', duration: 30, totalMarks: 50, totalQuestions: 25, questions: [], isSectional: true, isPreviousYear: false, difficulty: 'medium' },
  { id: 7, title: 'English Comprehension Sectional Test', subject: 'English', category: 'SSC', duration: 30, totalMarks: 50, totalQuestions: 25, questions: [], isSectional: true, isPreviousYear: false, difficulty: 'easy' },
  { id: 8, title: 'RRB NTPC Stage I Mock Test', subject: 'General', category: 'Railway', duration: 90, totalMarks: 100, totalQuestions: 100, questions: [], isSectional: false, isPreviousYear: true, difficulty: 'easy' },
];

const SAMPLE_QUESTIONS: Record<string, Question[]> = {
  'General Awareness': [
    { id: 'ga1', question: 'Which article deals with Right to Equality?', options: ['Article 14', 'Article 19', 'Article 21', 'Article 32'], answer: 0, subject: 'General Awareness' },
    { id: 'ga2', question: 'Who is known as Father of Indian Constitution?', options: ['M. Gandhi', 'J. Nehru', 'B.R. Ambedkar', 'S. Patel'], answer: 2, subject: 'General Awareness' },
    { id: 'ga3', question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], answer: 2, subject: 'General Awareness' },
    { id: 'ga4', question: 'Chemical formula of water?', options: ['H2O', 'CO2', 'NaCl', 'H2SO4'], answer: 0, subject: 'General Awareness' },
    { id: 'ga5', question: 'Largest planet in our solar system?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], answer: 2, subject: 'General Awareness' },
  ],
  'Quantitative Aptitude': [
    { id: 'qa1', question: 'What is 15% of 200?', options: ['25', '30', '35', '20'], answer: 1, subject: 'Quantitative Aptitude' },
    { id: 'qa2', question: 'Speed of train traveling 360km in 6 hours?', options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'], answer: 1, subject: 'Quantitative Aptitude' },
    { id: 'qa3', question: 'Square root of 144?', options: ['10', '11', '12', '13'], answer: 2, subject: 'Quantitative Aptitude' },
    { id: 'qa4', question: 'LCM of 12 and 18?', options: ['24', '36', '48', '72'], answer: 1, subject: 'Quantitative Aptitude' },
    { id: 'qa5', question: 'If 3x + 5 = 20, x = ?', options: ['3', '4', '5', '6'], answer: 2, subject: 'Quantitative Aptitude' },
  ],
  'Reasoning': [
    { id: 're1', question: 'Next number: 2, 6, 18, 54, ?', options: ['108', '162', '216', '270'], answer: 1, subject: 'Reasoning' },
    { id: 're2', question: 'Odd one out: Apple, Mango, Potato, Orange', options: ['Apple', 'Mango', 'Potato', 'Orange'], answer: 2, subject: 'Reasoning' },
    { id: 're3', question: 'If ROSE = 6841, SOUR = ?', options: ['6418', '6841', '4186', '1468'], answer: 0, subject: 'Reasoning' },
    { id: 're4', question: 'What comes next: Z, X, V, T, ?', options: ['R', 'S', 'Q', 'P'], answer: 0, subject: 'Reasoning' },
    { id: 're5', question: 'A is father of B. B is sister of C. C is mother of D. A is D\'s ?', options: ['Grandfather', 'Father', 'Uncle', 'Brother'], answer: 0, subject: 'Reasoning' },
  ],
  'English': [
    { id: 'en1', question: 'Correct spelling?', options: ['Accommodation', 'Acommodation', 'Accomodation', 'Acomodation'], answer: 0, subject: 'English' },
    { id: 'en2', question: 'Synonym of "Abundant"?', options: ['Scarce', 'Plentiful', 'Limited', 'Rare'], answer: 1, subject: 'English' },
    { id: 'en3', question: 'Fill: He _____ to school every day.', options: ['go', 'goes', 'going', 'gone'], answer: 1, subject: 'English' },
    { id: 'en4', question: 'Antonym of "Generous"?', options: ['Kind', 'Selfish', 'Helpful', 'Charitable'], answer: 1, subject: 'English' },
    { id: 'en5', question: 'Meaning of "Break the ice"?', options: ['Break something', 'Start a conversation', 'Cold weather', 'Destroy ice'], answer: 1, subject: 'English' },
  ],
};

const SUBJECTS = ['All', 'General Awareness', 'Quantitative Aptitude', 'Reasoning', 'English'];
const CATEGORIES = ['All', 'UPSC', 'SSC', 'Banking', 'Railway', 'Defence'];

export default function MockTestPlatform() {
  const { user } = useAuth();
  const [tests] = useState<Test[]>(SAMPLE_TESTS);
  const [filterCat, setFilterCat] = useState('All');
  const [filterSubj, setFilterSubj] = useState('All');
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const filtered = (tests.length > 0 ? tests : SAMPLE_TESTS).filter(t => {
    if (filterCat !== 'All' && t.category !== filterCat) return false;
    if (filterSubj !== 'All' && t.subject !== filterSubj) return false;
    return true;
  });

  const generateQuestionsForTest = (test: Test): Question[] => {
    if (test.subject === 'General' || test.category === 'SSC' || test.category === 'Banking') {
      const all = [
        ...(SAMPLE_QUESTIONS['General Awareness'] || []),
        ...(SAMPLE_QUESTIONS['Quantitative Aptitude'] || []),
        ...(SAMPLE_QUESTIONS['Reasoning'] || []),
        ...(SAMPLE_QUESTIONS['English'] || []),
      ];
      return all.slice(0, test.totalQuestions);
    }
    return (SAMPLE_QUESTIONS[test.subject] || SAMPLE_QUESTIONS['General Awareness']).slice(0, test.totalQuestions);
  };

  const answersRef = useRef<Record<number, number>>({});
  useEffect(() => { answersRef.current = answers; }, [answers]);
  const timeLeftRef = useRef(0);
useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  const startTest = (test: Test) => {
    const populated = { ...test, questions: generateQuestionsForTest(test) };
    setActiveTest(populated);
    setCurrentQ(0);
    setAnswers({});
    answersRef.current = {};
    setSubmitted(false);
    setResult(null);
    setTimeLeft(populated.duration * 60);
    setTimerActive(true);
  };

  useEffect(() => {
    if (!timerActive || !activeTest) return;
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          setTimerActive(false);
          handleSubmit(answersRef.current, activeTest);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerActive, activeTest]);

  const selectAnswer = (qIndex: number, optIndex: number) => {
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = async (finalAnswers: Record<number, number>, test: Test) => {
    setSubmitted(true);
    setTimerActive(false);

    const questions = test.questions;
    let correct = 0;
    const subjectWise: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q, i) => {
      const sub = q.subject || 'General';
      if (!subjectWise[sub]) subjectWise[sub] = { total: 0, correct: 0 };
      subjectWise[sub].total++;
      if (finalAnswers[i] === q.answer) {
        correct++;
        subjectWise[sub].correct++;
      }
    });

    const totalAnswered = Object.keys(finalAnswers).length;
    const wrong = totalAnswered - correct;
    const notAnswered = questions.length - totalAnswered;

    const score = Math.round((correct / questions.length) * test.totalMarks);

    setResult({
      score,
      total: test.totalMarks,
      correct,
      incorrect: wrong,
      unanswered: notAnswered,
      subjectWise,
      percentage: Math.round((correct / questions.length) * 100),
    });
    
    if (user) {
      try {
        await api.post(`/mock-tests/${test.id}/submit`, { answers: questions.map((_, i) => finalAnswers[i]),timeTaken: test.duration * 60 - timeLeftRef.current });
      } catch {}
    }
  };

  const formatTime = (secs: number) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

  if (activeTest && !submitted) {
    const q = activeTest.questions[currentQ];
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col">
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">{activeTest.title}</p>
            <p className="text-xs text-slate-500">Question {currentQ + 1} of {activeTest.questions.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
              <Clock className="h-3.5 w-3.5 inline mr-1" />{formatTime(timeLeft)}
            </div>
            <button onClick={() => handleSubmit(answers, activeTest)} className="text-xs bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Submit</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{q.subject}</span>
            <h3 className="text-lg font-bold mt-3 mb-6">{q.question}</h3>
            <div className="space-y-3">
              {q.options.map((opt, oi) => (
                <button key={oi} onClick={() => selectAnswer(currentQ, oi)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${answers[currentQ] === oi ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}>
                  <span className="w-7 h-7 rounded-full border-2 inline-flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">{String.fromCharCode(65 + oi)}</span>
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button disabled={currentQ === 0} onClick={() => setCurrentQ(q => q - 1)} className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-30">Previous</button>
              <div className="flex gap-2">{[...Array(activeTest.questions.length)].map((_, i) => (<button key={i} onClick={() => setCurrentQ(i)} className={`w-8 h-8 rounded-lg text-xs font-bold ${answers[i] !== undefined ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'} hover:opacity-80`}>{i + 1}</button>))}</div>
              {currentQ < activeTest.questions.length - 1 ? (
                <button onClick={() => setCurrentQ(q => q + 1)} className="btn-primary text-sm flex items-center gap-1">Next <ChevronRight className="h-4 w-4" /></button>
              ) : (
                <button onClick={() => handleSubmit(answers, activeTest)} className="bg-green-500 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-green-600">Submit Test</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Mock Test Center</h2>
            <p className="text-slate-500 text-sm">Practice with full-length, sectional, and previous year papers</p>
          </div>
        </div>

        {submitted && result && (
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="bg-white dark:bg-slate-800 border-2 border-green-200 dark:border-green-700 rounded-xl p-6 mb-6">
            <div className="text-center mb-6">
              <Award className={`h-16 w-16 mx-auto mb-3 ${result.percentage >= 60 ? 'text-green-500' : result.percentage >= 40 ? 'text-yellow-500' : 'text-red-500'}`} />
              <h3 className="text-2xl font-bold">Your Score: {result.score}/{result.total}</h3>
              <p className="text-lg text-slate-500">{result.percentage}%</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-1" /><p className="text-lg font-bold text-green-600">{result.correct}</p><p className="text-xs text-slate-500">Correct</p></div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl"><XCircle className="h-5 w-5 text-red-500 mx-auto mb-1" /><p className="text-lg font-bold text-red-600">{result.incorrect}</p><p className="text-xs text-slate-500">Incorrect</p></div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl"><AlertTriangle className="h-5 w-5 text-yellow-500 mx-auto mb-1" /><p className="text-lg font-bold text-yellow-600">{result.unanswered}</p><p className="text-xs text-slate-500">Unanswered</p></div>
            </div>
            {result.subjectWise && Object.entries(result.subjectWise).length > 0 && (
              <div className="mb-6">
                <p className="font-bold text-sm mb-3">Subject-wise Performance</p>
                {Object.entries(result.subjectWise).map(([sub, data]: [string, any]) => (
                  <div key={sub} className="mb-2">
                    <div className="flex justify-between text-xs mb-1"><span>{sub}</span><span>{Math.round((data.correct / data.total) * 100)}%</span></div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full"><div className={`h-full rounded-full ${(data.correct / data.total) >= 0.6 ? 'bg-green-500' : (data.correct / data.total) >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${(data.correct / data.total) * 100}%` }}></div></div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => { setSubmitted(false); setActiveTest(null); setResult(null); }} className="btn-primary text-sm mx-auto block">Try Another Test</button>
          </motion.div>
        )}

        <div className="flex gap-2 flex-wrap mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map(c => (<button key={c} onClick={() => setFilterCat(c)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filterCat === c ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>{c}</button>))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap mb-4">
          {SUBJECTS.map(s => (<button key={s} onClick={() => setFilterSubj(s)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filterSubj === s ? 'bg-accent text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>{s}</button>))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((test, i) => (
          <motion.div key={test.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${test.difficulty === 'hard' ? 'bg-red-100 text-red-600' : test.difficulty === 'easy' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{test.difficulty}</span>
              {test.isPreviousYear && <span className="text-[10px] font-bold bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Previous Year</span>}
            </div>
            <h3 className="font-bold text-sm mb-3">{test.title}</h3>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {test.totalQuestions} Q</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {test.duration} min</span>
              <span className="flex items-center gap-1"><BarChart3 className="h-3.5 w-3.5" /> {test.totalMarks} marks</span>
            </div>
            <button onClick={() => startTest(test)} className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5">
              <Play className="h-3.5 w-3.5" /> Start Test
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
