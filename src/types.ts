export interface Exercise {
  id: string;
  name: string;
  targetMuscles: string;
  equipment: string;
  description: string;
  keyTip: string;
  tempo: string; // e.g. "3s excéntrico (bajada) / 1s explosivo (subida)"
  targetReps: string; // e.g. "10-12 repeticiones (RIR 1-2)"
  iconName?: string;
}

export interface Superset {
  id: string;
  name: string; // e.g., "Pareja 1: Pecho Elevado + Hombro Resistencia"
  exerciseA: Exercise;
  exerciseB: Exercise;
  targetRounds: number; // default 3
  restSecondsBetweenRounds: number; // default 60
}

export interface DailyWorkout {
  id: string; // 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo'
  dayName: string; // 'Lunes'
  category: string; // 'Empuje', 'Tirón', 'Piernas', 'Torso Completo', 'Piernas y Abdomen', 'Descanso'
  title: string;
  focusMuscles: string[];
  estimatedMinutes: number;
  supersets: Superset[];
  isRestDay?: boolean;
  restDaySuggestions?: string[];
}

export interface SetLog {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  repsCompleted: number;
  weightKg: number;
  bandTension: 'Sin Goma' | 'Baja' | 'Media' | 'Alta';
  rir: number; // Reps in Reserve (0, 1, 2, 3)
}

export interface WorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  dayId: string;
  workoutTitle: string;
  durationSeconds: number;
  completedRoundsTotal: number;
  sets: SetLog[];
  tempoAdherenceRating: number; // 1-5 stars
  overallFeeling: 'Excelente' | 'Bueno' | 'Regular' | 'Exigente';
  notes?: string;
}

export interface DailyGoals {
  waterMlTarget: number; // Default 3000 (3 Litros)
  proteinMealsTarget: number; // Default 4
  proteinGramsTarget: number; // Default 120-140g
  sleepHoursTarget: number; // Default 8h
  workoutMinutesTarget: number; // Default 30m
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  waterMlCurrent: number;
  proteinMealsCompleted: {
    desayuno: boolean;
    comida: boolean;
    merienda: boolean;
    cena: boolean;
  };
  proteinGramsCurrent: number;
  sleepHoursCurrent: number;
  surplusCarbAdded: boolean; // Ración extra de arroz, patata, avena o pan integral
  workoutDone: boolean;
  workoutLogId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
