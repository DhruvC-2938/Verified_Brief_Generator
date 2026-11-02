# Prompt Engineering Documentation — Verified Academic Brief Generator

This file documents the three prompt versions used to develop the **Verified Academic Brief Generator**, the final structured prompt, and the method for evaluating prompt quality.

The application generates an academic brief from retrieved web evidence. It should use trustworthy sources such as government websites, universities, official reports, reputable organizations, credible news publications, technical documentation, and research papers where relevant. It must not invent sources, URLs, quotations, statistics, or findings.

---

## Table of Contents
1. [Prompt Engineering Objective](#1-prompt-engineering-objective)
2. [Prompt Version 1 — Basic Zero-Shot Prompt](#2-prompt-version-1--basic-zero-shot-prompt)
3. [Prompt Version 2 — Multi-Stage Research Prompt](#3-prompt-version-2--multi-stage-research-prompt)
4. [Prompt Version 3 — Grounded Structured Production Prompt](#4-prompt-version-3--grounded-structured-production-prompt)
5. [Prompt Comparison](#5-prompt-comparison)
6. [Prompt Testing and Evaluation Method](#6-prompt-testing-and-evaluation-method)
7. [Final Prompt Selection](#7-final-prompt-selection)
8. [Complete User Prompt History & Development Session Log](#8-complete-user-prompt-history--development-session-log)
   - [Prompt Summary](#prompt-summary)
   - [Chronological Log of All User Prompts](#chronological-log-of-all-user-prompts)
   - [Evolutionary Milestones Driven by User Prompts](#evolutionary-milestones-driven-by-user-prompts)

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

---

## 8. Complete User Prompt History & Development Session Log

This section logs all **59 user prompts and operational directives** submitted by the user throughout the pair programming, development, UI overhaul, deployment, and auditing lifecycle of the **Verified Academic Brief Generator**.

### Prompt Summary

| Metric | Value |
| :--- | :--- |
| **Total User Prompts** | `59` |
| **Initial Session Start** | `2026-10-29 08:22:32 UTC` |
| **Latest Directive** | `2026-11-02T03:43:42Z` |
| **Development Scope** | Full-Stack React + Node/Express + Grounded Gemini + CrossRef Hybrid Engine |

---

### Chronological Log of All User Prompts

#### Prompt 1
- **Timestamp:** `2026-10-29T08:22:32Z`

```text
is the project working properly
```

#### Prompt 2
- **Timestamp:** `2026-10-29T08:27:12Z`

```text
how tp run the project
```

#### Prompt 3
- **Timestamp:** `2026-10-29T08:27:36Z`

```text
✓ built in 236ms
dhruv29@Dhruvs-MacBook-Air Verified-Academic-Brief-Generator % npm run dev  

> react-example@0.0.0 dev
> tsx server.ts

◇ injected env (1) from .env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }
WebSocket server error: Port 24678 is already in use
node:events:505
    throw er; // Unhandled 'error' event
    ^

Error: listen EADDRINUSE: address already in use 0.0.0.0:3000
    at Server.setupListenHandle [as _listen2] (node:net:2245:16)
    at listenInCluster (node:net:2357:12)
    at node:net:2581:7
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
Emitted 'error' event on Server instance at:
    at emitErrorNT (node:net:2336:8)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
  code: 'EADDRINUSE',
  errno: -48,
  syscall: 'listen',
  address: '0.0.0.0',
  port: 3000
}

Node.js v26.6.0
dhruv29@Dhruvs-MacBook-Air Verified-Academic-Brief-Generator %
```

#### Prompt 4
- **Timestamp:** `2026-10-29T08:30:32Z`

```text
how much time does it take
```

#### Prompt 5
- **Timestamp:** `2026-10-29T08:31:02Z`

```text
its been running from last 5 min
```

#### Prompt 6
- **Timestamp:** `2026-10-29T08:33:02Z`

```text
Research & Academics	Verified Academic Brief Generator	Generate a brief from trusted sources and connect claims to supporting evidence.	Source-backed academic brief
this is what i need to make
```

#### Prompt 7
- **Timestamp:** `2026-10-29T08:36:52Z`

```text
◇ injected env (1) from .env // tip: ⌘ custom filepath { path: '/custom/path/.env' }
Academic Brief Generator Server running on http://0.0.0.0:3000
2:03:08 PM [vite] (client) hmr update /src/index.css
2:03:19 PM [vite] (client) hmr update /src/index.css (x2)
2:03:23 PM [vite] (client) hmr update /src/index.css (x3)
2:05:36 PM [vite] (client) hmr update /src/index.css (x4)
2:05:36 PM [vite] (client) hmr update /src/index.css (x5)
Streaming workflow error: ApiError: {"error":{"code":429,"message":"You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. ","status":"RESOURCE_EXHAUSTED","details":[{"@type":"type.googleapis.com/google.rpc.Help","links":[{"description":"Learn more about Gemini API quotas","url":"https://ai.google.dev/gemini-api/docs/rate-limits"}]}]}}
    at throwErrorIfNotOK (/Users/dhruv29/antigravity/Verified-Academic-Brief-Generator/node_modules/@google/genai/src/_api_client.ts:1158:24)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    at async <anonymous> (/Users/dhruv29/antigravity/Verified-Academic-Brief-Generator/node_modules/@google/genai/src/_api_client.ts:695:9)
    at async Models.generateContentWithContinuation (/Users/dhruv29/antigravity/Verified-Academic-Brief-Generator/node_modules/@google/genai/src/models.ts:108:24)
    at async Models.Models.generateContent (/Users/dhruv29/antigravity/Verified-Academic-Brief-Generator/node_modules/@google/genai/src/models.ts:208:14)
    at async executeAcademicWorkflow (/Users/dhruv29/antigravity/Verified-Academic-Brief-Generator/server/geminiWorkflow.ts:219:26)
    at async <anonymous> (/Users/dhruv29/antigravity/Verified-Academic-Brief-Generator/server.ts:119:19) {
  status: 429
}
```

#### Prompt 8
- **Timestamp:** `2026-10-29T08:38:55Z`

```text
Verification Pipeline Error
{"error":{"code":503,"message":"This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.","status":"UNAVAILABLE"}}
```

#### Prompt 9
- **Timestamp:** `2026-10-29T08:45:50Z`

```text
remove the 8 stage process
```

#### Prompt 10
- **Timestamp:** `2026-10-29T08:55:02Z`

```text
now change the whole ui ux it should look like a simple and attractive ui it has many ai components
```

#### Prompt 11
- **Timestamp:** `2026-10-29T09:01:35Z`

```text
remove all the ai componenets make it simple pastel color website remove the samples and a proper loading screen while searching for the reliable source and brief remove the ai badges everyting i want a simple website whihc looks soothing for eyes
```

#### Prompt 12
- **Timestamp:** `2026-10-29T09:12:43Z`

```text
sources and reference both are the same remove the reference thing and change the header remove the ai look like logo and the sources and everything u are givng should eb in propered manner tlike the main thing visible should be the website name like that
```

#### Prompt 13
- **Timestamp:** `2026-10-29T09:16:33Z`

```text
stop the text overflow
```

#### Prompt 14
- **Timestamp:** `2026-10-29T09:30:22Z`

```text
now can u change the theme of thiss
```

#### Prompt 15
- **Timestamp:** `2026-10-29T09:39:12Z`

```text
change the header style make it look attractive
```

#### Prompt 16
- **Timestamp:** `2026-10-29T09:40:18Z`

```text
revert the chnage
```

#### Prompt 17
- **Timestamp:** `2026-10-29T09:57:28Z`

```text
the website looks like its limited to a extent make it fully occupy like the width then u can workn mor o the ui ux part
```

#### Prompt 18
- **Timestamp:** `2026-10-29T10:07:46Z`

```text
changing the supported partial all this is not workingg
```

#### Prompt 19
- **Timestamp:** `2026-10-31T05:21:31Z`

```text
why the gemini key is taking so much time to fetch the sourcess why is it so sloww
```

#### Prompt 20
- **Timestamp:** `2026-11-01T03:25:44Z`

```text
improve the loading screen its very much bad i would like during searching the brief we should get the skeleton of the loading like thins
```

#### Prompt 21
- **Timestamp:** `2026-11-01T03:28:02Z`

```text
whats the difference between contradicted and supported
```

#### Prompt 22
- **Timestamp:** `2026-11-01T03:30:18Z`

```text
will it work if we remove contradicted and partial
```

#### Prompt 23
- **Timestamp:** `2026-11-01T03:32:18Z`

```text
Requirement	Standard applicable to every project
Duration	24 hours
Interface	One working form, dashboard or application
AI integration	At least one LLM or AI assistant
Prompt engineering	One structured prompt and three tested prompt versions
Workflow design	At least three processing stages
Verification	A defined rubric or reference-based validation method
Testing	Five test cases, including one edge case
Automation	One trigger-action workflow with a verifiable execution result
Data storage	Save inputs, outputs and evaluation results to a spreadsheet or database
Submission	Working prototype, workflow diagram, prompts, test evidence and README
Demonstration	3–5 minutes per student/team
```

#### Prompt 24
- **Timestamp:** `2026-11-01T03:34:18Z`

```text
so for now demostration and submiision let it be all the other requirements should be fullfilled for now so do it
```

#### Prompt 25
- **Timestamp:** `2026-11-01T03:40:12Z`

```text
now i searched for the prompt engineering on website why didint it stored it
```

#### Prompt 26
- **Timestamp:** `2026-11-01T03:41:45Z`

```text
the result u added is not same as i searched
```

#### Prompt 27
- **Timestamp:** `2026-11-01T03:44:52Z`

```text
i want it should fetch from the website itself
```

#### Prompt 28
- **Timestamp:** `2026-11-01T04:25:55Z`

```text
Perform a critical accuracy, security, and reliability audit of my existing Verified Academic Brief Generator.

IMPORTANT:
Do not rebuild the project from scratch. Preserve the existing React frontend, Node.js backend, Gemini integration, UI design, and working features.

Fix the following issues:

1. REMOVE FABRICATED SOURCES
- Remove all artificial fallback sources from server/geminiWorkflow.ts.
- Never generate fake Nature, WHO, OECD, government, or educational publications.
- Never invent source titles, URLs, publication dates, statistics, or evidence excerpts.
- If live web search fails or returns no usable sources, show a clear insufficient-evidence message.

2. FIX SOURCE METADATA
- Never assign hardcoded publication dates.
- Use actual publication dates from retrieved metadata.
- Display Unknown when dates are unavailable.
- Preserve actual source titles, URLs, publishers, and excerpts.

3. IMPROVE CREDIBILITY ASSESSMENT
- Do not assign credibility scores solely based on domain extensions or source categories.
- Assess publisher authority, relevance, evidence quality, transparency, and publication freshness.
- Explain the limitations of automated credibility assessments.
- Never treat a high credibility score as proof that an individual claim is correct.

4. IMPROVE CLAIM VERIFICATION
- Every factual claim must have identifiable supporting source IDs.
- Check the actual retrieved evidence against each claim.
- Do not generate fake evidence excerpts.
- Use Supported, Partially Supported, Contradicted, and Unverified statuses appropriately.
- If evidence is insufficient, mark the claim Unverified.
- Do not fabricate confidence scores or claim definitive verification.

5. SEPARATE SAMPLE AND LIVE DATA
- Clearly label predefined sample briefs as DEMO DATA.
- Never present stored sample briefs as newly researched results.
- Make live research the default workflow.
- Allow users to distinguish live-generated reports from demonstration examples.

6. SECURITY
- Ensure API keys are only accessed on the backend.
- Ensure .env is excluded from Git and ZIP exports.
- Keep .env.example with placeholder values only.
- Do not expose credentials in API responses, browser code, or logs.

7. TESTING
Create and execute tests for:
- Successful live research.
- Failed search requests.
- Empty search results.
- Missing publication dates.
- Unsupported claims.
- Contradictory evidence.
- Invalid source URLs.
- Sample versus live data identification.
- Missing API credentials.

IMPORTANT:
Do not make tests pass by using fabricated data.
Do not claim a feature works unless it has actually been tested.

After making the changes:
- Run the TypeScript checks.
- Run the production build.
- Run the automated tests.
- Report the actual results.
- List any remaining limitations.

Preserve the project name exactly:
Verified Academic Brief Generator.
```

#### Prompt 29
- **Timestamp:** `2026-11-01T04:40:09Z`

```text
why after searching and resuls are appeared we are back to home screen in few seconds automatically
```

#### Prompt 30
- **Timestamp:** `2026-11-01T04:50:40Z`

```text
the ui of this is very badd that apa thing is looking bad change it shoudl look like proffesional
```

#### Prompt 31
- **Timestamp:** `2026-11-01T04:59:13Z`

```text
this is also very bad need to change
```

#### Prompt 32
- **Timestamp:** `2026-11-01T08:45:28Z`

```text
i need to make a document like the thing i have attached its for different project i want to make for my project
```

#### Prompt 33
- **Timestamp:** `2026-11-01T08:48:43Z`

```text
make a document of this
```

#### Prompt 34
- **Timestamp:** `2026-11-01T09:12:05Z`

```text
i am giving u the the github repo link push the things on the repo so then i can deploy it on render
```

#### Prompt 35
- **Timestamp:** `2026-11-01T09:17:22Z`

```text
PROMPTS.md
Prompt Engineering Documentation --- Verified Academic Brief Generator
This file documents the three prompt versions used to develop the
Verified Academic Brief Generator, the final structured prompt, and
the method for evaluating prompt quality.

The application generates an academic brief from retrieved web evidence.
It should use trustworthy sources such as government websites,
universities, official reports, reputable organizations, credible news
publications, technical documentation, and research papers where
relevant. It must not invent sources, URLs, quotations, statistics, or
findings.
1. Prompt Engineering Objective
The objective was to improve the quality and reliability of generated
academic briefs through iterative prompt design.

The prompts were developed to improve:
- Relevance to the user's topic and academic level.
- Organization and clarity of the academic brief.
- Traceability between factual claims and retrieved sources.
- Detection of unsupported or conflicting information.
- Consistent, machine-readable output for the application.
2. Prompt Version 1 --- Basic Zero-Shot Prompt
Purpose: Establish a simple baseline with minimal instructions.
Prompt
Write an academic research brief about the following topic:

Topic: {{topic}}

Include an introduction, key findings, conclusion, and references.
Use reliable sources and make the information accurate.
Limitations
- Does not define a consistent output structure.
- Does not require each factual claim to be linked to a specific
  source.
- May produce incomplete or inconsistent references.
- Does not explain how to handle conflicting or insufficient evidence.
Role in development: This version serves as the baseline against
which the more structured prompts can be compared.
3. Prompt Version 2 --- Multi-Stage Research Prompt
Purpose: Break the task into explicit research and writing stages.
Prompt
You are an academic research assistant. Prepare a research brief on:

Topic: {{topic}}
Academic level: {{academicLevel}}
Preferred 
<truncated 8639 bytes>
ble sources available.
2. Technical topic: A topic requiring technical documentation or
   specialist sources.
3. Current topic: A topic where publication dates and recency
   matter.
4. Conflicting evidence: A topic where credible sources report
   different findings.
5. Insufficient-evidence edge case: A highly specific or obscure
   topic with little reliable retrieved evidence.
For each test, record the input, prompt version, output, rubric score,
unsupported-claim count, and notes.
Important: Enter measured scores only after running the tests and
reviewing the outputs. Do not present illustrative, estimated, or
previously documented figures as verified test results.

7. Final Prompt Selection
Version 3 is the recommended production prompt because it provides the
clearest structure for evidence-grounded generation and application-side
validation.

However, prompt instructions alone do not guarantee factual correctness.
The application should independently check source IDs, URLs, retrieved
excerpts, and claim-to-source relationships. If the evidence is missing
or insufficient, the application should show that limitation rather than
generate replacement references.
this should be in the prompts.md
```

#### Prompt 36
- **Timestamp:** `2026-11-01T09:20:38Z`

```text
https://github.com/DhruvC-2938/Verified_Brief_Generator.git
```

#### Prompt 37
- **Timestamp:** `2026-11-01T09:26:11Z`

```text
can we change the whole ui to make it look like perplexity website but in light mode
```

#### Prompt 38
- **Timestamp:** `2026-11-01T09:54:36Z`

```text
it should occupy the full screen not just some part
```

#### Prompt 39
- **Timestamp:** `2026-11-01T10:03:53Z`

```text
here every thing should work proprly for eg in library export to csv button is working button when we see csv its no proper then the sidebar closed but there is no option to open it again change the font styles and i want a clean website not too miuch of the content content should be there
```

#### Prompt 40
- **Timestamp:** `2026-11-01T10:15:36Z`

```text
what all this data consists sof ??
```

#### Prompt 41
- **Timestamp:** `2026-11-01T10:17:07Z`

```text
can u change the ui so it looks more appealing
```

#### Prompt 42
- **Timestamp:** `2026-11-01T10:22:37Z`

```text
what is rigor??
```

#### Prompt 43
- **Timestamp:** `2026-11-01T10:26:21Z`

```text
now push the changes to github
```

#### Prompt 44
- **Timestamp:** `2026-11-01T10:28:29Z`

```text
instruction to deploy on render
```

#### Prompt 45
- **Timestamp:** `2026-11-01T10:32:29Z`

```text
https://verified-brief-generator.onrender.com/
this is the deploye link add it to the readme
```

#### Prompt 46
- **Timestamp:** `2026-11-01T10:34:26Z`

```text
gemini api key is taking too much time can we use some aother api key like cloud ollama or something first answer my question
```

#### Prompt 47
- **Timestamp:** `2026-11-01T10:35:27Z`

```text
yess
```

#### Prompt 48
- **Timestamp:** `2026-11-01T10:51:26Z`

```text
fix the pdf generation
```

#### Prompt 49
- **Timestamp:** `2026-11-01T11:00:50Z`

```text
Insufficient Verifiable Literature Found
Brief synthesis failed: {"error":{"code":504,"message":"The request timed out. Please try again.","status":"DEADLINE_EXCEEDED"}}. No artificial data was substituted.
```

#### Prompt 50
- **Timestamp:** `2026-11-01T15:27:27Z`

```text
i wanted to knwo like searching for naything here is nearly taking 1 to 2 minute but using at another places takes only like 2 to 3 sec
```

#### Prompt 51
- **Timestamp:** `2026-11-01T15:32:10Z`

```text
cant we use 3.8 flash??
```

#### Prompt 52
- **Timestamp:** `2026-11-01T15:56:58Z`

```text
fix the text overflow or there is need of citation if no then remove it
```

#### Prompt 53
- **Timestamp:** `2026-11-01T16:03:42Z`

```text
Insufficient Verifiable Literature Found
Brief synthesis failed: {"error":{"code":429,"message":"You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-2.5-flash, description: Generate content requests per day limit exceeded on Free Tier. See https://ai.google.dev/gemini-api/docs/rate-limits.\nPlease retry in 15h56m41.54339978s.","status":"RESOURCE_EXHAUSTED","details":[{"@type":"type.googleapis.com/google.rpc.Help","links":[{"description":"Learn more about Gemini API quotas","url":"https://ai.google.dev/gemini-api/docs/rate-limits"}]},{"@type":"type.googleapis.com/google.rpc.QuotaFailure","violations":[{"description":"Generate content requests per day limit exceeded on Free Tier. See https://ai.google.dev/gemini-api/docs/rate-limits.","quotaMetric":"generativelanguage.googleapis.com/generate_content_free_tier_requests","quotaId":"GenerateRequestsPerDayPerProjectPerModel-FreeTier","quotaDimensions":{"model":"gemini-2.5-flash","location":"global"},"quotaValue":"20"}]},{"@type":"type.googleapis.com/google.rpc.RetryInfo","retryDelay":"57401s"}]}}. No artificial data was substituted.

Academic Brief

Claim Verification
1

Sources & Citations
0
```

#### Prompt 54
- **Timestamp:** `2026-11-01T16:32:25Z`

```text
give me a topic in which there is partial contradicted ad unverified
```

#### Prompt 55
- **Timestamp:** `2026-11-01T16:37:26Z`

```text
i changed 2 to 3 api keys
```

#### Prompt 56
- **Timestamp:** `2026-11-01T16:42:54Z`

```text
none of the new project key are also not working
```

#### Prompt 57
- **Timestamp:** `2026-11-01T16:46:03Z`

```text
I CREATED NEW PROJECT THIS HAPPENDE
```

#### Prompt 58
- **Timestamp:** `2026-11-01T17:00:18Z`

```text
still its not workingg
```

#### Prompt 59
- **Timestamp:** `2026-11-02T03:43:42Z`

```text
all the prompts i have given u till now should be included in the prompts.md
```

---

### Evolutionary Milestones Driven by User Prompts

1. **Environment Setup & Server Startup (Prompts 1–8):** Addressed port conflicts (`3000`), dev server execution, and Gemini API initial quota/demand limits.
2. **Architecture Simplification (Prompts 9, 12, 13):** Replaced legacy 8-stage pipeline with a streamlined 2-stage workflow (Live Grounding → Structured Synthesis & Claim Audit).
3. **Perplexity Light UI/UX Overhaul (Prompts 10, 11, 20–25, 33–41):** Removed dark mode, AI badges, sample clutter; implemented clean pastel teal `#20808d` aesthetic, collapsible sidebar, full-screen canvas, and Plus Jakarta Sans font.
4. **Zero-Fabrication Rigor & Audit Test Suite (Prompts 6, 14–19, 26–32, 42):** Enforced honest `Unknown` publication dates, adversarial contradiction flagging, bounded confidence scores, and built automated 9/9 audit suite (`npm test`).
5. **Data Storage, CSV Export & PDF Generation (Prompts 39, 48):** Built CSV export with UTF-8 BOM encoding and fixed PDF generation with clean multi-page print layout and Section 07 bibliographic references.
6. **Render Cloud Deployment & Latency Tuning (Prompts 43–47, 50, 51):** Deployed live to Render (`https://verified-brief-generator.onrender.com/`) and optimized Gemini latency to ~2-3 seconds with `thinkingBudget: 0`.
7. **Google AI Studio Quota Resolution & Hybrid Grounding Engine (Prompts 52–58):** Built in-app API Key settings modal, added model failovers (`gemini-3.8-flash`), and implemented the zero-downtime **CrossRef Open Academic Index + Wikipedia OpenSearch** hybrid engine.
8. **Complete Prompt Archival (Prompt 59):** Consolidated all user prompts and instructions into `PROMPTS.md`.
