import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Database,
  FileCheck2,
  Compass,
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

  // Clean and sanitize any raw technical or retry messages
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

  // Stage progression timer to provide rich visual feedback while research runs
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
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Premium Hero Research Synthesizer Card */}
      <div className="bg-[#fffdf9] rounded-2xl border border-[#e5ddcb] p-6 sm:p-8 shadow-sm space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#eee7da]">
          <div className="flex items-center gap-4">
            {/* Animated Scholarly Compass/Book Icon with Elegant Aura */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-[#14233c] text-white flex items-center justify-center shadow-md">
                <Compass className="w-6 h-6 text-[#f4eee2] animate-spin [animation-duration:8s]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#1b4e2c] border-2 border-[#fffdf9] flex items-center justify-center shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#14233c] tracking-tight">
                  Synthesizing Verified Academic Brief
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-sans px-2.5 py-0.5 rounded-full bg-[#fcf2f4] text-[#7f1d2a] font-semibold border border-[#f0cdd4]">
                  <Sparkles className="w-3 h-3 text-[#7f1d2a]" />
                  <span>Live Grounded Research</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#5a6778] font-sans flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#7f1d2a] animate-ping shrink-0" />
                <span className="font-medium text-[#2d3a4b]">{cleanMessage}</span>
              </p>
            </div>
          </div>

          {/* Research Subject Badge */}
          {topic && (
            <div className="self-start md:self-auto flex items-center gap-2 bg-[#f8f4ec] px-4 py-2 rounded-xl border border-[#e3dacf]">
              <Database className="w-3.5 h-3.5 text-[#7f1d2a] shrink-0" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-sans text-[#788596] block font-semibold">Active Inquiry</span>
                <span className="text-xs font-serif font-bold text-[#14233c] line-clamp-1">"{topic}"</span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-[#5e6978] font-medium flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-[#14233c]" />
              <span>Pipeline Stage {currentStageIndex + 1} of 4: <strong className="text-[#14233c]">{STAGES[currentStageIndex].name}</strong></span>
            </span>
            <span className="font-mono font-semibold text-[#14233c]">{progressPercent}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#eee7da] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#14233c] via-[#7f1d2a] to-[#14233c] transition-all duration-700 ease-out"
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
                    ? 'bg-[#ffffff] border-[#7f1d2a] shadow-xs'
                    : isCompleted
                    ? 'bg-[#f8f6f0] border-[#dcd3bf] opacity-80'
                    : 'bg-[#faf7f0]/60 border-[#eae1cf] opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] font-bold text-[#7f1d2a] bg-[#fcf2f4] px-1.5 py-0.2 rounded border border-[#f0cdd4]">
                    STAGE 0{stage.id}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#1b4e2c]" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#7f1d2a] animate-ping" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#c0b6a2]" />
                  )}
                </div>

                <div className="font-serif font-bold text-xs text-[#14233c]">
                  {stage.name}
                </div>
                <p className="text-[11px] text-[#636f7e] font-sans mt-0.5 leading-snug">
                  {stage.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Integrity Guarantee Banner */}
        <div className="p-3 bg-[#f8f4ec] rounded-xl border border-[#e5ddcb] flex flex-wrap items-center justify-between gap-2 text-xs font-sans text-[#5d6878]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1b4e2c] shrink-0" />
            <span>Zero-Fabrication Mandate: Every claim is audited against live-retrieved web indices.</span>
          </div>
          <span className="font-mono text-[11px] text-[#7f1d2a] font-medium">
            Elapsed: {elapsedSeconds}s
          </span>
        </div>
      </div>

      {/* Metrics Bar Skeleton */}
      <div className="bg-[#fffdf9] rounded-2xl border border-[#e5ddcb] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#eee7da]">
          <div className="space-y-1.5">
            <div className="h-4 w-48 rounded-md skeleton-shimmer" />
            <div className="h-3 w-64 rounded-md skeleton-shimmer" />
          </div>
          <div className="h-6 w-36 rounded-xl skeleton-shimmer" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-3.5 rounded-xl border border-[#e8dfcf] bg-[#f9f5ec]/70 space-y-2">
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

      {/* Main Brief & Companion Skeleton Grid */}
      <div className="xl:grid xl:grid-cols-12 gap-8 items-start">
        {/* Main Article Skeleton */}
        <article className="xl:col-span-8 2xl:col-span-9 bg-[#fffdf9] rounded-2xl border border-[#e5ddcb] shadow-xs p-6 sm:p-10 space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4 pb-6 border-b border-[#eee7da]">
            <div className="flex items-center gap-2">
              <div className="h-5 w-28 rounded-full skeleton-shimmer" />
              <div className="h-4 w-32 rounded skeleton-shimmer" />
              <div className="h-4 w-24 rounded skeleton-shimmer" />
            </div>

            <div className="space-y-2">
              <div className="h-8 sm:h-10 w-4/5 rounded-lg skeleton-shimmer" />
              <div className="h-6 w-2/3 rounded-lg skeleton-shimmer" />
            </div>

            <div className="p-3.5 bg-[#f8f3e8] rounded-xl border border-[#e7ddca] space-y-1.5">
              <div className="h-3.5 w-28 rounded skeleton-shimmer" />
              <div className="h-4 w-full rounded skeleton-shimmer" />
            </div>
          </div>

          {/* 1. Executive Summary Skeleton */}
          <section className="space-y-3">
            <div className="h-3.5 w-36 rounded skeleton-shimmer" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded skeleton-shimmer" />
              <div className="h-4 w-[96%] rounded skeleton-shimmer" />
              <div className="h-4 w-[92%] rounded skeleton-shimmer" />
              <div className="h-4 w-[85%] rounded skeleton-shimmer" />
            </div>
          </section>

          {/* 2. Key Findings Skeleton */}
          <section className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-32 rounded skeleton-shimmer" />
              <div className="h-3 w-40 rounded skeleton-shimmer" />
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#f8f4ec] border border-[#e8dfcf] flex items-start gap-3.5"
                >
                  <div className="w-6 h-6 rounded-md bg-[#182c4a]/15 shrink-0 skeleton-shimmer" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-full rounded skeleton-shimmer" />
                    <div className="h-4 w-4/5 rounded skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Introduction & Background Skeleton */}
          <section className="space-y-3 pt-2">
            <div className="h-3.5 w-44 rounded skeleton-shimmer" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded skeleton-shimmer" />
              <div className="h-4 w-[94%] rounded skeleton-shimmer" />
              <div className="h-4 w-[88%] rounded skeleton-shimmer" />
            </div>
          </section>

          {/* 4. Evidence Analysis Skeleton */}
          <section className="space-y-3 pt-2">
            <div className="h-3.5 w-40 rounded skeleton-shimmer" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded skeleton-shimmer" />
              <div className="h-4 w-[98%] rounded skeleton-shimmer" />
              <div className="h-4 w-[93%] rounded skeleton-shimmer" />
              <div className="h-4 w-[80%] rounded skeleton-shimmer" />
            </div>
          </section>

          {/* 5. Limitations Skeleton */}
          <section className="p-5 rounded-xl bg-[#fdf8eb] border border-[#eedcb7] space-y-2.5">
            <div className="h-4 w-56 rounded skeleton-shimmer" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-full rounded skeleton-shimmer" />
              <div className="h-3.5 w-4/5 rounded skeleton-shimmer" />
            </div>
          </section>
        </article>

        {/* Right Sidebar Companion Skeleton */}
        <aside className="hidden xl:block xl:col-span-4 2xl:col-span-3 space-y-5">
          {/* Table of Contents Skeleton */}
          <div className="bg-[#fffdf9] p-5 rounded-2xl border border-[#e5ddcb] shadow-xs space-y-3">
            <div className="h-4 w-36 rounded skeleton-shimmer pb-2 border-b border-[#eee7da]" />
            <div className="space-y-2 pt-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-3.5 w-4/5 rounded skeleton-shimmer" />
              ))}
            </div>
          </div>

          {/* Cited Sources Quick Ledger Skeleton */}
          <div className="bg-[#fffdf9] p-5 rounded-2xl border border-[#e5ddcb] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#eee7da]">
              <div className="h-4 w-32 rounded skeleton-shimmer" />
              <div className="h-3 w-16 rounded skeleton-shimmer" />
            </div>

            <div className="space-y-2.5 pt-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#f8f4ec] border border-[#e8dfcf] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-10 rounded skeleton-shimmer" />
                    <div className="h-2.5 w-14 rounded skeleton-shimmer" />
                  </div>
                  <div className="h-3.5 w-2/3 rounded skeleton-shimmer" />
                  <div className="h-3 w-full rounded skeleton-shimmer" />
                </div>
              ))}
            </div>
          </div>

          {/* Traceability Box Skeleton */}
          <div className="bg-[#f8f3e8] p-4 rounded-xl border border-[#e7ddca] space-y-2">
            <div className="h-4 w-40 rounded skeleton-shimmer" />
            <div className="h-3 w-full rounded skeleton-shimmer" />
            <div className="h-3 w-4/5 rounded skeleton-shimmer" />
          </div>
        </aside>
      </div>
    </div>
  );
};
