# Verified Academic Brief Generator

> **Live Deployment:** [https://verified-brief-generator.onrender.com/](https://verified-brief-generator.onrender.com/)  
> **Source Repository:** [https://github.com/DhruvC-2938/Verified_Brief_Generator.git](https://github.com/DhruvC-2938/Verified_Brief_Generator.git)

An AI-powered academic research engine and epistemic verification dashboard built with React, Node.js, Tailwind CSS, and the Gemini API with Google Search Grounding.

Developed for college AI Tools and Prompt Engineering coursework, this system accepts any research inquiry, retrieves authoritative online sources (.gov, .edu, peer-reviewed journals, official reports, reputable news), synthesizes a structured academic brief with inline citations, and adversarially verifies every major factual assertion against verbatim retrieved source excerpts.

---

## Key Features

1. **Deterministic 8-Stage Prompt Engineering Architecture**:
   - **Stage 1: Topic Interpretation & Question Formulation** – Scopes academic breadth, refines research questions, and establishes inquiry criteria.
   - **Stage 2: Multi-Source Discovery via Search Grounding** – Interrogates live web search grounding indices to discover real, authoritative documents.
   - **Stage 3: Credibility, Freshness & Authority Evaluation** – Deduplicates URLs, scores domain authority (.gov, .edu, .org, recognized journals), and checks metadata completeness.
   - **Stage 4: Evidence Extraction** – Isolates verbatim empirical excerpts, statistical parameters, and direct factual propositions.
   - **Stage 5: Structured Academic Brief Drafting** – Composes 6 structured academic sections with inline citation tags (`[S1]`, `[S2]`).
   - **Stage 6: Claim-Level Evidence Verification** – Adversarially audits every major factual claim against its supporting source excerpt, assigning statuses:
     - `Supported`: Excerpt directly confirms the assertion with matching numbers and scope.
     - `Partially Supported`: Excerpt provides directional evidence but lacks specific metrics.
     - `Contradicted`: Excerpt or empirical reality refutes the claim.
     - `Unverified`: Excerpt is missing, vague, or inconclusive.
   - **Stage 7: Revision & Nuance** – Rewrites overreaching assertions, applies epistemic hedging, and flags contradictions in the Limitations section.
   - **Stage 8: Reference Ledger Compilation** – Formats complete APA/IEEE bibliographic entries with persistent hyperlinks.

2. **Claim-Level Evidence Ledger**:
   - Unique claim identifiers (`CLM-001`, `CLM-002`, etc.).
   - Side-by-side comparison between the audited proposition and the verbatim source excerpt.
   - Real-time epistemic rationale explaining the verification rating.
   - Epistemic revision highlights for contradicted or unverified statements.
   - Direct clickable inspection of the original source URL.

3. **Academic Dashboard & Reader**:
   - Clean academic design with a navy, white, and restrained violet palette.
   - Editorial typography: Newsreader serif for scholarly text, Inter for interface elements, JetBrains Mono for citation keys and timestamps.
   - Full Export options: Copy formatted Markdown, Download `.md` document, and clean Print / PDF preview.
   - Instant Demo Pre-sets for fast evaluation:
     - *mRNA Vaccine Distribution Equity in LMICs*
     - *Post-Quantum Cryptography & NIST Standards*
     - *CRISPR-Cas9 Human Germline Editing Ethics*
     - *Direct Air Carbon Capture Efficacy*

---

## Project Structure

```
├── index.html                   # HTML entry point with Newsreader, Inter & JetBrains Mono fonts
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies & full-stack scripts (tsx server.ts)
├── server.ts                    # Express server with Vite middleware, REST & SSE streaming
├── server/
│   ├── geminiWorkflow.ts        # 8-Stage Prompt Engineering & Gemini Search Grounding engine
│   └── sampleData.ts            # Curated academic briefs with complete verification ledgers
├── src/
│   ├── App.tsx                  # Root app coordinating pipeline, tabs, and modals
│   ├── index.css                # Tailwind CSS v4 styling, font mappings, and print styles
│   ├── main.tsx                 # React DOM mount point
│   ├── types/
│   │   └── index.ts             # Strongly-typed models for briefs, claims, sources, and stages
│   └── components/
│       ├── Header.tsx           # Application header with sample selector & reset
│       ├── ResearchForm.tsx     # Topic input, academic level, length, and source filters
│       ├── StageProgressTracker.tsx # 8-stage stepper with live progress animation
│       ├── MetricsBar.tsx       # Verification rigor score, source counts, and claim breakdown
│       ├── BriefViewer.tsx      # Formal scholarly brief with interactive inline citations
│       ├── ClaimsTable.tsx      # Evidence verification table with filterable statuses
│       ├── SourcesList.tsx      # Discovered source cards with authority scores and excerpts
│       ├── StageAuditView.tsx   # Detailed telemetry for all 8 prompt engineering stages
│       ├── ReferencesView.tsx   # APA/IEEE formatted citations with copy and URL actions
│       └── SourceDetailModal.tsx # Inspect source telemetry, excerpt, and linked claims
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
# GEMINI_API_KEY: Required for Gemini API calls and search grounding.
GEMINI_API_KEY="your-gemini-api-key-here"

# PORT: Server port (defaults to 3000)
PORT=3000
```

---

## Local Setup & Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The dev server will start on `http://localhost:3000`, serving both the backend API and the Vite React frontend.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Run Production Server**:
   ```bash
   npm run start
   ```

---

## Deployment Instructions

### Render (Live Production)
- **Live URL**: [https://verified-brief-generator.onrender.com/](https://verified-brief-generator.onrender.com/)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `GEMINI_API_KEY`: `your-gemini-api-key`

### Vercel / Netlify
1. Connect repository.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set `GEMINI_API_KEY` in environment variables.
5. For full-stack API routes, ensure serverless proxy or deploy the Express backend to a Node.js container (e.g., Render, Railway, or Google Cloud Run).

### Google Cloud Run / Docker
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## Academic Demonstration Walkthrough

1. Open the application at `http://localhost:3000`.
2. Click **"mRNA Equity"** or **"Post-Quantum NIST"** in the top bar or preset buttons to instantly inspect a pre-verified brief.
3. Observe the **Metrics Bar**:
   - Total Vetted Sources (e.g. 5 / 14 discovered)
   - Audited Claims (e.g. 6 claims evaluated)
   - Supported vs. Contradicted claims breakdown
   - Epistemic Rigor Score (e.g. 92/100)
4. Click on the **Claim Verification Ledger** tab:
   - Filter by **"Contradicted"** to observe claim `CLM-004`: Notice how the false proposition regarding patent-only immediate fixes was caught and revised to reflect technical bioreactor constraints.
   - Click **"Inspect"** on any source row to review the verbatim retrieved excerpt.
5. Click on the **8-Stage Pipeline Audit** tab to inspect each isolated stage's runtime, telemetry, and non-hallucination guardrails.
6. Click **"Copy Markdown"** or **"Print / PDF"** to export the brief.
7. Click **"New Research"** to submit a custom research topic!
