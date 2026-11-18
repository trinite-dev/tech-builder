import React from 'react';
import { Category, Priority, TaskStatus } from '../types/task';
import { Briefcase, User, BookOpen, Heart, DollarSign, Folder, CheckCircle, Clock, AlertCircle, Layers } from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  selectedPriority: Priority | null;
  onSelectPriority: (priority: Priority | null) => void;
  selectedStatus: TaskStatus | null;
  onSelectStatus: (status: TaskStatus | null) => void;
  taskCounts: {
    total: number;
    completed: number;
    urgent: number;
    inProgress: number;
  };
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Briefcase': return <Briefcase className="w-4 h-4" />;
    case 'User': return <User className="w-4 h-4" />;
    case 'BookOpen': return <BookOpen className="w-4 h-4" />;
    case 'Heart': return <Heart className="w-4 h-4" />;
    case 'DollarSign': return <DollarSign className="w-4 h-4" />;
    default: return <Folder className="w-4 h-4" />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedPriority,
  onSelectPriority,
  selectedStatus,
  onSelectStatus,
  taskCounts,
}) => {
  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Quick Filters M3 Surface Card */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 px-3">
          Filtres rapides
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => { onSelectCategory(null); onSelectPriority(null); onSelectStatus(null); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
              selectedCategory === null && selectedPriority === null && selectedStatus === null
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Toutes les tâches</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              {taskCounts.total}
            </span>
          </button>

          <button
            onClick={() => onSelectStatus('completed')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
              selectedStatus === 'completed'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Terminées</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              {taskCounts.completed}
            </span>
          </button>

          <button
            onClick={() => onSelectStatus('in_progress')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
              selectedStatus === 'in_progress'
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>En cours</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              {taskCounts.inProgress}
            </span>
          </button>

          <button
            onClick={() => onSelectPriority('urgent')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
              selectedPriority === 'urgent'
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Urgentes</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              {taskCounts.urgent}
            </span>
          </button>
        </div>
      </div>

      {/* Categories M3 Surface Card */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3 px-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Catégories
          </h3>
        </div>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cat.color} shadow-sm`}>
                  {getCategoryIcon(cat.icon)}
                </div>
                <span className="truncate">{cat.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
