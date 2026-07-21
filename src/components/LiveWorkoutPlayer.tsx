import React, { useState, useEffect } from 'react';
import { DailyWorkout, Superset, SetLog, WorkoutLog } from '../types';
import { Play, Pause, SkipForward, CheckCircle, Clock, Volume2, VolumeX, ArrowLeft, RotateCcw, Award, Star, Flame, Zap } from 'lucide-react';
import { saveWorkoutLog, getTodayDateString } from '../lib/storage';

interface LiveWorkoutPlayerProps {
  workout: DailyWorkout;
  onClose: () => void;
  onWorkoutFinished: () => void;
}

export const LiveWorkoutPlayer: React.FC<LiveWorkoutPlayerProps> = ({
  workout,
  onClose,
  onWorkoutFinished,
}) => {
  // Navigation & Step tracking
  const [currentSupersetIdx, setCurrentSupersetIdx] = useState(0);
  const [currentRound, setCurrentRound] = useState(1); // 1 to 3
  const [currentPhase, setCurrentPhase] = useState<'exercise' | 'rest' | 'summary'>('exercise');

  // Elapsed workout time
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Rest Timer State
  const [restSecondsLeft, setRestSecondsLeft] = useState(60);
  const [isRestActive, setIsRestActive] = useState(false);

  // Tempo Metronome Assistant State
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [tempoCount, setTempoCount] = useState(3);
  const [tempoDirection, setTempoDirection] = useState<'bajada' | 'subida'>('bajada');

  // Set Inputs for current round
  const [repsA, setRepsA] = useState(12);
  const [weightA, setWeightA] = useState(5);
  const [bandA, setBandA] = useState<'Sin Goma' | 'Baja' | 'Media' | 'Alta'>('Media');
  const [rirA, setRirA] = useState(1);

  const [repsB, setRepsB] = useState(12);
  const [weightB, setWeightB] = useState(5);
  const [bandB, setBandB] = useState<'Sin Goma' | 'Baja' | 'Media' | 'Alta'>('Media');
  const [rirB, setRirB] = useState(1);

  // Completed logs accumulator
  const [completedSets, setCompletedSets] = useState<SetLog[]>([]);

  // Summary state
  const [tempoAdherence, setTempoAdherence] = useState(5);
  const [overallFeeling, setOverallFeeling] = useState<'Excelente' | 'Bueno' | 'Regular' | 'Exigente'>('Excelente');
  const [notes, setNotes] = useState('');

  const currentSuperset: Superset = workout.supersets[currentSupersetIdx] || workout.supersets[0];
  const totalSupersets = workout.supersets.length;
  const totalRoundsOverall = totalSupersets * 3;
  const completedRoundsOverall = currentSupersetIdx * 3 + (currentRound - 1);

  // Overall workout timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rest countdown timer
  useEffect(() => {
    let timer: any = null;
    if (isRestActive && restSecondsLeft > 0) {
      timer = setInterval(() => {
        setRestSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (restSecondsLeft === 0 && isRestActive) {
      setIsRestActive(false);
      handleFinishRest();
    }
    return () => clearInterval(timer);
  }, [isRestActive, restSecondsLeft]);

  // Tempo metronome timer (3s descent / 1s ascent)
  useEffect(() => {
    let timer: any = null;
    if (isMetronomeActive) {
      timer = setInterval(() => {
        if (tempoDirection === 'bajada') {
          setTempoCount((prev) => {
            if (prev <= 1) {
              setTempoDirection('subida');
              return 1;
            }
            return prev - 1;
          });
        } else {
          setTempoDirection('bajada');
          setTempoCount(3);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isMetronomeActive, tempoDirection]);

  // Log round and start 60s rest
  const handleCompleteRound = () => {
    setIsMetronomeActive(false);

    // Save set logs for A & B
    const setLogA: SetLog = {
      exerciseId: currentSuperset.exerciseA.id,
      exerciseName: currentSuperset.exerciseA.name,
      setNumber: currentRound,
      repsCompleted: repsA,
      weightKg: weightA,
      bandTension: bandA,
      rir: rirA,
    };

    const setLogB: SetLog = {
      exerciseId: currentSuperset.exerciseB.id,
      exerciseName: currentSuperset.exerciseB.name,
      setNumber: currentRound,
      repsCompleted: repsB,
      weightKg: weightB,
      bandTension: bandB,
      rir: rirB,
    };

    setCompletedSets((prev) => [...prev, setLogA, setLogB]);

    // Transition to Rest Phase
    setRestSecondsLeft(currentSuperset.restSecondsBetweenRounds || 60);
    setIsRestActive(true);
    setCurrentPhase('rest');
  };

  // Next round after rest
  const handleFinishRest = () => {
    setIsRestActive(false);

    if (currentRound < 3) {
      setCurrentRound((prev) => prev + 1);
      setCurrentPhase('exercise');
    } else {
      // Move to next superset pair or finish
      if (currentSupersetIdx < totalSupersets - 1) {
        setCurrentSupersetIdx((prev) => prev + 1);
        setCurrentRound(1);
        setCurrentPhase('exercise');
      } else {
        // Finish entire workout
        setCurrentPhase('summary');
      }
    }
  };

  // Save final workout log to storage
  const handleSaveWorkoutSummary = () => {
    const newLog: WorkoutLog = {
      id: `workout_${Date.now()}`,
      date: getTodayDateString(),
      dayId: workout.id,
      workoutTitle: workout.title,
      durationSeconds: elapsedSeconds,
      completedRoundsTotal: totalRoundsOverall,
      sets: completedSets,
      tempoAdherenceRating: tempoAdherence,
      overallFeeling,
      notes,
    };

    saveWorkoutLog(newLog);
    onWorkoutFinished();
    onClose();
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-y-auto no-scrollbar">
      
      {/* Top Sticky Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-lg">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 text-slate-400 hover:text-slate-100 text-xs font-semibold px-2 py-1 rounded bg-slate-800 border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Salir</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            {workout.dayName} • {workout.title}
          </span>
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-300 font-mono mt-0.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Tiempo: {formatTime(elapsedSeconds)}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 font-mono">
            Ronda {completedRoundsOverall}/{totalRoundsOverall}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 flex-1 space-y-6">

        {/* Phase 1: Exercise Execution */}
        {currentPhase === 'exercise' && (
          <div className="space-y-6 animate-fade-in">

            {/* Superset Header Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Superserie #{currentSupersetIdx + 1} de {totalSupersets}
                </span>
                <h2 className="text-xl font-extrabold text-slate-100 mt-2">{currentSuperset.name}</h2>
              </div>

              <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
                <span className="text-xs text-slate-400">Ronda actual:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3].map((r) => (
                    <span
                      key={r}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        r === currentRound
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50'
                          : r < currentRound
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Eccentric Tempo Metronome Assistant */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                  <Clock className="w-4 h-4" />
                  <span>Asistente de Cadencia / Tempo (3s Bajada / 1s Subida)</span>
                </div>
                <button
                  onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isMetronomeActive
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {isMetronomeActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isMetronomeActive ? 'Detener Ritmo' : 'Iniciar Metrónomo'}</span>
                </button>
              </div>

              {/* Metronome Visualizer */}
              <div
                className={`h-12 rounded-xl border flex items-center justify-center font-black text-sm sm:text-base transition-all duration-300 ${
                  isMetronomeActive
                    ? tempoDirection === 'bajada'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 scale-[1.01]'
                      : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 scale-[1.01]'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                {isMetronomeActive ? (
                  tempoDirection === 'bajada' ? (
                    <span>⬇️ BAJA DESPACIO... {tempoCount} SEGUNDOS</span>
                  ) : (
                    <span>⬆️ SUBE POTENTE! (1 SEG)</span>
                  )
                ) : (
                  <span>Presiona "Iniciar Metrónomo" para llevar el ritmo exacto de 3 segundos</span>
                )}
              </div>
            </div>

            {/* Exercise Pair Forms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Exercise A Form */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    1º Ejercicio de la Pareja
                  </span>
                  <h3 className="text-base font-extrabold text-slate-100 mt-1">
                    {currentSuperset.exerciseA.name}
                  </h3>
                  <p className="text-xs text-slate-400">{currentSuperset.exerciseA.tempo}</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Repeticiones realizadas:</label>
                    <input
                      type="number"
                      value={repsA}
                      onChange={(e) => setRepsA(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Peso Mancuerna (kg):</label>
                    <input
                      type="number"
                      value={weightA}
                      onChange={(e) => setWeightA(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Tensión Goma Elástica:</label>
                    <select
                      value={bandA}
                      onChange={(e: any) => setBandA(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold text-xs focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Sin Goma">Sin Goma</option>
                      <option value="Baja">Goma Suave / Baja</option>
                      <option value="Media">Goma Media</option>
                      <option value="Alta">Goma Fuerte / Alta</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Cansancio / RIR (Reps en Reserva):</label>
                    <select
                      value={rirA}
                      onChange={(e) => setRirA(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold text-xs focus:border-amber-400 focus:outline-none"
                    >
                      <option value={0}>RIR 0 (Fallo total - 0 repeticiones)</option>
                      <option value={1}>RIR 1 (Dejé 1 repetición en reserva - Recomendado)</option>
                      <option value={2}>RIR 2 (Dejé 2 repeticiones en reserva - Perfecto)</option>
                      <option value={3}>RIR 3+ (Poco esfuerzo)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Exercise B Form */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                    2º Ejercicio (Seguido sin descanso)
                  </span>
                  <h3 className="text-base font-extrabold text-slate-100 mt-1">
                    {currentSuperset.exerciseB.name}
                  </h3>
                  <p className="text-xs text-slate-400">{currentSuperset.exerciseB.tempo}</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Repeticiones realizadas:</label>
                    <input
                      type="number"
                      value={repsB}
                      onChange={(e) => setRepsB(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Peso Mancuerna (kg):</label>
                    <input
                      type="number"
                      value={weightB}
                      onChange={(e) => setWeightB(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Tensión Goma Elástica:</label>
                    <select
                      value={bandB}
                      onChange={(e: any) => setBandB(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold text-xs focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Sin Goma">Sin Goma</option>
                      <option value="Baja">Goma Suave / Baja</option>
                      <option value="Media">Goma Media</option>
                      <option value="Alta">Goma Fuerte / Alta</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Cansancio / RIR (Reps en Reserva):</label>
                    <select
                      value={rirB}
                      onChange={(e) => setRirB(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold text-xs focus:border-amber-400 focus:outline-none"
                    >
                      <option value={0}>RIR 0 (Fallo total - 0 repeticiones)</option>
                      <option value={1}>RIR 1 (Dejé 1 repetición en reserva - Recomendado)</option>
                      <option value={2}>RIR 2 (Dejé 2 repeticiones en reserva - Perfecto)</option>
                      <option value={3}>RIR 3+ (Poco esfuerzo)</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* Complete Round Action */}
            <div className="pt-2">
              <button
                onClick={handleCompleteRound}
                className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-base py-4 rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5 fill-slate-950 stroke-amber-400" />
                <span>Completar Ronda {currentRound} y Pasar a Descanso (1 min)</span>
              </button>
            </div>

          </div>
        )}

        {/* Phase 2: Rest Phase Timer */}
        {currentPhase === 'rest' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-fade-in max-w-lg mx-auto my-12">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              ⏱️ Descanso entre Rondas
            </span>

            <h3 className="text-xl font-bold text-slate-100">
              Recupera el aliento y bebe un trago de agua
            </h3>

            {/* Rest Counter Circle */}
            <div className="w-40 h-40 mx-auto rounded-full bg-slate-950 border-4 border-amber-500/40 flex flex-col items-center justify-center shadow-inner">
              <span className="text-5xl font-black text-amber-400 font-mono">
                {restSecondsLeft}
              </span>
              <span className="text-xs text-slate-400 font-medium mt-1">segundos</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-3 text-xs font-bold">
              <button
                onClick={() => setRestSecondsLeft((prev) => Math.max(0, prev - 10))}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl border border-slate-700"
              >
                -10s
              </button>
              <button
                onClick={() => setIsRestActive(!isRestActive)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl shadow font-extrabold"
              >
                {isRestActive ? 'Pausar' : 'Reanudar'}
              </button>
              <button
                onClick={() => setRestSecondsLeft((prev) => prev + 10)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl border border-slate-700"
              >
                +10s
              </button>
            </div>

            <div>
              <button
                onClick={handleFinishRest}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all shadow flex items-center justify-center space-x-2 text-sm"
              >
                <SkipForward className="w-4 h-4 fill-slate-950" />
                <span>Saltar Descanso y Empezar Siguiente Ronda</span>
              </button>
            </div>
          </div>
        )}

        {/* Phase 3: Final Summary Screen */}
        {currentPhase === 'summary' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in max-w-xl mx-auto my-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                <Award className="w-8 h-8 text-slate-950" />
              </div>
              <h2 className="text-2xl font-black text-slate-100">¡Entrenamiento de 30m Completado!</h2>
              <p className="text-xs text-slate-300">
                Has estimulado la hipertrofia muscular manteniendo cadencia lenta y tensión constante.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 border border-slate-800 p-4 rounded-2xl">
              <div>
                <span className="text-slate-400 block">Tiempo Total:</span>
                <span className="text-sm font-bold text-amber-400 font-mono">{formatTime(elapsedSeconds)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Rondas de Superseries:</span>
                <span className="text-sm font-bold text-slate-100 font-mono">{completedSets.length / 2} Rondas</span>
              </div>
            </div>

            {/* Tempo Rating */}
            <div className="space-y-2 text-xs">
              <label className="text-slate-300 font-semibold block">
                ¿Qué tal has cumplido los 3 segundos de bajada excéntrica?
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setTempoAdherence(star)}
                    className={`flex-1 py-2 rounded-xl border flex items-center justify-center transition-all ${
                      star <= tempoAdherence
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Overall Feeling */}
            <div className="space-y-2 text-xs">
              <label className="text-slate-300 font-semibold block">Sensación general:</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Excelente', 'Bueno', 'Exigente', 'Regular'] as const).map((feel) => (
                  <button
                    key={feel}
                    onClick={() => setOverallFeeling(feel)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      overallFeeling === feel
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {feel}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-semibold block">Notas / Observaciones:</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Las sentadillas a una pierna en la espaldera picaron bastante. Usé goma media."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 placeholder-slate-600 text-xs focus:border-amber-400 focus:outline-none"
                rows={2}
              />
            </div>

            <button
              onClick={handleSaveWorkoutSummary}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black py-3.5 rounded-xl shadow-lg transition-all"
            >
              Guardar Entrenamiento en el Historial
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
