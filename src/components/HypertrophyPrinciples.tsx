import React, { useState, useEffect } from 'react';
import { Timer, Layers, User, Zap, Play, Pause, RefreshCw, CheckCircle, Info } from 'lucide-react';

export const HypertrophyPrinciples: React.FC = () => {
  // Tempo Simulator State
  const [isSimulating, setIsSimulating] = useState(false);
  const [tempoPhase, setTempoPhase] = useState<'bajada' | 'subida' | 'pausa'>('pausa');
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    let interval: any = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (tempoPhase === 'bajada') {
            if (prev <= 1) {
              setTempoPhase('subida');
              return 1;
            }
            return prev - 1;
          } else if (tempoPhase === 'subida') {
            setTempoPhase('bajada');
            return 3;
          } else {
            setTempoPhase('bajada');
            return 3;
          }
        });
      }, 1000);
    } else {
      setTempoPhase('pausa');
      setSeconds(3);
    }
    return () => clearInterval(interval);
  }, [isSimulating, tempoPhase]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wide">
            <Zap className="w-3.5 h-3.5" />
            <span>Ciencia de la Hipertrofia Ligera</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            ¿Cómo vas a ganar músculo si las pesas son de solo 5 kg?
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Para que el músculo crezca necesita sentir <strong className="text-amber-300 font-semibold">estrés mecánico y fatiga</strong>. 
            Como tus mancuernas pesan 5 kg, no metemos más peso: hacemos el ejercicio mucho más exigente mediante <strong className="text-amber-300 font-semibold">cadencia, gomas, trabajo unilateral y proximidad al fallo</strong>.
          </p>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pillar 1 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-amber-500/30 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Timer className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold bg-slate-800 text-amber-300 px-2.5 py-1 rounded-md border border-slate-700">
              Clave 1
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">1. Muévete despacio (Tempo Excéntrico 3s)</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
              En lugar de subir y bajar rápido, baja contando <strong>3 segundos despacio</strong>. La fase excéntrica lenta multiplica el tiempo bajo tensión muscular y genera el máximo microtrauma beneficioso sin lesionar articulaciones.
            </p>
          </div>

          {/* Interactive Metronome simulator */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Simulador de Cadencia Visual:</span>
              <span className="font-mono text-amber-400 font-semibold">3s Bajada / 1s Subida</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs transition-all shadow"
              >
                {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isSimulating ? 'Pausar' : 'Probar Metrónomo'}</span>
              </button>

              <div className="flex-1 flex items-center space-x-2">
                <div
                  className={`flex-1 h-10 rounded-lg flex items-center justify-center font-extrabold text-sm transition-all duration-300 ${
                    tempoPhase === 'bajada'
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 scale-105'
                      : tempoPhase === 'subida'
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 scale-105'
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                  }`}
                >
                  {tempoPhase === 'bajada' && `⬇️ BAJA DESPACIO... ${seconds}s`}
                  {tempoPhase === 'subida' && `⬆️ SUBE POTENTE! 1s`}
                  {tempoPhase === 'pausa' && `Pulse "Probar Metrónomo"`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-amber-500/30 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold bg-slate-800 text-orange-300 px-2.5 py-1 rounded-md border border-slate-700">
              Clave 2
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">2. Usa las gomas junto con las pesas</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
              Coge la mancuerna de 5 kg y, al mismo tiempo, estira la goma elástica. Las pesas dan una carga constante, mientras que la goma te irá frenando e incrementando la tensión a medida que el músculo se acorta.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
              <span><strong>Mancuerna (5kg)</strong>: Tensión constante en el inicio de la repetición.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
              <span><strong>Goma Elástica</strong>: Tensión progresiva máxima al final de la contracción.</span>
            </div>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-amber-500/30 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <User className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold bg-slate-800 text-emerald-300 px-2.5 py-1 rounded-md border border-slate-700">
              Clave 3
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">3. Trabaja a una pierna o un brazo (Unilateral)</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
              Hacer una sentadilla normal reparte el peso entre dos piernas. Hacer una <strong>sentadilla a una pierna con el pie atras en la espaldera</strong> duplica la carga efectiva en ese músculo con tus mismos 5 kg.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Sentadilla bilateral (2 piernas):</span>
              <span className="font-mono text-slate-300">50% peso por pierna</span>
            </div>
            <div className="flex items-center justify-between font-bold text-emerald-400">
              <span>Sentadilla Búlgara / Unilateral:</span>
              <span className="font-mono">100% estímulo + Estabilidad Espaldera</span>
            </div>
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-amber-500/30 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold bg-slate-800 text-sky-300 px-2.5 py-1 rounded-md border border-slate-700">
              Clave 4
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">4. Llega casi hasta el final (Proximidad al fallo)</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
              Haz cada serie hasta que sientas que solo te quedarían <strong>1 o 2 repeticiones más</strong> antes de que el músculo no pueda más (RIR 1-2). Ahí es donde el cuerpo recluta las fibras musculares de mayor potencial de crecimiento.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">RIR 0:</span>
              <span className="text-red-400 font-semibold">Fallo total (No puedes hacer más)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold">RIR 1 - 2 (Recomendado):</span>
              <span className="text-emerald-300 font-bold">Solo podías 1 o 2 reps más!</span>
            </div>
          </div>
        </div>

      </div>

      {/* Equipment Guide Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-3 text-amber-400">
          <Info className="w-5 h-5" />
          <h3 className="font-bold text-slate-100 text-base">Tu Equipamiento Necesario para esta Aplicación</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <span className="font-bold text-amber-400 block text-sm">🏋️ Mancuernas de 5 kg</span>
            <p className="text-slate-400">Pares de 5 kg para aislamientos, elevaciones y peso extra en pierna/brazo.</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <span className="font-bold text-amber-400 block text-sm">🎗️ Gomas Elásticas</span>
            <p className="text-slate-400">Bandas de resistencia para amarrar en espaldera o estirar junto a las pesas.</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <span className="font-bold text-amber-400 block text-sm">🪜 Espaldera de Pared</span>
            <p className="text-slate-400">Punto de anclaje para dominadas, elevación de pies, soporte de sentadilla y gomas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
