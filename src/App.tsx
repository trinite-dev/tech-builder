import React, { useState, useEffect } from 'react';
import { Task, Category, ViewMode, Priority, TaskStatus } from './types/task';
import { DEFAULT_CATEGORIES, DEFAULT_TASKS } from './utils/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TaskListView } from './components/TaskListView';
import { KanbanView } from './components/KanbanView';
import { CalendarView } from './components/CalendarView';
import { TaskModal } from './components/TaskModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { PomodoroModal } from './components/PomodoroModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { auth, db, loginWithGoogle, logoutUser, testFirestoreConnection } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [pomodoroTask, setPomodoroTask] = useState<Task | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiSubtasks, setAiSubtasks] = useState<{ title: string; estimatedMinutes?: number }[]>([]);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Data Synchronization
  useEffect(() => {
    if (!user) {
      // Fallback to local storage or defaults when not signed in
      const localTasks = localStorage.getItem('taskflow_tasks_v1');
      setTasks(localTasks ? JSON.parse(localTasks) : DEFAULT_TASKS);
      const localCats = localStorage.getItem('taskflow_categories_v1');
      setCategories(localCats ? JSON.parse(localCats) : DEFAULT_CATEGORIES);
      return;
    }

    // Load Categories from Firestore
    const catsRef = collection(db, 'categories');
    const qCats = query(catsRef, where('userId', '==', user.uid));
    const unsubCats = onSnapshot(qCats, (snapshot) => {
      if (snapshot.empty) {
        // Seed default categories
        DEFAULT_CATEGORIES.forEach(async (cat) => {
          await setDoc(doc(db, 'categories', cat.id), { ...cat, userId: user.uid });
        });
      } else {
        const loadedCats: Category[] = [];
        snapshot.forEach(docSnap => {
          loadedCats.push(docSnap.data() as Category);
        });
        setCategories(loadedCats);
      }
    });

    // Load Tasks from Firestore
    const tasksRef = collection(db, 'tasks');
    const qTasks = query(tasksRef, where('userId', '==', user.uid));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      if (snapshot.empty) {
        // Seed default tasks
        DEFAULT_TASKS.forEach(async (t) => {
          await setDoc(doc(db, 'tasks', t.id), { ...t, userId: user.uid });
        });
      } else {
        const loadedTasks: Task[] = [];
        snapshot.forEach(docSnap => {
          loadedTasks.push(docSnap.data() as Task);
        });
        setTasks(loadedTasks);
      }
    });

    return () => {
      unsubCats();
      unsubTasks();
    };
  }, [user]);

  const handleSaveTaskData = async (taskData: Partial<Task>) => {
    const fullTask: Task = {
      id: taskData.id || 'task-' + Date.now(),
      title: taskData.title || '',
      description: taskData.description,
      categoryId: taskData.categoryId || categories[0]?.id || 'cat-work',
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      subtasks: taskData.subtasks || [],
      tags: taskData.tags || [],
      estimatedPomodoros: taskData.estimatedPomodoros || 2,
      completedPomodoros: taskData.completedPomodoros || 0,
      createdAt: taskData.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (user) {
      try {
        await setDoc(doc(db, 'tasks', fullTask.id), { ...fullTask, userId: user.uid });
      } catch (err) {
        console.error('Erreur sauvegarde Firestore:', err);
      }
    } else {
      const updated = tasks.some(t => t.id === fullTask.id)
        ? tasks.map(t => t.id === fullTask.id ? fullTask : t)
        : [fullTask, ...tasks];
      setTasks(updated);
      localStorage.setItem('taskflow_tasks_v1', JSON.stringify(updated));
    }
    setEditingTask(null);
    setAiSubtasks([]);
  };

  const handleToggleTaskStatus = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newStatus: TaskStatus = task.status === 'completed' ? 'todo' : 'completed';
    const updatedTask = { ...task, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] };

    if (user) {
      await setDoc(doc(db, 'tasks', taskId), { ...updatedTask, userId: user.uid });
    } else {
      const updated = tasks.map(t => t.id === taskId ? updatedTask : t);
      setTasks(updated);
      localStorage.setItem('taskflow_tasks_v1', JSON.stringify(updated));
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const updatedTask = { ...task, status, updatedAt: new Date().toISOString().split('T')[0] };

    if (user) {
      await setDoc(doc(db, 'tasks', taskId), { ...updatedTask, userId: user.uid });
    } else {
      const updated = tasks.map(t => t.id === taskId ? updatedTask : t);
      setTasks(updated);
      localStorage.setItem('taskflow_tasks_v1', JSON.stringify(updated));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      if (user) {
        await deleteDoc(doc(db, 'tasks', taskId));
      } else {
        const updated = tasks.filter(t => t.id !== taskId);
        setTasks(updated);
        localStorage.setItem('taskflow_tasks_v1', JSON.stringify(updated));
      }
    }
  };

  const handleSaveCategories = async (newCats: Category[]) => {
    setCategories(newCats);
    if (user) {
      newCats.forEach(async (c) => {
        await setDoc(doc(db, 'categories', c.id), { ...c, userId: user.uid });
      });
    } else {
      localStorage.setItem('taskflow_categories_v1', JSON.stringify(newCats));
    }
  };

  const handleCompletePomodoro = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const updatedTask = { ...task, completedPomodoros: (task.completedPomodoros || 0) + 1 };
    if (user) {
      await setDoc(doc(db, 'tasks', taskId), { ...updatedTask, userId: user.uid });
    } else {
      const updated = tasks.map(t => t.id === taskId ? updatedTask : t);
      setTasks(updated);
      localStorage.setItem('taskflow_tasks_v1', JSON.stringify(updated));
    }
  };

  const taskCounts = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    urgent: tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors ${darkMode ? 'dark' : ''}`}>
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenNewTask={() => { setEditingTask(null); setAiSubtasks([]); setIsTaskModalOpen(true); }}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onOpenCategories={() => setIsCategoryModalOpen(true)}
        onOpenPomodoro={() => { setPomodoroTask(tasks[0] || null); setIsPomodoroOpen(true); }}
        darkMode={darkMode}
        onToggleDarkMode={() => {
          setDarkMode(!darkMode);
          document.documentElement.classList.toggle('dark');
        }}
      />

      {/* Auth Banner Bar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Base de données Firestore active {user ? `(Connecté en tant que ${user.displayName || user.email})` : '(Mode local — connectez-vous pour synchroniser)'}</span>
        </div>

        <div>
          {user ? (
            <button
              onClick={() => logoutUser()}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Se déconnecter</span>
            </button>
          ) : (
            <button
              onClick={() => loginWithGoogle()}
              className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connexion Google Firestore</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedPriority={selectedPriority}
          onSelectPriority={setSelectedPriority}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          taskCounts={taskCounts}
        />

        <main className="flex-1 min-w-0">
          {currentView === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              categories={categories}
              onNewTask={() => { setEditingTask(null); setAiSubtasks([]); setIsTaskModalOpen(true); }}
              onToggleTaskStatus={handleToggleTaskStatus}
              onOpenAiAssistant={() => setIsAiModalOpen(true)}
              onSelectTaskForPomodoro={(t) => { setPomodoroTask(t); setIsPomodoroOpen(true); }}
            />
          )}

          {currentView === 'list' && (
            <TaskListView
              tasks={tasks}
              categories={categories}
              selectedCategory={selectedCategory}
              selectedPriority={selectedPriority}
              selectedStatus={selectedStatus}
              onToggleTaskStatus={handleToggleTaskStatus}
              onDeleteTask={handleDeleteTask}
              onEditTask={(t) => { setEditingTask(t); setIsTaskModalOpen(true); }}
              onNewTask={() => { setEditingTask(null); setAiSubtasks([]); setIsTaskModalOpen(true); }}
              onSelectTaskForPomodoro={(t) => { setPomodoroTask(t); setIsPomodoroOpen(true); }}
              onOpenAiBreakdown={(t) => {
                setAiSubtasks([]);
                setIsAiModalOpen(true);
              }}
            />
          )}

          {currentView === 'kanban' && (
            <KanbanView
              tasks={tasks}
              categories={categories}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onSelectTaskForPomodoro={(t) => { setPomodoroTask(t); setIsPomodoroOpen(true); }}
              onEditTask={(t) => { setEditingTask(t); setIsTaskModalOpen(true); }}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarView
              tasks={tasks}
              categories={categories}
              onToggleTaskStatus={handleToggleTaskStatus}
              onSelectTaskForPomodoro={(t) => { setPomodoroTask(t); setIsPomodoroOpen(true); }}
              onEditTask={(t) => { setEditingTask(t); setIsTaskModalOpen(true); }}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
        onSaveTask={handleSaveTaskData}
        categories={categories}
        editingTask={editingTask}
        initialAiSubtasks={aiSubtasks}
      />

      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onSaveCategories={handleSaveCategories}
      />

      <PomodoroModal
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
        task={pomodoroTask}
        onCompletePomodoro={handleCompletePomodoro}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplySubtasks={(subs) => {
          setAiSubtasks(subs);
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
      />
    </div>
  );
}
