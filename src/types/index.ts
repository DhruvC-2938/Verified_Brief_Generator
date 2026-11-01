export type AcademicLevel = 'beginner' | 'undergraduate' | 'advanced';
export type BriefLength = 'short' | 'medium' | 'long';
export type SourceTypeFilter = 'all' | 'gov' | 'edu' | 'news' | 'reports' | 'papers';

export type VerificationStatus = 'supported' | 'partially_supported' | 'contradicted' | 'unverified';

export interface SourceItem {
  id: string; // e.g. "S1", "S2"
  title: string;
  url: string;
  publisher: string;
  domain: string;
  publishedDate: string; // or "Unavailable / Undated"
  sourceType: 'Government' | 'Educational' | 'News' | 'Official Report' | 'Research Paper' | 'Organizational';
  credibilityScore: number; // 0-100
  credibilityTier: 'High Authority' | 'Moderate Authority' | 'Standard Reference';
  credibilityNotes: string;
  excerpt: string;
  accessible: boolean;
}

export interface ClaimVerification {
  id: string; // e.g. "CLM-001"
  claimText: string;
  sourceIds: string[]; // e.g. ["S1", "S3"]
  evidenceExcerpt: string;
  status: VerificationStatus;
  confidenceScore: number; // 0 - 100
  rationale: string;
  sectionRef: 'Executive Summary' | 'Introduction' | 'Key Findings' | 'Evidence Analysis' | 'Limitations & Conflicts' | 'Conclusion';
  contradictionFlag?: boolean;
  revisedText?: string;
  originalClaimBeforeRevision?: string;
}

export interface BriefSection {
  heading: string;
  content: string;
}

export interface AcademicReference {
  id: string; // e.g. "S1"
  citationNumber: number;
  authorsOrPublisher: string;
  title: string;
  publicationDate: string;
  url: string;
  sourceType: string;
  formattedCitation: string;
}

export interface StageAudit {
  stageNumber: number;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'flagged';
  durationMs: number;
  detailSummary: string;
  outputArtifacts?: Record<string, any>;
}

export interface AcademicBriefData {
  id: string;
  title: string;
  topic: string;
  researchQuestion: string;
  academicLevel: AcademicLevel;
  briefLength: BriefLength;
  generatedAt: string;
  isDemoSample?: boolean; // Distinguishes predefined DEMO sample data from live research
  insufficientEvidence?: boolean; // Indicates if live search found insufficient empirical sources
  insufficientEvidenceMessage?: string;
  executiveSummary: string;
  introduction: string;
  keyFindings: string[];
  evidenceAnalysis: string;
  limitationsAndConflictingInfo: string;
  conclusion: string;
  claims: ClaimVerification[];
  sources: SourceItem[];
  references: AcademicReference[];
  stages: StageAudit[];
  metrics: {
    totalSourcesFound: number;
    sourcesRetained: number;
    totalClaimsEvaluated: number;
    supportedCount: number;
    partiallySupportedCount: number;
    contradictedCount: number;
    unverifiedCount: number;
    verificationRigorScore: number; // e.g. 88
    averageSourceCredibility: number;
  };
}

export interface BriefGenerationRequest {
  topic: string;
  researchQuestion?: string;
  academicLevel: AcademicLevel;
  briefLength: BriefLength;
  preferredSourceTypes: SourceTypeFilter;
}

export interface StageProgressUpdate {
  stage: number;
  totalStages: number;
  stageName: string;
  message: string;
  data?: Partial<AcademicBriefData>;
}
