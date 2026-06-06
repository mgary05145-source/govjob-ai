"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Loader2, User, Sparkles, BookOpen, Lightbulb, GraduationCap, Brain, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_ACTIONS = [
  { icon: 'BookOpen', label: 'Study Plan', query: 'Create a 6-month study plan for SSC CGL 2026' },
  { icon: 'Lightbulb', label: 'Exam Tips', query: 'Give me tips for UPSC prelims preparation' },
  { icon: 'GraduationCap', label: 'Career Advice', query: 'Which government exam should I take after graduation?' },
  { icon: 'Brain', label: 'Motivation', query: 'I am feeling demotivated. Motivate me to study!' },
];

const actionIcons: Record<string, React.ElementType> = { BookOpen, Lightbulb, GraduationCap, Brain };

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: "👋 **Namaste! I'm GovJob Guru, your AI mentor!**\n\nI can help you with:\n- 📚 Study strategies & exam tips\n- 📝 Subject-specific guidance\n- 🎯 Career recommendations\n- 💪 Motivation & study techniques\n\n**What would you like help with today?**"
};

export default function AiCoach() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await api.post('/ai/ask', { query: text });
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer || 'I am here to help you with your exam preparation!' }]);
    } catch {
      const fallbackResponses: Record<string, string> = {
        'study plan': "**Study Plan Recommendation:**\n\n- **Foundation Phase (Months 1-2):** NCERTs + Basic textbooks\n- **Intensive Phase (Months 3-4):** Subject-wise deep dive\n- **Practice Phase (Months 5):** Mock tests + previous year papers\n- **Revision Phase (Last month):** Quick revisions + weak area focus\n\nStudy 6-8 hours daily with proper breaks!",
        'syllabus': "**Syllabus Coverage Strategy:**\n\n1. Start with high-weightage topics\n2. Use NCERTs as foundation\n3. Make concise notes for revision\n4. Solve PYQs topic-wise\n5. Revise regularly (weekly) 🎯",
        'motivat': "**Stay Motivated!** 🌟\n\nRemember: Every hour of study brings you closer to your dream government job!\n- You have the power to change your life\n- Consistency beats intensity\n- Take breaks, stay healthy, keep going!\n\n**Believe in yourself!** 💪",
        'default': "Great question! Here are some key points:\n\n- **Consistency is key** - Study 4-5 hours daily\n- **Revision matters** - Spend 20% time revising\n- **Practice tests** - Take at least 1 weekly\n- **Current Affairs** - Read newspaper 30 mins daily\n\nNeed more specific help? Ask about any exam, subject, or strategy!",
      };

      const q = text.toLowerCase();
      let answer = fallbackResponses.default;
      for (const [key, value] of Object.entries(fallbackResponses)) {
        if (q.includes(key)) { answer = value; break; }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:bg-primary-dark transition-all hover:scale-105"
      >
        {isOpen ? <MessageSquare className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-white" />}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="bg-primary p-4 text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-sm">GovJob Guru</p>
              <p className="text-xs text-blue-100">AI Study Coach</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-xl p-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}>
                  <div className="prose prose-sm dark:prose-invert max-w-none [&_strong]:font-bold">
                    {msg.content.split('\n').map((line, j) => (
                      <p key={j} className="mb-1 last:mb-0">{line}</p>
                    ))}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-slate-400 mb-2 text-center">Quick actions</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(action.query)}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs transition-all"
                  >
                    {React.createElement(actionIcons[action.icon as keyof typeof actionIcons] || 'div', { className: 'h-3.5 w-3.5 text-primary flex-shrink-0' })}
                    <span className="text-left leading-tight">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="px-4 py-2 flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> GovJob Guru is thinking...
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask GovJob Guru anything..."
                className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-primary transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white disabled:opacity-50 hover:bg-primary-dark transition-all"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </>
  );
}
