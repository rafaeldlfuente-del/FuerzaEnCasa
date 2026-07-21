import React, { useState, useEffect } from 'react';
import { WorkoutLog } from '../types';
import { loadWorkoutLogs } from '../lib/storage';
import { BarChart2, Calendar, Award, Flame, Star, Clock, CheckCircle2, Dumbbell, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export const ProgressDashboard: React.FC = () => {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    setLogs(loadWorkoutLogs());
  }, []);

  const totalWorkouts = logs.length;
  const totalRounds = logs.reduce((acc, curr) => acc + (curr.completedRoundsTotal || 0), 0);
  const totalMinutes = Math.round(logs.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0) / 60);

  const avgTempo = logs.length
    ? (logs.reduce((acc, curr) => acc + curr.tempoAdherenceRating, 0) / logs.length).toFixed(1)
    : '5.0';

  const formatSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-semibold mb-2">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Seguimiento en Tiempo Real</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100">Progreso de Entrenamientos</h2>
          <p className="text-xs text-slate-400 mt-1">
            Historial de sesiones de 30 minutos realizadas, rondas completadas y adherencia al tempo excéntrico.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold text-slate-400">Sesiones Realizadas</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-100 font-mono">{totalWorkouts}</span>
          <span className="text-[11px] text-slate-400 block">Días completados</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-orange-400">
            <span className="text-xs font-bold text-slate-400">Rondas Superseries</span>
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-100 font-mono">{totalRounds}</span>
          <span className="text-[11px] text-slate-400 block">Rondas finalizadas</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-sky-400">
            <span className="text-xs font-bold text-slate-400">Minutos Totales</span>
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-100 font-mono">{totalMinutes}m</span>
          <span className="text-[11px] text-slate-400 block">Tiempo de trabajo</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-yellow-400">
            <span className="text-xs font-bold text-slate-400">Ritmo Tempo (3s)</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-100 font-mono">{avgTempo} / 5</span>
          <span className="text-[11px] text-slate-400 block">Adherencia al ritmo</span>
        </div>

      </div>

      {/* History Log List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="font-extrabold text-slate-100 text-base flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          <span>Historial de Sesiones Registradas</span>
        </h3>

        {logs.length === 0 ? (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs space-y-2">
            <Dumbbell className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-300">Aún no has registrado ningún entrenamiento.</p>
            <p>Inicia tu sesión de 30 minutos desde la pestaña "Rutina 30m" para comenzar a guardar tu progreso.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const isExpanded = expandedLogId === log.id;

              return (
                <div key={log.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 transition-all">
                  <div
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold font-mono text-amber-400">{log.date}</span>
                        <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-slate-300 uppercase font-bold">
                          {log.workoutTitle}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-slate-400">
                        <span>⏱️ {formatSeconds(log.durationSeconds)}</span>
                        <span>•</span>
                        <span>🔥 {log.completedRoundsTotal} rondas</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">{log.overallFeeling}</span>
                      </div>
                    </div>

                    <button className="text-slate-400 hover:text-slate-200">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Expanded set logs details */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-800 space-y-3 text-xs animate-fade-in">
                      {log.notes && (
                        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-300 italic">
                          "{log.notes}"
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-300 block">Detalle de Series Registradas:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          {log.sets.map((s, idx) => (
                            <div key={idx} className="bg-slate-900 border border-slate-800 p-2 rounded-lg flex justify-between items-center text-slate-300">
                              <div>
                                <span className="font-bold text-slate-100">{s.exerciseName}</span>
                                <span className="text-slate-400 block text-[10px]">
                                  Ronda #{s.setNumber} • Goma: {s.bandTension} • RIR {s.rir}
                                </span>
                              </div>
                              <span className="font-mono font-bold text-amber-400">{s.repsCompleted} reps ({s.weightKg}kg)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
