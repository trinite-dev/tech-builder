import React, { useState } from 'react';
import { Task, Category } from '../types/task';
import { CheckCircle2, Clock, AlertTriangle, Sparkles, Plus, ArrowRight, Play, CheckCircle } from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
  categories: Category[];
  onNewTask: () => void;
  onToggleTaskStatus: (taskId: string) => void;
  onOpenAiAssistant: () => void;
  onSelectTaskForPomodoro: (task: Task) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  categories,
  onNewTask,
  onToggleTaskStatus,
  onOpenAiAssistant,
  onSelectTaskForPomodoro,
}) => {
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const urgentCount = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const dueTodayTasks = tasks.filter(t => t.dueDate === todayStr && t.status !== 'completed');
  const recentTasks = tasks.slice(0, 5);

  const handleGetAiAdvice = async () => {
    try {
      setLoadingAi(true);
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasksSummary: tasks.map(t => ({ title: t.title, priority: t.priority, status: t.status, dueDate: t.dueDate }))
        })
      });
      const data = await res.json();
      if (data.advice) {
        setAiAdvice(data.advice);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const getCategory = (catId: string) => categories.find(c => c.id === catId);

  return (
    <div className="space-y-8">
      {/* M3 Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[2.55rem] p-8 md:p-10 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-4 py-1.5 rounded-full bg-white/25 text-xs font-bold tracking-wide uppercase backdrop-blur-md">
              Tableau de bord Material You
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Gérez vos tâches avec efficacité et style
          </h1>
          <p className="text-indigo-100 text-base mb-6 leading-relaxed">
            {completedCount} sur {tasks.length} tâches accomplies ({completionRate}%). Organisez vos priorités et activez l'assistant IA pour optimiser votre journée.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNewTask}
              className="px-6 py-3 rounded-full bg-white text-indigo-950 font-bold text-sm hover:bg-indigo-50 shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une tâche</span>
            </button>

            <button
              onClick={handleGetAiAdvice}
              disabled={loadingAi}
              className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-md border border-white/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>{loadingAi ? 'Analyse...' : 'Conseil IA du jour'}</span>
            </button>
          </div>
        </div>

        {aiAdvice && (
          <div className="mt-6 p-5 rounded-3xl bg-black/25 backdrop-blur-md border border-white/20 text-sm text-indigo-50 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>Coaching de l'Assistant IA :</span>
            </div>
            <p className="whitespace-pre-line leading-relaxed">{aiAdvice}</p>
          </div>
        )}
      </div>

      {/* M3 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Tâches</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mb-1">
            {tasks.length}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {completedCount} terminées ({completionRate}%)
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">En Cours</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mb-1">
            {inProgressCount}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            En cours de réalisation
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Urgentes</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mb-1">
            {urgentCount}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Nécessitent une action rapide
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Échéance du Jour</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mb-1">
            {dueTodayTasks.length}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            À finaliser aujourd'hui
          </div>
        </div>
      </div>

      {/* Content Split: Due Today & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Due Today Column */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Échéances du jour
            </h3>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
              {dueTodayTasks.length}
            </span>
          </div>

          {dueTodayTasks.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              Aucune tâche urgente pour aujourd'hui.
            </div>
          ) : (
            <div className="space-y-3">
              {dueTodayTasks.map(task => {
                const cat = getCategory(task.categoryId);
                return (
                  <div key={task.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        onClick={() => onToggleTaskStatus(task.id)}
                        className="w-5 h-5 rounded-lg border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-indigo-600 transition-colors shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {task.title}
                        </h4>
                        {cat && (
                          <span className="text-xs text-slate-500 truncate block">
                            {cat.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectTaskForPomodoro(task)}
                      title="Lancer le minuteur Pomodoro"
                      className="p-2.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition-colors shrink-0"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Tasks Column */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tâches récentes
            </h3>
            <button
              onClick={onOpenAiAssistant}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>Décomposer avec l'IA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTasks.map(task => {
              const cat = getCategory(task.categoryId);
              return (
                <div key={task.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => onToggleTaskStatus(task.id)}
                      className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${
                        task.status === 'completed'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-600'
                      }`}
                    >
                      {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div className="min-w-0">
                      <h4 className={`text-sm font-bold truncate ${task.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        {cat && <span>{cat.name}</span>}
                        <span>·</span>
                        <span>Échéance: {task.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                      task.priority === 'urgent' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                      task.priority === 'high' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
