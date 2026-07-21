import { DailyGoals, DailyProgress, WorkoutLog } from '../types';

const STORAGE_KEYS = {
  DAILY_GOALS: 'fuerzaencasa_daily_goals_v1',
  DAILY_PROGRESS: 'fuerzaencasa_daily_progress_v1',
  WORKOUT_LOGS: 'fuerzaencasa_workout_logs_v1',
};

export const DEFAULT_GOALS: DailyGoals = {
  waterMlTarget: 3000, // 3 Litros
  proteinMealsTarget: 4,
  proteinGramsTarget: 130,
  sleepHoursTarget: 8,
  workoutMinutesTarget: 30,
};

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDayOfWeekId(): string {
  const dayNum = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const map: Record<number, string> = {
    1: 'lunes',
    2: 'martes',
    3: 'miercoles',
    4: 'jueves',
    5: 'viernes',
    6: 'sabado',
    0: 'domingo',
  };
  return map[dayNum] || 'lunes';
}

export function loadDailyGoals(): DailyGoals {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_GOALS);
    if (!raw) return DEFAULT_GOALS;
    return { ...DEFAULT_GOALS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading daily goals', e);
    return DEFAULT_GOALS;
  }
}

export function saveDailyGoals(goals: DailyGoals): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Error saving daily goals', e);
  }
}

export function loadDailyProgress(date: string = getTodayDateString()): DailyProgress {
  try {
    const rawMap = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
    const map: Record<string, DailyProgress> = rawMap ? JSON.parse(rawMap) : {};
    
    if (map[date]) {
      return map[date];
    }

    const newProgress: DailyProgress = {
      date,
      waterMlCurrent: 0,
      proteinMealsCompleted: {
        desayuno: false,
        comida: false,
        merienda: false,
        cena: false,
      },
      proteinGramsCurrent: 0,
      sleepHoursCurrent: 7.5,
      surplusCarbAdded: false,
      workoutDone: false,
    };
    return newProgress;
  } catch (e) {
    console.error('Error loading daily progress', e);
    return {
      date,
      waterMlCurrent: 0,
      proteinMealsCompleted: {
        desayuno: false,
        comida: false,
        merienda: false,
        cena: false,
      },
      proteinGramsCurrent: 0,
      sleepHoursCurrent: 7.5,
      surplusCarbAdded: false,
      workoutDone: false,
    };
  }
}

export function saveDailyProgress(progress: DailyProgress): void {
  try {
    const rawMap = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
    const map: Record<string, DailyProgress> = rawMap ? JSON.parse(rawMap) : {};
    map[progress.date] = progress;
    localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(map));
  } catch (e) {
    console.error('Error saving daily progress', e);
  }
}

export function loadWorkoutLogs(): WorkoutLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading workout logs', e);
    return [];
  }
}

export function saveWorkoutLog(log: WorkoutLog): void {
  try {
    const existing = loadWorkoutLogs();
    const updated = [log, ...existing];
    localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(updated));

    // Also update daily progress
    const daily = loadDailyProgress(log.date);
    daily.workoutDone = true;
    daily.workoutLogId = log.id;
    saveDailyProgress(daily);
  } catch (e) {
    console.error('Error saving workout log', e);
  }
}
