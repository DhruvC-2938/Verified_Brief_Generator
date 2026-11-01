import React, { useState } from 'react';
import { Copy, Check, Printer, AlertTriangle, Calendar, BookOpen, ListOrdered, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { AcademicBriefData, SourceItem } from '../types/index.ts';

interface BriefViewerProps {
  brief: AcademicBriefData;
  onOpenSourceModal?: (source: SourceItem) => void;
  onSelectTab?: (tab: string) => void;
}

export const BriefViewer: React.FC<BriefViewerProps> = ({
  brief,
  onOpenSourceModal,
  onSelectTab,
}) => {
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(brief.generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const estimatedWords = Math.round(
    (brief.executiveSummary + ' ' + brief.introduction + ' ' + brief.evidenceAnalysis + ' ' + brief.conclusion)
      .trim()
      .split(/\s+/).length
  );
  const readTimeMin = Math.max(2, Math.round(estimatedWords / 200));

  const generateMarkdown = (): string => {
    return `# ${brief.title}

**Topic:** ${brief.topic}  
**Research Question:** ${brief.researchQuestion}  
**Academic Level:** ${brief.academicLevel.toUpperCase()}  
**Generated Date:** ${formattedDate}  

---

## 1. Executive Summary
${brief.executiveSummary}

## 2. Introduction & Background
${brief.introduction}

## 3. Key Findings
${brief.keyFindings.map((kf, i) => `${i + 1}. ${kf}`).join('\n')}

## 4. Evidence Analysis
${brief.evidenceAnalysis}

## 5. Limitations & Conflicting Evidence
${brief.limitationsAndConflictingInfo}

## 6. Conclusion
${brief.conclusion}

---

## References
${brief.references.map((r) => `[${r.id}] ${r.formattedCitation}`).join('\n')}
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Render text with clickable Warm Editorial [S1], [S2] badges
  const renderTextWithCitations = (text: string) => {
    const parts = text.split(/(\[S\d+(?:,\s*S\d+)*\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(S\d+(?:,\s*S\d+)*)\]/);
      if (match) {
        const ids = match[1].split(',').map((id) => id.trim());
        return (
          <span key={index} className="inline-flex items-center gap-1 mx-1">
            {ids.map((id) => {
              const matchedSource = brief.sources.find((s) => s.id === id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => matchedSource && onOpenSourceModal?.(matchedSource)}
                  title={matchedSource ? `${matchedSource.publisher}: ${matchedSource.title}` : `Source ${id}`}
                  className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono font-medium rounded-md bg-[#fdf2f4] hover:bg-[#fae3e7] text-[#7f1d2a] border border-[#f0cdd4] transition-colors cursor-pointer"
                >
                  [{id}]
                </button>
              );
            })}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="xl:grid xl:grid-cols-12 gap-8 items-start">
      {/* Main Dossier Article (Occupies Primary Space) */}
      <article className="xl:col-span-8 2xl:col-span-9 bg-[#fffdf9] rounded-2xl border border-[#e5ddcb] shadow-xs p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0 overflow-hidden max-w-full break-words">
        {/* Header & Meta */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[#eee7da]">
          <div className="space-y-2.5 max-w-3xl overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5e6978]">
              <span className="capitalize px-2.5 py-0.5 rounded-full bg-[#f3ece0] text-[#1a2d48] border border-[#ded5c3] font-medium font-sans">
                {brief.academicLevel} Level
              </span>
              <span className="flex items-center gap-1 font-sans">
                <Calendar className="w-3 h-3 text-[#707c8d]" />
                {formattedDate}
              </span>
              <span aria-hidden="true" className="text-[#ded5c3]">·</span>
              <span className="flex items-center gap-1 font-sans text-[#707c8d]">
                <Clock className="w-3 h-3" />
                ~{readTimeMin} min read ({estimatedWords.toLocaleString()} words)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#14233c] tracking-tight leading-snug break-words">
              {brief.title}
            </h1>

            <div className="p-3.5 bg-[#f8f3e8] rounded-xl border border-[#e7ddca] text-xs sm:text-sm text-[#253750] font-sans break-words [overflow-wrap:anywhere]">
              <span className="font-semibold text-[#14233c]">Core Inquiry: </span>
              {brief.researchQuestion}
            </div>
          </div>

          {/* Minimal Actions */}
          <div className="flex items-center gap-2 print:hidden self-start">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1a2c47] hover:text-[#0e1c31] bg-[#f4ece0] hover:bg-[#eae0d1] rounded-lg transition-colors border border-[#d8cfbe]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#1b4e2c]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1a2c47] hover:text-[#0e1c31] bg-[#f4ece0] hover:bg-[#eae0d1] rounded-lg transition-colors border border-[#d8cfbe]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <section id="executive-summary" className="space-y-2.5">
          <h2 className="text-xs font-sans uppercase tracking-wider font-bold text-[#7f1d2a]">
            1. Executive Summary
          </h2>
          <div className="text-sm sm:text-base text-[#28323f] font-serif leading-relaxed whitespace-pre-wrap">
            {renderTextWithCitations(brief.executiveSummary)}
          </div>
        </section>

        {/* 2. Key Findings */}
        <section id="key-findings" className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-sans uppercase tracking-wider font-bold text-[#7f1d2a]">
              2. Key Findings
            </h2>
            <button
              onClick={() => onSelectTab?.('claims')}
              className="text-xs text-[#182e4e] hover:text-[#7f1d2a] font-medium transition-colors print:hidden"
            >
              View Claim Verification Table →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {brief.keyFindings.map((finding, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#f8f4ec] border border-[#e8dfcf] flex items-start gap-3.5"
              >
                <div className="w-6 h-6 rounded-md bg-[#182c4a] text-white flex items-center justify-center shrink-0 font-sans text-xs font-bold mt-0.5">
                  {idx + 1}
                </div>
                <div className="text-sm text-[#232d3a] font-sans leading-relaxed">
                  {renderTextWithCitations(finding)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Introduction & Background */}
        <section id="introduction" className="space-y-2.5 pt-2">
          <h2 className="text-xs font-sans uppercase tracking-wider font-bold text-[#7f1d2a]">
            3. Introduction & Background
          </h2>
          <div className="text-sm sm:text-base text-[#28323f] font-serif leading-relaxed whitespace-pre-wrap">
            {renderTextWithCitations(brief.introduction)}
          </div>
        </section>

        {/* 4. Evidence Analysis */}
        <section id="evidence-analysis" className="space-y-2.5 pt-2">
          <h2 className="text-xs font-sans uppercase tracking-wider font-bold text-[#7f1d2a]">
            4. Evidence Analysis
          </h2>
          <div className="text-sm sm:text-base text-[#28323f] font-serif leading-relaxed whitespace-pre-wrap space-y-4">
            {brief.evidenceAnalysis.split('\n\n').map((paragraph, pIdx) => (
              <p key={pIdx}>{renderTextWithCitations(paragraph)}</p>
            ))}
          </div>
        </section>

        {/* 5. Limitations & Conflicting Evidence */}
        <section id="limitations" className="p-5 rounded-xl bg-[#fdf8eb] border border-[#eedcb7] space-y-2.5">
          <div className="flex items-center gap-2 text-[#7c511b] font-serif font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-[#9c6523]" />
            <h3>5. Research Limitations & Debated Findings</h3>
          </div>
          <div className="text-xs sm:text-sm text-[#4d3410] font-sans leading-relaxed whitespace-pre-wrap">
            {renderTextWithCitations(brief.limitationsAndConflictingInfo)}
          </div>
        </section>

        {/* 6. Conclusion */}
        <section id="conclusion" className="space-y-2.5 pt-2 border-t border-[#eee7da]">
          <h2 className="text-xs font-sans uppercase tracking-wider font-bold text-[#7f1d2a]">
            6. Synthesis & Implications
          </h2>
          <div className="text-sm sm:text-base text-[#28323f] font-serif leading-relaxed whitespace-pre-wrap">
            {renderTextWithCitations(brief.conclusion)}
          </div>
        </section>
      </article>

      {/* Right Research Companion Sidebar (Occupies Full Screen Width Gracefully) */}
      <aside className="hidden xl:block xl:col-span-4 2xl:col-span-3 space-y-5 sticky top-24 print:hidden">
        {/* Navigation Table of Contents */}
        <div className="bg-[#fffdf9] p-5 rounded-2xl border border-[#e5ddcb] shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#eee7da] text-xs font-serif font-bold text-[#14233c]">
            <ListOrdered className="w-4 h-4 text-[#7f1d2a]" />
            <span>Document Sections</span>
          </div>
          <nav className="space-y-1 text-xs font-sans">
            {[
              { id: 'executive-summary', label: '1. Executive Summary' },
              { id: 'key-findings', label: '2. Key Findings' },
              { id: 'introduction', label: '3. Introduction & Background' },
              { id: 'evidence-analysis', label: '4. Evidence Analysis' },
              { id: 'limitations', label: '5. Limitations & Debates' },
              { id: 'conclusion', label: '6. Synthesis & Implications' },
            ].map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="block px-2.5 py-1.5 rounded-lg text-[#5e6978] hover:text-[#14233c] hover:bg-[#f5efe2] transition-colors"
              >
                {sec.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Cited Evidence Sources in Brief */}
        <div className="bg-[#fffdf9] p-5 rounded-2xl border border-[#e5ddcb] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#eee7da]">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#14233c]">
              <ShieldCheck className="w-4 h-4 text-[#1b4e2c]" />
              <span>Cited References ({brief.sources.length})</span>
            </div>
            <button
              onClick={() => onSelectTab?.('sources')}
              className="text-[11px] text-[#7f1d2a] hover:underline font-medium"
            >
              All Sources →
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {brief.sources.map((src) => (
              <div
                key={src.id}
                onClick={() => onOpenSourceModal?.(src)}
                className="p-2.5 rounded-xl bg-[#f8f4ec] hover:bg-[#f1ebe0] border border-[#e8dfcf] cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-[#7f1d2a] bg-[#fcf2f4] border border-[#f0cdd4] px-1.5 py-0.2 rounded">
                    [{src.id}]
                  </span>
                  <span className="text-[10px] font-mono text-[#152e4d]">
                    {src.credibilityScore}% Auth
                  </span>
                </div>
                <div className="text-xs font-medium text-[#14233c] line-clamp-1 group-hover:text-[#7f1d2a]">
                  {src.publisher}
                </div>
                <div className="text-[11px] text-[#6b7582] line-clamp-1 font-serif italic">
                  {src.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Summary Card */}
        <div className="bg-[#f8f3e8] p-4 rounded-xl border border-[#e7ddca] text-xs space-y-2 font-sans">
          <div className="font-semibold text-[#14233c] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#182c4a]" />
            <span>Traceability Guarantee</span>
          </div>
          <p className="text-[#495565] leading-relaxed">
            Every statement and claim in this brief is tied to extracted empirical passages from designated literature sources.
          </p>
        </div>
      </aside>
    </div>
  );
};
