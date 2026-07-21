import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HypertrophyPrinciples } from './components/HypertrophyPrinciples';
import { WorkoutSchedule } from './components/WorkoutSchedule';
import { LiveWorkoutPlayer } from './components/LiveWorkoutPlayer';
import { DailyGoalsTracker } from './components/DailyGoalsTracker';
import { NutritionGuide } from './components/NutritionGuide';
import { ProgressDashboard } from './components/ProgressDashboard';
import { AICoachChat } from './components/AICoachChat';

import { DailyGoals, DailyProgress, DailyWorkout } from './types';
import {
  loadDailyGoals,
  saveDailyGoals,
  loadDailyProgress,
  saveDailyProgress,
  getTodayDateString,
  getDayOfWeekId,
} from './lib/storage';
import { WEEKLY_WORKOUT_SCHEDULE } from './data/workouts';
import { Dumbbell, ShieldCheck, HeartPulse } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'principles' | 'workout' | 'goals' | 'nutrition' | 'progress' | 'coach'>('workout');
  const [selectedDayId, setSelectedDayId] = useState<string>(getDayOfWeekId());

  // Goals & Progress state
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>(loadDailyGoals());
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>(loadDailyProgress(getTodayDateString()));

  // Active Live Workout Player Modal
  const [activeLiveWorkout, setActiveLiveWorkout] = useState<DailyWorkout | null>(null);

  // Sync Goals
  const handleUpdateGoals = (newGoals: DailyGoals) => {
    setDailyGoals(newGoals);
    saveDailyGoals(newGoals);
  };

  // Sync Progress
  const handleUpdateProgress = (newProgress: DailyProgress) => {
    setDailyProgress(newProgress);
    saveDailyProgress(newProgress);
  };

  // Trigger Live Workout
  const handleStartWorkout = (workout?: DailyWorkout) => {
    const target = workout || WEEKLY_WORKOUT_SCHEDULE.find((w) => w.id === selectedDayId) || WEEKLY_WORKOUT_SCHEDULE[0];
    if (target.isRestDay) return;
    setActiveLiveWorkout(target);
  };

  // When live workout finishes
  const handleWorkoutFinished = () => {
    const updated = loadDailyProgress(getTodayDateString());
    setDailyProgress(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dailyProgress={dailyProgress}
        dailyGoals={dailyGoals}
        onOpenLiveWorkout={() => handleStartWorkout()}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'workout' && (
          <WorkoutSchedule
            selectedDayId={selectedDayId}
            setSelectedDayId={setSelectedDayId}
            onStartLiveWorkout={handleStartWorkout}
            dailyProgress={dailyProgress}
          />
        )}

        {activeTab === 'principles' && <HypertrophyPrinciples />}

        {activeTab === 'goals' && (
          <DailyGoalsTracker
            dailyGoals={dailyGoals}
            dailyProgress={dailyProgress}
            onUpdateGoals={handleUpdateGoals}
            onUpdateProgress={handleUpdateProgress}
          />
        )}

        {activeTab === 'nutrition' && <NutritionGuide />}

        {activeTab === 'progress' && <ProgressDashboard />}

        {activeTab === 'coach' && (
          <AICoachChat
            dailyProgress={dailyProgress}
            dailyGoals={dailyGoals}
            selectedDayId={selectedDayId}
          />
        )}
      </main>

      {/* Live Interactive Workout Player Modal */}
      {activeLiveWorkout && (
        <LiveWorkoutPlayer
          workout={activeLiveWorkout}
          onClose={() => setActiveLiveWorkout(null)}
          onWorkoutFinished={handleWorkoutFinished}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 text-slate-500 py-6 text-center text-xs space-y-2">
        <div className="flex items-center justify-center space-x-2 text-slate-400">
          <Dumbbell className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-300">FuerzaEnCasa • Entrenamiento Personal de Hipertrofia</span>
        </div>
        <p>Mancuernas de 5kg + Gomas Elásticas + Espaldera de Pared • 30 minutos al día</p>
      </footer>

    </div>
  );
}
