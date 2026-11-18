import React, { useState, useEffect } from 'react';
import { Task, Category, Priority, TaskStatus, Subtask } from '../types/task';
import { X, Plus, Trash2 } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (taskData: Partial<Task>) => void;
  categories: Category[];
  editingTask?: Task | null;
  initialAiSubtasks?: { title: string; estimatedMinutes?: number }[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  categories,
  editingTask,
  initialAiSubtasks,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setCategoryId(editingTask.categoryId);
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
      setDueDate(editingTask.dueDate);
      setSubtasks(editingTask.subtasks);
      setTagsInput(editingTask.tags.join(', '));
    } else {
      setTitle('');
      setDescription('');
      setCategoryId(categories[0]?.id || '');
      setPriority('medium');
      setStatus('todo');
      setDueDate(new Date().toISOString().split('T')[0]);
      if (initialAiSubtasks && initialAiSubtasks.length > 0) {
        setSubtasks(initialAiSubtasks.map((s, i) => ({
          id: 'sub-' + Date.now() + '-' + i,
          title: s.title,
          completed: false,
          estimatedMinutes: s.estimatedMinutes || 30,
        })));
      } else {
        setSubtasks([]);
      }
      setTagsInput('');
    }
  }, [editingTask, initialAiSubtasks, isOpen, categories]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub: Subtask = {
      id: 'sub-' + Date.now(),
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onSaveTask({
      id: editingTask ? editingTask.id : 'task-' + Date.now(),
      title: title.trim(),
      description: description.trim() || undefined,
      categoryId,
      priority,
      status,
      dueDate,
      subtasks,
      tags,
      estimatedPomodoros: Math.max(1, Math.ceil(subtasks.length * 1.5)),
      completedPomodoros: editingTask ? editingTask.completedPomodoros : 0,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] max-w-xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Titre de la tâche *</label>
            <input
              type="text"
              required
              placeholder="Ex: Rédiger le rapport marketing Q3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description détaillée</label>
            <textarea
              rows={3}
              placeholder="Détails, objectifs et consignes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catégorie</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="todo">À faire</option>
                <option value="in_progress">En cours</option>
                <option value="review">En révision</option>
                <option value="completed">Terminé</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date d'échéance</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Subtasks Checklist */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sous-tâches et étapes</label>
            <div className="space-y-2">
              {subtasks.map((sub, idx) => (
                <div key={sub.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={(e) => {
                        const updated = [...subtasks];
                        updated[idx].completed = e.target.checked;
                        setSubtasks(updated);
                      }}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={`text-sm font-medium ${sub.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {sub.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(sub.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-full"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ajouter une sous-tâche..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                  className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-full text-xs font-bold"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tags (séparés par des virgules)</label>
            <input
              type="text"
              placeholder="ex: urgent, backend, finance"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-7 py-3 rounded-full text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
