"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Moon, Sun, Bell, ChevronDown, LogOut, User, Zap, BookOpen, LayoutDashboard, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    const dm = localStorage.getItem('darkMode') === 'true';
    setDarkMode(dm);
    if (dm) document.documentElement.classList.add('dark');
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDark = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-lg group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
              <Zap className="h-6 w-6 text-white fill-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">
              <span className="text-primary">GovJob</span>
              <span className="text-slate-700 dark:text-slate-300"> India AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/job-explorer" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Jobs</Link>
            <Link href="/study-planner" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Study Planner</Link>
            <Link href="/mock-tests" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Mock Tests</Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/notes" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Notes</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-600" />}
            </button>

            {user ? (
              <>
                <div className="relative">
                  <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                    <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 max-h-96 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-bold">Notifications</p>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-slate-500">No new notifications</div>
                      ) : notifications.map((n: any, i: number) => (
                        <div key={i} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-slate-500">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1.5 pl-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700">
                    <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">{user.name?.[0] || 'U'}</div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">{user.name?.split(' ')[0]}</span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"><LogOut className="h-4 w-4" /> Sign Out</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 px-3 py-2 hover:text-primary">Sign in</Link>
                <Link href="/signup" className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Get Started</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-4 space-y-2">
            <Link href="/job-explorer" className="block px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800">Job Explorer</Link>
            <Link href="/study-planner" className="block px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800">Study Planner</Link>
            <Link href="/mock-tests" className="block px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800">Mock Tests</Link>
            <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800">Dashboard</Link>
            <Link href="/notes" className="block px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800">Notes</Link>
          </div>
        )}
      </div>
    </header>
  );
}
