/**
 * Automated Verification Test Suite
 * Evaluates 5 required test cases, including 1 edge case.
 */
import dotenv from 'dotenv';
dotenv.config();

import { executeAcademicWorkflow } from '../server/geminiWorkflow.ts';
import { saveEvaluationAndTriggerAutomation } from '../server/storageService.ts';
import { BriefGenerationRequest } from '../src/types/index.ts';

interface TestCase {
  id: string;
  name: string;
  category: 'Standard' | 'Broad' | 'Technical' | 'Interdisciplinary' | 'Edge Case';
  input: BriefGenerationRequest;
  expectedAssertion: (brief: any) => { passed: boolean; reason: string };
}

const TEST_CASES: TestCase[] = [
  {
    id: 'TC-01',
    name: 'Standard Domain Inquiry (Medical & Public Health)',
    category: 'Standard',
    input: {
      topic: 'mRNA Vaccine Distribution Equity in LMICs',
      academicLevel: 'undergraduate',
      briefLength: 'medium',
      preferredSourceTypes: 'all',
    },
    expectedAssertion: (brief) => ({
      passed: brief.sources.length >= 2 && brief.claims.length >= 2 && brief.metrics.verificationRigorScore > 80,
      reason: `Found ${brief.sources.length} sources and ${brief.claims.length} claims with ${brief.metrics.verificationRigorScore}% rigor.`,
    }),
  },
  {
    id: 'TC-02',
    name: 'Technical Hard Sciences Inquiry (Quantum Cryptography)',
    category: 'Technical',
    input: {
      topic: 'Post-Quantum Cryptography & NIST Standards',
      academicLevel: 'advanced',
      briefLength: 'medium',
      preferredSourceTypes: 'papers',
    },
    expectedAssertion: (brief) => ({
      passed: brief.title.length > 5 && brief.sources.some((s: any) => s.domain.includes('nist') || s.domain.includes('nature') || s.domain.includes('edu') || s.domain.includes('ieee') || s.domain.includes('arxiv')),
      reason: `Generated authoritative technical brief with source domains: ${brief.sources.map((s: any) => s.domain).join(', ')}`,
    }),
  },
  {
    id: 'TC-03',
    name: 'Broad Macroeconomic Inquiry',
    category: 'Broad',
    input: {
      topic: 'Impact of Artificial Intelligence on Global Labor Productivity',
      academicLevel: 'undergraduate',
      briefLength: 'short',
      preferredSourceTypes: 'reports',
    },
    expectedAssertion: (brief) => ({
      passed: brief.executiveSummary.length > 100 && brief.keyFindings.length >= 2,
      reason: `Executive summary synthesized (${brief.executiveSummary.length} chars) with ${brief.keyFindings.length} key findings.`,
    }),
  },
  {
    id: 'TC-04',
    name: 'Interdisciplinary Policy & Environmental Sciences',
    category: 'Interdisciplinary',
    input: {
      topic: 'Direct Air Carbon Capture Efficacy and Energy Trade-Offs',
      academicLevel: 'advanced',
      briefLength: 'long',
      preferredSourceTypes: 'all',
    },
    expectedAssertion: (brief) => ({
      passed: brief.evidenceAnalysis.length > 150 && brief.references.length >= 2,
      reason: `Evidence analysis validated with ${brief.references.length} bibliographic references.`,
    }),
  },
  {
    id: 'TC-05',
    name: 'Edge Case (Niche / Minimal Prior Knowledge / Boundary Input)',
    category: 'Edge Case',
    input: {
      topic: 'Xylo-Phonetic Acoustic Quantum Resonance in Superconducting Nanotubes',
      academicLevel: 'advanced',
      briefLength: 'short',
      preferredSourceTypes: 'all',
    },
    expectedAssertion: (brief) => ({
      passed: Boolean(brief.title) && brief.sources.length >= 1 && Array.isArray(brief.claims),
      reason: 'Handled niche synthetic query without crashing, returned resilient fallback source indexing and structured output.',
    }),
  },
];

async function runTestSuite() {
  console.log('===============================================================');
  console.log('     ACADEMIC BRIEF GENERATOR - VERIFICATION TEST RUNNER       ');
  console.log('===============================================================\n');

  let passedCount = 0;
  const results = [];

  for (const tc of TEST_CASES) {
    const startTime = Date.now();
    process.stdout.write(`[RUNNING] ${tc.id}: ${tc.name}... `);

    try {
      const brief = await executeAcademicWorkflow(tc.input);
      const assertion = tc.expectedAssertion(brief);
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      // Automated action: persist evaluation & dossier
      const record = await saveEvaluationAndTriggerAutomation(tc.input, brief);

      if (assertion.passed) {
        passedCount++;
        console.log(`✅ PASSED (${duration}s)`);
        results.push({
          id: tc.id,
          name: tc.name,
          category: tc.category,
          status: 'PASSED',
          duration: `${duration}s`,
          evaluationId: record.id,
          notes: assertion.reason,
        });
      } else {
        console.log(`❌ FAILED (${duration}s)`);
        results.push({
          id: tc.id,
          name: tc.name,
          category: tc.category,
          status: 'FAILED',
          duration: `${duration}s`,
          evaluationId: record.id,
          notes: assertion.reason,
        });
      }
    } catch (err: any) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`❌ ERROR (${duration}s): ${err.message}`);
      results.push({
        id: tc.id,
        name: tc.name,
        category: tc.category,
        status: 'ERROR',
        duration: `${duration}s`,
        notes: err.message,
      });
    }
  }

  console.log('\n===============================================================');
  console.log(`TEST SUMMARY: ${passedCount}/${TEST_CASES.length} Test Cases Passed`);
  console.log('===============================================================\n');

  console.table(results);
}

runTestSuite().catch((err) => {
  console.error('Test runner execution failed:', err);
  process.exit(1);
});
