import React from 'react';
import { Task, Category } from '../types/task';
import { Calendar as CalendarIcon, CheckCircle2, Play } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  categories: Category[];
  onToggleTaskStatus: (taskId: string) => void;
  onSelectTaskForPomodoro: (task: Task) => void;
  onEditTask: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  categories,
  onToggleTaskStatus,
  onSelectTaskForPomodoro,
  onEditTask,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().split('T')[0];

  const getCategory = (catId: string) => categories.find(c => c.id === catId);

  const overdue = tasks.filter(t => t.dueDate < todayStr && t.status !== 'completed');
  const today = tasks.filter(t => t.dueDate === todayStr);
  const tomorrow = tasks.filter(t => t.dueDate === tomorrowStr);
  const upcoming = tasks.filter(t => t.dueDate > tomorrowStr);

  const renderSection = (title: string, list: Task[], badgeColor: string) => {
    if (list.length === 0) return null;
    return (
      <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200/80 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <span>{title}</span>
          </h3>
          <span className={`text-xs font-mono px-3.5 py-1 rounded-full font-bold ${badgeColor}`}>
            {list.length}
          </span>
        </div>

        <div className="space-y-3">
          {list.map(task => {
            const cat = getCategory(task.categoryId);
            return (
              <div key={task.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${
                      task.status === 'completed'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-600'
                    }`}
                  >
                    {task.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0">
                    <h4
                      onClick={() => onEditTask(task)}
                      className={`text-sm font-bold cursor-pointer truncate ${task.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
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

                  <button
                    onClick={() => onSelectTaskForPomodoro(task)}
                    title="Lancer le minuteur Pomodoro"
                    className="p-2.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-full transition-colors"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {overdue.length > 0 && renderSection('En retard', overdue, 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300')}
      {renderSection("Aujourd'hui", today, 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300')}
      {renderSection('Demain', tomorrow, 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300')}
      {renderSection('Plus tard', upcoming, 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300')}

      {overdue.length === 0 && today.length === 0 && tomorrow.length === 0 && upcoming.length === 0 && (
        <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200/80 dark:border-slate-800 rounded-[2.5rem] p-16 text-center space-y-3">
          <CalendarIcon className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Aucune tâche planifiée</h3>
          <p className="text-xs text-slate-400">Ajoutez des dates d'échéance à vos tâches pour les retrouver ici.</p>
        </div>
      )}
    </div>
  );
};
