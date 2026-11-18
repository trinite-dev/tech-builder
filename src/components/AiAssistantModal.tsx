import React, { useState } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { Task } from '../types/task';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTask?: Task | null;
  onApplySubtasks: (subtasks: { title: string; estimatedMinutes?: number }[]) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  targetTask,
  onApplySubtasks,
}) => {
  const [taskTitle, setTaskTitle] = useState(targetTask ? targetTask.title : '');
  const [taskDesc, setTaskDesc] = useState(targetTask ? targetTask.description || '' : '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ subtasks: { title: string; estimatedMinutes?: number }[]; advice?: string } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      setLoading(true);
      const res = await fetch('/api/ai/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle, taskDescription: taskDesc }),
      });
      const data = await res.json();
      if (data.subtasks) {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la génération par l\'IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Assistant IA — Décomposition</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Titre de la tâche complexe *</label>
              <input
                type="text"
                required
                placeholder="Ex: Préparer le lancement de la v2 de l'application"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contexte ou description (optionnel)</label>
              <textarea
                rows={3}
                placeholder="Ajoutez des détails pour affiner la décomposition..."
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Génération par l\'IA...' : 'Générer les sous-tâches'}</span>
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {result.advice && (
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900/50 text-xs text-purple-900 dark:text-purple-200 leading-relaxed">
                <span className="font-bold block mb-1">Conseil d'expert IA :</span>
                {result.advice}
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sous-tâches proposées</h3>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {result.subtasks.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{sub.title}</span>
                    {sub.estimatedMinutes && (
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                        {sub.estimatedMinutes} min
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setResult(null)}
                className="flex-1 py-3 rounded-full text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
              >
                Recommencer
              </button>
              <button
                onClick={() => {
                  onApplySubtasks(result.subtasks);
                  onClose();
                }}
                className="flex-1 py-3 rounded-full text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                <span>Appliquer à la tâche</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
