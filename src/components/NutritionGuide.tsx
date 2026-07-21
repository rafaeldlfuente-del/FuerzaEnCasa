import React, { useState } from 'react';
import { Utensils, Droplets, Flame, CheckCircle, Sparkles, HelpCircle, HeartPulse } from 'lucide-react';

export const NutritionGuide: React.FC = () => {
  const [selectedProtein, setSelectedProtein] = useState<string>('pollo');
  const [selectedCarb, setSelectedCarb] = useState<string>('arroz');

  const PROTEIN_SOURCES = [
    { id: 'pollo', name: 'Pollo / Pavo', icon: '🍗', desc: 'Proteína magra de alta calidad', gramsPer100g: 23 },
    { id: 'pescado', name: 'Pescado (Atún/Salmón/Merluza)', icon: '🐟', desc: 'Rico en proteína y omega-3', gramsPer100g: 20 },
    { id: 'huevos', name: 'Huevos', icon: '🥚', desc: 'Proteína completa con alto valor biológico', gramsPer100g: 13 },
    { id: 'ternera', name: 'Ternera magra', icon: '🥩', desc: 'Aporta hierro, zinc y proteína pura', gramsPer100g: 22 },
    { id: 'yogur', name: 'Yogur Griego / Queso Proteico', icon: '🧀', desc: 'Ideal para desayunos o meriendas rápidas', gramsPer100g: 10 },
  ];

  const CARB_SOURCES = [
    { id: 'arroz', name: 'Arroz Integral o Blanco', icon: '🍚', desc: 'Energía limpia para tus sesiones de 30 min' },
    { id: 'patata', name: 'Patata o Boniato cocido/asado', icon: '🥔', desc: 'Fácil digestión y rico en potasio' },
    { id: 'avena', name: 'Avena integral', icon: '🥣', desc: 'Perfecto para comenzar el día' },
    { id: 'pan', name: 'Pan integral de grano entero', icon: '🍞', desc: 'Rápido y práctico para acompañar' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Utensils className="w-3.5 h-3.5" />
          <span>Sin Complicarse la Vida</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          La Comida: Tres Reglas Simples para Ganar Músculo
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
          No necesitas pesarlo todo al gramo ni volverte loco contando calorías. Sigue estas 3 pautas fundamentales en tu día a día para que el entrenamiento con 5 kg se traduzca en masa muscular real.
        </p>
      </div>

      {/* 3 Simple Rules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Rule 1 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Regla #1</span>
            <h2 className="text-lg font-bold text-slate-100 mt-1">1. Asegura la proteína</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              En cada una de tus comidas principales (desayuno, comida y cena) tiene que haber algo de esto: <strong>pollo, pavo, ternera, pescado, huevos, yogur o queso</strong>. Come algo de proteína <strong>3 o 4 veces al día</strong>.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1">
            <span className="text-emerald-400 font-bold block mb-1">Fuentes recomendadas:</span>
            <div className="flex flex-wrap gap-1 text-[11px]">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">🍗 Pollo / Pavo</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">🐟 Pescado</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">🥚 Huevos</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">🥩 Ternera</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">🧀 Yogur / Queso</span>
            </div>
          </div>
        </div>

        {/* Rule 2 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg hover:border-orange-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Regla #2</span>
            <h2 className="text-lg font-bold text-slate-100 mt-1">2. Come un poco más</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              Para fabricar músculo, el cuerpo necesita energía extra. Añade una ración de <strong>arroz, patata, avena o pan integral</strong> en tus platos habituales.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1">
            <span className="text-orange-400 font-bold block mb-1">Ración de energía extra:</span>
            <p className="text-[11px] text-slate-400">
              Un puñado grande de arroz o 1 patata mediana cocida extra en la comida da el empuje calórico perfecto.
            </p>
          </div>
        </div>

        {/* Rule 3 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg hover:border-sky-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Regla #3</span>
            <h2 className="text-lg font-bold text-slate-100 mt-1">3. Bebe agua constantemente</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              El músculo está compuesto en un 75% por agua. Intenta tener siempre una botella a mano y beber con frecuencia a lo largo de todo el día.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1">
            <span className="text-sky-400 font-bold block mb-1">Consejo práctico:</span>
            <p className="text-[11px] text-slate-400">
              Usa el contador de agua en la pestaña de "Metas Diarias" para registrar tus vasos diarios.
            </p>
          </div>
        </div>

      </div>

      {/* Interactive Meal Builder / Inspiration Generator */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-100 text-lg">Combinador Rápido de Platos Anabólicos</h3>
            <p className="text-xs text-slate-400">Elige tu proteína y tu carbohidrato para ver tu combinación recomendada</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Select Protein */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              1. Elige tu Fuente de Proteína:
            </label>
            <div className="space-y-2">
              {PROTEIN_SOURCES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProtein(p.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                    selectedProtein === p.id
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-lg">{p.icon}</span>
                    <span>{p.name}</span>
                  </div>
                  {selectedProtein === p.id && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Select Carb */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
              2. Elige tu Ración Extra de Energía:
            </label>
            <div className="space-y-2">
              {CARB_SOURCES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCarb(c.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                    selectedCarb === c.id
                      ? 'bg-orange-500/15 border-orange-500/40 text-orange-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-lg">{c.icon}</span>
                    <span>{c.name}</span>
                  </div>
                  {selectedCarb === c.id && <CheckCircle className="w-4 h-4 text-orange-400" />}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Result Dish Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-2">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">🍽️ Tu Plato Sugerido:</span>
          <div className="text-sm font-extrabold text-slate-100 flex items-center space-x-2">
            <span>
              {PROTEIN_SOURCES.find((p) => p.id === selectedProtein)?.icon}{' '}
              {PROTEIN_SOURCES.find((p) => p.id === selectedProtein)?.name}
            </span>
            <span>+</span>
            <span>
              {CARB_SOURCES.find((c) => c.id === selectedCarb)?.icon}{' '}
              {CARB_SOURCES.find((c) => c.id === selectedCarb)?.name}
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Plato equilibrado ideal para antes o después de tu entrenamiento de 30 minutos. Recuerda acompañarlo de una gran botella de agua para cumplir tu meta de hidratación.
          </p>
        </div>

      </div>
    </div>
  );
};
