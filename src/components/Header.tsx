import React from 'react';
import { Dumbbell, Activity, Calendar, Utensils, MessageSquare, BarChart2, CheckCircle2, Droplets } from 'lucide-react';
import { DailyProgress, DailyGoals } from '../types';
import { PWAInstallPrompt } from './PWAInstallPrompt';

interface HeaderProps {
  activeTab: 'principles' | 'workout' | 'goals' | 'nutrition' | 'progress' | 'coach';
  setActiveTab: (tab: 'principles' | 'workout' | 'goals' | 'nutrition' | 'progress' | 'coach') => void;
  dailyProgress: DailyProgress;
  dailyGoals: DailyGoals;
  onOpenLiveWorkout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  dailyProgress,
  dailyGoals,
  onOpenLiveWorkout,
}) => {
  const waterPercent = Math.min(100, Math.round((dailyProgress.waterMlCurrent / dailyGoals.waterMlTarget) * 100));
  const proteinCount = Object.values(dailyProgress.proteinMealsCompleted).filter(Boolean).length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('workout')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Dumbbell className="w-6 h-6 sm:w-7 sm:h-7 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-amber-200 bg-clip-text text-transparent">
                  FuerzaEnCasa
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                  5kg + Gomas
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Entrenamiento Personal & Hipertrofia</p>
            </div>
          </div>

          {/* Quick Daily Highlights Widget */}
          <div className="hidden lg:flex items-center space-x-4 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5">
              <Droplets className="w-4 h-4 text-sky-400" />
              <span>{dailyProgress.waterMlCurrent / 1000}L / {dailyGoals.waterMlTarget / 1000}L</span>
              <span className="text-[10px] text-sky-400 font-semibold">({waterPercent}%)</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Proteína: {proteinCount}/{dailyGoals.proteinMealsTarget} comidas</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center space-x-1.5">
              {dailyProgress.workoutDone ? (
                <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completado</span>
                </span>
              ) : (
                <span className="text-amber-400 font-medium">Hoy: 30m Pendiente</span>
              )}
            </div>
          </div>

          {/* Action Buttons: PWA Install + Quick Start */}
          <div className="flex items-center space-x-2.5">
            <PWAInstallPrompt />

            {onOpenLiveWorkout && (
              <button
                onClick={onOpenLiveWorkout}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl shadow-md transition-all transform active:scale-95"
              >
                <Activity className="w-4 h-4 text-slate-950 animate-pulse" />
                <span className="hidden xs:inline sm:inline whitespace-nowrap">Entrenar Ahora</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 py-2 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('workout')}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'workout'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Rutina 30m</span>
          </button>

          <button
            onClick={() => setActiveTab('principles')}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'principles'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Claves de 5kg</span>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'goals'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Metas Diarias</span>
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'nutrition'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Nutrición (3 Reglas)</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'progress'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Progreso</span>
          </button>

          <button
            onClick={() => setActiveTab('coach')}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'coach'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Entrenador AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
