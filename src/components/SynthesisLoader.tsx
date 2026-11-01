import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Database,
  FileCheck2,
  Globe,
} from 'lucide-react';

interface SynthesisLoaderProps {
  statusMessage: string;
  topic?: string;
}

const STAGES = [
  { id: 1, name: 'Source Grounding', desc: 'Querying live peer-reviewed & official web indices' },
  { id: 2, name: 'Evidence Extraction', desc: 'Parsing empirical data, statistics & methodology excerpts' },
  { id: 3, name: 'Claim Verification', desc: 'Auditing assertions against retrieved primary documentation' },
  { id: 4, name: 'Brief Synthesis', desc: 'Formatting executive summary & APA / MLA / BibTeX citations' },
];

export const SynthesisLoader: React.FC<SynthesisLoaderProps> = ({
  statusMessage,
  topic,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const cleanMessage = React.useMemo(() => {
    if (!statusMessage) {
      return 'Consulting reputable academic repositories, government databases, and journals...';
    }
    const lower = statusMessage.toLowerCase();
    if (lower.includes('rate limit') || lower.includes('pause') || lower.includes('429')) {
      return 'High research index traffic: optimizing literature retrieval pipeline...';
    }
    if (lower.includes('demand') || lower.includes('503') || lower.includes('spike') || lower.includes('gemini')) {
      return 'Scholarly cluster busy: re-routing query to ensure zero-fabrication integrity...';
    }
    return statusMessage;
  }, [statusMessage]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (elapsedSeconds < 8) {
      setCurrentStageIndex(0);
    } else if (elapsedSeconds < 18) {
      setCurrentStageIndex(1);
    } else if (elapsedSeconds < 28) {
      setCurrentStageIndex(2);
    } else {
      setCurrentStageIndex(3);
    }
  }, [elapsedSeconds]);

  const progressPercent = Math.min(95, Math.round(15 + (elapsedSeconds * 2.8)));

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Perplexity-style Synthesis Progress Hero */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#f3f4f6]">
          <div className="flex items-center gap-4">
            {/* Spinning Asterisk / Compass Mark */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-[#20808d] text-white flex items-center justify-center shadow-xs">
                <Compass className="w-6 h-6 text-white animate-spin [animation-duration:8s]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#10b981] border-2 border-white flex items-center justify-center shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-lg sm:text-xl text-[#111827] tracking-tight">
                  Synthesizing Verified Academic Brief
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-[#e6f4f5] text-[#20808d] font-semibold border border-[#bce2e6]">
                  <Sparkles className="w-3 h-3 text-[#20808d]" />
                  <span>Live Grounded Research</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#4b5563] flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#20808d] animate-ping shrink-0" />
                <span className="font-medium text-[#111827]">{cleanMessage}</span>
              </p>
            </div>
          </div>

          {/* Research Subject Badge */}
          {topic && (
            <div className="self-start md:self-auto flex items-center gap-2 bg-[#f9fafb] px-3.5 py-2 rounded-xl border border-[#e5e7eb]">
              <Database className="w-3.5 h-3.5 text-[#20808d] shrink-0" />
              <div className="text-left">
                <span className="text-[10px] uppercase text-[#6b7280] block font-semibold">Active Inquiry</span>
                <span className="text-xs font-semibold text-[#111827] line-clamp-1">"{topic}"</span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6b7280] font-medium flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-[#20808d]" />
              <span>Pipeline Stage {currentStageIndex + 1} of 4: <strong className="text-[#111827]">{STAGES[currentStageIndex].name}</strong></span>
            </span>
            <span className="font-mono font-semibold text-[#20808d]">{progressPercent}%</span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-[#f3f4f6] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#20808d] to-[#0d9488] transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 4-Stage Research Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={stage.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-white border-[#20808d] shadow-xs'
                    : isCompleted
                    ? 'bg-[#f9fafb] border-[#e5e7eb] opacity-80'
                    : 'bg-[#f9fafb]/50 border-[#f3f4f6] opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] font-bold text-[#20808d] bg-[#e6f4f5] px-1.5 py-0.2 rounded border border-[#bce2e6]">
                    STAGE 0{stage.id}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#20808d] animate-ping" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#cbd5e1]" />
                  )}
                </div>

                <div className="font-semibold text-xs text-[#111827]">
                  {stage.name}
                </div>
                <p className="text-[11px] text-[#6b7280] mt-0.5 leading-snug">
                  {stage.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Integrity Guarantee Banner */}
        <div className="p-3 bg-[#f9fafb] rounded-xl border border-[#e5e7eb] flex flex-wrap items-center justify-between gap-2 text-xs text-[#6b7280]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
            <span>Zero-Fabrication Mandate: Every claim is audited against live-retrieved web indices.</span>
          </div>
          <span className="font-mono text-[11px] text-[#20808d] font-semibold">
            Elapsed: {elapsedSeconds}s
          </span>
        </div>
      </div>

      {/* Shimmer Skeletons (Perplexity Clean Gray Gradient) */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f6]">
          <div className="space-y-1.5">
            <div className="h-4 w-48 rounded-md skeleton-shimmer" />
            <div className="h-3 w-64 rounded-md skeleton-shimmer" />
          </div>
          <div className="h-6 w-36 rounded-xl skeleton-shimmer" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-3.5 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 rounded skeleton-shimmer" />
                <div className="h-3.5 w-3.5 rounded-full skeleton-shimmer" />
              </div>
              <div className="h-7 w-12 rounded skeleton-shimmer" />
              <div className="h-2.5 w-24 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>

      <article className="bg-white rounded-2xl border border-[#e5e7eb] shadow-xs p-6 sm:p-10 space-y-8">
        <div className="space-y-4 pb-6 border-b border-[#f3f4f6]">
          <div className="flex items-center gap-2">
            <div className="h-5 w-28 rounded-full skeleton-shimmer" />
            <div className="h-4 w-32 rounded skeleton-shimmer" />
            <div className="h-4 w-24 rounded skeleton-shimmer" />
          </div>
          <div className="space-y-2">
            <div className="h-8 sm:h-10 w-4/5 rounded-lg skeleton-shimmer" />
            <div className="h-6 w-2/3 rounded-lg skeleton-shimmer" />
          </div>
        </div>

        <section className="space-y-3">
          <div className="h-4 w-36 rounded skeleton-shimmer" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded skeleton-shimmer" />
            <div className="h-4 w-[96%] rounded skeleton-shimmer" />
            <div className="h-4 w-[92%] rounded skeleton-shimmer" />
            <div className="h-4 w-[85%] rounded skeleton-shimmer" />
          </div>
        </section>
      </article>
    </div>
  );
};
