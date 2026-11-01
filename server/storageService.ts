import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AcademicBriefData, BriefGenerationRequest } from '../src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const JSON_FILE = path.join(DATA_DIR, 'evaluations.json');
const CSV_FILE = path.join(DATA_DIR, 'evaluations.csv');

export interface StoredEvaluationRecord {
  id: string;
  timestamp: string;
  topic: string;
  academicLevel: string;
  briefLength: string;
  preferredSourceTypes: string;
  title: string;
  totalSources: number;
  totalClaims: number;
  supportedClaims: number;
  verificationRigorScore: number;
  averageCredibilityScore: number;
  automatedExportTriggered: boolean;
  exportedFilePath?: string;
}

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(JSON_FILE)) {
    fs.writeFileSync(JSON_FILE, JSON.stringify([], null, 2), 'utf-8');
  }

  if (!fs.existsSync(CSV_FILE)) {
    const csvHeaders = [
      'id',
      'timestamp',
      'topic',
      'academicLevel',
      'briefLength',
      'title',
      'totalSources',
      'totalClaims',
      'supportedClaims',
      'verificationRigorScore',
      'averageCredibilityScore',
      'automatedExportTriggered',
    ].join(',');
    fs.writeFileSync(CSV_FILE, csvHeaders + '\n', 'utf-8');
  }
}

/**
 * Automates the saving of inputs, outputs, and evaluation metrics to both
 * a persistent JSON database and an append-only CSV spreadsheet.
 * Also triggers automated dossier export.
 */
export async function saveEvaluationAndTriggerAutomation(
  req: BriefGenerationRequest,
  brief: AcademicBriefData
): Promise<StoredEvaluationRecord> {
  ensureDataFiles();

  const id = `EVAL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  const timestamp = new Date().toISOString();

  // 1. Automated Action: Generate and export formatted academic Markdown dossier to disk
  const exportFileName = `dossier_${brief.topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${id}.md`;
  const exportPath = path.join(DATA_DIR, exportFileName);

  const dossierContent = [
    `# ${brief.title}`,
    `**Inquiry Topic:** ${brief.topic}`,
    `**Core Research Question:** ${brief.researchQuestion}`,
    `**Academic Level:** ${brief.academicLevel.toUpperCase()}`,
    `**Evaluation ID:** ${id}`,
    `**Timestamp:** ${timestamp}`,
    `**Verification Rigor Score:** ${brief.metrics.verificationRigorScore}%`,
    `**Average Source Credibility:** ${brief.metrics.averageSourceCredibility}%`,
    '',
    '---',
    '',
    '## 1. Executive Summary',
    brief.executiveSummary,
    '',
    '## 2. Key Findings',
    ...brief.keyFindings.map((kf, i) => `${i + 1}. ${kf}`),
    '',
    '## 3. Evidence Analysis',
    brief.evidenceAnalysis,
    '',
    '## 4. Research Limitations & Conflicting Evidence',
    brief.limitationsAndConflictingInfo,
    '',
    '## 5. Verified Claim Ledger',
    ...brief.claims.map(
      (c) =>
        `- **[${c.id}]** "${c.claimText}" | Status: ${c.status.toUpperCase()} (${c.confidenceScore}%)\n  *Rationale:* ${c.rationale}`
    ),
    '',
    '## 6. Citations & References',
    ...brief.references.map((r) => `[${r.id}] ${r.formattedCitation}`),
  ].join('\n');

  fs.writeFileSync(exportPath, dossierContent, 'utf-8');

  // 2. Prepare Database Record
  const record: StoredEvaluationRecord = {
    id,
    timestamp,
    topic: req.topic,
    academicLevel: req.academicLevel,
    briefLength: req.briefLength,
    preferredSourceTypes: req.preferredSourceTypes,
    title: brief.title,
    totalSources: brief.sources.length,
    totalClaims: brief.claims.length,
    supportedClaims: brief.metrics.supportedCount,
    verificationRigorScore: brief.metrics.verificationRigorScore,
    averageCredibilityScore: brief.metrics.averageSourceCredibility,
    automatedExportTriggered: true,
    exportedFilePath: exportPath,
  };

  // 3. Save to JSON store
  try {
    const raw = fs.readFileSync(JSON_FILE, 'utf-8');
    const records: StoredEvaluationRecord[] = JSON.parse(raw || '[]');
    records.unshift(record);
    fs.writeFileSync(JSON_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to update evaluations.json:', err);
  }

  // 4. Save to CSV spreadsheet
  try {
    const csvRow = [
      `"${record.id}"`,
      `"${record.timestamp}"`,
      `"${record.topic.replace(/"/g, '""')}"`,
      `"${record.academicLevel}"`,
      `"${record.briefLength}"`,
      `"${record.title.replace(/"/g, '""')}"`,
      record.totalSources,
      record.totalClaims,
      record.supportedClaims,
      record.verificationRigorScore,
      record.averageCredibilityScore,
      record.automatedExportTriggered,
    ].join(',');
    fs.appendFileSync(CSV_FILE, csvRow + '\n', 'utf-8');
  } catch (err) {
    console.error('Failed to update evaluations.csv:', err);
  }

  return record;
}

export function getStoredEvaluations(): StoredEvaluationRecord[] {
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(JSON_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
}

