import React from 'react';
import { CheckSquare, Moon, Sun, Plus, Sparkles, Settings, Timer } from 'lucide-react';
import { ViewMode } from '../types/task';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenNewTask: () => void;
  onOpenAiAssistant: () => void;
  onOpenCategories: () => void;
  onOpenPomodoro: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenNewTask,
  onOpenAiAssistant,
  onOpenCategories,
  onOpenPomodoro,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="flex items-center justify-between gap-6 px-6 py-4 bg-[#F8F9FA]/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-30 transition-colors">
      {/* Material 3 Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0 cursor-pointer group" onClick={() => onViewChange('dashboard')}>
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <CheckSquare className="w-5 h-5" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block">
            TaskFlow <span className="text-indigo-600 dark:text-indigo-400">Pro</span>
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block -mt-0.5">
            Material Design 3
          </span>
        </div>
      </div>

      {/* M3 Navigation Segmented Pill Bar */}
      <nav className="hidden lg:flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 shadow-inner">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`px-5 py-2 rounded-full transition-all whitespace-nowrap ${
            currentView === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
              : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Tableau de bord
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={`px-5 py-2 rounded-full transition-all whitespace-nowrap ${
            currentView === 'list'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
              : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Liste des tâches
        </button>
        <button
          onClick={() => onViewChange('kanban')}
          className={`px-5 py-2 rounded-full transition-all whitespace-nowrap ${
            currentView === 'kanban'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
              : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Tableau Kanban
        </button>
        <button
          onClick={() => onViewChange('calendar')}
          className={`px-5 py-2 rounded-full transition-all whitespace-nowrap ${
            currentView === 'calendar'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
              : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Calendrier
        </button>
      </nav>

      {/* Action Buttons & Utilities */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenPomodoro}
          title="Minuteur Pomodoro"
          className="p-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <Timer className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenAiAssistant}
          className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-950/60 hover:bg-purple-200/70 dark:hover:bg-purple-900/60 rounded-full border border-purple-200 dark:border-purple-800 transition-all whitespace-nowrap shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Assistant IA</span>
        </button>

        <button
          onClick={onOpenCategories}
          title="Paramètres des catégories"
          className="p-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleDarkMode}
          title="Changer de thème"
          className="p-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg shadow-indigo-600/30 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle tâche</span>
        </button>
      </div>
    </header>
  );
};
