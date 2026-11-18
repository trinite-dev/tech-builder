import React from 'react';
import { Task, Category, TaskStatus } from '../types/task';
import { Play } from 'lucide-react';

interface KanbanViewProps {
  tasks: Task[];
  categories: Category[];
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onSelectTaskForPomodoro: (task: Task) => void;
  onEditTask: (task: Task) => void;
}

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'À faire', color: 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40' },
  { id: 'in_progress', title: 'En cours', color: 'border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20' },
  { id: 'review', title: 'En révision', color: 'border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20' },
  { id: 'completed', title: 'Terminé', color: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20' },
];

export const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  categories,
  onUpdateTaskStatus,
  onSelectTaskForPomodoro,
  onEditTask,
}) => {
  const getCategory = (catId: string) => categories.find(c => c.id === catId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);
        return (
          <div key={col.id} className={`border ${col.color} rounded-[2.2rem] p-5 flex flex-col min-h-[500px] shadow-sm`}>
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{col.title}</span>
                <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm font-bold">
                  {colTasks.length}
                </span>
              </div>
            </div>

            {/* Tasks list in column */}
            <div className="space-y-3.5 flex-1">
              {colTasks.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                  Aucune tâche
                </div>
              ) : (
                colTasks.map(task => {
                  const cat = getCategory(task.categoryId);
                  return (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-[#1E1E1E] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => onEditTask(task)}
                          className="text-sm font-bold text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 transition-colors"
                        >
                          {task.title}
                        </h4>
                        <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full font-bold shrink-0 ${
                          task.priority === 'urgent' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                          task.priority === 'high' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {cat && (
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${cat.color} shadow-sm`}>
                            {cat.name}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-medium">
                        <span>{task.dueDate}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectTaskForPomodoro(task)}
                            title="Lancer le Pomodoro"
                            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-full"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>

                          <select
                            value={task.status}
                            onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                            className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full px-2.5 py-1 focus:outline-none"
                          >
                            <option value="todo">À faire</option>
                            <option value="in_progress">En cours</option>
                            <option value="review">Révision</option>
                            <option value="completed">Terminé</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
