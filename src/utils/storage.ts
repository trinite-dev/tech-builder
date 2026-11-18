import { Category, Task } from '../types/task';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-work', name: 'Professionnel', color: 'bg-blue-600 text-white', icon: 'Briefcase', description: 'Projets clients et réunions' },
  { id: 'cat-personal', name: 'Personnel', color: 'bg-emerald-600 text-white', icon: 'User', description: 'Vie quotidienne et loisirs' },
  { id: 'cat-studies', name: 'Études & Veille', color: 'bg-purple-600 text-white', icon: 'BookOpen', description: 'Formations et certifications' },
  { id: 'cat-health', name: 'Santé & Sport', color: 'bg-rose-600 text-white', icon: 'Heart', description: 'Entraînements et bien-être' },
  { id: 'cat-finance', name: 'Finances', color: 'bg-amber-600 text-white', icon: 'DollarSign', description: 'Factures et budget' },
];

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 5);

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Refondre l\'architecture de l\'API backend',
    description: 'Migrer vers une structure modulaire avec gestion des erreurs robuste et tests d\'intégration.',
    categoryId: 'cat-work',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: formatDate(today),
    subtasks: [
      { id: 'sub-1', title: 'Audit des routes existantes', completed: true, estimatedMinutes: 45 },
      { id: 'sub-2', title: 'Implémentation des contrôleurs', completed: true, estimatedMinutes: 90 },
      { id: 'sub-3', title: 'Tests unitaires avec Vitest', completed: false, estimatedMinutes: 60 }
    ],
    tags: ['backend', 'architecture', 'refactor'],
    estimatedPomodoros: 4,
    completedPomodoros: 2,
    createdAt: formatDate(today),
    updatedAt: formatDate(today)
  },
  {
    id: 'task-2',
    title: 'Préparer le rapport budgétaire Q3',
    description: 'Consolider les dépenses marketing et les prévisions de revenus pour le comité de direction.',
    categoryId: 'cat-finance',
    priority: 'high',
    status: 'todo',
    dueDate: formatDate(tomorrow),
    subtasks: [
      { id: 'sub-4', title: 'Extraire les exports comptables', completed: false, estimatedMinutes: 30 },
      { id: 'sub-5', title: 'Créer les graphiques comparatifs', completed: false, estimatedMinutes: 60 }
    ],
    tags: ['finance', 'q3', 'budget'],
    estimatedPomodoros: 3,
    completedPomodoros: 0,
    createdAt: formatDate(today),
    updatedAt: formatDate(today)
  },
  {
    id: 'task-3',
    title: 'Entraînement cardio & renforcement',
    description: 'Séance de 45 minutes de course à pied suivie de stretching.',
    categoryId: 'cat-health',
    priority: 'medium',
    status: 'completed',
    dueDate: formatDate(today),
    subtasks: [
      { id: 'sub-6', title: 'Échauffement 10 min', completed: true, estimatedMinutes: 10 },
      { id: 'sub-7', title: 'Course 30 min', completed: true, estimatedMinutes: 30 }
    ],
    tags: ['sport', 'santé'],
    estimatedPomodoros: 2,
    completedPomodoros: 2,
    createdAt: formatDate(today),
    updatedAt: formatDate(today)
  },
  {
    id: 'task-4',
    title: 'Lire le livre "Clean Architecture" (Ch. 5-7)',
    description: 'Approfondir les principes de conception SOLID et la séparation des couches.',
    categoryId: 'cat-studies',
    priority: 'low',
    status: 'todo',
    dueDate: formatDate(nextWeek),
    subtasks: [
      { id: 'sub-8', title: 'Lecture chapitre 5', completed: false, estimatedMinutes: 40 },
      { id: 'sub-9', title: 'Prise de notes synthétiques', completed: false, estimatedMinutes: 20 }
    ],
    tags: ['lecture', 'veille'],
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    createdAt: formatDate(today),
    updatedAt: formatDate(today)
  }
];

const STORAGE_KEY_TASKS = 'taskflow_tasks_v1';
const STORAGE_KEY_CATEGORIES = 'taskflow_categories_v1';

export const loadTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_TASKS);
    return data ? JSON.parse(data) : DEFAULT_TASKS;
  } catch {
    return DEFAULT_TASKS;
  }
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
};

export const loadCategories = (): Category[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: Category[]) => {
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
};
