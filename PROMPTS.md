# Prompt Engineering Documentation — Verified Academic Brief Generator

This file documents the three prompt versions used to develop the **Verified Academic Brief Generator**, the final structured prompt, and the method for evaluating prompt quality.

The application generates an academic brief from retrieved web evidence. It should use trustworthy sources such as government websites, universities, official reports, reputable organizations, credible news publications, technical documentation, and research papers where relevant. It must not invent sources, URLs, quotations, statistics, or findings.

---

## 1. Prompt Engineering Objective

The objective was to improve the quality and reliability of generated academic briefs through iterative prompt design.

The prompts were developed to improve:
- **Relevance** to the user's topic and academic level.
- **Organization and clarity** of the academic brief.
- **Traceability** between factual claims and retrieved sources.
- **Detection** of unsupported or conflicting information.
- **Consistent, machine-readable output** for the application.

---

## 2. Prompt Version 1 — Basic Zero-Shot Prompt

**Purpose:** Establish a simple baseline with minimal instructions.

### Prompt Text
```text
Write an academic research brief about the following topic:

Topic: {{topic}}

Include an introduction, key findings, conclusion, and references.
Use reliable sources and make the information accurate.
```

### Limitations
- Does not define a consistent output structure.
- Does not require each factual claim to be linked to a specific source.
- May produce incomplete or inconsistent references.
- Does not explain how to handle conflicting or insufficient evidence.

**Role in development:** This version serves as the baseline against which the more structured prompts can be compared.

---

## 3. Prompt Version 2 — Multi-Stage Research Prompt

**Purpose:** Break the task into explicit research and writing stages.

### Prompt Text
```text
You are an academic research assistant. Prepare a research brief on:

Topic: {{topic}}
Academic level: {{academicLevel}}
Preferred length: {{briefLength}}

Follow these stages:

1. Understand the topic and identify the central research question.
2. Identify useful search queries and the kinds of sources needed.
3. Review the web evidence supplied to you.
4. Extract relevant facts, statistics, findings, and limitations from the sources.
5. Organize the evidence into key themes.
6. Draft an academic brief using only information supported by the supplied evidence.
7. Review each factual claim and check whether a source supports it.
8. List the references and identify any gaps or conflicting findings.

Rules:
- Do not invent sources, authors, URLs, statistics, quotations, or publication dates.
- Do not claim to have accessed a source unless its content or retrieved evidence is available.
- If evidence is insufficient, state that clearly.
- Distinguish established findings from interpretations.
- Include limitations and conflicting evidence where present.
```

### Improvements over Version 1
- Makes the research process more systematic.
- Separates evidence review from writing.
- Explicitly asks for limitations and conflicting information.
- Adds instructions against fabricated sources and facts.

### Limitations
- A long sequence of separate model calls can increase latency and API usage.
- If an intermediate stage fails, later stages may receive incomplete information.
- The prompt alone cannot prove that a source is genuine or that a claim is supported; the application must validate retrieved source data.

*Implementation note: These are logical workflow stages. They do not necessarily require eight separate LLM calls.*

---

## 4. Prompt Version 3 — Grounded Structured Production Prompt

**Purpose:** Generate a consistent academic brief using retrieved evidence and a structured JSON response.

### Prompt Template
*The application should replace the placeholders with the actual user input and retrieved source material before sending the prompt to the model.*

```text
You are an academic research assistant. Your task is to produce a clear, balanced, evidence-based academic brief.

USER INPUT
Topic: {{topic}}
Academic level: {{academicLevel}}
Preferred length: {{briefLength}}

RETRIEVED WEB EVIDENCE
{{retrievedEvidence}}

AVAILABLE SOURCES
{{sourceList}}

CORE INSTRUCTIONS

1. Base factual statements only on the retrieved evidence provided above.
2. Use sources from the available source list. Do not invent or substitute sources.
3. Give each source a stable source ID, such as S1, S2, and S3.
4. Cite factual statements with the relevant source IDs, for example [S1].
5. A citation is valid only when the cited source actually supports the statement.
6. Do not create quotations. An evidence excerpt must appear in the supplied
   retrieved material and must preserve its meaning.
7. Do not invent URLs, authors, publishers, publication dates, statistics,
   research findings, or DOIs.
8. If the evidence does not support a claim, mark it as "unverified".
9. If sources disagree, describe the disagreement and cite the relevant sources.
10. Distinguish source-reported facts from analysis or interpretation.
11. Do not treat a domain or source category alone as proof that a claim is true.
12. If the retrieved evidence is insufficient, explain the limitation instead
    of filling the gap with unsupported information.
13. Return valid JSON only. Do not include Markdown fences or introductory text.

OUTPUT FORMAT

{
  "title": "Academic title",
  "researchQuestion": "The central research question",
  "executiveSummary": "A concise summary grounded in the evidence",
  "introduction": "Background, context, and definitions supported by evidence",
  "keyFindings": [
    {
      "finding": "A concise evidence-based finding",
      "sourceIds": ["S1"]
    }
  ],
  "evidenceAnalysis": "Analysis of the retrieved evidence, including relevant patterns, mechanisms, and differences between sources",
  "limitationsAndConflictingInfo": "Evidence limitations, uncertainty, and conflicting findings",
  "conclusion": "A balanced conclusion based on the available evidence",
  "claims": [
    {
      "id": "CLM-001",
      "claimText": "One factual claim made in the brief",
      "sourceIds": ["S1"],
      "evidenceExcerpt": "A short excerpt from the supplied retrieved evidence",
      "status": "supported",
      "confidenceScore": 90,
      "rationale": "Why the cited evidence supports or does not support the claim",
      "sectionRef": "Key Findings"
    }
  ],
  "references": [
    {
      "sourceId": "S1",
      "title": "Exact retrieved source title",
      "publisher": "Publisher shown in the retrieved source",
      "url": "Exact retrieved URL",
      "publicationDate": "Date if supplied; otherwise null"
    }
  ]
}

CLAIM STATUS RULES

- "supported": the cited evidence directly supports the claim.
- "partially_supported": the evidence supports only part of the claim or requires important qualification.
- "contradicted": the supplied evidence conflicts with the claim.
- "unverified": the supplied evidence does not establish the claim.

CONFIDENCE RULES

- Confidence must reflect the strength and relevance of the evidence, not merely the reputation or domain of the publisher.
- Do not use a high confidence score when the evidence is indirect, incomplete, outdated, or conflicting.
- Confidence scores are model assessments, not statistical probabilities.

Before returning the JSON, check that:
- Every source ID used in a claim exists in the available source list.
- Every reference corresponds to a source actually supplied to the model.
- Every evidence excerpt is present in the retrieved material.
- Unsupported claims are marked honestly.
- The response is valid JSON and follows the required structure.
```

### Improvements over Version 2
- Uses retrieved evidence as the grounding context.
- Defines a predictable JSON structure for application processing.
- Connects individual claims to source IDs and evidence excerpts.
- Defines explicit claim-verification statuses.
- Requires the model to report insufficient or conflicting evidence.
- Avoids treating a source's domain or category as automatic proof of accuracy.

---

## 5. Prompt Comparison

| Evaluation Area | Version 1: Basic | Version 2: Multi-Stage | Version 3: Grounded Structured |
| :--- | :--- | :--- | :--- |
| **Instructions** | Minimal | Detailed stages | Detailed rules and schema |
| **Output Consistency** | Not specified | Partly specified | JSON structure specified |
| **Claim-Level Citations** | Not required | Requested | Required through source IDs |
| **Evidence Excerpts** | Not required | Requested | Required for claim records |
| **Conflicting Evidence** | Not specified | Requested | Explicitly required |
| **Insufficient Evidence** | Not specified | Explicitly handled | Explicit status and explanation |
| **Fabricated Source Prevention** | General request for reliability | Explicit prohibition | Explicit prohibition and source-list constraint |

---

## 6. Prompt Testing and Evaluation Method

To compare the prompt versions fairly:
1. Use the same topic, academic level, and brief length for all versions.
2. Provide the same retrieved source material wherever the prompt design allows.
3. Save the prompt, model output, timestamp, and evaluation result for each run.
4. Evaluate the output using the rubric below.
5. Repeat tests where possible; do not treat a single run as proof of reliability.

### Evaluation Rubric

| Criterion | What to Check |
| :--- | :--- |
| **Topic relevance** | Does the brief answer the requested topic? |
| **Source validity** | Do the cited sources exist in the supplied source list? |
| **Claim support** | Does each cited source support the associated claim? |
| **Evidence traceability** | Can the claim be traced to the supplied evidence excerpt? |
| **Output structure** | Does the output follow the required format? |
| **Balanced analysis** | Are limitations and conflicting findings represented? |
| **Honesty about uncertainty** | Are unsupported claims marked as unverified? |

#### Scoring System
A score can be calculated by assigning each criterion a rating from 0 to 2:
- **0:** Missing or incorrect.
- **1:** Partially meets the criterion.
- **2:** Fully meets the criterion.

- **Maximum score:** 14 points.
- **Percentage score:** $\frac{\text{score obtained}}{14} \times 100$.

### Test Cases
Use at least five test cases, including an edge case:
1. **General topic:** A topic with multiple reliable sources available.
2. **Technical topic:** A topic requiring technical documentation or specialist sources.
3. **Current topic:** A topic where publication dates and recency matter.
4. **Conflicting evidence:** A topic where credible sources report different findings.
5. **Insufficient-evidence edge case:** A highly specific or obscure topic with little reliable retrieved evidence.

For each test, record the input, prompt version, output, rubric score, unsupported-claim count, and notes.

> **Important:** Enter measured scores only after running the tests and reviewing the outputs. Do not present illustrative, estimated, or previously documented figures as verified test results.

---

## 7. Final Prompt Selection

**Version 3 is the recommended production prompt** because it provides the clearest structure for evidence-grounded generation and application-side validation.

However, prompt instructions alone do not guarantee factual correctness. The application should independently check source IDs, URLs, retrieved excerpts, and claim-to-source relationships. If the evidence is missing or insufficient, the application should show that limitation rather than generate replacement references.
