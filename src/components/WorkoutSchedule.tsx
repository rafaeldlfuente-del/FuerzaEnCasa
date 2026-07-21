import React from 'react';
import { WEEKLY_WORKOUT_SCHEDULE } from '../data/workouts';
import { DailyWorkout, DailyProgress } from '../types';
import { Play, CheckCircle2, Clock, Flame, Dumbbell, Shield, ChevronRight, Sparkles, RefreshCw } from 'lucide-react';

interface WorkoutScheduleProps {
  selectedDayId: string;
  setSelectedDayId: (dayId: string) => void;
  onStartLiveWorkout: (workout: DailyWorkout) => void;
  dailyProgress: DailyProgress;
}

export const WorkoutSchedule: React.FC<WorkoutScheduleProps> = ({
  selectedDayId,
  setSelectedDayId,
  onStartLiveWorkout,
  dailyProgress,
}) => {
  const currentWorkout = WEEKLY_WORKOUT_SCHEDULE.find((w) => w.id === selectedDayId) || WEEKLY_WORKOUT_SCHEDULE[0];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Week Day Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-lg">
        <div className="flex space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar">
          {WEEKLY_WORKOUT_SCHEDULE.map((day) => {
            const isSelected = day.id === selectedDayId;
            const isTodayDone = day.id === dailyProgress.date && dailyProgress.workoutDone;

            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayId(day.id)}
                className={`flex-1 min-w-[85px] sm:min-w-[110px] py-2.5 px-3 rounded-xl transition-all flex flex-col items-center justify-between border text-center ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/20 to-amber-500/5 border-amber-500/40 text-amber-300 shadow-md scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-bold uppercase tracking-wider">{day.dayName}</span>
                  {isTodayDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <span className="text-[10px] font-medium text-slate-400 truncate w-full mt-0.5">
                  {day.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Routine Overview Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full">
                🗓️ {currentWorkout.dayName} • {currentWorkout.category}
              </span>
              <span className="flex items-center space-x-1 text-slate-400 text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentWorkout.estimatedMinutes} min de sesión</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              {currentWorkout.title}
            </h2>

            <div className="flex flex-wrap gap-2 text-xs text-slate-300 pt-1">
              <span className="text-slate-400 font-medium">Músculos clave:</span>
              {currentWorkout.focusMuscles.map((muscle, idx) => (
                <span key={idx} className="bg-slate-800 border border-slate-700/80 px-2.5 py-0.5 rounded-md font-medium text-amber-300/90">
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Start Action Button */}
          {!currentWorkout.isRestDay ? (
            <button
              onClick={() => onStartLiveWorkout(currentWorkout)}
              className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/10 transition-all transform active:scale-95 shrink-0"
            >
              <Play className="w-5 h-5 fill-slate-950 stroke-none group-hover:scale-110 transition-transform" />
              <span>Iniciar Entrenamiento de 30 Minutos</span>
              <ChevronRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-3 text-xs text-slate-300 max-w-xs">
              <span className="font-bold text-amber-400 block mb-0.5">🗓️ Día de Descanso Activo</span>
              <span>El músculo crece durante el sueño y la recuperación. Sal a pasear o estira suavemente.</span>
            </div>
          )}
        </div>
      </div>

      {/* Routine Content: Supersets vs Rest Day Suggestions */}
      {!currentWorkout.isRestDay ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Parejas de Ejercicios (Superseries de 3 Rondas)</span>
            </h3>
            <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              ⏱️ 1 min de descanso entre rondas
            </span>
          </div>

          {currentWorkout.supersets.map((superset, index) => (
            <div key={superset.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md hover:border-slate-700 transition-all">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-bold text-xs flex items-center justify-center">
                    #{index + 1}
                  </span>
                  <h4 className="font-bold text-slate-100 text-sm sm:text-base">{superset.name}</h4>
                </div>
                <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  {superset.targetRounds} Rondas
                </span>
              </div>

              {/* Pair Exercises Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Exercise A */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                      Ejercicio A
                    </span>
                    <span className="text-xs font-mono text-slate-400">{superset.exerciseA.equipment}</span>
                  </div>
                  <h5 className="font-extrabold text-slate-100 text-base">{superset.exerciseA.name}</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">{superset.exerciseA.description}</p>
                  
                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs">
                    <div className="flex justify-between text-amber-300 font-medium">
                      <span>⏱️ Tempo Excéntrico:</span>
                      <span className="font-mono">{superset.exerciseA.tempo}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>🎯 Objetivo:</span>
                      <span className="font-bold text-slate-100">{superset.exerciseA.targetReps}</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 font-sans mt-2">
                    <strong className="text-amber-400 font-semibold">💡 Consejo de técnica: </strong>
                    {superset.exerciseA.keyTip}
                  </div>
                </div>

                {/* Exercise B */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                      Ejercicio B (Seguido)
                    </span>
                    <span className="text-xs font-mono text-slate-400">{superset.exerciseB.equipment}</span>
                  </div>
                  <h5 className="font-extrabold text-slate-100 text-base">{superset.exerciseB.name}</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">{superset.exerciseB.description}</p>
                  
                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs">
                    <div className="flex justify-between text-orange-300 font-medium">
                      <span>⏱️ Tempo Excéntrico:</span>
                      <span className="font-mono">{superset.exerciseB.tempo}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>🎯 Objetivo:</span>
                      <span className="font-bold text-slate-100">{superset.exerciseB.targetReps}</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 font-sans mt-2">
                    <strong className="text-orange-400 font-semibold">💡 Consejo de técnica: </strong>
                    {superset.exerciseB.keyTip}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Rest Day Cards */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-emerald-400" />
            <span>Pautas para tu Descanso Activo</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentWorkout.restDaySuggestions?.map((item, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-xs text-slate-300 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
