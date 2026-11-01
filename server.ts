import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { executeAcademicWorkflow } from './server/geminiWorkflow.ts';
import { SAMPLE_BRIEFS } from './server/sampleData.ts';
import { BriefGenerationRequest } from './src/types/index.ts';
import {
  saveEvaluationAndTriggerAutomation,
  getStoredEvaluations,
} from './server/storageService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '2mb' }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    timestamp: new Date().toISOString(),
  });
});

// Endpoint to query saved evaluations (Data Storage requirement)
app.get('/api/evaluations', (req: Request, res: Response) => {
  try {
    const records = getStoredEvaluations();
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve evaluations.' });
  }
});

// Endpoint to export evaluations as a clean CSV download
app.get('/api/evaluations/csv', (req: Request, res: Response) => {
  try {
    const csvPath = path.join(__dirname, 'server', 'data', 'evaluations.csv');
    if (!fs.existsSync(csvPath)) {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="evaluations.csv"');
      return res.send('\uFEFFid,timestamp,topic,academicLevel,briefLength,title,totalSources,totalClaims,supportedClaims,verificationRigorScore,averageCredibilityScore,automatedExportTriggered\r\n');
    }
    const content = fs.readFileSync(csvPath, 'utf-8');
    // Ensure UTF-8 BOM so Microsoft Excel and other spreadsheet apps render unicode characters cleanly
    const payload = content.startsWith('\uFEFF') ? content : '\uFEFF' + content;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="evaluations.csv"');
    return res.send(payload);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve evaluations CSV.' });
  }
});

// List available sample briefs (explicitly labeled as DEMO data)
app.get('/api/samples', (req: Request, res: Response) => {
  const summaries = Object.entries(SAMPLE_BRIEFS).map(([key, brief]) => ({
    key,
    id: brief.id,
    title: brief.title,
    topic: brief.topic,
    academicLevel: brief.academicLevel,
    isDemoSample: true,
    sourcesCount: brief.sources.length,
    claimsCount: brief.claims.length,
    supportedCount: brief.metrics.supportedCount,
    contradictedCount: brief.metrics.contradictedCount,
  }));
  res.json(summaries);
});

// Get specific sample brief (explicitly labeled as DEMO data)
app.get('/api/samples/:key', (req: Request, res: Response) => {
  const { key } = req.params;
  const sample = SAMPLE_BRIEFS[key];
  if (!sample) {
    res.status(404).json({ error: `Demo sample brief "${key}" not found.` });
    return;
  }
  res.json({
    ...sample,
    isDemoSample: true,
  });
});

// Standard REST Generation Endpoint
app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const { topic, researchQuestion, academicLevel, briefLength, preferredSourceTypes } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length < 3) {
      res.status(400).json({ error: 'A valid research topic of at least 3 characters is required.' });
      return;
    }

    const payload: BriefGenerationRequest = {
      topic: topic.trim(),
      researchQuestion: researchQuestion ? String(researchQuestion).trim() : undefined,
      academicLevel: academicLevel || 'undergraduate',
      briefLength: briefLength || 'medium',
      preferredSourceTypes: preferredSourceTypes || 'all',
    };

    const brief = await executeAcademicWorkflow(payload);

    // Save inputs, outputs, and evaluation metrics & trigger automated export
    const record = await saveEvaluationAndTriggerAutomation(payload, brief);

    res.json({ ...brief, storageEvaluation: record });
  } catch (error: any) {
    console.error('Error generating academic brief:', error);
    res.status(500).json({
      error: error.message || 'An error occurred during academic brief generation.',
      details: error.stack,
    });
  }
});

// Interactive AI Research Q&A endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { question, briefContext } = req.body;
    if (!question || !briefContext) {
      res.status(400).json({ error: 'Question and brief context are required.' });
      return;
    }
    const { answerBriefQuestion } = await import('./server/geminiWorkflow.ts');
    const answer = await answerBriefQuestion(question, briefContext);
    res.json({ answer });
  } catch (error: any) {
    console.error('Error answering brief question:', error);
    res.status(500).json({ error: error.message || 'Failed to process inquiry.' });
  }
});

// Server-Sent Events (SSE) Live Streaming Workflow
app.get('/api/stream', async (req: Request, res: Response) => {
  const topic = req.query.topic as string;
  const researchQuestion = req.query.researchQuestion as string | undefined;
  const academicLevel = (req.query.academicLevel as any) || 'undergraduate';
  const briefLength = (req.query.briefLength as any) || 'medium';
  const preferredSourceTypes = (req.query.preferredSourceTypes as any) || 'all';

  if (!topic || topic.trim().length < 3) {
    res.status(400).json({ error: 'A valid research topic is required.' });
    return;
  }

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const payload: BriefGenerationRequest = {
      topic: topic.trim(),
      researchQuestion: researchQuestion?.trim(),
      academicLevel,
      briefLength,
      preferredSourceTypes,
    };

    sendEvent('status', { message: 'Initiating source-grounded academic research...' });

    const brief = await executeAcademicWorkflow(payload, (update) => {
      sendEvent('stage_progress', update);
    });

    // Save inputs, outputs, and evaluation metrics & trigger automated export
    const record = await saveEvaluationAndTriggerAutomation(payload, brief);
    sendEvent('storage_saved', record);

    sendEvent('complete', brief);
    res.end();
  } catch (error: any) {
    console.error('Streaming workflow error:', error);
    sendEvent('error', {
      message: error.message || 'Failed to complete academic brief synthesis.',
    });
    res.end();
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: {
          ignored: [
            '**/server/**',
            '**/server/data/**',
            '**/tests/**',
            '**/*.csv',
            '**/*.json',
            '**/*.md',
          ],
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Academic Brief Generator Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
