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
    <div className="space-y-6 font-sans">
      {/* Top Title & Metadata Row */}
      <div className="space-y-3 pb-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b7280]">
          <span className="capitalize px-2.5 py-0.5 rounded-full bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb] font-medium">
            {brief.academicLevel} Level
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#9ca3af]" />
            {formattedDate}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#9ca3af]" />
            ~{readTimeMin} min read ({estimatedWords} words)
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#111827] tracking-tight leading-snug">
          {brief.title}
        </h1>

        <div className="p-3.5 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-between gap-3 text-xs text-[#4b5563]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#20808d] shrink-0" />
            <span><strong>Research Question:</strong> {brief.researchQuestion}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb] text-xs font-medium transition-colors shadow-2xs cursor-pointer"
              title="Copy Brief Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb] text-xs font-medium transition-colors shadow-2xs cursor-pointer"
              title="Print or Export PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Iconic Perplexity Top Sources Strip */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#111827]">
            <Globe className="w-4 h-4 text-[#20808d]" />
            <span>Sources ({brief.sources.length})</span>
          </div>

          <button
            onClick={() => onSelectTab?.('sources')}
            className="text-xs text-[#20808d] hover:text-[#186974] font-medium transition-colors cursor-pointer"
          >
            View all citations →
          </button>
        </div>

        {/* Horizontal Scrolling Source Cards Carousel */}
        <div className="flex items-stretch gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {brief.sources.map((src) => (
            <div
              key={src.id}
              onClick={() => onOpenSourceModal?.(src)}
              className="w-56 shrink-0 p-3 rounded-xl bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] hover:border-[#20808d] shadow-2xs cursor-pointer transition-all flex flex-col justify-between gap-2 group"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#e6f4f5] text-[#20808d] border border-[#bce2e6]">
                    [{src.id}]
                  </span>
                  <span className="text-[10px] font-mono text-[#059669]">
                    {src.credibilityScore}% Rigor
                  </span>
                </div>
                <h5 className="text-xs font-semibold text-[#111827] line-clamp-1 group-hover:text-[#20808d] transition-colors">
                  {src.title}
                </h5>
                <p className="text-[11px] text-[#6b7280] line-clamp-1">
                  {src.publisher}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#f3f4f6] text-[10px] text-[#9ca3af]">
                <span className="truncate max-w-[140px] font-mono">{src.domain}</span>
                <ExternalLink className="w-3 h-3 text-[#9ca3af] group-hover:text-[#20808d]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Reading Canvas */}
      <article className="bg-white rounded-2xl border border-[#e5e7eb] shadow-xs p-6 sm:p-9 space-y-8 leading-relaxed">
        {/* 1. Executive Summary */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-[#111827] flex items-center gap-2 border-b border-[#f3f4f6] pb-2">
            <span className="w-2 h-2 rounded-full bg-[#20808d]" />
            <span>Executive Summary</span>
          </h2>
          <div className="text-sm sm:text-base text-[#1f2937] leading-relaxed whitespace-pre-line">
            {renderTextWithCitations(brief.executiveSummary)}
          </div>
        </section>

        {/* 2. Key Findings */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-[#111827] flex items-center gap-2 border-b border-[#f3f4f6] pb-2">
            <span className="w-2 h-2 rounded-full bg-[#20808d]" />
            <span>Key Empirical Findings</span>
          </h2>
          <div className="grid grid-cols-1 gap-2.5">
            {brief.keyFindings.map((finding, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-[#e6f4f5] text-[#20808d] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="text-xs sm:text-sm text-[#1f2937] leading-relaxed flex-1">
                  {renderTextWithCitations(finding)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Introduction & Context */}
        {brief.introduction && (
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-[#111827] flex items-center gap-2 border-b border-[#f3f4f6] pb-2">
              <span className="w-2 h-2 rounded-full bg-[#20808d]" />
              <span>Background & Context</span>
            </h2>
            <div className="text-xs sm:text-sm text-[#374151] leading-relaxed whitespace-pre-line">
              {renderTextWithCitations(brief.introduction)}
            </div>
          </section>
        )}

        {/* 4. Evidence Analysis */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-[#111827] flex items-center gap-2 border-b border-[#f3f4f6] pb-2">
            <span className="w-2 h-2 rounded-full bg-[#20808d]" />
            <span>Evidence Analysis & Mechanism Synthesis</span>
          </h2>
          <div className="text-xs sm:text-sm text-[#374151] leading-relaxed whitespace-pre-line">
            {renderTextWithCitations(brief.evidenceAnalysis)}
          </div>
        </section>

        {/* 5. Limitations & Conflicting Info */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-[#111827] flex items-center gap-2 border-b border-[#f3f4f6] pb-2">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <span>Research Limitations & Disagreements</span>
          </h2>
          <div className="p-4 rounded-xl bg-[#fffbeb] border border-[#fef3c7] text-xs sm:text-sm text-[#92400e] leading-relaxed whitespace-pre-line">
            {renderTextWithCitations(brief.limitationsAndConflictingInfo)}
          </div>
        </section>

        {/* 6. Conclusion */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-[#111827] flex items-center gap-2 border-b border-[#f3f4f6] pb-2">
            <span className="w-2 h-2 rounded-full bg-[#20808d]" />
            <span>Conclusion & Future Research Directions</span>
          </h2>
          <div className="text-xs sm:text-sm text-[#374151] leading-relaxed whitespace-pre-line">
            {renderTextWithCitations(brief.conclusion)}
          </div>
        </section>
      </article>

      {/* Perplexity Follow-Up Q&A Section */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-xs p-5 sm:p-6 space-y-4">
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
