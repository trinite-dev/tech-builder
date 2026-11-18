import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Initialize Gemini AI client server-side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API Routes
  app.post('/api/ai/breakdown', async (req, res) => {
    try {
      const { taskTitle, taskDescription } = req.body;
      if (!taskTitle) {
        return res.status(400).json({ error: 'Le titre de la tâche est requis.' });
      }

      const prompt = `Décompose cette tâche principale en 3 à 6 sous-tâches concrètes, actionnables et logiques avec une estimation de durée pour chacune.
Titre: "${taskTitle}"
Description: "${taskDescription || 'Aucune description'}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction: 'Tu es un assistant expert en gestion de projet et productivité. Renvoie ta réponse strictement au format JSON selon le schéma demandé.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subtasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: 'Titre de la sous-tâche' },
                    estimatedMinutes: { type: Type.INTEGER, description: 'Durée estimée en minutes' }
                  }
                },
                description: 'Liste des sous-tâches'
              },
              advice: { type: Type.STRING, description: 'Un conseil avisé pour réussir cette tâche efficacement' }
            }
          }
        }
      });

      const textResult = response.text;
      if (!textResult) {
        throw new Error('Aucune réponse générée par l\'IA.');
      }

      const parsed = JSON.parse(textResult);
      res.json(parsed);
    } catch (error: any) {
      console.error('Erreur API Gemini Breakdown:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la génération des sous-tâches.' });
    }
  });

  app.post('/api/ai/coach', async (req, res) => {
    try {
      const { tasksSummary } = req.body;

      const prompt = `Voici l'état actuel des tâches de l'utilisateur :
${JSON.stringify(tasksSummary, null, 2)}

Analyse cette liste et donne un coaching de productivité court (en français, max 3 conseils percutants) pour aider l'utilisateur à prioriser sa journée, éviter la surcharge et réussir ses objectifs.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction: 'Tu es un coach en gestion du temps bienveillant et structuré.',
        }
      });

      res.json({ advice: response.text || 'Continuez sur votre lancée !' });
    } catch (error: any) {
      console.error('Erreur API Gemini Coach:', error);
      res.status(500).json({ error: error.message || 'Erreur lors du coaching IA.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 TaskFlow Pro server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
