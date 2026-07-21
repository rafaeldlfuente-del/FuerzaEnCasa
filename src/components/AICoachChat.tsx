import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, DailyProgress, DailyGoals } from '../types';
import { Send, Bot, User, Sparkles, Loader2, Dumbbell, Utensils, RefreshCw } from 'lucide-react';

interface AICoachChatProps {
  dailyProgress: DailyProgress;
  dailyGoals: DailyGoals;
  selectedDayId: string;
}

export const AICoachChat: React.FC<AICoachChatProps> = ({
  dailyProgress,
  dailyGoals,
  selectedDayId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `¡Hola! Soy tu **Entrenador Virtual FuerzaEnCasa** 🏋️‍♂️

Estoy aquí para ayudarte a sacar el máximo rendimiento a tus **mancuernas de 5 kg, gomas elásticas y espaldera**. 

¿En qué te puedo asesorar hoy?
- ⏱️ **Técnica y cadencia** (tempo de 3s en la bajada).
- 🎗️ **Cómo amarrar la goma** junto con la mancuerna.
- 🍗 **Consultas de nutrición** (las 3 reglas simples de proteína y carbohidratos).
- 🗓️ **Adaptaciones** de tu rutina de 30 minutos.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const QUICK_QUESTIONS = [
    '¿Cómo combino la goma y la mancuerna de 5kg paso a paso?',
    '¿Qué hago si las sentadillas a una pierna en la espaldera me resultan difíciles?',
    '¿Ideas de cenas altas en proteína con pollo o huevos sin complicaciones?',
    '¿Por qué contar 3 segundos al bajar hace crecer el músculo con poco peso?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          userContext: {
            selectedDayId,
            waterMlCurrent: dailyProgress.waterMlCurrent,
            proteinMealsDone: dailyProgress.proteinMealsCompleted,
            workoutDoneToday: dailyProgress.workoutDone,
          },
        }),
      });

      const data = await response.json();
      if (data.reply) {
        const assistantMsg: ChatMessage = {
          id: `msg_ai_${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Respuesta vacía');
      }
    } catch (err) {
      console.error('Error enviando consulta al coach:', err);
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un problema al consultar con el entrenador. Verifica tu conexión e inténtalo de nuevo.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col h-[650px] animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-100 text-base">Entrenador Virtual FuerzaEnCasa</h2>
            <p className="text-xs text-amber-400 font-medium">Asistente IA • Especialista en 5kg, Gomas y Espaldera</p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar text-xs sm:text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-1.5 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
              <span
                className={`text-[10px] block text-right font-mono ${
                  msg.role === 'user' ? 'text-slate-900/70' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-3 text-xs text-amber-400 bg-slate-950/80 border border-slate-800 p-3 rounded-xl w-fit">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>El Entrenador está analizando tu consulta...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="py-2 overflow-x-auto no-scrollbar flex space-x-2">
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-full text-[11px] whitespace-nowrap transition-all shrink-0"
          >
            💬 {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2 pt-2 border-t border-slate-800"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta sobre técnica, agarre de goma, peso o comida..."
          disabled={isLoading}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-xs sm:text-sm focus:border-amber-400 focus:outline-none placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-slate-950 font-bold p-3 rounded-xl shadow transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
