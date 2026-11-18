import React, { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { X, Play, Pause, RotateCcw, Timer } from 'lucide-react';

interface PomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onCompletePomodoro: (taskId: string) => void;
}

export const PomodoroModal: React.FC<PomodoroModalProps> = ({
  isOpen,
  onClose,
  task,
  onCompletePomodoro,
}) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'work' && task) {
        onCompletePomodoro(task.id);
        alert('Session Pomodoro terminée ! Bravo pour votre concentration.');
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, task, onCompletePomodoro]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSwitchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Timer className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Minuteur Pomodoro</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {task && (
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 text-left">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">Tâche active</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{task.title}</h4>
          </div>
        )}

        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleSwitchMode('work')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${mode === 'work' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            Travail (25m)
          </button>
          <button
            onClick={() => handleSwitchMode('break')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${mode === 'break' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            Pause (5m)
          </button>
        </div>

        {/* Timer Display */}
        <div className="py-6">
          <div className="text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {formatTime(timeLeft)}
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            {mode === 'work' ? 'Restez concentré sur votre objectif' : 'Prenez une pause bien méritée'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-full text-sm font-bold text-white shadow-xl transition-all flex items-center gap-2 ${
              isRunning ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isRunning ? 'Pause' : 'Démarrer'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
