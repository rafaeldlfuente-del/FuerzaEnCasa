import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialization of Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Endpoint for AI Virtual Personal Trainer Coach
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    const ai = getAIClient();

    const systemInstruction = `
Eres "Coach FuerzaEnCasa", un entrenador personal virtual experto en ganancia muscular (hipertrofia) con equipamiento ligero (mancuernas de 5 kg, gomas elásticas de resistencia y espaldera/barra de pared).

Tus 4 pautas maestras para ganar músculo con 5 kg son:
1. Moverse despacio: Tempo excéntrico contando 3 segundos en la bajada de cada repetición.
2. Usar gomas + pesas: Estirar la goma al mismo tiempo que se mueve la mancuerna de 5 kg para resistencia progresiva.
3. Trabajo unilateral (a 1 pierna o 1 brazo): Usar la espaldera para estabilidad o apoyo de pie.
4. Llegar cerca del final: RIR 1-2 (dejar solo 1 o 2 repeticiones en reserva antes del fallo).

Programa semanal de 30 minutos (Superseries de 2 ejercicios, 3 rondas cada pareja, 1 min de descanso):
- Lunes: Empuje (Pecho, Hombros, Tríceps)
- Martes: Tirón (Espalda, Bíceps)
- Miércoles: Piernas
- Jueves: Torso Completo
- Viernes: Piernas y Abdomen
- Sábado y Domingo: Descanso Activo

Nutrición (3 Reglas Simples):
1. Proteína en cada comida principal (pollo, pavo, ternera, pescado, huevos, yogur, queso). 3-4 veces al día.
2. Músculo necesita energía: añade ración extra de arroz, patata, avena o pan integral.
3. Hidratación: Beber agua a lo largo del día.

Descanso: Dormir 7-8 horas y 2 días libres.

Contexto actual del alumno: ${JSON.stringify(userContext || {})}

Instrucciones de respuesta:
- Sé motivador, cercano, riguroso pero práctico y muy fácil de entender.
- Da consejos de técnica concretos, variantes o ajustes.
- Usa formato markdown claro (negritas, listas, viñetas).
- Mantén un tono amigable de entrenador profesional español.
`;

    // Extract recent context and last question
    const conversation = (messages || []).map((m: { role: string; content: string }) => {
      return `${m.role === 'user' ? 'Alumno' : 'Entrenador'}: ${m.content}`;
    }).join('\n\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: conversation,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'No se pudo generar una respuesta. Por favor intenta de nuevo.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'Error consultando al Entrenador Virtual',
      details: error.message || String(error),
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FuerzaEnCasa] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
