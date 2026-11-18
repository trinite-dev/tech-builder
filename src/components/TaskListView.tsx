import React, { useState } from 'react';
import { Task, Category, Priority, TaskStatus } from '../types/task';
import { Search, Plus, Trash2, Edit, CheckCircle2, Play, Sparkles } from 'lucide-react';

interface TaskListViewProps {
  tasks: Task[];
  categories: Category[];
  selectedCategory: string | null;
  selectedPriority: Priority | null;
  selectedStatus: TaskStatus | null;
  onToggleTaskStatus: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onNewTask: () => void;
  onSelectTaskForPomodoro: (task: Task) => void;
  onOpenAiBreakdown: (task: Task) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  categories,
  selectedCategory,
  selectedPriority,
  selectedStatus,
  onToggleTaskStatus,
  onDeleteTask,
  onEditTask,
  onNewTask,
  onSelectTaskForPomodoro,
  onOpenAiBreakdown,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('');

  const getCategory = (catId: string) => categories.find(c => c.id === catId);

  const filteredTasks = tasks.filter(task => {
    if (selectedCategory && task.categoryId !== selectedCategory) return false;
    if (selectedPriority && task.priority !== selectedPriority) return false;
    if (selectedStatus && task.status !== selectedStatus) return false;

    if (filterPriority && task.priority !== filterPriority) return false;
    if (filterStatus && task.status !== filterStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q) || false;
      const matchTags = task.tags.some(tag => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }

    return true;
  });

  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200/80 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une tâche par titre, mot-clé ou tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | '')}
            className="px-4 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Toutes priorités</option>
            <option value="urgent">Urgent</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TaskStatus | '')}
            className="px-4 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tous statuts</option>
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="review">En révision</option>
            <option value="completed">Terminé</option>
          </select>

          <button
            onClick={onNewTask}
            className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md shadow-indigo-600/30 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>

      {/* Task List Table */}
      {filteredTasks.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-bold">Aucune tâche trouvée</p>
          <p className="text-xs text-slate-400">Modifiez vos critères de recherche ou créez une nouvelle tâche.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTasks.map(task => {
            const cat = getCategory(task.categoryId);
            const completedSubtasks = task.subtasks.filter(s => s.completed).length;
            return (
              <div key={task.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-4 rounded-2xl transition-all">
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <button
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 mt-0.5 sm:mt-0 ${
                      task.status === 'completed'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-600'
                    }`}
                  >
                    {task.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className={`text-sm font-bold ${task.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                        {task.title}
                      </h4>
                      {cat && (
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${cat.color} shadow-sm`}>
                          {cat.name}
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span>Échéance : {task.dueDate}</span>
                      {task.subtasks.length > 0 && (
                        <>
                          <span>·</span>
                          <span>Sous-tâches : {completedSubtasks}/{task.subtasks.length}</span>
                        </>
                      )}
                      {task.tags.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="font-mono">#{task.tags.join(', #')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
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

                  <button
                    onClick={() => onOpenAiBreakdown(task)}
                    title="Décomposer avec l'IA"
                    className="p-2.5 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 rounded-full transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onEditTask(task)}
                    title="Modifier"
                    className="p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    title="Supprimer"
                    className="p-2.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
