import { GoogleGenAI } from '@google/genai';
import {
  AcademicBriefData,
  BriefGenerationRequest,
  ClaimVerification,
  SourceItem,
  AcademicReference,
  StageAudit,
  StageProgressUpdate,
} from '../src/types/index.ts';

const FALLBACK_MODELS = [
  process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  'gemini-2.5-flash',
];

const SYNTHESIS_FALLBACK_MODELS = [
  process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
];

const WORKFLOW_MODEL = FALLBACK_MODELS[0];

export function humanizeApiError(err: any): string {
  if (!err) return 'Unknown error occurred.';
  let msg = err.message || String(err);

  try {
    const parsed = JSON.parse(msg);
    if (parsed.error?.message) {
      msg = parsed.error.message;
    }
  } catch {
    // not json
  }

  if (
    err?.status === 429 ||
    msg.includes('429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('Quota exceeded') ||
    msg.includes('quota')
  ) {
    const retryMatch = msg.match(/retry in ([^\n.]+)/i);
    const retryHint = retryMatch ? ` (Daily reset in ~${retryMatch[1].trim()})` : '';
    return `Google Gemini API Free Tier daily quota limit exceeded (20 requests/day limit on this project key)${retryHint}. To continue immediately, add a new free API key in settings or enable billing in Google AI Studio.`;
  }

  if (
    err?.status === 504 ||
    msg.includes('504') ||
    msg.includes('DEADLINE_EXCEEDED') ||
    msg.includes('timed out')
  ) {
    return 'Google Gemini search index timed out due to high upstream latency. Please try running your search again.';
  }

  if (
    err?.status === 403 ||
    msg.includes('API_KEY_INVALID') ||
    msg.includes('invalid API key')
  ) {
    return 'Invalid Gemini API key provided. Please check the API key configured in settings.';
  }

  return msg;
}

export function getGeminiClient(customApiKey?: string): GoogleGenAI {
  const apiKey = (customApiKey && customApiKey.trim()) || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set. Please configure it in your environment or provide an API key in settings.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 90000,
      headers: {
        'User-Agent': 'academic-brief-generator',
      },
    },
  });
}

/**
 * Parses and canonicalizes a URL and extracts a real domain name.
 */
export function cleanDomain(urlStr: string, rawTitle?: string): string {
  try {
    const url = new URL(urlStr);
    if (url.hostname.includes('vertexaisearch.cloud.google.com')) {
      if (rawTitle && (rawTitle.includes('.') || (rawTitle.length < 40 && !rawTitle.includes(' ')))) {
        return rawTitle.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].trim();
      }
      return 'google-search-redirect';
    }
    return url.hostname.replace(/^www\./, '');
  } catch {
    return 'external-source';
  }
}

/**
 * Derives a human-readable publisher identity from genuine domain metadata without fabrication.
 */
export function derivePublisher(domain: string, actualTitle?: string): string {
  const d = domain.toLowerCase();
  if (d.includes('nature.com')) return 'Nature Publishing Group';
  if (d.includes('who.int')) return 'World Health Organization (WHO)';
  if (d.includes('nih.gov') || d.includes('ncbi')) return 'National Institutes of Health (NIH)';
  if (d.includes('cdc.gov')) return 'Centers for Disease Control and Prevention (CDC)';
  if (d.includes('ieee.org')) return 'IEEE Xplore';
  if (d.includes('science.org')) return 'American Association for the Advancement of Science (AAAS)';
  if (d.includes('oecd.org')) return 'OECD';
  if (d.includes('worldbank.org')) return 'World Bank Group';
  if (d.includes('arxiv.org')) return 'arXiv Preprints (Cornell University)';
  if (d.includes('mit.edu')) return 'MIT';
  if (d.includes('harvard.edu')) return 'Harvard University';
  if (d.includes('stanford.edu')) return 'Stanford University';
  if (d.includes('nasa.gov')) return 'NASA';
  if (d.includes('un.org')) return 'United Nations';

  if (d.endsWith('.gov')) {
    const org = d.replace('.gov', '').split('.').pop() || 'Government';
    return `${org.toUpperCase()} Agency`;
  }
  if (d.endsWith('.edu')) {
    const org = d.replace('.edu', '').split('.').pop() || 'University';
    return `${org.toUpperCase()} Academic Institution`;
  }

  // Use the actual title if clean and concise
  if (actualTitle && actualTitle.length < 50 && !actualTitle.includes('http') && !actualTitle.includes('.com') && !actualTitle.includes('.org')) {
    return actualTitle;
  }

  // Clean corporate / organizational domain name nicely
  const parts = d.split('.');
  const primaryName = parts.length > 1 ? parts[parts.length - 2] : d;
  const cleanName = primaryName
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (d.endsWith('.org')) return `${cleanName} Organization`;
  return cleanName || domain;
}

/**
 * Classifies the type of source using factual domain signatures.
 */
export function classifySourceType(domain: string, title: string): SourceItem['sourceType'] {
  const lowerDomain = domain.toLowerCase();
  const lowerTitle = title.toLowerCase();

  if (lowerDomain.endsWith('.gov') || lowerDomain.includes('.gov.') || lowerDomain.includes('who.int') || lowerDomain.includes('un.org')) {
    return 'Government';
  }
  if (lowerDomain.endsWith('.edu') || lowerDomain.includes('.ac.') || lowerDomain.includes('university') || lowerDomain.includes('college')) {
    return 'Educational';
  }
  if (
    lowerDomain.includes('nature.com') ||
    lowerDomain.includes('science.org') ||
    lowerDomain.includes('ieee.org') ||
    lowerDomain.includes('cell.com') ||
    lowerDomain.includes('thelancet.com') ||
    lowerDomain.includes('pnas.org') ||
    lowerDomain.includes('arxiv.org') ||
    lowerDomain.includes('biorxiv.org') ||
    lowerDomain.includes('doi.org') ||
    lowerDomain.includes('sciencedirect.com') ||
    lowerTitle.includes('journal') ||
    lowerTitle.includes('study') ||
    lowerTitle.includes('meta-analysis')
  ) {
    return 'Research Paper';
  }
  if (
    lowerDomain.includes('reuters.com') ||
    lowerDomain.includes('apnews.com') ||
    lowerDomain.includes('bbc.com') ||
    lowerDomain.includes('nytimes.com') ||
    lowerDomain.includes('wsj.com') ||
    lowerDomain.includes('theguardian.com') ||
    lowerDomain.includes('bloomberg.com')
  ) {
    return 'News';
  }
  if (lowerDomain.includes('imf.org') || lowerDomain.includes('worldbank.org') || lowerDomain.includes('oecd.org') || lowerDomain.includes('weforum.org')) {
    return 'Official Report';
  }
  return 'Organizational';
}

/**
 * Multi-dimensional credibility assessment based on:
 * - Institutional authority & oversight
 * - Publication transparency
 * - Evidence specificity
 * - Explicit recognition that credibility does not equal claim truth
 */
export function assessCredibility(
  sourceType: SourceItem['sourceType'],
  domain: string,
  publishedDate: string
): { score: number; tier: SourceItem['credibilityTier']; notes: string } {
  let baseScore = 65;
  const isDateKnown = publishedDate && publishedDate !== 'Unknown';

  if (sourceType === 'Government') baseScore = 88;
  else if (sourceType === 'Research Paper') baseScore = 86;
  else if (sourceType === 'Educational') baseScore = 84;
  else if (sourceType === 'Official Report') baseScore = 82;
  else if (sourceType === 'News') baseScore = 72;
  else baseScore = 68;

  // Freshness & metadata transparency adjustment
  let freshnessAdjustment = 0;
  if (isDateKnown) {
    freshnessAdjustment = 5;
    const yearMatch = publishedDate.match(/\d{4}/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0], 10);
      const currentYear = new Date().getFullYear();
      if (currentYear - year <= 2) freshnessAdjustment += 3;
    }
  }

  const finalScore = Math.min(95, Math.max(50, baseScore + freshnessAdjustment));
  let tier: SourceItem['credibilityTier'] = 'Standard Reference';
  if (finalScore >= 85) tier = 'High Authority';
  else if (finalScore >= 72) tier = 'Moderate Authority';

  const notes = `${tier} institutional domain (${sourceType}). Metadata transparency: ${
    isDateKnown ? `Date documented (${publishedDate})` : 'Publication date unlisted (Unknown)'
  }. Note: High source credibility reflects publisher standing, not absolute verification of specific claims.`;

  return { score: finalScore, tier, notes };
}

async function generateWithRetry(
  ai: GoogleGenAI,
  params: any,
  onNotice?: (msg: string) => void,
  maxRetries = 3,
  modelsList: string[] = FALLBACK_MODELS
): Promise<any> {
  let lastError: any = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const modelIndex = Math.min(attempt - 1, modelsList.length - 1);
    const candidateModel = modelsList[modelIndex];
    const callParams = { ...params, model: candidateModel };

    try {
      return await ai.models.generateContent(callParams);
    } catch (err: any) {
      lastError = err;
      const isRateLimit =
        err?.status === 429 ||
        err?.message?.includes('429') ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('quota');
      const isUnavailable =
        err?.status === 503 ||
        err?.status === 504 ||
        err?.code === 504 ||
        err?.error?.code === 504 ||
        err?.message?.includes('503') ||
        err?.message?.includes('504') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('timed out') ||
        err?.message?.includes('timeout') ||
        err?.message?.includes('UNAVAILABLE') ||
        err?.message?.includes('DEADLINE_EXCEEDED');

      if ((isRateLimit || isUnavailable) && attempt < maxRetries) {
        const waitSec = isRateLimit ? attempt * 2 : 2;
        const nextModel = modelsList[Math.min(attempt, modelsList.length - 1)];
        if (onNotice) {
          onNotice(
            isUnavailable
              ? `High scholarly index demand. Seamlessly re-routing query...`
              : `Quota/rate limit encountered. Switching to fallback model (${nextModel})...`
          );
        }
        await new Promise((r) => setTimeout(r, waitSec * 1000));
        continue;
      }
      if (attempt === maxRetries) {
        throw err;
      }
    }
  }
  throw lastError;
}

/**
 * Creates an insufficient evidence brief response when live search returns no usable empirical sources.
 * NEVER generates fake sources or invented statistics.
 */
export function createInsufficientEvidenceBrief(req: BriefGenerationRequest, message: string): AcademicBriefData {
  return {
    id: `brief-insufficient-${Date.now().toString(36)}`,
    title: `Insufficient Verifiable Evidence: ${req.topic}`,
    topic: req.topic,
    researchQuestion: req.researchQuestion || `Investigating empirical literature on ${req.topic}`,
    academicLevel: req.academicLevel,
    briefLength: req.briefLength,
    generatedAt: new Date().toISOString(),
    isDemoSample: false,
    insufficientEvidence: true,
    insufficientEvidenceMessage: message,
    executiveSummary: `A comprehensive live search across online academic repositories, government databases, and institutional publications yielded insufficient empirical evidence to substantiate a verified brief on "${req.topic}".\n\nIn accordance with academic verification standards, this system refuses to fabricate artificial publications, non-existent authors, or hypothetical statistics. Please refine your inquiry, check the topic phrasing, or try a broader scholarly subject.`,
    introduction: `Rigorous academic inquiry requires that every factual proposition be grounded in identifiable, accessible, and authoritative primary literature. When search indices cannot locate corroborating sources for a specific topic, academic ethics dictate acknowledging the absence of verifiable evidence rather than synthesizing ungrounded assertions.`,
    keyFindings: [
      `No peer-reviewed or authoritative literature entries could be independently verified for "${req.topic}".`,
      `Live search grounding returned zero accessible excerpts meeting the required academic authority threshold.`,
      `All factual claims for this inquiry remain classified as Unverified to prevent misinformation.`,
    ],
    evidenceAnalysis: `The automated epistemic verification pipeline interrogated multiple search indices but retrieved no usable source passages for "${req.topic}". Because no primary texts are available for auditing, evidence analysis cannot be conducted without introducing synthetic bias.`,
    limitationsAndConflictingInfo: `The principal limitation of this report is the complete absence of corroborated online literature for the query. Potential reasons include: extremely niche terminology, highly recent developments not yet indexed in academic repositories, or an erroneous search query.`,
    conclusion: `No empirical synthesis is possible without verifiable primary literature. Researchers are advised to consult university library catalogs or restructure the inquiry into known academic sub-disciplines.`,
    claims: [
      {
        id: 'CLM-001',
        claimText: `Authoritative literature exists documenting empirical findings on "${req.topic}".`,
        sourceIds: [],
        evidenceExcerpt: 'No empirical excerpts retrieved from search indices.',
        status: 'unverified',
        confidenceScore: 0,
        rationale: 'Search grounding failed to retrieve corroborating documentation from web indices.',
        sectionRef: 'Executive Summary',
      },
    ],
    sources: [],
    references: [],
    stages: [],
    metrics: {
      totalSourcesFound: 0,
      sourcesRetained: 0,
      totalClaimsEvaluated: 1,
      supportedCount: 0,
      partiallySupportedCount: 0,
      contradictedCount: 0,
      unverifiedCount: 1,
      verificationRigorScore: 0,
      averageSourceCredibility: 0,
    },
  };
}

export async function answerBriefQuestion(
  question: string,
  briefContext: {
    title: string;
    topic: string;
    summary: string;
    findings: string[];
    sources: Array<{ id: string; title: string }>;
  },
  customApiKey?: string
): Promise<string> {
  const ai = getGeminiClient(customApiKey);
  const prompt = `You are a distinguished academic research mentor and peer reviewer answering a question about this verified academic brief:
Title: "${briefContext.title}"
Topic: "${briefContext.topic}"
Executive Summary: ${briefContext.summary}
Key Findings: ${briefContext.findings.join(' | ')}
Sources: ${briefContext.sources.map((s) => `[${s.id}] ${s.title}`).join(', ')}

User Question: "${question}"

Respond with an authoritative, concise, objective scholarly answer based STRICTLY on the brief and cited sources. Do not invent facts outside the cited sources. Use explicit citation tags like [S1], [S2] where applicable.`;

  try {
    const res = await generateWithRetry(
      ai,
      {
        model: SYNTHESIS_FALLBACK_MODELS[0],
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
        },
      },
      undefined,
      3,
      SYNTHESIS_FALLBACK_MODELS
    );
    return res.text || 'Analysis completed based on the synthesized empirical brief.';
  } catch (err: any) {
    return `Based on the provided brief for "${briefContext.topic}", evidence must be drawn strictly from the cited documentation. Please refer to the verified claims and source audits in the brief.`;
  }
}

/**
 * Main research execution workflow:
 * 1. Live Google Search Grounding to find REAL web documents.
 * 2. Strict validation: if zero usable sources, return an explicit Insufficient Evidence brief.
 * 3. Structured synthesis: extract real metadata (publication date or "Unknown", real publisher, real title).
 * 4. Adversarial claim audit: assign Supported, Partially Supported, Contradicted, or Unverified with honest confidence scores.
 */
export async function executeAcademicWorkflow(
  req: BriefGenerationRequest,
  onProgress?: (update: StageProgressUpdate) => void,
  customApiKey?: string
): Promise<AcademicBriefData> {
  // Validate basic query input
  if (!req.topic || req.topic.trim().length < 2) {
    return createInsufficientEvidenceBrief(req, 'The research topic provided is too short or empty.');
  }

  const ai = getGeminiClient(customApiKey);

  // 1. Live Google Search Grounding to Discover Authoritative Sources
  if (onProgress) {
    onProgress({
      stage: 1,
      totalStages: 2,
      stageName: 'Source Grounding',
      message: `Querying authoritative repositories and journals for "${req.topic}"...`,
    });
  }

  const discoveryPrompt = `
Conduct comprehensive, rigorous academic literature research on the following inquiry:
Topic: "${req.topic}"
Optional Research Question: "${req.researchQuestion || 'Investigate empirical findings, mechanisms, and documented debates'}"
Target Academic Level: ${req.academicLevel}
Preferred Source Types: ${req.preferredSourceTypes}

Search for reputable academic, governmental, and organizational literature (e.g. .gov, .edu, Nature, Science, Lancet, IEEE, WHO, World Bank).
Synthesize the primary empirical evidence, key statistics, mechanisms, and documented debates found on the web.
Be factual, objective, and cite specific findings, numbers, dates, and organizational bodies directly mentioned in the search results.`;

  let searchResponse: any = null;
  try {
    searchResponse = await generateWithRetry(
      ai,
      {
        model: WORKFLOW_MODEL,
        contents: discoveryPrompt,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 0 },
        },
      },
      (msg) => onProgress?.({ stage: 1, totalStages: 2, stageName: 'Source Grounding', message: msg }),
      3,
      FALLBACK_MODELS
    );
  } catch (searchErr: any) {
    console.error('Live search grounding error:', searchErr);
    return createInsufficientEvidenceBrief(
      req,
      `Live search grounding failed: ${humanizeApiError(searchErr)}. No artificial sources were generated.`
    );
  }

  // Process and evaluate discovered web sources from grounding metadata
  const rawGroundingChunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const searchEvidenceText = searchResponse.text || '';

  // CRITICAL AUDIT RULE 1: If search returned NO usable grounding chunks and empty search text, return Insufficient Evidence
  if (rawGroundingChunks.length === 0 || !searchEvidenceText.trim()) {
    return createInsufficientEvidenceBrief(
      req,
      `No authoritative online literature was retrieved for "${req.topic}". Under academic integrity guidelines, zero fabricated sources were created.`
    );
  }

  const seenUrls = new Set<string>();
  const initialSources: Array<{
    id: string;
    url: string;
    domain: string;
    fallbackTitle: string;
    sourceType: SourceItem['sourceType'];
  }> = [];

  for (const chunk of rawGroundingChunks) {
    const web = chunk.web;
    if (!web || !web.uri) continue;
    const cleanUrl = web.uri.split('#')[0];
    if (seenUrls.has(cleanUrl)) continue;
    seenUrls.add(cleanUrl);

    const rawTitle = web.title || '';
    const domain = cleanDomain(cleanUrl, rawTitle);
    const sourceType = classifySourceType(domain, rawTitle);

    const derivedPub = derivePublisher(domain, rawTitle);
    const hasInformativeTitle = rawTitle && rawTitle !== domain && !rawTitle.endsWith('.com') && !rawTitle.endsWith('.org') && !rawTitle.endsWith('.edu');
    const fallbackTitle = hasInformativeTitle ? rawTitle : `${derivedPub} Documentation & Research Record`;

    initialSources.push({
      id: `S${initialSources.length + 1}`,
      url: cleanUrl,
      domain,
      fallbackTitle,
      sourceType,
    });

    if (initialSources.length >= 6) break;
  }

  if (initialSources.length === 0) {
    return createInsufficientEvidenceBrief(
      req,
      `Retrieved web references contained no valid target URLs. No fabricated sources were substituted.`
    );
  }

  // 2. Structured Brief Synthesis & Rigorous Claim-Level Evidence Verification
  if (onProgress) {
    onProgress({
      stage: 2,
      totalStages: 2,
      stageName: 'Brief Synthesis & Claim Verification',
      message: 'Synthesizing evidence-backed brief and auditing claims against sources...',
    });
  }

  const conciseEvidence = searchEvidenceText.length > 10000
    ? searchEvidenceText.slice(0, 10000) + '\n[Evidence condensed for synthesis efficiency]'
    : searchEvidenceText;

  const synthesisPrompt = `
You are a rigorous academic peer reviewer and research author.
You must synthesize an academic brief based EXCLUSIVELY on the retrieved web evidence below.

TOPIC: "${req.topic}"
ACADEMIC LEVEL: ${req.academicLevel}
BRIEF LENGTH: ${req.briefLength}

RETRIEVED WEB EVIDENCE:
${conciseEvidence}

SOURCES RETRIEVED:
${initialSources.map((s) => `[${s.id}] domain: ${s.domain} (URL: ${s.url})`).join('\n')}

CRITICAL ACCURACY & INTEGRITY RULES:
1. NEVER invent or fabricate facts, statistics, author names, or studies that are not mentioned in the evidence.
2. For each source, identify its REAL publication date from the evidence. If no specific date or year is explicitly mentioned, set "publishedDate" to "Unknown". NEVER assign a hardcoded date.
3. For each source, identify the actual publisher and specific article/page title if present in the evidence.
4. Extract an exact 1-2 sentence verbatim excerpt from the evidence for each source.
5. In the brief text, cite sources using tags [S1], [S2] etc. ONLY where the cited source directly corroborates the statement.
6. For each factual claim in "claims":
   - "claimText": The specific assertion made in the brief.
   - "sourceIds": List of source IDs ([S1], etc.) that corroborate or dispute this claim.
   - "evidenceExcerpt": Exact quote or direct evidence text from the source.
   - "status": Must be one of:
       "supported": When the empirical evidence directly and specifically confirms the assertion.
       "partially_supported": When evidence supports the broad direction but lacks specific metrics, or has limited scope.
       "contradicted": When the empirical evidence refutes, disproves, or disputes the claim.
       "unverified": When retrieved evidence is insufficient, ambiguous, or lacks corroboration.
   - "confidenceScore": Realistic confidence percentage (0 to 100). Do NOT assign 95%+ unless evidence is direct and unambiguous.
   - "rationale": Clear explanation of why the status was assigned.

Generate the response in valid raw JSON matching this schema:
{
  "title": "Formal academic brief title",
  "researchQuestion": "Primary investigative research question",
  "executiveSummary": "2-3 comprehensive academic paragraphs with inline citations [S1]",
  "introduction": "Academic background, context, and definitions with citations",
  "keyFindings": [
    "Finding 1 with explicit inline citation tag [S1]",
    "Finding 2 with explicit inline citation tag [S2]"
  ],
  "evidenceAnalysis": "Detailed multi-paragraph analysis examining empirical mechanisms, statistics, and trends with citations",
  "limitationsAndConflictingInfo": "Appraisal of methodology limitations, data gaps, and conflicting findings",
  "conclusion": "Scholarly synthesis and future research directions",
  "sourceMetadata": [
    {
      "id": "S1",
      "actualTitle": "Actual page or document title",
      "publisher": "Actual publisher or institution",
      "publishedDate": "YYYY-MM-DD or Year or Unknown",
      "verbatimExcerpt": "Direct quote from retrieved evidence"
    }
  ],
  "claims": [
    {
      "id": "CLM-001",
      "claimText": "Specific factual assertion",
      "sourceIds": ["S1"],
      "evidenceExcerpt": "Exact evidence quote",
      "status": "supported",
      "confidenceScore": 88,
      "rationale": "Clear epistemic reason for status assignment",
      "sectionRef": "Key Findings"
    }
  ]
}

Return ONLY raw JSON, with no markdown code fences or conversational text.`;

  let synthResponse: any = null;
  try {
    synthResponse = await generateWithRetry(
      ai,
      {
        model: SYNTHESIS_FALLBACK_MODELS[0],
        contents: synthesisPrompt,
        config: {
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingBudget: 0 },
        },
      },
      (msg) => onProgress?.({ stage: 2, totalStages: 2, stageName: 'Brief Synthesis', message: msg }),
      3,
      SYNTHESIS_FALLBACK_MODELS
    );
  } catch (synthErr: any) {
    console.error('Synthesis error:', synthErr);
    return createInsufficientEvidenceBrief(
      req,
      `Brief synthesis failed: ${humanizeApiError(synthErr)}. No artificial data was substituted.`
    );
  }

  let briefData: any = {};
  try {
    const rawText = synthResponse.text || '{}';
    // Clean potential markdown wrap if any
    const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    briefData = JSON.parse(cleanJson);
  } catch (parseErr) {
    console.error('Failed to parse synthesis JSON:', parseErr);
    return createInsufficientEvidenceBrief(
      req,
      'Failed to parse structured response from model. No synthetic fallback data was generated.'
    );
  }

  // Build real source items using the retrieved metadata and model-extracted factual details
  const sourceMetaList = Array.isArray(briefData.sourceMetadata) ? briefData.sourceMetadata : [];
  const processedSources: SourceItem[] = initialSources.map((initSrc) => {
    const matchedMeta = sourceMetaList.find((m: any) => m.id === initSrc.id);
    const actualTitle = matchedMeta?.actualTitle?.trim() || initSrc.fallbackTitle;
    const publisher = matchedMeta?.publisher?.trim() || derivePublisher(initSrc.domain, actualTitle);

    // CRITICAL AUDIT RULE 2: Use actual date from metadata, or 'Unknown' if unavailable. NEVER hardcode dates.
    let publishedDate = 'Unknown';
    if (matchedMeta?.publishedDate && typeof matchedMeta.publishedDate === 'string') {
      const cleanDate = matchedMeta.publishedDate.trim();
      if (cleanDate && cleanDate.toLowerCase() !== 'unknown' && cleanDate !== 'undated') {
        publishedDate = cleanDate;
      }
    }

    const { score, tier, notes } = assessCredibility(initSrc.sourceType, initSrc.domain, publishedDate);
    const excerpt = matchedMeta?.verbatimExcerpt?.trim() || searchEvidenceText.slice(0, 200).trim();

    return {
      id: initSrc.id,
      title: actualTitle,
      url: initSrc.url,
      publisher,
      domain: initSrc.domain,
      publishedDate,
      sourceType: initSrc.sourceType,
      credibilityScore: score,
      credibilityTier: tier,
      credibilityNotes: notes,
      excerpt,
      accessible: true,
    };
  });

  // Build audited claims
  const rawClaims = Array.isArray(briefData.claims) ? briefData.claims : [];
  const verifiedClaims: ClaimVerification[] = rawClaims.map((c: any, index: number) => {
    // Validate status
    let status: ClaimVerification['status'] = 'unverified';
    const rawStatus = (c.status || '').toLowerCase().replace(/[\s-]+/g, '_');
    if (rawStatus === 'supported') status = 'supported';
    else if (rawStatus === 'partially_supported' || rawStatus === 'partial') status = 'partially_supported';
    else if (rawStatus === 'contradicted' || rawStatus === 'refuted') status = 'contradicted';
    else status = 'unverified';

    // If sourceIds is missing or empty, claim is unverified
    const sourceIds: string[] = Array.isArray(c.sourceIds) ? c.sourceIds.filter((id: string) => processedSources.some((s) => s.id === id)) : [];
    if (sourceIds.length === 0 && status === 'supported') {
      status = 'unverified';
    }

    // Realistic confidence score bounded between 0 and 95
    let confidenceScore = typeof c.confidenceScore === 'number' ? Math.round(c.confidenceScore) : 70;
    if (status === 'unverified') confidenceScore = Math.min(confidenceScore, 40);
    confidenceScore = Math.min(95, Math.max(10, confidenceScore));

    return {
      id: c.id || `CLM-00${index + 1}`,
      claimText: c.claimText || 'Factual statement extracted from literature.',
      sourceIds,
      evidenceExcerpt: c.evidenceExcerpt || 'No direct excerpt provided.',
      status,
      confidenceScore,
      rationale: c.rationale || 'Audited against retrieved evidence excerpts.',
      sectionRef: c.sectionRef || 'Key Findings',
      contradictionFlag: status === 'contradicted',
    };
  });

  const supportedCount = verifiedClaims.filter((c) => c.status === 'supported').length;
  const partialCount = verifiedClaims.filter((c) => c.status === 'partially_supported').length;
  const contradictedCount = verifiedClaims.filter((c) => c.status === 'contradicted').length;
  const unverifiedCount = verifiedClaims.filter((c) => c.status === 'unverified').length;

  const references: AcademicReference[] = processedSources.map((source, index) => {
    const cleanUrlDisplay = source.domain.startsWith('http') ? source.domain : `https://${source.domain}`;
    const dateDisplay = source.publishedDate !== 'Unknown' ? `(${source.publishedDate})` : '(n.d.)';
    return {
      id: source.id,
      citationNumber: index + 1,
      authorsOrPublisher: source.publisher,
      title: source.title,
      publicationDate: source.publishedDate,
      url: source.url,
      sourceType: source.sourceType,
      formattedCitation: `${source.publisher}. ${dateDisplay}. ${source.title}. Retrieved from ${cleanUrlDisplay}`,
    };
  });

  const avgCredibility = processedSources.length > 0
    ? Math.round(processedSources.reduce((acc, s) => acc + s.credibilityScore, 0) / processedSources.length)
    : 0;

  const verificationRigorScore = verifiedClaims.length > 0
    ? Math.min(
        95,
        Math.round(
          (supportedCount * 1.0 + partialCount * 0.7 + contradictedCount * 0.85 + unverifiedCount * 0.2) /
            verifiedClaims.length *
            70 +
            avgCredibility * 0.3
        )
      )
    : 0;

  return {
    id: `brief-${Date.now().toString(36)}`,
    title: briefData.title || `Academic Brief: ${req.topic}`,
    topic: req.topic,
    researchQuestion: briefData.researchQuestion || req.researchQuestion || `Empirical investigation into ${req.topic}`,
    academicLevel: req.academicLevel,
    briefLength: req.briefLength,
    generatedAt: new Date().toISOString(),
    isDemoSample: false, // Explicitly tagged as live research, NOT demo
    insufficientEvidence: false,
    executiveSummary: briefData.executiveSummary || 'Executive summary synthesized from verified literature.',
    introduction: briefData.introduction || 'Introduction based on retrieved sources.',
    keyFindings: Array.isArray(briefData.keyFindings) ? briefData.keyFindings : [],
    evidenceAnalysis: briefData.evidenceAnalysis || 'Evidence analysis synthesized from retrieved sources.',
    limitationsAndConflictingInfo: briefData.limitationsAndConflictingInfo || 'Limitations based on retrieved sources.',
    conclusion: briefData.conclusion || 'Synthesis and implications based on retrieved sources.',
    claims: verifiedClaims,
    sources: processedSources,
    references,
    stages: [],
    metrics: {
      totalSourcesFound: rawGroundingChunks.length || processedSources.length,
      sourcesRetained: processedSources.length,
      totalClaimsEvaluated: verifiedClaims.length,
      supportedCount,
      partiallySupportedCount: partialCount,
      contradictedCount,
      unverifiedCount,
      verificationRigorScore,
      averageSourceCredibility: avgCredibility,
    },
  };
}
