import React, { useState } from 'react';
import { DailyGoals, DailyProgress } from '../types';
import { Droplets, Utensils, Moon, Dumbbell, Plus, Minus, CheckCircle, Settings, X, Flame, Sparkles } from 'lucide-react';

interface DailyGoalsTrackerProps {
  dailyGoals: DailyGoals;
  dailyProgress: DailyProgress;
  onUpdateGoals: (newGoals: DailyGoals) => void;
  onUpdateProgress: (newProgress: DailyProgress) => void;
}

export const DailyGoalsTracker: React.FC<DailyGoalsTrackerProps> = ({
  dailyGoals,
  dailyProgress,
  onUpdateGoals,
  onUpdateProgress,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Temporary editable goals state for modal
  const [editWater, setEditWater] = useState(dailyGoals.waterMlTarget);
  const [editProteinMeals, setEditProteinMeals] = useState(dailyGoals.proteinMealsTarget);
  const [editSleep, setEditSleep] = useState(dailyGoals.sleepHoursTarget);

  // Water Handlers
  const handleAddWater = (amountMl: number) => {
    const updatedWater = Math.max(0, dailyProgress.waterMlCurrent + amountMl);
    onUpdateProgress({
      ...dailyProgress,
      waterMlCurrent: updatedWater,
    });
  };

  // Protein Meal Toggle
  const handleToggleProteinMeal = (mealKey: 'desayuno' | 'comida' | 'merienda' | 'cena') => {
    const updatedMeals = {
      ...dailyProgress.proteinMealsCompleted,
      [mealKey]: !dailyProgress.proteinMealsCompleted[mealKey],
    };
    onUpdateProgress({
      ...dailyProgress,
      proteinMealsCompleted: updatedMeals,
    });
  };

  // Surplus Carb Toggle
  const handleToggleSurplus = () => {
    onUpdateProgress({
      ...dailyProgress,
      surplusCarbAdded: !dailyProgress.surplusCarbAdded,
    });
  };

  // Sleep Change
  const handleSleepChange = (hours: number) => {
    onUpdateProgress({
      ...dailyProgress,
      sleepHoursCurrent: Math.max(0, hours),
    });
  };

  // Save Modal Settings
  const handleSaveSettings = () => {
    onUpdateGoals({
      ...dailyGoals,
      waterMlTarget: editWater,
      proteinMealsTarget: editProteinMeals,
      sleepHoursTarget: editSleep,
    });
    setIsSettingsOpen(false);
  };

  const waterPercent = Math.min(100, Math.round((dailyProgress.waterMlCurrent / dailyGoals.waterMlTarget) * 100));
  const proteinCompletedCount = Object.values(dailyProgress.proteinMealsCompleted).filter(Boolean).length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hábitos y Registro Diario</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100">Metas Diarias Ajustables</h2>
          <p className="text-xs text-slate-400 mt-1">
            Adapta tu hidratación, proteína en comidas principales, energía extra y descanso para maximizar tu hipertrofia.
          </p>
        </div>

        <button
          onClick={() => {
            setEditWater(dailyGoals.waterMlTarget);
            setEditProteinMeals(dailyGoals.proteinMealsTarget);
            setEditSleep(dailyGoals.sleepHoursTarget);
            setIsSettingsOpen(true);
          }}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0"
        >
          <Settings className="w-4 h-4 text-amber-400" />
          <span>Personalizar Mis Metas</span>
        </button>
      </div>

      {/* Grid of 4 Main Daily Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Tracker 1: Hidratación / Agua */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-100 text-base">Agua e Hidratación</h3>
                <span className="text-xs text-slate-400">Mantén una botella siempre a mano</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2.5 py-1 rounded-md">
              {dailyProgress.waterMlCurrent / 1000}L / {dailyGoals.waterMlTarget / 1000}L
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Progreso de Agua</span>
              <span className="font-bold text-sky-400">{waterPercent}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-sky-500 to-blue-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={() => handleAddWater(250)}
              className="flex-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+250 ml (1 Vaso)</span>
            </button>
            <button
              onClick={() => handleAddWater(500)}
              className="flex-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+500 ml (Botella)</span>
            </button>
            <button
              onClick={() => handleAddWater(-250)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-400 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
              title="Restar 250ml"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tracker 2: Proteína en Comidas Principales */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-100 text-base">Asegurar Proteína</h3>
                <span className="text-xs text-slate-400">En tus 3 o 4 comidas principales</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-md">
              {proteinCompletedCount} / {dailyGoals.proteinMealsTarget} Comidas
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Pollo, pavo, ternera, pescado, huevos, yogur o queso en cada toma.
          </p>

          {/* Meals Checkboxes */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(['desayuno', 'comida', 'merienda', 'cena'] as const).map((mealKey) => {
              const isDone = dailyProgress.proteinMealsCompleted[mealKey];
              const labels = {
                desayuno: 'Desayuno',
                comida: 'Comida',
                merienda: 'Merienda',
                cena: 'Cena',
              };

              return (
                <button
                  key={mealKey}
                  onClick={() => handleToggleProteinMeal(mealKey)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isDone
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold">{labels[mealKey]}</span>
                  {isDone && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tracker 3: Ración de Energía Extra (Carbohidratos limpios) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-100 text-base">Comer un poco más (Energía Extra)</h3>
                <span className="text-xs text-slate-400">Para fabricar músculo necesitas energía extra</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Añade una ración de arroz, patata, avena o pan integral en tus comidas habituales.
          </p>

          <button
            onClick={handleToggleSurplus}
            className={`w-full p-3.5 rounded-xl border font-bold text-xs flex items-center justify-between transition-all ${
              dailyProgress.surplusCarbAdded
                ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span>🍚 Añadida ración extra de carbohidratos hoy</span>
            {dailyProgress.surplusCarbAdded && <CheckCircle className="w-4 h-4 text-orange-400" />}
          </button>
        </div>

        {/* Tracker 4: Sueño y Recuperación */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-100 text-base">Descanso y Sueño</h3>
                <span className="text-xs text-slate-400">El músculo crece cuando duermes</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-md">
              {dailyProgress.sleepHoursCurrent}h / {dailyGoals.sleepHoursTarget}h
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Objetivo: entre 7 y 8 horas de sueño profundo para reparar el tejido muscular.
          </p>

          <div className="flex items-center space-x-3 pt-1">
            <button
              onClick={() => handleSleepChange(dailyProgress.sleepHoursCurrent - 0.5)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold"
            >
              -0.5h
            </button>
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2 text-center text-sm font-extrabold text-indigo-300 font-mono">
              {dailyProgress.sleepHoursCurrent} horas dormidas
            </div>
            <button
              onClick={() => handleSleepChange(dailyProgress.sleepHoursCurrent + 0.5)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold"
            >
              +0.5h
            </button>
          </div>
        </div>

      </div>

      {/* Modal Adjust Goals Settings */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-100 text-lg">Ajustar Mis Metas Personalizadas</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Meta de Agua diaria (ml):</label>
                <input
                  type="number"
                  step={250}
                  value={editWater}
                  onChange={(e) => setEditWater(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono text-sm focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Ej: 3000 ml = 3 Litros</span>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Objetivo de Comidas con Proteína:</label>
                <input
                  type="number"
                  value={editProteinMeals}
                  onChange={(e) => setEditProteinMeals(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono text-sm focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Recomendación: 3 a 4 veces al día</span>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Horas de Sueño objetivo (horas):</label>
                <input
                  type="number"
                  step={0.5}
                  value={editSleep}
                  onChange={(e) => setEditSleep(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono text-sm focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Recomendación: 7.5 - 8 horas</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs shadow-md"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
