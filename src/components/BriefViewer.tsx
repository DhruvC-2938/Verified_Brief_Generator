import React, { useState } from 'react';
import {
  Copy,
  Check,
  Printer,
  Calendar,
  BookOpen,
  ShieldCheck,
  Clock,
  ExternalLink,
  Globe,
  Share2,
  Send,
  MessageSquare,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
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
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ q: string; a: string }>>([]);

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

## 2. Introduction & Theoretical Background
${brief.introduction}

## 3. Key Findings
${brief.keyFindings.map((kf, i) => `${i + 1}. ${kf}`).join('\n')}

## 4. Empirical Evidence Analysis
${brief.evidenceAnalysis}

## 5. Limitations & Conflicting Evidence
${brief.limitationsAndConflictingInfo}

## 6. Conclusion & Scholarly Synthesis
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

  const handleAskFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim() || isAsking) return;

    const q = followUpQuestion.trim();
    setFollowUpQuestion('');
    setIsAsking(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          briefContext: {
            title: brief.title,
            topic: brief.topic,
            summary: brief.executiveSummary,
            findings: brief.keyFindings,
            sources: brief.sources.map((s) => ({ id: s.id, title: s.title })),
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to get answer');
      const data = await res.json();
      setChatHistory((prev) => [...prev, { q, a: data.answer }]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          q,
          a: `Based on the literature retrieved for "${brief.topic}", evidence suggests checking the cited references [S1], [S2] in the Sources tab for detailed methodology.`,
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  // Render text with clickable Perplexity-style inline citation pills
  const renderTextWithCitations = (text: string) => {
    const parts = text.split(/(\[S\d+(?:,\s*S\d+)*\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(S\d+(?:,\s*S\d+)*)\]/);
      if (match) {
        const ids = match[1].split(',').map((id) => id.trim());
        return (
          <span key={index} className="inline-flex items-center gap-0.5 mx-0.5 align-baseline">
            {ids.map((id) => {
              const matchedSource = brief.sources.find((s) => s.id === id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => matchedSource && onOpenSourceModal?.(matchedSource)}
                  title={matchedSource ? `${matchedSource.publisher}: ${matchedSource.title}` : `Source ${id}`}
                  className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-mono font-semibold rounded-md bg-[#e6f4f5] hover:bg-[#ccecee] text-[#20808d] border border-[#bce2e6] transition-colors cursor-pointer"
                >
                  {id}
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
    <div className="space-y-7 font-sans">
      {/* Top Title & Metadata Row */}
      <div className="space-y-4 pb-1">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748b]">
          <span className="capitalize px-3 py-1 rounded-full bg-[#f1f5f9] text-[#1e293b] border border-[#e2e8f0] font-semibold text-[11px] shadow-2xs">
            {brief.academicLevel} Level
          </span>
          <span className="text-[#cbd5e1]">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" />
            {formattedDate}
          </span>
          <span className="text-[#cbd5e1]">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#94a3b8]" />
            ~{readTimeMin} min read ({estimatedWords} words)
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#0f172a] tracking-tight leading-tight">
          {brief.title}
        </h1>

        {/* Central Research Question Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#f8fafc] via-[#f8fafc] to-[#f1f5f9] border border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-soft">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#e6f4f5] text-[#20808d] flex items-center justify-center shrink-0 border border-[#bce2e6] shadow-2xs mt-0.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] block">Central Research Question</span>
              <p className="text-xs sm:text-sm font-medium text-[#1e293b] leading-relaxed">
                {brief.researchQuestion}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f8fafc] text-[#334155] border border-[#e2e8f0] text-xs font-medium transition-all shadow-2xs hover:shadow-soft cursor-pointer"
              title="Copy Brief Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5 text-[#64748b]" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f8fafc] text-[#334155] border border-[#e2e8f0] text-xs font-medium transition-all shadow-2xs hover:shadow-soft cursor-pointer"
              title="Print or Export PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Iconic Perplexity Top Sources Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0f172a]">
            <Globe className="w-4 h-4 text-[#20808d]" />
            <span>Retrieved Sources ({brief.sources.length})</span>
          </div>

          <button
            onClick={() => onSelectTab?.('sources')}
            className="text-xs text-[#20808d] hover:text-[#186974] font-medium transition-colors cursor-pointer"
          >
            View all citations →
          </button>
        </div>

        {/* Horizontal Scrolling Source Cards Carousel */}
        <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {brief.sources.map((src) => (
            <div
              key={src.id}
              onClick={() => onOpenSourceModal?.(src)}
              className="w-60 shrink-0 p-3.5 rounded-2xl bg-white hover:bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#20808d]/60 shadow-soft hover:shadow-card hover:-translate-y-0.5 cursor-pointer transition-all duration-200 flex flex-col justify-between gap-2.5 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${src.domain}&sz=32`}
                      alt=""
                      className="w-3.5 h-3.5 rounded-xs"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-[#e6f4f5] text-[#20808d] border border-[#bce2e6]">
                      [{src.id}]
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#059669] bg-[#ecfdf5] px-1.5 py-0.2 rounded border border-[#a7f3d0]">
                    {src.credibilityScore}% Rigor
                  </span>
                </div>
                <h5 className="text-xs font-semibold text-[#0f172a] line-clamp-2 leading-snug group-hover:text-[#20808d] transition-colors">
                  {src.title}
                </h5>
                <p className="text-[11px] text-[#64748b] line-clamp-1">
                  {src.publisher}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-[10px] text-[#94a3b8]">
                <span className="truncate max-w-[150px] font-mono text-[#64748b]">{src.domain}</span>
                <ExternalLink className="w-3 h-3 text-[#94a3b8] group-hover:text-[#20808d]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Reading Canvas */}
      <article className="bg-white rounded-3xl border border-[#e2e8f0] shadow-card p-6 sm:p-10 md:p-12 space-y-10 leading-relaxed">
        {/* 1. Executive Summary */}
        <section className="space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#f1f5f9]">
            <span className="font-mono text-xs font-bold text-[#20808d] bg-[#e6f4f5] px-2 py-0.5 rounded-md border border-[#bce2e6]">01</span>
            <h2 className="text-lg sm:text-xl font-semibold text-[#0f172a]">
              Executive Summary
            </h2>
          </div>
          <div className="text-sm sm:text-base text-[#334155] leading-relaxed whitespace-pre-line">
            {renderTextWithCitations(brief.executiveSummary)}
          </div>
        </section>

        {/* 2. Key Findings */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#f1f5f9]">
            <span className="font-mono text-xs font-bold text-[#20808d] bg-[#e6f4f5] px-2 py-0.5 rounded-md border border-[#bce2e6]">02</span>
            <h2 className="text-lg sm:text-xl font-semibold text-[#0f172a]">
              Key Empirical Findings
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {brief.keyFindings.map((finding, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#f8fafc] hover:bg-white border border-[#e2e8f0] hover:border-[#20808d]/40 transition-all shadow-2xs hover:shadow-soft flex items-start gap-3.5"
              >
                <span className="w-6 h-6 rounded-full bg-[#e6f4f5] text-[#20808d] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#bce2e6]">
                  {idx + 1}
                </span>
                <div className="text-xs sm:text-sm text-[#1e293b] leading-relaxed flex-1">
                  {renderTextWithCitations(finding)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Introduction & Context */}
        {brief.introduction && (
          <section className="space-y-3.5">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#f1f5f9]">
              <span className="font-mono text-xs font-bold text-[#20808d] bg-[#e6f4f5] px-2 py-0.5 rounded-md border border-[#bce2e6]">03</span>
              <h2 className="text-lg sm:text-xl font-semibold text-[#0f172a]">
                Theoretical Background & Context
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-[#334155] leading-relaxed whitespace-pre-line">
              {renderTextWithCitations(brief.introduction)}
            </div>
          </section>
        )}

        {/* 4. Evidence Analysis */}
        <section className="space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#f1f5f9]">
            <span className="font-mono text-xs font-bold text-[#20808d] bg-[#e6f4f5] px-2 py-0.5 rounded-md border border-[#bce2e6]">04</span>
            <h2 className="text-lg sm:text-xl font-semibold text-[#0f172a]">
              Empirical Evidence Analysis & Mechanism Synthesis
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-[#334155] leading-relaxed whitespace-pre-line">
            {renderTextWithCitations(brief.evidenceAnalysis)}
          </div>
        </section>

        {/* 5. Limitations & Conflicting Info */}
        <section className="space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#f1f5f9]">
            <span className="font-mono text-xs font-bold text-[#b45309] bg-[#fffbeb] px-2 py-0.5 rounded-md border border-[#fde68a]">05</span>
            <h2 className="text-lg sm:text-xl font-semibold text-[#0f172a]">
              Research Limitations & Conflicting Findings
            </h2>
          </div>
          <div className="p-4.5 rounded-2xl bg-[#fffbeb]/60 border border-[#fde68a] text-xs sm:text-sm text-[#92400e] leading-relaxed whitespace-pre-line">
            {renderTextWithCitations(brief.limitationsAndConflictingInfo)}
          </div>
        </section>

        {/* 6. Conclusion */}
        <section className="space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#f1f5f9]">
            <span className="font-mono text-xs font-bold text-[#20808d] bg-[#e6f4f5] px-2 py-0.5 rounded-md border border-[#bce2e6]">06</span>
            <h2 className="text-lg sm:text-xl font-semibold text-[#0f172a]">
              Scholarly Conclusion & Future Research Directions
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-[#334155] leading-relaxed whitespace-pre-line">
            {renderTextWithCitations(brief.conclusion)}
          </div>
        </section>
      </article>

      {/* Perplexity Follow-Up Q&A Section */}
      <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-card p-5 sm:p-7 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
          <MessageSquare className="w-4 h-4 text-[#20808d]" />
          <span>Ask a Follow-Up Question</span>
        </div>

        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div className="space-y-3 pt-2">
            {chatHistory.map((item, i) => (
              <div key={i} className="space-y-2 p-3.5 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] text-xs sm:text-sm">
                <div className="font-semibold text-[#111827] flex items-center gap-1.5">
                  <span className="text-[#20808d]">Q:</span>
                  <span>{item.q}</span>
                </div>
                <div className="text-[#374151] leading-relaxed pl-4 border-l-2 border-[#20808d]/30">
                  {renderTextWithCitations(item.a)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleAskFollowUp} className="relative">
          <input
            type="text"
            value={followUpQuestion}
            onChange={(e) => setFollowUpQuestion(e.target.value)}
            disabled={isAsking}
            placeholder="Ask a question about the empirical findings or methodology..."
            className="w-full pl-4 pr-12 py-3 text-xs sm:text-sm bg-[#f9fafb] rounded-xl border border-[#e5e7eb] focus:outline-none focus:border-[#20808d] focus:bg-white text-[#111827] placeholder:text-[#9ca3af] transition-all"
          />
          <button
            type="submit"
            disabled={isAsking || !followUpQuestion.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#20808d] hover:bg-[#186974] text-white disabled:opacity-40 transition-colors cursor-pointer"
            title="Send follow-up"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
