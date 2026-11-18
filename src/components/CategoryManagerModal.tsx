import React, { useState } from 'react';
import { Category } from '../types/task';
import { X, Plus, Trash2, Folder } from 'lucide-react';

interface CategoryManagerModalProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSaveCategories: (categories: Category[]) => void;
}

const AVAILABLE_COLORS = [
  { label: 'Bleu', class: 'bg-blue-600 text-white' },
  { label: 'Émeraude', class: 'bg-emerald-600 text-white' },
  { label: 'Violet', class: 'bg-purple-600 text-white' },
  { label: 'Rose', class: 'bg-rose-600 text-white' },
  { label: 'Ambre', class: 'bg-amber-600 text-white' },
  { label: 'Indigo', class: 'bg-indigo-600 text-white' },
  { label: 'Cyan', class: 'bg-cyan-600 text-white' },
  { label: 'Gris', class: 'bg-slate-700 text-white' },
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  categories,
  isOpen,
  onClose,
  onSaveCategories,
}) => {
  const [list, setList] = useState<Category[]>(categories);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(AVAILABLE_COLORS[0].class);
  const [newDesc, setNewDesc] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: newName.trim(),
      color: newColor,
      icon: 'Folder',
      description: newDesc.trim() || undefined,
    };

    const updated = [...list, newCat];
    setList(updated);
    onSaveCategories(updated);
    setNewName('');
    setNewDesc('');
  };

  const handleDelete = (id: string) => {
    if (list.length <= 1) {
      alert('Vous devez conserver au moins une catégorie.');
      return;
    }
    const updated = list.filter(c => c.id !== id);
    setList(updated);
    onSaveCategories(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Gestion des Catégories
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Categories */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {list.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.color} shadow-sm`}>
                  <Folder className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</h4>
                  {cat.description && <p className="text-xs text-slate-400">{cat.description}</p>}
                </div>
              </div>

              <button
                onClick={() => handleDelete(cat.id)}
                className="p-2.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleAdd} className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Créer une nouvelle catégorie</h3>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nom de la catégorie (ex: Marketing)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="text"
              placeholder="Description courte (optionnel)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Couleur d'affichage</label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {AVAILABLE_COLORS.map(c => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setNewColor(c.class)}
                    className={`w-9 h-9 rounded-xl ${c.class} flex items-center justify-center transition-transform shadow-sm ${newColor === c.class ? 'ring-4 ring-offset-2 ring-indigo-600 scale-110' : 'opacity-85 hover:opacity-100'}`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter la catégorie</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
